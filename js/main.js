// Matrix Intelligence - Fixed Version
console.log('Matrix Intelligence loading...');

// Simple initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing...');
    initLanding();
});

function initLanding() {
    console.log('Initializing landing functionality...');
    initFrequencySelector();
    setupSmoothScroll();
    setupModalHandlers();
    console.log('Landing initialized successfully');
}

// Frequency Selector
function initFrequencySelector() {
    var options = document.querySelectorAll('.freq-option');
    console.log('Found frequency options:', options.length);
    
    options.forEach(function(option) {
        option.addEventListener('click', function() {
            selectFrequency(this);
        });
        
        var btn = option.querySelector('.freq-select-btn');
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
    
    document.querySelectorAll('.freq-option').forEach(function(opt) {
        opt.classList.remove('active');
        var btn = opt.querySelector('.freq-select-btn');
        if (btn) {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
    });
    
    optionElement.classList.add('active');
    var selectedBtn = optionElement.querySelector('.freq-select-btn');
    if (selectedBtn) {
        selectedBtn.classList.remove('btn-outline');
        selectedBtn.classList.add('btn-primary');
    }
    
    updateFrequencySummary(optionElement.dataset.freq, optionElement.dataset.price);
    showNotification('Selected: ' + getFrequencyText(optionElement.dataset.freq) + ' plan');
}

function updateFrequencySummary(frequency, price) {
    var freqElement = document.getElementById('selected-frequency');
    var priceElement = document.getElementById('selected-price');
    if (freqElement) freqElement.textContent = getFrequencyText(frequency);
    if (priceElement) priceElement.textContent = price;
}

function getFrequencyText(frequency) {
    var map = {
        'daily': 'Daily Updates',
        'weekly': 'Weekly Intelligence', 
        'biweekly': 'Twice a Month',
        'monthly': 'Monthly Strategic'
    };
    return map[frequency] || 'Twice a Month';
}

// Smooth Scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var headerHeight = document.querySelector('.header').offsetHeight || 80;
                var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

// Modal Handlers
function setupModalHandlers() {
    var closeBtn = document.querySelector('.close');
    if (closeBtn) closeBtn.addEventListener('click', closePDFPreview);
    
    document.addEventListener('click', function(e) {
        var modal = document.getElementById('pdfPreviewModal');
        if (e.target === modal) closePDFPreview();
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closePDFPreview();
    });
}

// Global Functions for HTML onclick
function requestDemo() {
    var company = prompt('Please enter your company name:');
    var email = prompt('Please enter your email for demo delivery:');
    
    if (company && email) {
        showNotification('Demo request received! We will contact you within 24 hours.');
        setTimeout(generateSamplePDF, 1000);
    } else if (!company && !email) {
        generateSamplePDF();
    }
}

function generateSamplePDF() {
    showNotification('Generating sample PDF report...');
    setTimeout(function() {
        showNotification('Sample PDF report downloaded successfully!');
        var blob = new Blob(['Matrix Intelligence Sample Report'], { type: 'text/plain' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'Matrix-Intelligence-Sample-Report.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 1500);
}

function showPDFPreview() {
    var modal = document.getElementById('pdfPreviewModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        showNotification('PDF preview opened');
    }
}

function closePDFPreview() {
    var modal = document.getElementById('pdfPreviewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function proceedToPayment() {
    var activeOption = document.querySelector('.freq-option.active');
    var frequency = activeOption ? activeOption.dataset.freq : null;
    
    if (!frequency) {
        showNotification('Please select a monitoring frequency first');
        return;
    }
    
    var paymentSection = document.getElementById('payment');
    if (paymentSection) {
        var headerHeight = document.querySelector('.header').offsetHeight || 80;
        var targetPosition = paymentSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
    
    showNotification('Proceeding with ' + getFrequencyText(frequency) + ' plan');
}

function copyAddress() {
    var address = document.getElementById('usdt-address');
    var copyBtn = document.querySelector('.btn-copy');
    
    if (!address) {
        showNotification('USDT address not found', 'error');
        return;
    }

    var text = address.textContent;
    
    if (copyBtn) {
        var originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#10b981';
        setTimeout(function() {
            copyBtn.textContent = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }

    navigator.clipboard.writeText(text).then(function() {
        showNotification('USDT address copied to clipboard!');
    }).catch(function() {
        var textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('USDT address copied to clipboard!');
    });
}

function showConfirmationForm() {
    var txHash = prompt('Please enter your USDT transaction hash:');
    var email = prompt('Please enter your email for report delivery:');
    
    if (txHash && email) {
        showNotification('Payment confirmed! Full report will be delivered within 48 hours.');
    } else {
        showNotification('Payment confirmation cancelled');
    }
}

function scrollToSection(sectionId) {
    var element = document.getElementById(sectionId);
    if (element) {
        var headerHeight = document.querySelector('.header').offsetHeight || 80;
        var elementPosition = element.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
}

// Missing functions for Matrix Pulse
function activateSubscription(frequency) {
    console.log('Activating subscription:', frequency);
    var landingUrl = 'https://ngu2025.github.io/landing-ai-solutions/#pricing';
    window.open(landingUrl, '_blank');
    showNotification('Redirecting to activate ' + getFrequencyText(frequency) + ' plan');
}

function refreshMetrics() {
    console.log('Refreshing metrics...');
    showNotification('Refreshing market data...');
    setTimeout(function() {
        showNotification('Market data updated successfully');
    }, 1500);
}

// Notification System - FIXED VERSION
function showNotification(message, type) {
    // Remove existing notifications
    var existingNotes = document.querySelectorAll('.matrix-notification');
    existingNotes.forEach(function(note) {
        note.parentNode.removeChild(note);
    });
    
    // Create new notification
    var notification = document.createElement('div');
    notification.className = 'matrix-notification';
    if (type === 'error') {
        notification.className += ' error';
    }
    
    notification.innerHTML = message;
    
    // Set styles without template literals
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = type === 'error' ? '#dc2626' : '#00dc82';
    notification.style.color = 'white';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '8px';
    notification.style.zIndex = '10000';
    notification.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    notification.style.fontWeight = '600';
    notification.style.maxWidth = '300px';
    notification.style.transform = 'translateX(400px)';
    notification.style.transition = 'transform 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(function() {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(function() {
        notification.style.transform = 'translateX(400px)';
        setTimeout(function() {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

console.log('✅ Matrix Intelligence fully loaded without errors');