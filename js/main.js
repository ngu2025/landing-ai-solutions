// Matrix Intelligence - Emergency Fix
console.log('Matrix Intelligence loading...');

// Simple initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing...');
    initLanding();
});

function initLanding() {
    console.log('Initializing landing functionality...');
    
    // Initialize frequency selector
    initFrequencySelector();
    
    // Setup smooth scroll
    setupSmoothScroll();
    
    // Setup modal handlers
    setupModalHandlers();
    
    console.log('Landing initialized successfully');
}

// Frequency Selector
function initFrequencySelector() {
    const options = document.querySelectorAll('.freq-option');
    console.log('Found frequency options:', options.length);
    
    options.forEach(option => {
        option.addEventListener('click', function() {
            selectFrequency(this);
        });
        
        // Also handle button clicks
        const btn = option.querySelector('.freq-select-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                selectFrequency(option);
            });
        }
    });
}

function selectFrequency(optionElement) {
    console.log('Selecting frequency:', optionElement.dataset.freq);
    
    // Remove active class from all
    document.querySelectorAll('.freq-option').forEach(opt => {
        opt.classList.remove('active');
        const btn = opt.querySelector('.freq-select-btn');
        if (btn) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
    });
    
    // Add active to selected
    optionElement.classList.add('active');
    const selectedBtn = optionElement.querySelector('.freq-select-btn');
    if (selectedBtn) {
        selectedBtn.classList.remove('btn-outline');
        selectedBtn.classList.add('btn-primary');
    }
    
    // Update summary
    updateFrequencySummary(optionElement.dataset.freq, optionElement.dataset.price);
    showNotification(`Selected: ${getFrequencyText(optionElement.dataset.freq)} plan`);
}

function updateFrequencySummary(frequency, price) {
    const freqElement = document.getElementById('selected-frequency');
    const priceElement = document.getElementById('selected-price');
    
    if (freqElement) freqElement.textContent = getFrequencyText(frequency);
    if (priceElement) priceElement.textContent = price;
}

function getFrequencyText(frequency) {
    const map = {
        'daily': 'Daily Updates',
        'weekly': 'Weekly Intelligence', 
        'biweekly': 'Twice a Month',
        'monthly': 'Monthly Strategic'
    };
    return map[frequency] || 'Twice a Month';
}

// Smooth Scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight || 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Modal Handlers
function setupModalHandlers() {
    // Close modal with X
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closePDFPreview);
    }
    
    // Close modal on outside click
    document.addEventListener('click', function(e) {
        const modal = document.getElementById('pdfPreviewModal');
        if (e.target === modal) {
            closePDFPreview();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePDFPreview();
        }
    });
}

// Global Functions for HTML onclick
function requestDemo() {
    console.log('Request Demo clicked');
    const company = prompt('Please enter your company name:');
    const email = prompt('Please enter your email for demo delivery:');
    
    if (company && email) {
        showNotification('Demo request received! We will contact you within 24 hours.');
        // Auto-generate sample PDF after demo request
        setTimeout(generateSamplePDF, 1000);
    } else if (!company && !email) {
        generateSamplePDF();
    }
}

function generateSamplePDF() {
    console.log('Generating sample PDF...');
    showNotification('Generating sample PDF report...');
    
    // Simulate PDF generation
    setTimeout(() => {
        showNotification('Sample PDF report downloaded successfully!');
        
        // Create simple download
        const blob = new Blob(['Matrix Intelligence Sample Report - Professional Market Analysis'], { 
            type: 'text/plain' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Matrix-Intelligence-Sample-Report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 1500);
}

function showPDFPreview() {
    console.log('Showing PDF preview');
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        showNotification('PDF preview opened');
    }
}

function closePDFPreview() {
    const modal = document.getElementById('pdfPreviewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function proceedToPayment() {
    const frequency = document.querySelector('.freq-option.active')?.dataset.freq;
    if (!frequency) {
        showNotification('Please select a monitoring frequency first');
        return;
    }
    
    // Scroll to payment section
    const paymentSection = document.getElementById('payment');
    if (paymentSection) {
        const headerHeight = document.querySelector('.header').offsetHeight || 80;
        const targetPosition = paymentSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    showNotification(`Proceeding with ${getFrequencyText(frequency)} plan`);
}

function copyAddress() {
    console.log('Copying USDT address');
    const address = document.getElementById('usdt-address');
    const copyBtn = document.querySelector('.btn-copy');
    
    if (!address) {
        showNotification('USDT address not found', 'error');
        return;
    }

    const text = address.textContent;
    
    // Visual feedback
    if (copyBtn) {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }

    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        showNotification('USDT address copied to clipboard!');
    }).catch(() => {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('USDT address copied to clipboard!');
    });
}

function showConfirmationForm() {
    const txHash = prompt('Please enter your USDT transaction hash:');
    const email = prompt('Please enter your email for report delivery:');
    
    if (txHash && email) {
        showNotification('Payment confirmed! Full report will be delivered within 48 hours.');
    } else {
        showNotification('Payment confirmation cancelled');
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = document.querySelector('.header').offsetHeight || 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.matrix-notification').forEach(note => {
        note.remove();
    });
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `matrix-notification ${type === 'error' ? 'error' : ''}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc2626' : '#00dc82'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        font-weight: 600;
        max-width: 300px;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Debug info
console.log('Matrix Intelligence scripts loaded successfully');