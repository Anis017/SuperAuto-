// Global variables
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

// Sample car data (in production, this would come from PHP/MySQL)
const carsData = [
    {
        id: 1,
        brand: 'Ferrari',
        model: 'SF90 Stradale',
        price: 625000,
        image: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        description: 'The SF90 Stradale is Ferrari\'s first series-production plug-in hybrid supercar, combining a twin-turbo V8 with three electric motors.',
        year: 2024,
        fuel_type: 'Hybrid',
        mileage: 0,
        horsepower: 986,
        top_speed: 211,
        acceleration: '2.5s 0-60mph',
        gallery: [
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
            'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
            'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
        ]
    },
    {
        id: 2,
        brand: 'Lamborghini',
        model: 'Revuelto',
        price: 598000,
        image: 'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        description: 'The Revuelto is Lamborghini\'s first V12 hybrid super sports car, combining naturally aspirated V12 with hybrid technology.',
        year: 2024,
        fuel_type: 'Hybrid',
        mileage: 0,
        horsepower: 1001,
        top_speed: 217,
        acceleration: '2.5s 0-60mph',
        gallery: [
            'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
            'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
        ]
    },
    {
        id: 3,
        brand: 'McLaren',
        model: '720S',
        price: 315000,
        image: 'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        description: 'The McLaren 720S is a pinnacle of supercar engineering, featuring carbon fiber construction and active aerodynamics.',
        year: 2023,
        fuel_type: 'Petrol',
        mileage: 2500,
        horsepower: 710,
        top_speed: 212,
        acceleration: '2.8s 0-60mph',
        gallery: [
            'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
            'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
        ]
    },
    {
        id: 4,
        brand: 'Rolls-Royce',
        model: 'Cullinan',
        price: 395000,
        image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        description: 'The Cullinan is Rolls-Royce\'s first SUV, combining luxury with all-terrain capability and the finest materials.',
        year: 2024,
        fuel_type: 'Petrol',
        mileage: 0,
        horsepower: 563,
        top_speed: 155,
        acceleration: '5.2s 0-60mph',
        gallery: [
            'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
        ]
    },
    {
        id: 5,
        brand: 'Porsche',
        model: '911 Turbo S',
        price: 230000,
        image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        description: 'The 911 Turbo S represents the pinnacle of Porsche performance, combining heritage with cutting-edge technology.',
        year: 2024,
        fuel_type: 'Petrol',
        mileage: 0,
        horsepower: 640,
        top_speed: 205,
        acceleration: '2.6s 0-60mph',
        gallery: [
            'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
            'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
        ]
    },
    {
        id: 6,
        brand: 'Bugatti',
        model: 'Chiron',
        price: 3200000,
        image: 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
        description: 'The Chiron is the ultimate expression of automotive luxury and performance, with an 8.0L quad-turbo W16 engine.',
        year: 2023,
        fuel_type: 'Petrol',
        mileage: 1200,
        horsepower: 1479,
        top_speed: 261,
        acceleration: '2.4s 0-60mph',
        gallery: [
            'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2',
            'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=2'
        ]
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavbar();
    initializeHeroSlider();
    initializeScrollAnimations();
    loadFeaturedCars();
    initializeAOS();
});

// Navbar functionality
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Active link highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Hero slider functionality
function initializeHeroSlider() {
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (slides.length === 0) return;

    // Auto-play slider
    setInterval(nextSlide, 5000);

    // Manual controls
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Indicator controls
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateSlider();
}

function updateSlider() {
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Scroll animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.stat-item, .car-card, [data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// AOS (Animate On Scroll) initialization
function initializeAOS() {
    const aosElements = document.querySelectorAll('[data-aos]');
    
    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const aosType = element.getAttribute('data-aos');
                const aosDelay = element.getAttribute('data-aos-delay') || 0;
                
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, aosDelay);
            }
        });
    }, {
        threshold: 0.1
    });

    aosElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        aosObserver.observe(el);
    });
}

// Load featured cars on homepage
function loadFeaturedCars() {
    const featuredCarsContainer = document.getElementById('featuredCars');
    if (!featuredCarsContainer) return;

    const featuredCars = carsData.slice(0, 3); // Get first 3 cars as featured
    
    featuredCarsContainer.innerHTML = featuredCars.map((car, index) => `
        <div class="car-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <div class="car-image">
                <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy">
                <div class="car-overlay"></div>
                <div class="car-price">$${car.price.toLocaleString()}</div>
            </div>
            <div class="car-content">
                <h3 class="car-title">${car.brand} ${car.model}</h3>
                <p class="car-description">${car.description}</p>
                <div class="car-specs">
                    <div class="car-spec">
                        <i class="fas fa-calendar"></i>
                        <span>${car.year}</span>
                    </div>
                    <div class="car-spec">
                        <i class="fas fa-gas-pump"></i>
                        <span>${car.fuel_type}</span>
                    </div>
                    <div class="car-spec">
                        <i class="fas fa-bolt"></i>
                        <span>${car.horsepower} HP</span>
                    </div>
                    <div class="car-spec">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>${car.top_speed} mph</span>
                    </div>
                </div>
                <a href="car-details.html?id=${car.id}" class="btn btn-primary">View Details</a>
            </div>
        </div>
    `).join('');
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-US').format(number);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 400px;
            }
            .notification.success {
                background: #4CAF50;
            }
            .notification.error {
                background: #F44336;
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 5000);
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function validateRequired(value) {
    return value.trim().length > 0;
}

// Local storage helpers
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Export functions for use in other files
window.carsData = carsData;
window.formatPrice = formatPrice;
window.formatNumber = formatNumber;
window.showNotification = showNotification;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.validateRequired = validateRequired;
window.saveToLocalStorage = saveToLocalStorage;
window.getFromLocalStorage = getFromLocalStorage;