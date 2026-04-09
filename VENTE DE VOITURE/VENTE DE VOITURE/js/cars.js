// Cars page functionality
document.addEventListener('DOMContentLoaded', function() {
    let filteredCars = [...carsData];
    
    initializeFilters();
    loadCars();
    setupFilterEvents();
});

// Initialize filter options
function initializeFilters() {
    const brandFilter = document.getElementById('brandFilter');
    if (brandFilter) {
        const brands = [...new Set(carsData.map(car => car.brand))].sort();
        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandFilter.appendChild(option);
        });
    }
}

// Setup filter event listeners
function setupFilterEvents() {
    const searchInput = document.getElementById('searchInput');
    const brandFilter = document.getElementById('brandFilter');
    const priceFilter = document.getElementById('priceFilter');
    const yearFilter = document.getElementById('yearFilter');
    const fuelFilter = document.getElementById('fuelFilter');
    const filterToggle = document.getElementById('filterToggle');
    const advancedFilters = document.getElementById('advancedFilters');

    // Search input
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterCars, 300));
    }

    // Filter selects
    [brandFilter, priceFilter, yearFilter, fuelFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', filterCars);
        }
    });

    // Filter toggle
    if (filterToggle && advancedFilters) {
        filterToggle.addEventListener('click', function() {
            advancedFilters.classList.toggle('show');
            const icon = filterToggle.querySelector('i');
            if (advancedFilters.classList.contains('show')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-sliders-h';
            }
        });
    }
}

// Filter cars based on current filter values
function filterCars() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const selectedBrand = document.getElementById('brandFilter')?.value || '';
    const selectedPrice = document.getElementById('priceFilter')?.value || '';
    const selectedYear = document.getElementById('yearFilter')?.value || '';
    const selectedFuel = document.getElementById('fuelFilter')?.value || '';

    filteredCars = carsData.filter(car => {
        // Search filter
        const matchesSearch = searchTerm === '' || 
            car.brand.toLowerCase().includes(searchTerm) ||
            car.model.toLowerCase().includes(searchTerm) ||
            car.description.toLowerCase().includes(searchTerm);

        // Brand filter
        const matchesBrand = selectedBrand === '' || car.brand === selectedBrand;

        // Price filter
        let matchesPrice = true;
        if (selectedPrice) {
            const [min, max] = selectedPrice.split('-').map(Number);
            matchesPrice = car.price >= min && car.price <= (max || Infinity);
        }

        // Year filter
        const matchesYear = selectedYear === '' || car.year.toString() === selectedYear;

        // Fuel type filter
        const matchesFuel = selectedFuel === '' || car.fuel_type === selectedFuel;

        return matchesSearch && matchesBrand && matchesPrice && matchesYear && matchesFuel;
    });

    loadCars();
    updateResultsCount();
}

// Load and display cars
function loadCars() {
    const carsGrid = document.getElementById('carsGrid');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const noResults = document.getElementById('noResults');

    if (!carsGrid) return;

    // Show loading
    if (loadingSpinner) loadingSpinner.style.display = 'block';
    if (noResults) noResults.style.display = 'none';
    carsGrid.innerHTML = '';

    // Simulate loading delay for better UX
    setTimeout(() => {
        if (loadingSpinner) loadingSpinner.style.display = 'none';

        if (filteredCars.length === 0) {
            if (noResults) noResults.style.display = 'block';
            return;
        }

        // Generate car cards
        carsGrid.innerHTML = filteredCars.map((car, index) => `
            <div class="car-card" style="animation-delay: ${index * 0.1}s">
                <div class="car-image">
                    <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy">
                    <div class="car-overlay"></div>
                    <div class="car-price">${formatPrice(car.price)}</div>
                </div>
                <div class="car-content">
                    <h3 class="car-title">${car.brand} ${car.model}</h3>
                    <p class="car-description">${truncateText(car.description, 100)}</p>
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
                            <span>${formatNumber(car.horsepower)} HP</span>
                        </div>
                        <div class="car-spec">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>${car.top_speed} mph</span>
                        </div>
                    </div>
                    <a href="car-details.html?id=${car.id}" class="btn btn-primary">
                        <i class="fas fa-eye"></i>
                        View Details
                    </a>
                </div>
            </div>
        `).join('');

        // Animate cards on load
        const carCards = carsGrid.querySelectorAll('.car-card');
        carCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 100);
        });
    }, 500);
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const total = carsData.length;
        const showing = filteredCars.length;
        resultsCount.textContent = `Showing ${showing} of ${total} cars`;
    }
}

// Utility functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Sort functionality (optional enhancement)
function sortCars(sortBy) {
    switch (sortBy) {
        case 'price-low':
            filteredCars.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCars.sort((a, b) => b.price - a.price);
            break;
        case 'year-new':
            filteredCars.sort((a, b) => b.year - a.year);
            break;
        case 'year-old':
            filteredCars.sort((a, b) => a.year - b.year);
            break;
        case 'brand':
            filteredCars.sort((a, b) => a.brand.localeCompare(b.brand));
            break;
        default:
            // Default order
            filteredCars = [...carsData];
            filterCars(); // Re-apply filters
            return;
    }
    loadCars();
}

// Add sort dropdown if needed
function addSortControls() {
    const filtersContainer = document.querySelector('.filter-controls');
    if (filtersContainer && !document.getElementById('sortSelect')) {
        const sortSelect = document.createElement('select');
        sortSelect.id = 'sortSelect';
        sortSelect.className = 'filter-select';
        sortSelect.innerHTML = `
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="year-new">Year: Newest First</option>
            <option value="year-old">Year: Oldest First</option>
            <option value="brand">Brand: A to Z</option>
        `;
        
        sortSelect.addEventListener('change', (e) => {
            sortCars(e.target.value);
        });
        
        filtersContainer.appendChild(sortSelect);
    }
}

// Initialize sort controls
document.addEventListener('DOMContentLoaded', function() {
    addSortControls();
});