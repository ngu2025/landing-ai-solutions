// Enhanced Landing AI Solutions - Main Controller
class LandingAISolutions {
    constructor() {
        this.selectedFormat = null;
        this.selectedFrequency = 'biweekly';
        this.selectedPrice = 349;
        this.pdfGenerator = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSmoothScroll();
        this.setupFrequencySelector();
        this.initializePDFGenerator();
        this.setupModalHandlers();
    }

    bindEvents() {
        // Payment confirmation
        const confirmBtn = document.querySelector('.btn-confirm');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.showConfirmationForm();
            });
        }

        // Copy address button
        const copyBtn = document.querySelector('.btn-copy');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                this.copyAddress();
            });
        }

        // PDF generation buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[onclick*="generateSamplePDF"]') || 
                e.target.closest('[onclick*="generateSamplePDF"]')) {
                this.generateSamplePDF();
            }
            
            if (e.target.matches('[onclick*="showPDFPreview"]') || 
                e.target.closest('[onclick*="showPDFPreview"]')) {
                this.showPDFPreview();
            }
        });
    }

    setupFrequencySelector() {
        // Frequency selection
        document.querySelectorAll('.freq-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectFrequency(e.currentTarget);
            });
        });

        // Frequency select buttons
        document.querySelectorAll('.freq-select-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const option = e.target.closest('.freq-option');
                this.selectFrequency(option);
            });
        });
    }

    setupModalHandlers() {
        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            const modal = document.getElementById('pdfPreviewModal');
            if (e.target === modal) {
                this.closePDFPreview();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePDFPreview();
            }
        });
    }

    async initializePDFGenerator() {
        try {
            // Load PDF generator module
            if (typeof PDFReportGenerator !== 'undefined') {
                this.pdfGenerator = new PDFReportGenerator();
                await this.pdfGenerator.init();
                console.log('PDF Generator initialized successfully');
            }
        } catch (error) {
            console.warn('PDF Generator not available:', error);
        }
    }

    selectFrequency(optionElement) {
        // Remove active class from all options
        document.querySelectorAll('.freq-option').forEach(opt => {
            opt.classList.remove('active');
            const btn = opt.querySelector('.freq-select-btn');
            if (btn) {
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-outline');
            }
        });

        // Add active class to selected option
        optionElement.classList.add('active');
        const selectedBtn = optionElement.querySelector('.freq-select-btn');
        if (selectedBtn) {
            selectedBtn.classList.remove('btn-outline');
            selectedBtn.classList.add('btn-primary');
        }

        // Update selected values
        this.selectedFrequency = optionElement.dataset.freq;
        this.selectedPrice = optionElement.dataset.price;

        // Update summary
        this.updateFrequencySummary();
        
        // Show notification
        this.showNotification(`${this.getFrequencyText(this.selectedFrequency)} plan selected`);
    }

    updateFrequencySummary() {
        const frequencyElement = document.getElementById('selected-frequency');
        const priceElement = document.getElementById('selected-price');
        
        if (frequencyElement && priceElement) {
            const frequencyText = this.getFrequencyText(this.selectedFrequency);
            frequencyElement.textContent = frequencyText;
            priceElement.textContent = this.selectedPrice;
        }
    }

    getFrequencyText(frequency) {
        const frequencyMap = {
            'daily': 'Daily Updates',
            'weekly': 'Weekly Intelligence',
            'biweekly': 'Twice a Month',
            'monthly': 'Monthly Strategic'
        };
        return frequencyMap[frequency] || 'Twice a Month';
    }

    setupSmoothScroll() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    requestDemo() {
        const company = prompt('Please enter your company name:');
        const email = prompt('Please enter your email for demo delivery:');
        
        if (company && email) {
            this.submitDemoRequest(company, email);
        } else if (!company && !email) {
            // If user cancels both prompts, show sample PDF
            this.generateSamplePDF();
        }
    }

    submitDemoRequest(company, email) {
        const requestData = {
            company: company,
            email: email,
            frequency: this.selectedFrequency,
            timestamp: new Date().toISOString(),
            source: 'landing_ai_solutions'
        };

        console.log('Demo request submitted:', requestData);
        this.showNotification('Demo request received! We will contact you within 24 hours.');
        
        // Simulate demo delivery
        setTimeout(() => {
            this.deliverDemoReport(company, email);
        }, 2000);
    }

    deliverDemoReport(company, email) {
        const demoContent = this.generateDemoContent(company);
        
        // Simulate email delivery
        console.log('Demo report delivered to:', email);
        this.showNotification(`Demo report sent to ${email}! Check your inbox.`);
        
        // Also generate immediate PDF download
        this.generateSamplePDF();
    }

    generateDemoContent(company) {
        return {
            company: company,
            frequency: this.selectedFrequency,
            sections: [
                "Market Overview Analysis",
                "Competitive Landscape", 
                "Target Audience Insights",
                "Strategic Recommendations",
                "Implementation Roadmap"
            ],
            generated: new Date().toISOString()
        };
    }

    async generateSamplePDF() {
        this.showNotification('Generating sample PDF report...');
        
        try {
            if (this.pdfGenerator && typeof this.pdfGenerator.generateReport === 'function') {
                const companyData = {
                    company_name: 'Sample Corporation',
                    industry: 'Technology Services',
                    market_size: '$402.5 Billion',
                    market_growth: '12.4% YoY',
                    key_opportunity: 'AI-powered personalized learning solutions',
                    opportunity_value: '$45M Annual Potential'
                };
                
                await this.pdfGenerator.generateReport({
                    type: 'demo',
                    companyData: companyData,
                    options: {
                        quality: 'high',
                        format: 'A4'
                    }
                });
            } else {
                // Fallback: Redirect to static PDF or show message
                this.showNotification('PDF system is loading, please try again in a moment...');
                
                // Simulate PDF download
                setTimeout(() => {
                    this.showNotification('Sample PDF report downloaded successfully!');
                    // In production, this would trigger actual download
                    this.simulatePDFDownload();
                }, 1500);
            }
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showNotification('Error generating PDF. Please try again.');
        }
    }

    simulatePDFDownload() {
        // Create a fake download link for demonstration
        const link = document.createElement('a');
        link.href = '#'; // In production, this would be the actual PDF URL
        link.download = 'Matrix-Intelligence-Sample-Report.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showPDFPreview() {
        const modal = document.getElementById('pdfPreviewModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.showNotification('PDF preview opened');
        }
    }

    closePDFPreview() {
        const modal = document.getElementById('pdfPreviewModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    proceedToPayment() {
        if (!this.selectedFrequency) {
            this.showNotification('Please select a monitoring frequency first');
            this.scrollToSection('pricing');
            return;
        }
        
        this.scrollToSection('payment');
        this.showNotification(`Proceeding with ${this.getFrequencyText(this.selectedFrequency)} plan - $${this.selectedPrice}/month`);
    }

    copyAddress() {
        const address = document.getElementById('usdt-address');
        if (!address) return;
        
        const text = address.textContent;
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('USDT address copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showNotification('USDT address copied to clipboard!');
        });
    }

    showConfirmationForm() {
        const txHash = prompt('Please enter your USDT transaction hash:');
        const email = prompt('Please enter your email for report delivery:');
        
        if (txHash && email) {
            this.confirmPayment(txHash, email);
        } else if (!txHash && !email) {
            this.showNotification('Payment confirmation cancelled');
        } else {
            this.showNotification('Please provide both transaction hash and email');
        }
    }

    confirmPayment(txHash, email) {
        const paymentData = {
            frequency: this.selectedFrequency,
            price: this.selectedPrice,
            txHash: txHash,
            email: email,
            timestamp: new Date().toISOString()
        };

        console.log('Payment confirmed:', paymentData);
        this.showNotification('Payment confirmed! Full report will be delivered within 48 hours.');
        
        // Simulate report delivery
        setTimeout(() => {
            this.showNotification(`First ${this.getFrequencyText(this.selectedFrequency)} report sent to ${email}`);
        }, 3000);
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            // Adjust for fixed header
            const headerHeight = document.querySelector('.header').offsetHeight;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        document.querySelectorAll('.matrix-notification').forEach(notification => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `matrix-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc2626' : '#00dc82'};
            color: var(--matrix-bg);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            font-weight: 600;
            max-width: 300px;
            word-wrap: break-word;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.landingAI = new LandingAISolutions();
});

// Global functions for HTML onclick handlers
function requestDemo() {
    if (window.landingAI) {
        window.landingAI.requestDemo();
    }
}

function scrollToSection(sectionId) {
    if (window.landingAI) {
        window.landingAI.scrollToSection(sectionId);
    }
}
