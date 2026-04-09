// Admin panel functionality
let isLoggedIn = false;
let currentTab = 'cars';

document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
    initializeLogin();
    initializeAdminPanel();
});

// Check if user is already logged in
function checkLoginStatus() {
    isLoggedIn = getFromLocalStorage('adminLoggedIn') || false;
    
    if (isLoggedIn) {
        showAdminDashboard();
    } else {
        showLoginForm();
    }
}

// Initialize login functionality
function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginStatus = document.getElementById('loginStatus');
    
    // Simple authentication (in production, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        isLoggedIn = true;
        saveToLocalStorage('adminLoggedIn', true);
        
        showNotification('Login successful!', 'success');
        showAdminDashboard();
    } else {
        loginStatus.innerHTML = '<div class="form-status error">Invalid username or password</div>';
        showNotification('Invalid credentials', 'error');
    }
}

// Show login form
function showLoginForm() {
    const loginSection = document.getElementById('adminLogin');
    const dashboardSection = document.getElementById('adminDashboard');
    
    if (loginSection) loginSection.style.display = 'flex';
    if (dashboardSection) dashboardSection.style.display = 'none';
}

// Show admin dashboard
function showAdminDashboard() {
    const loginSection = document.getElementById('adminLogin');
    const dashboardSection = document.getElementById('adminDashboard');
    
    if (loginSection) loginSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    
    loadDashboardData();
}

// Initialize admin panel functionality
function initializeAdminPanel() {
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Add car button
    const addCarBtn = document.getElementById('addCarBtn');
    if (addCarBtn) {
        addCarBtn.addEventListener('click', showAddCarModal);
    }
    
    // Car form
    const carForm = document.getElementById('carForm');
    if (carForm) {
        carForm.addEventListener('submit', handleCarFormSubmission);
    }
    
    // Modal close buttons
    const closeCarModal = document.getElementById('closeCarModal');
    if (closeCarModal) {
        closeCarModal.addEventListener('click', hideCarModal);
    }
    
    // Close modal on outside click
    const carModal = document.getElementById('carModal');
    if (carModal) {
        carModal.addEventListener('click', function(e) {
            if (e.target === carModal) {
                hideCarModal();
            }
        });
    }
}

// Handle logout
function handleLogout() {
    isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    showNotification('Logged out successfully', 'success');
    showLoginForm();
}

