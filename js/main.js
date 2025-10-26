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
        this.setupModalHandlers();
        this.initializePDFGenerator();
        console.log('Matrix Intelligence Landing initialized');
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

        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePDFPreview();
            }
        });

        // Listen for PDF notifications
        document.addEventListener('pdfNotification', (e) => {
            this.showNotification(e.detail.message, e.detail.type);
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
    }

    async initializePDFGenerator() {
        try {
            // Check if PDF generator is available
            if (typeof PDFReportGenerator !== 'undefined') {
                this.pdfGenerator = new PDFReportGenerator();
                await this.pdfGenerator.init();
                console.log('PDF Generator initialized successfully');
            } else {
                console.log('PDF Generator not available, using fallback methods');
            }
        } catch (error) {
            console.warn('PDF Generator initialization failed:', error);
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
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
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
        } else {
            this.showNotification('Please provide both company name and email');
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
        setTimeout(() => {
            this.generateSamplePDF();
        }, 1000);
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
                
                const result = await this.pdfGenerator.generateReport({
                    type: 'demo',
                    companyData: companyData,
                    options: {
                        quality: 'high',
                        format: 'A4'
                    }
                });
                
                if (result && !result.success) {
                    throw new Error(result.error);
                }
                
            } else {
                // Fallback PDF generation
                this.generateFallbackPDF();
            }
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showNotification('Using fallback PDF generation method...');
            this.generateFallbackPDF();
        }
    }

    generateFallbackPDF() {
        // Create a simple PDF download simulation
        const fileName = 'Matrix-Intelligence-Sample-Report.pdf';
        
        // Simulate download delay
        setTimeout(() => {
            this.showNotification(`Sample PDF "${fileName}" downloaded successfully!`);
            
            // Create a fake download for demonstration
            const blob = new Blob(['Sample PDF Content - Matrix Intelligence Report'], { 
                type: 'application/pdf' 
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
        }, 1500);
    }

    showPDFPreview() {
        const modal = document.getElementById('pdfPreviewModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            this.showNotification('PDF preview opened - scroll to see sample content');
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
        const copyBtn = document.querySelector('.btn-copy');
        
        if (!address) {
            this.showNotification('USDT address not found', 'error');
            return;
        }

        const text = address.textContent;
        
        // Visual feedback
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            const originalBackground = copyBtn.style.background;
            
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#10b981';
            copyBtn.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = originalBackground;
                copyBtn.classList.remove('copied');
            }, 2000);
        }

        // Copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('USDT address copied to clipboard!');
        }).catch((err) => {
            console.error('Clipboard copy failed:', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    this.showNotification('USDT address copied to clipboard!');
                } else {
                    this.showNotification('Failed to copy address. Please copy manually.', 'error');
                }
            } catch (fallbackErr) {
                this.showNotification('Failed to copy address. Please copy manually.', 'error');
            }
            
            document.body.removeChild(textArea);
        });
    }

    showConfirmationForm() {
        const txHash = prompt('Please enter your USDT transaction hash:');
        if (!txHash) {
            this.showNotification('Payment confirmation cancelled');
            return;
        }

        const email = prompt('Please enter your email for report delivery:');
        if (!email) {
            this.showNotification('Payment confirmation cancelled');
            return;
        }

        if (txHash && email) {
            this.confirmPayment(txHash, email);
        }
    }

    confirmPayment(txHash, email) {
        const paymentData = {
            frequency: this.selectedFrequency,
            price: this.selectedPrice,
            tx