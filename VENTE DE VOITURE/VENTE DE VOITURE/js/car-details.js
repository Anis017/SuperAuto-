// Car details page functionality
let currentCar = null;
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', function() {
    loadCarDetails();
    initializeImageGallery();
    initializeTestDriveModal();
});

// Load car details from URL parameter
function loadCarDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = parseInt(urlParams.get('id'));
    
    if (!carId) {
        showError('Car not found');
        return;
    }
    
    currentCar = carsData.find(car => car.id === carId);
    
    if (!currentCar) {
        showError('Car not found');
        return;
    }
    
    displayCarDetails(currentCar);
}

// Display car details on the page
function displayCarDetails(car) {
    // Update page title
    document.title = `${car.brand} ${car.model} - Luxury Supercars`;
    
    // Update car information
    updateElement('carTitle', `${car.brand} ${car.model}`);
    updateElement('carPrice', formatPrice(car.price));
    updateElement('carDescription', car.description);
    updateElement('carYear', car.year);
    updateElement('carFuelType', car.fuel_type);
    updateElement('carMileage', `${formatNumber(car.mileage)} miles`);
    updateElement('carHorsepower', `${formatNumber(car.horsepower)} HP`);
    updateElement('carTopSpeed', `${car.top_speed} mph`);
    updateElement('carAcceleration', car.acceleration);
    
    // Load main image
    const mainImage = document.getElementById('mainCarImage');
    if (mainImage && car.gallery && car.gallery.length > 0) {
        mainImage.src = car.gallery[0];
        mainImage.alt = `${car.brand} ${car.model}`;
    }
    
    // Load thumbnail gallery
    loadThumbnailGallery(car.gallery);
}

// Load thumbnail gallery
function loadThumbnailGallery(gallery) {
    const thumbnailGallery = document.getElementById('thumbnailGallery');
    if (!thumbnailGallery || !gallery) return;
    
    thumbnailGallery.innerHTML = gallery.map((image, index) => `
        <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">
            <img src="${image}" alt="Car image ${index + 1}" loading="lazy">
        </div>
    `).join('');
}

// Initialize image gallery functionality
function initializeImageGallery() {
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    
    if (prevBtn) prevBtn.addEventListener('click', previousImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') previousImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}

// Select specific image
function selectImage(index) {
    if (!currentCar || !currentCar.gallery) return;
    
    currentImageIndex = index;
    const mainImage = document.getElementById('mainCarImage');
    
    if (mainImage) {
        // Add fade effect
        mainImage.style.opacity = '0';
        
        setTimeout(() => {
            mainImage.src = currentCar.gallery[index];
            mainImage.style.opacity = '1';
        }, 200);
    }
    
    // Update thumbnails
    const thumbnails = document.querySelectorAll('.thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// Navigate to previous image
function previousImage() {
    if (!currentCar || !currentCar.gallery) return;
    
    currentImageIndex = (currentImageIndex - 1 + currentCar.gallery.length) % currentCar.gallery.length;
    selectImage(currentImageIndex);
}

// Navigate to next image
function nextImage() {
    if (!currentCar || !currentCar.gallery) return;
    
    currentImageIndex = (currentImageIndex + 1) % currentCar.gallery.length;
    selectImage(currentImageIndex);
}

// Initialize test drive modal
function initializeTestDriveModal() {
    const testDriveBtn = document.getElementById('bookTestDriveBtn');
    const contactBtn = document.getElementById('contactBtn');
    const modal = document.getElementById('testDriveModal');
    const closeModal = document.getElementById('closeModal');
    const testDriveForm = document.getElementById('testDriveForm');
    
    // Open modal
    if (testDriveBtn) {
        testDriveBtn.addEventListener('click', function() {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Set minimum date to today
            const dateInput = document.getElementById('testDriveDate');
            if (dateInput) {
                const today = new Date().toISOString().split('T')[0];
                dateInput.min = today;
            }
        });
    }
    
    // Contact button
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            window.location.href = 'contact.html';
        });
    }
    
    // Close modal
    if (closeModal) {
        closeModal.addEventListener('click', closeTestDriveModal);
    }
    
    // Close modal on outside click
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTestDriveModal();
            }
        });
    }
    
    // Handle form submission
    if (testDriveForm) {
        testDriveForm.addEventListener('submit', handleTestDriveSubmission);
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeTestDriveModal();
        }
    });
}

// Close test drive modal
function closeTestDriveModal() {
    const modal = document.getElementById('testDriveModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('testDriveForm');
        if (form) form.reset();
    }
}

