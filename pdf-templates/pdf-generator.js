// PDF Report Generator - Matrix Intelligence (Fixed Version)
class PDFReportGenerator {
    constructor() {
        this.templates = {};
        this.currentData = {};
        this.init();
    }

    init() {
        this.loadTemplates();
        this.setupEventListeners();
        console.log('✅ PDF Generator initialized');
    }

    async loadTemplates() {
        // Use inline templates instead of file loading
        this.templates = {
            'demo': this.getDemoTemplate(),
            'executive': this.getExecutiveTemplate(),
            'comprehensive': this.getComprehensiveTemplate()
        };
        console.log('✅ PDF templates loaded successfully');
    }

    setupEventListeners() {
        // Global PDF generation function
        window.generateMatrixPDF = (config) => {
            return this.generateReport(config);
        };

        // Sample PDF download
        window.generateSamplePDF = () => {
            this.downloadSamplePDF();
        };
    }

    // NEW METHOD: Direct sample PDF download
    downloadSamplePDF() {
        try {
            // Create direct download link to your PDF file
            const pdfUrl = '/downloads/market_research_sample.pdf';
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'Matrix_Intelligence_Market_Research_Sample.pdf';
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Track download in analytics
            this.trackDownload('sample_pdf');
            
            this.showNotification('Sample PDF report downloaded successfully!');
            
        } catch (error) {
            console.error('PDF download failed:', error);
            this.showError('Failed to download sample PDF: ' + error.message);
            
            // Fallback: open in new tab
            window.open('/downloads/market_research_sample.pdf', '_blank');
        }
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
            generation_date: new Date().toISOString().split('T')[0]
        };

        try {
            // For demo purposes, use sample PDF
            if (type === 'demo') {
                this.downloadSamplePDF();
                return {
                    success: true,
                    fileName: 'Matrix_Intelligence_Market_Research_Sample.pdf',
                    data: this.currentData
                };
            }

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

        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            const value = data[key];
            return value !== undefined ? value : `[${key}]`;
        });
    }

    async htmlToPdf(htmlContent, options = {}) {
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

    trackDownload(type) {
        // Google Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'pdf',
                'event_label': type
            });
        }
        
        // Console log for debugging
        console.log(`📥 PDF downloaded: ${type}`);
    }

    triggerDownload(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
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
            growth_rate: '+12.4% YoY'
        };
    }

    // Simplified templates (keep your existing template methods)
    getDemoTemplate() {
        return `... your existing demo template HTML ...`;
    }

    getExecutiveTemplate() {
        return `... your existing executive template HTML ...`;
    }

    getComprehensiveTemplate() {
        return `... your existing comprehensive template HTML ...`;
    }

    showNotification(message) {
        // Simple notification
        console.log('✅ PDF Notification:', message);
        alert(message); // Or replace with your notification system
    }

    showError(message) {
        console.error('❌ PDF Error:', message);
        alert('Error: ' + message); // Or replace with your error system
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.matrixPDFGenerator = new PDFReportGenerator();
    console.log('🚀 Matrix PDF Generator Ready');
});

// Global function for button clicks
window.generateSamplePDF = function() {
    if (window.matrixPDFGenerator) {
        window.matrixPDFGenerator.downloadSamplePDF();
    } else {
        // Fallback direct download
        const link = document.createElement('a');
        link.href = '/downloads/market_research_sample.pdf';
        link.download = 'Matrix_Intelligence_Market_Research_Sample.pdf';
        link.click();
    }
};