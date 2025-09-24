// Newsletter functionality
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletterEmail');
            const email = emailInput.value.trim();
            
            if (email) {
                // Send email using EmailJS
                sendNewsletterEmail(email);
            }
        });
    }
});

function sendNewsletterEmail(subscriberEmail) {
    const btn = document.querySelector('.newsletter-btn');
    const originalHTML = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    // Email template parameters
    const templateParams = {
        to_email: 'futurefareagency@gmail.com',
        from_email: subscriberEmail,
        subject: 'New Newsletter Subscription - FutureFareAgency',
        message: `New newsletter subscription from: ${subscriberEmail}\n\nSubscribed on: ${new Date().toLocaleString()}\n\nPlease add this email to your newsletter list.`
    };
    
    // Using EmailJS service
    emailjs.send('service_futurefareagency', 'template_newsletter', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            showNotification('Thank you for subscribing! We\'ll keep you updated.', 'success');
            document.getElementById('newsletterEmail').value = '';
        })
        .catch(function(error) {
            console.log('FAILED...', error);
            // Fallback to mailto
            const subject = encodeURIComponent('New Newsletter Subscription - FutureFareAgency');
            const body = encodeURIComponent(`New newsletter subscription from: ${subscriberEmail}\n\nSubscribed on: ${new Date().toLocaleString()}`);
            window.open(`mailto:futurefareagency@gmail.com?subject=${subject}&body=${body}`);
            showNotification('Opening email client...', 'info');
        })
        .finally(function() {
            // Reset button
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = '#27ae60';
    } else if (type === 'info') {
        notification.style.background = '#3498db';
    } else {
        notification.style.background = '#e74c3c';
    }
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);