// Handle test drive form submission
function handleTestDriveSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const testDriveData = {
        id: Date.now(), // Simple ID generation
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        car_id: currentCar.id,
        car_name: `${currentCar.brand} ${currentCar.model}`,
        preferred_date: formData.get('preferred_date'),
        message: formData.get('message') || '',
        submitted_at: new Date().toISOString()
    };
    
    // Validate form data
    if (!validateTestDriveForm(testDriveData)) {
        return;
    }
    
    // In a real application, this would be sent to the server
    // For now, we'll save to localStorage
    saveTestDriveRequest(testDriveData);
    
    // Show success message
    showNotification('Test drive request submitted successfully! We will contact you soon.', 'success');
    
    // Close modal
    closeTestDriveModal();
}

// Validate test drive form
function validateTestDriveForm(data) {
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    // Validate name
    if (!validateRequired(data.name)) {
        showFieldError('testDriveName', 'Name is required');
        isValid = false;
    }
    
    // Validate email
    if (!validateRequired(data.email)) {
        showFieldError('testDriveEmail', 'Email is required');
        isValid = false;
    } else if (!validateEmail(data.email)) {
        showFieldError('testDriveEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    if (!validateRequired(data.phone)) {
        showFieldError('testDrivePhone', 'Phone number is required');
        isValid = false;
    } else if (!validatePhone(data.phone)) {
        showFieldError('testDrivePhone', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Validate date
    if (!validateRequired(data.preferred_date)) {
        showFieldError('testDriveDate', 'Preferred date is required');
        isValid = false;
    } else {
        const selectedDate = new Date(data.preferred_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError('testDriveDate', 'Please select a future date');
            isValid = false;
        }
    }
    
    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.borderColor = '#F44336';
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
}

// Save test drive request to localStorage
function saveTestDriveRequest(data) {
    const existingRequests = getFromLocalStorage('testDriveRequests') || [];
    existingRequests.push(data);
    saveToLocalStorage('testDriveRequests', existingRequests);
}

// Utility functions
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

function showError(message) {
    const carDetails = document.getElementById('carDetails');
    if (carDetails) {
        carDetails.innerHTML = `
            <div class="container">
                <div class="error-message" style="text-align: center; padding: 60px 0;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 4rem; color: var(--luxury-gold); margin-bottom: 20px;"></i>
                    <h2 style="color: var(--luxury-white); margin-bottom: 15px;">${message}</h2>
                    <p style="color: var(--luxury-light-gray); margin-bottom: 30px;">The car you're looking for could not be found.</p>
                    <a href="cars.html" class="btn btn-primary">
                        <i class="fas fa-arrow-left"></i>
                        Back to Collection
                    </a>
                </div>
            </div>
        `;
    }
}

// Add smooth scrolling to specs section
function scrollToSpecs() {
    const specsSection = document.querySelector('.car-specs');
    if (specsSection) {
        specsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add image zoom functionality (optional enhancement)
function initializeImageZoom() {
    const mainImage = document.getElementById('mainCarImage');
    if (mainImage) {
        mainImage.addEventListener('click', function() {
            // Create zoom overlay
            const zoomOverlay = document.createElement('div');
            zoomOverlay.className = 'zoom-overlay';
            zoomOverlay.innerHTML = `
                <div class="zoom-container">
                    <img src="${this.src}" alt="${this.alt}">
                    <button class="zoom-close">&times;</button>
                </div>
            `;
            
            // Add styles
            zoomOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.9);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: zoom-out;
            `;
            
            const zoomContainer = zoomOverlay.querySelector('.zoom-container');
            zoomContainer.style.cssText = `
                position: relative;
                max-width: 90%;
                max-height: 90%;
            `;
            
            const zoomImage = zoomOverlay.querySelector('img');
            zoomImage.style.cssText = `
                width: 100%;
                height: 100%;
                object-fit: contain;
            `;
            
            const closeBtn = zoomOverlay.querySelector('.zoom-close');
            closeBtn.style.cssText = `
                position: absolute;
                top: -40px;
                right: -40px;
                background: none;
                border: none;
                color: white;
                font-size: 30px;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            // Add to page
            document.body.appendChild(zoomOverlay);
            document.body.style.overflow = 'hidden';
            
            // Close functionality
            const closeZoom = () => {
                document.body.removeChild(zoomOverlay);
                document.body.style.overflow = '';
            };
            
            zoomOverlay.addEventListener('click', closeZoom);
            closeBtn.addEventListener('click', closeZoom);
            
            // Prevent image click from closing
            zoomImage.addEventListener('click', (e) => e.stopPropagation());
        });
        
        // Add cursor pointer to indicate clickable
        mainImage.style.cursor = 'zoom-in';
    }
}

// Initialize image zoom on load
document.addEventListener('DOMContentLoaded', function() {
    initializeImageZoom();
});