// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFormValidation();
});

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmission);
    }
    
    // Add real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

// Initialize form validation
function initializeFormValidation() {
    // Set up custom validation messages
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.value && !validateEmail(this.value)) {
                this.setCustomValidity('Please enter a valid email address');
            } else {
                this.setCustomValidity('');
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            if (this.value && !validatePhone(this.value)) {
                this.setCustomValidity('Please enter a valid phone number');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Handle contact form submission
function handleContactFormSubmission(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    // Show loading state
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
    }
    
    // Get form data
    const formData = new FormData(e.target);
    const contactData = {
        id: Date.now(),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        email: formData.get('email'),
        phone: formData.get('phone') || '',
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        submitted_at: new Date().toISOString()
    };
    
    // Validate form
    if (!validateContactForm(contactData)) {
        resetSubmitButton();
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        // In a real application, this would be sent to the server
        saveContactMessage(contactData);
        
        // Show success message
        showFormStatus('Thank you for your message! We will get back to you within 24 hours.', 'success');
        
        // Reset form
        e.target.reset();
        
        // Reset submit button
        resetSubmitButton();
        
        // Show notification
        showNotification('Message sent successfully!', 'success');
        
    }, 1500); // Simulate network delay
}

// Validate contact form
function validateContactForm(data) {
    let isValid = true;
    
    // Clear previous errors
    clearAllErrors();
    
    // Validate first name
    if (!validateRequired(data.first_name)) {
        showFieldError('firstName', 'First name is required');
        isValid = false;
    }
    
    // Validate last name
    if (!validateRequired(data.last_name)) {
        showFieldError('lastName', 'Last name is required');
        isValid = false;
    }
    
    // Validate email
    if (!validateRequired(data.email)) {
        showFieldError('email', 'Email is required');
        isValid = false;
    } else if (!validateEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone (optional but if provided, must be valid)
    if (data.phone && !validatePhone(data.phone)) {
        showFieldError('phone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate subject
    if (!validateRequired(data.subject)) {
        showFieldError('subject', 'Please select a subject');
        isValid = false;
    }
    
    // Validate message
    if (!validateRequired(data.message)) {
        showFieldError('message', 'Message is required');
        isValid = false;
    } else if (data.message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    clearFieldError(field.id);
    
    switch (fieldName) {
        case 'first_name':
        case 'last_name':
            if (!validateRequired(value)) {
                showFieldError(field.id, `${fieldName.replace('_', ' ')} is required`);
            }
            break;
            
        case 'email':
            if (!validateRequired(value)) {
                showFieldError(field.id, 'Email is required');
            } else if (!validateEmail(value)) {
                showFieldError(field.id, 'Please enter a valid email address');
            }
            break;
            
        case 'phone':
            if (value && !validatePhone(value)) {
                showFieldError(field.id, 'Please enter a valid phone number');
            }
            break;
            
        case 'subject':
            if (!validateRequired(value)) {
                showFieldError(field.id, 'Please select a subject');
            }
            break;
            
        case 'message':
            if (!validateRequired(value)) {
                showFieldError(field.id, 'Message is required');
            } else if (value.length < 10) {
                showFieldError(field.id, 'Message must be at least 10 characters long');
            }
            break;
    }
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#F44336';
        field.classList.add('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
}

// Clear field error
function clearFieldError(fieldId) {
    const field = typeof fieldId === 'string' ? document.getElementById(fieldId) : fieldId;
    if (field) {
        field.style.borderColor = '';
        field.classList.remove('error');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
}

// Clear all errors
function clearAllErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    const errorFields = document.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.style.borderColor = '';
        field.classList.remove('error');
    });
}

// Show form status
function showFormStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
}

// Reset submit button
function resetSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        submitBtn.disabled = false;
    }
}

// Save contact message to localStorage
function saveContactMessage(data) {
    const existingMessages = getFromLocalStorage('contactMessages') || [];
    existingMessages.push(data);
    saveToLocalStorage('contactMessages', existingMessages);
}

// Add character counter for message field
function addCharacterCounter() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.8rem;
            color: var(--luxury-light-gray);
            margin-top: 5px;
        `;
        
        const updateCounter = () => {
            const length = messageField.value.length;
            counter.textContent = `${length}/500 characters`;
            
            if (length > 500) {
                counter.style.color = '#F44336';
            } else if (length > 400) {
                counter.style.color = '#FF9800';
            } else {
                counter.style.color = 'var(--luxury-light-gray)';
            }
        };
        
        messageField.addEventListener('input', updateCounter);
        messageField.parentNode.appendChild(counter);
        updateCounter();
    }
}

// Add form animations
function addFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Initialize enhancements
document.addEventListener('DOMContentLoaded', function() {
    addCharacterCounter();
    addFormAnimations();
    
    // Add focus effects to form fields
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            if (!this.value) {
                this.parentNode.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (field.value) {
            field.parentNode.classList.add('focused');
        }
    });
});

// Add floating label effect
function addFloatingLabels() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group {
            position: relative;
        }
        
        .form-group.focused label {
            transform: translateY(-25px) scale(0.8);
            color: var(--luxury-gold);
        }
        
        .form-group label {
            transition: all 0.3s ease;
            transform-origin: left top;
        }
    `;
    document.head.appendChild(style);
}

// Initialize floating labels
document.addEventListener('DOMContentLoaded', function() {
    addFloatingLabels();
});