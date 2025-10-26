// PDF Report Generator - Matrix Intelligence
class PDFReportGenerator {
    constructor() {
        this.templates = {};
        this.currentData = {};
        this.templatesPath = './pdf-templates/';
        this.stylesPath = './pdf-templates/styles/';
        this.init();
    }

    init() {
        this.loadTemplates();
        this.setupEventListeners();
        console.log('PDF Generator initialized with paths:', {
            templates: this.templatesPath,
            styles: this.stylesPath
        });
    }

    async loadTemplates() {
        try {
            // Try to load templates from files
            this.templates = {
                'demo': await this.loadTemplate('demo-report'),
                'executive': await this.loadTemplate('executive-summary'),
                'comprehensive': await this.loadTemplate('comprehensive-analysis')
            };
            console.log('PDF templates loaded successfully');
        } catch (error) {
            console.warn('Cannot load templates from files, using fallback templates:', error);
            this.templates = {
                'demo': this.getDemoTemplate(),
                'executive': this.getExecutiveTemplate(),
                'comprehensive': this.getComprehensiveTemplate()
            };
        }
    }

    async loadTemplate(templateName) {
        try {
            const response = await fetch(`${this.templatesPath}${templateName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.warn(`Failed to load template: ${templateName}`, error);
            throw error; // Re-throw to handle in loadTemplates
        }
    }

    setupEventListeners() {
        // Listen for PDF generation requests from main application
        document.addEventListener('pdfGenerationRequested', (e) => {
            this.generateReport(e.detail);
        });

        // Global PDF generation function
        window.generateMatrixPDF = (config) => {
            return this.generateReport(config);
        };
    }

    async generateReport(config) {
        const {
            type = 'demo',
            companyData = {},
            marketData = {},
            options = {}
        } = config;

        this.currentData = {
            ...this.getDefaultData(),
            ...companyData,
            ...marketData,
            report_date: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
            generation_date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        };

        try {
            const htmlContent = this.renderTemplate(type, this.currentData);
            const pdfBlob = await this.htmlToPdf(htmlContent, options);
            
            this.triggerDownload(pdfBlob, this.getFileName(type, companyData.company_name));
            
            return {
                success: true,
                fileName: this.getFileName(type, companyData.company_name),
                data: this.currentData
            };
        } catch (error) {
            console.error('PDF generation failed:', error);
            this.showError('Failed to generate PDF report: ' + error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }

    renderTemplate(templateType, data) {
        const template = this.templates[templateType];
        if (!template) {
            throw new Error(`Template ${templateType} not found`);
        }

        // Enhanced template rendering with fallbacks
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            const value = data[key];
            if (value === undefined || value === null) {
                console.warn(`Template variable {{${key}}} not found in data`);
                return `[${key}]`; // Show placeholder instead of empty string
            }
            return value;
        });
    }

    async htmlToPdf(htmlContent, options = {}) {
        // Use html2pdf.js if available, otherwise create simple blob
        if (typeof html2pdf !== 'undefined') {
            return this.generateWithHtml2Pdf(htmlContent, options);
        } else {
            return this.generateSimpleBlob(htmlContent, options);
        }
    }

    async generateWithHtml2Pdf(htmlContent, options) {
        const opt = {
            margin: [10, 10, 10, 10],
            filename: this.getFileName(options.type || 'demo'),
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false 
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            },
            ...options
        };

        return new Promise((resolve, reject) => {
            try {
                const worker = html2pdf().from(htmlContent).set(opt);
                worker.outputPdf('blob').then(resolve).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    async generateSimpleBlob(htmlContent, options) {
        // Fallback: create HTML blob that can be printed as PDF
        const fullHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${options.filename || 'Matrix-Intelligence-Report'}</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            color: #333; 
        }
        .header { 
            background: #0f172a; 
            color: white; 
            padding: 20px; 
            text-align: center; 
        }
        .logo { 
            color: #00dc82; 
            font-size: 24px; 
            font-weight: bold; 
        }
        .content { 
            padding: 20px; 
        }
        @media print {
            body { margin: 0; }
        }
    </style>
</head>
<body>
    ${htmlContent}
    <script>
        // Auto-print and close for demo purposes
        setTimeout(() => {
            window.print();
            setTimeout(() => window.close(), 1000);
        }, 500);
    </script>
</body>
</html>`;

        return new Blob([fullHtml], { type: 'text/html' });
    }

    triggerDownload(blob, fileName) {
        if (blob.type === 'application/pdf') {
            // Direct PDF download
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // HTML fallback - open in new window for printing
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
        
        this.showNotification(`PDF report "${fileName}" generated successfully`);
    }

    getFileName(reportType, companyName = '') {
        const prefix = reportType === 'demo' ? 'Demo' : 
                      reportType === 'executive' ? 'Executive' : 'Comprehensive';
        
        const date = new Date().toISOString().split('T')[0];
        const companySuffix = companyName ? `-${companyName.replace(/\s+/g, '-')}` : '';
        
        return `Matrix-Intelligence-${prefix}-Report${companySuffix}-${date}.pdf`;
    }

    getDefaultData() {
        return {
            company_name: 'Sample Corporation',
            industry: 'Technology Services',
            market_size: '$402.5 Billion',
            market_growth: '12.4%',
            market_trend: 'positive',
            market_trend_text: 'Growing',
            key_opportunity: 'Expansion into SME segment with AI-powered solutions',
            opportunity_value: '$45M Annual Potential',
            competitive_alert: 'New market entrant with disruptive pricing model',
            alert_level: 'medium',
            alert_level_text: 'Monitor Closely',
            tam_value: '$186.3B',
            sam_value: '$45.8B',
            growth_rate: '+12.4% YoY',
            chart_data: 'Simulated market growth data based on industry trends',
            competitor_rows: `
                <tr>
                    <td><strong>Coursera</strong></td>
                    <td>18.3%</td>
                    <td style="color: #10b981;">+2.1%</td>
                    <td>Brand Recognition & University Partnerships</td>
                </tr>
                <tr>
                    <td><strong>LinkedIn Learning</strong></td>
                    <td>15.7%</td>
                    <td style="color: #10b981;">+0.5%</td>
                    <td>Enterprise Integration & Professional Network</td>
                </tr>
                <tr>
                    <td><strong>Udemy</strong></td>
                    <td>12.4%</td>
                    <td style="color: #dc2626;">-1.2%</td>
                    <td>Marketplace Model & Course Variety</td>
                </tr>
                <tr>
                    <td><strong>Docebo</strong></td>
                    <td>5.6%</td>
                    <td style="color: #10b981;">+3.4%</td>
                    <td>Enterprise LMS & AI Features</td>
                </tr>
            `,
            high_priority_title: 'Develop AI-Powered Personalization Engine',
            high_priority_description: 'Implement machine learning algorithms to create personalized learning paths based on user behavior, performance metrics, and career goals. This will significantly improve user engagement and completion rates.',
            high_impact: 'High Impact (40% engagement increase)',
            high_timeframe: '3-6 months development',
            medium_priority_title: 'Expand Mobile Learning Capabilities',
            medium_priority_description: 'Enhance mobile app features to support offline learning, micro-learning modules, and mobile-first content delivery. Mobile usage accounts for 68% of learning time.',
            total_recommendations: '15',
            contact_email: 'intelligence@matrix.ai',
            website_url: 'https://matrix-intelligence.com'
        };
    }

    getDemoTemplate() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Report - Matrix Intelligence</title>
    <style>
        /* PDF Common Styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }

        .pdf-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 0;
        }

        .page-break {
            page-break-after: always;
            break-after: page;
        }

        /* Header Styles */
        .pdf-header {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 1.5rem 2rem;
            border-bottom: 4px solid #00dc82;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo-section .logo {
            font-size: 1.8rem;
            font-weight: bold;
            color: #00dc82;
        }

        .logo-section .subtitle {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-top: 0.2rem;
        }

        .report-info {
            text-align: right;
        }

        .report-type {
            font-size: 1.2rem;
            font-weight: bold;
            color: #00dc82;
        }

        .report-date {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-top: 0.2rem;
        }

        /* Cover Page */
        .cover-page {
            height: 297mm;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            text-align: center;
        }

        .cover-content h1 {
            font-size: 3rem;
            margin-bottom: 3rem;
            color: #00dc82;
            line-height: 1.2;
        }

        .client-info {
            margin: 3rem 0;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            backdrop-filter: blur(10px);
        }

        .client-info h2 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #00dc82;
        }

        .confidential-badge {
            margin-top: 2rem;
            padding: 1rem 2rem;
            background: rgba(220, 38, 38, 0.2);
            border: 2px solid #dc2626;
            border-radius: 25px;
            font-weight: bold;
            display: inline-block;
        }

        /* Section Styles */
        section {
            padding: 2rem;
            margin: 0;
        }

        h2 {
            color: #0f172a;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 3px solid #00dc82;
        }

        h3 {
            color: #1e293b;
            font-size: 1.3rem;
            margin: 1.5rem 0 1rem 0;
        }

        /* Summary Grid */
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .summary-card {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
        }

        .summary-card:hover {
            transform: translateY(-5px);
            border-color: #00dc82;
            box-shadow: 0 10px 25px rgba(0, 220, 130, 0.1);
        }

        .card-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
        }

        .trend-indicator {
            display: inline-block;
            padding: 0.3rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-top: 0.5rem;
        }

        .trend-indicator.positive {
            background: #dcfce7;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .trend-indicator.negative {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fecaca;
        }

        /* Additional styles from pdf-common.css... */
        /* ... (rest of the CSS styles from previous version) ... */
    </style>
</head>
<body>
    <div class="pdf-container">
        <!-- Header -->
        <header class="pdf-header">
            <div class="header-content">
                <div class="logo-section">
                    <div class="logo">MATRIX INTELLIGENCE</div>
                    <div class="subtitle">AI-Powered Market Analysis</div>
                </div>
                <div class="report-info">
                    <div class="report-type">DEMO REPORT</div>
                    <div class="report-date">{{report_date}}</div>
                </div>
            </div>
        </header>

        <!-- Cover Page -->
        <div class="cover-page">
            <div class="cover-content">
                <h1>Market Intelligence<br>Demo Report</h1>
                <div class="client-info">
                    <h2>Prepared for {{company_name}}</h2>
                    <p>Industry: {{industry}}</p>
                    <p>Generated: {{generation_date}}</p>
                </div>
                <div class="confidential-badge">
                    <span>CONFIDENTIAL & PROPRIETARY</span>
                </div>
            </div>
        </div>

        <!-- Executive Summary -->
        <div class="page-break"></div>
        <section class="executive-summary">
            <h2>Executive Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <div class="card-icon">📊</div>
                    <h3>Market Overview</h3>
                    <p>{{market_size}} growing at {{market_growth}} annually</p>
                    <div class="trend-indicator {{market_trend}}">{{market_trend_text}}</div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon">🎯</div>
                    <h3>Key Opportunity</h3>
                    <p>{{key_opportunity}}</p>
                    <div class="opportunity-size">Potential: {{opportunity_value}}</div>
                </div>
                
                <div class="summary-card">
                    <div class="card-icon">⚠️</div>
                    <h3>Competitive Alert</h3>
                    <p>{{competitive_alert}}</p>
                    <div class="alert-level {{alert_level}}">{{alert_level_text}}</div>
                </div>
            </div>
            
            <div class="summary-note">
                <p><strong>Note:</strong> This is a sample demo report. Full subscription includes detailed analysis, custom recommendations, and regular updates based on your chosen frequency.</p>
            </div>
        </section>

        <!-- Rest of the template content... -->
        <!-- ... (rest of the HTML template from previous version) ... -->
    </div>
</body>
</html>`;
    }

    getExecutiveTemplate() {
        return `<!-- Executive Summary Template -->`;
    }

    getComprehensiveTemplate() {
        return `<!-- Comprehensive Analysis Template -->`;
    }

    showNotification(message) {
        // Dispatch event for main application to handle
        const event = new CustomEvent('pdfNotification', {
            detail: { message, type: 'success' }
        });
        document.dispatchEvent(event);
    }

    showError(message) {
        const event = new CustomEvent('pdfNotification', {
            detail: { message, type: 'error' }
        });
        document.dispatchEvent(event);
    }

    // Utility method to check if PDF system is ready
    isReady() {
        return Object.keys(this.templates).length > 0;
    }

    // Method to get available templates
    getAvailableTemplates() {
        return Object.keys(this.templates);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.matrixPDFGenerator = new PDFReportGenerator();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PDFReportGenerator };
}