// Landing AI Solutions - Main Controller
class LandingAISolutions {
    constructor() {
        this.selectedFormat = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupSmoothScroll();
    }

    bindEvents() {
        // Format selection
        document.querySelectorAll('.format-card button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const card = e.target.closest('.format-card');
                const format = card.querySelector('h3').textContent;
                this.selectFormat(format);
            });
        });

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
        }
    }

    submitDemoRequest(company, email) {
        const requestData = {
            company: company,
            email: email,
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
    }

    generateDemoContent(company) {
        return {
            company: company,
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

    selectFormat(format) {
        this.selectedFormat = format;
        this.scrollToSection('payment');
        this.showNotification(`Selected: ${format}. Proceed to payment when ready.`);
    }

    copyAddress() {
        const address = document.getElementById('usdt-address').textContent;
        navigator.clipboard.writeText(address).then(() => {
            this.showNotification('USDT address copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = address;
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
        }
    }

    confirmPayment(txHash, email) {
        const paymentData = {
            format: this.selectedFormat,
            txHash: txHash,
            email: email,
            timestamp: new Date().toISOString()
        };

        console.log('Payment confirmed:', paymentData);
        this.showNotification('Payment confirmed! Full report will be delivered within 48 hours.');
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--matrix-accent);
            color: var(--matrix-bg);
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            font-weight: 600;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
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

function selectFormat(format) {
    if (window.landingAI) {
        window.landingAI.selectFormat(format);
    }
}

function copyAddress() {
    if (window.landingAI) {
        window.landingAI.copyAddress();
    }
}

function showConfirmationForm() {
    if (window.landingAI) {
        window.landingAI.showConfirmationForm();
    }
}