// Switch between tabs
function switchTab(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tabName}-tab`);
    });
    
    // Load tab-specific data
    switch (tabName) {
        case 'cars':
            loadCarsTable();
            break;
        case 'test-drives':
            loadTestDrivesTable();
            break;
        case 'messages':
            loadMessagesTable();
            break;
    }
}

// Load dashboard statistics
function loadDashboardData() {
    const cars = carsData;
    const testDrives = getFromLocalStorage('testDriveRequests') || [];
    const messages = getFromLocalStorage('contactMessages') || [];
    
    // Update stats
    updateElement('totalCars', cars.length);
    updateElement('totalTestDrives', testDrives.length);
    updateElement('totalMessages', messages.length);
    
    // Load initial tab
    switchTab('cars');
}

// Load cars table
function loadCarsTable() {
    const tableBody = document.getElementById('carsTableBody');
    if (!tableBody) return;
    
    const cars = getFromLocalStorage('carsData') || carsData;
    
    tableBody.innerHTML = cars.map(car => `
        <tr>
            <td>
                <img src="${car.image}" alt="${car.brand} ${car.model}" class="car-image-small">
            </td>
            <td>${car.brand}</td>
            <td>${car.model}</td>
            <td>${car.year}</td>
            <td>${formatPrice(car.price)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-edit" onclick="editCar(${car.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteCar(${car.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load test drives table
function loadTestDrivesTable() {
    const tableBody = document.getElementById('testDrivesTableBody');
    if (!tableBody) return;
    
    const testDrives = getFromLocalStorage('testDriveRequests') || [];
    
    if (testDrives.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: var(--luxury-light-gray);">
                    <i class="fas fa-calendar-times" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    No test drive requests yet
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = testDrives.map(request => `
        <tr>
            <td>${request.name}</td>
            <td>${request.email}</td>
            <td>${request.phone}</td>
            <td>${request.car_name || 'Unknown Car'}</td>
            <td>${formatDate(request.preferred_date)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-edit" onclick="viewTestDriveDetails(${request.id})">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteTestDrive(${request.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load messages table
function loadMessagesTable() {
    const tableBody = document.getElementById('messagesTableBody');
    if (!tableBody) return;
    
    const messages = getFromLocalStorage('contactMessages') || [];
    
    if (messages.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px; color: var(--luxury-light-gray);">
                    <i class="fas fa-envelope-open" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    No messages yet
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = messages.map(message => `
        <tr>
            <td>${message.first_name} ${message.last_name}</td>
            <td>${message.email}</td>
            <td>${message.subject}</td>
            <td>${formatDate(message.submitted_at)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn btn-sm btn-edit" onclick="viewMessageDetails(${message.id})">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="btn btn-sm btn-delete" onclick="deleteMessage(${message.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Show add car modal
function showAddCarModal() {
    const modal = document.getElementById('carModal');
    const modalTitle = document.getElementById('carModalTitle');
    const carForm = document.getElementById('carForm');
    
    if (modal && modalTitle && carForm) {
        modalTitle.textContent = 'Add New Car';
        carForm.reset();
        document.getElementById('carId').value = '';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Edit car
function editCar(carId) {
    const cars = getFromLocalStorage('carsData') || carsData;
    const car = cars.find(c => c.id === carId);
    
    if (!car) {
        showNotification('Car not found', 'error');
        return;
    }
    
    const modal = document.getElementById('carModal');
    const modalTitle = document.getElementById('carModalTitle');
    
    if (modal && modalTitle) {
        modalTitle.textContent = 'Edit Car';
        
        // Populate form
        document.getElementById('carId').value = car.id;
        document.getElementById('carBrand').value = car.brand;
        document.getElementById('carModel').value = car.model;
        document.getElementById('carYear').value = car.year;
        document.getElementById('carPrice').value = car.price;
        document.getElementById('carFuelType').value = car.fuel_type;
        document.getElementById('carMileage').value = car.mileage;
        document.getElementById('carHorsepower').value = car.horsepower || '';
        document.getElementById('carTopSpeed').value = car.top_speed || '';
        document.getElementById('carAcceleration').value = car.acceleration || '';
        document.getElementById('carImage').value = car.image;
        document.getElementById('carDescription').value = car.description;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Delete car
function deleteCar(carId) {
    if (!confirm('Are you sure you want to delete this car?')) {
        return;
    }
    
    let cars = getFromLocalStorage('carsData') || [...carsData];
    cars = cars.filter(car => car.id !== carId);
    saveToLocalStorage('carsData', cars);
    
    showNotification('Car deleted successfully', 'success');
    loadCarsTable();
    loadDashboardData();
}

// Handle car form submission
function handleCarFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const carData = {
        id: parseInt(formData.get('id')) || Date.now(),
        brand: formData.get('brand'),
        model: formData.get('model'),
        year: parseInt(formData.get('year')),
        price: parseInt(formData.get('price')),
        fuel_type: formData.get('fuel_type'),
        mileage: parseInt(formData.get('mileage')) || 0,
        horsepower: parseInt(formData.get('horsepower')) || 0,
        top_speed: parseInt(formData.get('top_speed')) || 0,
        acceleration: formData.get('acceleration') || '',
        image: formData.get('image'),
        description: formData.get('description'),
        gallery: [formData.get('image')] // Simple gallery with main image
    };
    
    let cars = getFromLocalStorage('carsData') || [...carsData];
    
    if (formData.get('id')) {
        // Update existing car
        const index = cars.findIndex(car => car.id === carData.id);
        if (index !== -1) {
            cars[index] = carData;
            showNotification('Car updated successfully', 'success');
        }
    } else {
        // Add new car
        cars.push(carData);
        showNotification('Car added successfully', 'success');
    }
    
    saveToLocalStorage('carsData', cars);
    hideCarModal();
    loadCarsTable();
    loadDashboardData();
}

// Hide car modal
function hideCarModal() {
    const modal = document.getElementById('carModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// View test drive details
function viewTestDriveDetails(requestId) {
    const testDrives = getFromLocalStorage('testDriveRequests') || [];
    const request = testDrives.find(r => r.id === requestId);
    
    if (!request) {
        showNotification('Request not found', 'error');
        return;
    }
    
    const details = `
        <strong>Name:</strong> ${request.name}<br>
        <strong>Email:</strong> ${request.email}<br>
        <strong>Phone:</strong> ${request.phone}<br>
        <strong>Car:</strong> ${request.car_name}<br>
        <strong>Preferred Date:</strong> ${formatDate(request.preferred_date)}<br>
        <strong>Message:</strong> ${request.message || 'No message provided'}<br>
        <strong>Submitted:</strong> ${formatDate(request.submitted_at)}
    `;
    
    showModal('Test Drive Request Details', details);
}

// View message details
function viewMessageDetails(messageId) {
    const messages = getFromLocalStorage('contactMessages') || [];
    const message = messages.find(m => m.id === messageId);
    
    if (!message) {
        showNotification('Message not found', 'error');
        return;
    }
    
    const details = `
        <strong>Name:</strong> ${message.first_name} ${message.last_name}<br>
        <strong>Email:</strong> ${message.email}<br>
        <strong>Phone:</strong> ${message.phone || 'Not provided'}<br>
        <strong>Subject:</strong> ${message.subject}<br>
        <strong>Newsletter:</strong> ${message.newsletter ? 'Yes' : 'No'}<br>
        <strong>Submitted:</strong> ${formatDate(message.submitted_at)}<br><br>
        <strong>Message:</strong><br>
        <div style="background: var(--luxury-black); padding: 15px; border-radius: 8px; margin-top: 10px;">
            ${message.message.replace(/\n/g, '<br>')}
        </div>
    `;
    
    showModal('Contact Message Details', details);
}

// Delete test drive request
function deleteTestDrive(requestId) {
    if (!confirm('Are you sure you want to delete this test drive request?')) {
        return;
    }
    
    let testDrives = getFromLocalStorage('testDriveRequests') || [];
    testDrives = testDrives.filter(request => request.id !== requestId);
    saveToLocalStorage('testDriveRequests', testDrives);
    
    showNotification('Test drive request deleted', 'success');
    loadTestDrivesTable();
    loadDashboardData();
}

// Delete message
function deleteMessage(messageId) {
    if (!confirm('Are you sure you want to delete this message?')) {
        return;
    }
    
    let messages = getFromLocalStorage('contactMessages') || [];
    messages = messages.filter(message => message.id !== messageId);
    saveToLocalStorage('contactMessages', messages);
    
    showNotification('Message deleted', 'success');
    loadMessagesTable();
    loadDashboardData();
}

// Show generic modal
function showModal(title, content) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('detailsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'detailsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 id="detailsModalTitle"></h2>
                    <button class="modal-close" onclick="hideDetailsModal()">&times;</button>
                </div>
                <div class="modal-body" id="detailsModalBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('detailsModalTitle').textContent = title;
    document.getElementById('detailsModalBody').innerHTML = content;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Hide details modal
function hideDetailsModal() {
    const modal = document.getElementById('detailsModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Utility functions
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Make functions globally available
window.editCar = editCar;
window.deleteCar = deleteCar;
window.viewTestDriveDetails = viewTestDriveDetails;
window.viewMessageDetails = viewMessageDetails;
window.deleteTestDrive = deleteTestDrive;
window.deleteMessage = deleteMessage;
window.hideDetailsModal = hideDetailsModal;