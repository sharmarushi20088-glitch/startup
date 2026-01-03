/* ============================================
   CLASSIFIED ADS PLATFORM - JAVASCRIPT
   ============================================ */

// ============================================
// SAMPLE DATA
// ============================================

const sampleListings = [
    {
        id: 1,
        title: "Best Database Data Entry Services",
        price: 4.00,
        location: "Hamirpur",
        category: "services",
        condition: "new",
        image: "https://via.placeholder.com/220x200?text=Database+Services",
        description: "Professional database data entry services with high accuracy. We handle large scale data input projects.",
        seller: { name: "John Dev", rating: 4.8 },
        date: "2 days ago",
        views: 234
    },
    {
        id: 2,
        title: "Haier 195L refrigerator",
        price: 7000,
        location: "Delhi",
        category: "electronics",
        condition: "used",
        image: "https://via.placeholder.com/220x200?text=Refrigerator",
        description: "Good condition refrigerator with minimal usage. All features working perfectly.",
        seller: { name: "Priya Sharma", rating: 4.5 },
        date: "5 days ago",
        views: 567
    },
    {
        id: 3,
        title: "Best Cruise In Varanasi - Jalsa Cruise Lines",
        price: 0,
        location: "Varanasi",
        category: "services",
        condition: "new",
        image: "https://via.placeholder.com/220x200?text=Cruise+Lines",
        description: "Experience the beauty of Varanasi with our premium cruise services. Book now for unforgettable memories.",
        seller: { name: "Cruise Travel", rating: 4.9 },
        date: "1 day ago",
        views: 890,
        isFree: true
    },
    {
        id: 4,
        title: "Custom Mobile Application Development",
        price: 0,
        location: "Bangalore",
        category: "services",
        condition: "new",
        image: "https://via.placeholder.com/220x200?text=Mobile+Apps",
        description: "Expert mobile app development for iOS and Android. Custom solutions for your business needs.",
        seller: { name: "Tech Studio", rating: 4.7 },
        date: "3 days ago",
        views: 1200,
        isFree: true
    },
    {
        id: 5,
        title: "Steel Wardrobe",
        price: 15000,
        location: "Mumbai",
        category: "furniture",
        condition: "used",
        image: "https://via.placeholder.com/220x200?text=Wardrobe",
        description: "Strong steel wardrobe with good storage. Slightly used, maintained well.",
        seller: { name: "Rajesh Kumar", rating: 4.6 },
        date: "1 week ago",
        views: 456
    },
    {
        id: 6,
        title: "Building Construction Consultation",
        price: 0,
        location: "Pune",
        category: "services",
        condition: "new",
        image: "https://via.placeholder.com/220x200?text=Construction",
        description: "Expert building construction consultation and planning. Civil engineers available for consultation.",
        seller: { name: "Build Expert", rating: 4.8 },
        date: "4 days ago",
        views: 678,
        isFree: true
    },
    {
        id: 7,
        title: "Best Ayurveda Treatments in Kerala",
        price: 0,
        location: "Kochi",
        category: "services",
        condition: "new",
        image: "https://via.placeholder.com/220x200?text=Ayurveda",
        description: "Traditional Ayurvedic treatments with expert practitioners. Rejuvenation and wellness packages available.",
        seller: { name: "Ayur Clinic", rating: 4.9 },
        date: "2 days ago",
        views: 890,
        isFree: true
    },
    {
        id: 8,
        title: "Product BOM Duplicate in Odoo",
        price: 8.25,
        location: "Hyderabad",
        category: "services",
        condition: "new",
        image: "https://via.placeholder.com/220x200?text=Odoo+Service",
        description: "Odoo ERP customization and BOM management solutions. Automate your product duplication process.",
        seller: { name: "Odoo Expert", rating: 4.7 },
        date: "3 days ago",
        views: 345
    }
];

// ============================================
// STATE MANAGEMENT
// ============================================

let currentListings = [...sampleListings];
let filteredListings = [...sampleListings];
let currentPage = 1;
const itemsPerPage = 12;
let currentViewMode = 'grid';
let selectedImages = [];

// ============================================
// DOM ELEMENTS
// ============================================

const listingsContainer = document.getElementById('listingsContainer');
const categoryFilter = document.getElementById('categoryFilter');
const locationFilter = document.getElementById('locationFilter');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const conditionCheckboxes = document.querySelectorAll('.condition-check');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const clearFiltersBtn = document.getElementById('clearFiltersBtn');
const sortFilter = document.getElementById('sortFilter');
const viewBtns = document.querySelectorAll('.view-btn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const sellBtn = document.getElementById('sellBtn');
const sellModal = document.getElementById('sellModal');
const listingModal = document.getElementById('listingModal');
const sellForm = document.getElementById('sellForm');
const fileInput = document.getElementById('sellPhotos');
const previewContainer = document.getElementById('previewContainer');
const uploadArea = document.querySelector('.upload-area');
const toast = document.getElementById('toast');
const noResults = document.getElementById('noResults');
const paginationContainer = document.getElementById('paginationContainer');

// ============================================
// INITIALIZATION
// ============================================

function init() {
    renderListings();
    setupEventListeners();
    updatePriceDisplay();
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Filter events
    applyFiltersBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);
    priceRange.addEventListener('input', updatePriceDisplay);
    sortFilter.addEventListener('change', handleSort);

    // Search events
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // View mode events
    viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            viewBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentViewMode = btn.dataset.view;
            currentPage = 1;
            renderListings();
        });
    });

    // Modal events
    sellBtn.addEventListener('click', () => openModal('sellModal'));
    
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            closeModal(modal.id);
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal.id);
        });
    });

    // Form events
    sellForm.addEventListener('submit', handleFormSubmit);
    fileInput.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = 'rgba(244, 120, 32, 0.1)';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        handleFileSelect({ target: { files: e.dataTransfer.files } });
    });
}

// ============================================
// FILTER FUNCTIONS
// ============================================

function updatePriceDisplay() {
    priceValue.textContent = parseInt(priceRange.value).toLocaleString('en-IN');
}

function applyFilters() {
    const category = categoryFilter.value;
    const location = locationFilter.value;
    const maxPrice = parseInt(priceRange.value);
    const conditions = Array.from(conditionCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value);

    filteredListings = currentListings.filter(listing => {
        const categoryMatch = !category || listing.category === category;
        const locationMatch = !location || listing.location.toLowerCase() === location.toLowerCase();
        const priceMatch = listing.price <= maxPrice;
        const conditionMatch = conditions.length === 0 || conditions.includes(listing.condition);

        return categoryMatch && locationMatch && priceMatch && conditionMatch;
    });

    currentPage = 1;
    renderListings();
    showToast('Filters applied successfully', 'success');
}

function clearFilters() {
    categoryFilter.value = '';
    locationFilter.value = '';
    priceRange.value = 100000;
    conditionCheckboxes.forEach(cb => cb.checked = false);
    updatePriceDisplay();
    filteredListings = [...currentListings];
    currentPage = 1;
    renderListings();
    showToast('Filters cleared', 'success');
}

function handleSort(e) {
    const sortBy = e.target.value;
    
    switch(sortBy) {
        case 'newest':
            filteredListings.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            filteredListings.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'price-low':
            filteredListings.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredListings.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredListings.sort((a, b) => b.views - a.views);
            break;
    }
    
    currentPage = 1;
    renderListings();
}

function performSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (!query) {
        filteredListings = [...currentListings];
    } else {
        filteredListings = currentListings.filter(listing => {
            const titleMatch = listing.title.toLowerCase().includes(query);
            const descMatch = listing.description.toLowerCase().includes(query);
            const locationMatch = listing.location.toLowerCase().includes(query);
            
            return titleMatch || descMatch || locationMatch;
        });
    }
    
    currentPage = 1;
    renderListings();
    
    if (filteredListings.length === 0) {
        showToast('No listings found for your search', 'error');
    }
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

function renderListings() {
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = startIdx + itemsPerPage;
    const paginatedListings = filteredListings.slice(startIdx, endIdx);

    if (paginatedListings.length === 0) {
        listingsContainer.innerHTML = '';
        noResults.style.display = 'block';
        paginationContainer.innerHTML = '';
        return;
    }

    noResults.style.display = 'none';
    listingsContainer.innerHTML = paginatedListings.map(listing => `
        <div class="listing-card ${currentViewMode === 'list' ? 'list-view' : ''}" onclick="openListingDetail(${listing.id})">
            <div class="listing-image">
                <img src="${listing.image}" alt="${listing.title}" loading="lazy">
                ${listing.isFree ? '<span class="listing-badge">Free</span>' : ''}
            </div>
            <div class="listing-details">
                <div class="listing-price">
                    ${listing.isFree ? 'Free' : '₹' + listing.price.toLocaleString('en-IN')}
                </div>
                <div class="listing-title">${listing.title}</div>
                <div class="listing-meta">
                    <span>${listing.condition}</span>
                    <span>${listing.views} views</span>
                </div>
                <div class="listing-location">📍 ${listing.location}</div>
                <div class="listing-seller">
                    <div class="seller-avatar">${listing.seller.name.charAt(0)}</div>
                    <div>
                        <div>${listing.seller.name}</div>
                        <div>⭐ ${listing.seller.rating}</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
    let paginationHTML = '';

    if (currentPage > 1) {
        paginationHTML += `<button onclick="changePage(${currentPage - 1})">← Previous</button>`;
    }

    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<button onclick="changePage(1)">1</button>`;
        if (startPage > 2) paginationHTML += `<span>...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="${activeClass}" onclick="changePage(${i})">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHTML += `<span>...</span>`;
        paginationHTML += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }

    if (currentPage < totalPages) {
        paginationHTML += `<button onclick="changePage(${currentPage + 1})">Next →</button>`;
    }

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(pageNum) {
    currentPage = pageNum;
    renderListings();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// MODAL FUNCTIONS
// ============================================

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
    if (modalId === 'sellModal') {
        sellForm.reset();
        previewContainer.innerHTML = '';
        selectedImages = [];
    }
}

function openListingDetail(listingId) {
    const listing = currentListings.find(l => l.id === listingId);
    if (!listing) return;

    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <div class="listing-detail">
            <div class="listing-detail-image">
                <img src="${listing.image}" alt="${listing.title}">
            </div>
            
            <div class="listing-detail-content">
                <h3>${listing.title}</h3>
                <div class="listing-detail-price">
                    ${listing.isFree ? 'Free' : '₹' + listing.price.toLocaleString('en-IN')}
                </div>
                
                <div class="listing-detail-meta">
                    <div class="detail-meta-item">
                        <span class="detail-meta-label">Location</span>
                        <span class="detail-meta-value">📍 ${listing.location}</span>
                    </div>
                    <div class="detail-meta-item">
                        <span class="detail-meta-label">Condition</span>
                        <span class="detail-meta-value">${listing.condition.charAt(0).toUpperCase() + listing.condition.slice(1)}</span>
                    </div>
                    <div class="detail-meta-item">
                        <span class="detail-meta-label">Category</span>
                        <span class="detail-meta-value">${listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}</span>
                    </div>
                    <div class="detail-meta-item">
                        <span class="detail-meta-label">Posted</span>
                        <span class="detail-meta-value">${listing.date}</span>
                    </div>
                </div>
                
                <div class="listing-detail-description">
                    <h4>Description</h4>
                    <p>${listing.description}</p>
                </div>
                
                <div class="seller-info">
                    <div class="seller-header">
                        <div class="seller-avatar-lg">${listing.seller.name.charAt(0)}</div>
                        <div>
                            <div class="seller-name">${listing.seller.name}</div>
                            <div class="seller-rating">⭐ ${listing.seller.rating} rating • ${listing.views} views</div>
                        </div>
                    </div>
                    <div class="seller-actions">
                        <button class="action-btn primary" onclick="contactSeller('${listing.seller.name}')">Contact Seller</button>
                        <button class="action-btn" onclick="addToWishlist(${listing.id})">❤️ Wishlist</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    openModal('listingModal');
}

// ============================================
// FORM HANDLING
// ============================================

function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    
    // Limit to 5 images
    if (selectedImages.length + files.length > 5) {
        showToast('Maximum 5 images allowed', 'error');
        return;
    }

    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            showToast('Please select image files only', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImages.push({
                src: e.target.result,
                name: file.name
            });
            renderImagePreviews();
        };
        reader.readAsDataURL(file);
    });
}

function renderImagePreviews() {
    previewContainer.innerHTML = selectedImages.map((img, idx) => `
        <div class="preview-image">
            <img src="${img.src}" alt="Preview">
            <button type="button" class="remove-image" onclick="removeImage(${idx})">×</button>
        </div>
    `).join('');
}

function removeImage(idx) {
    selectedImages.splice(idx, 1);
    renderImagePreviews();
}

function handleFormSubmit(e) {
    e.preventDefault();

    const newListing = {
        id: currentListings.length + 1,
        title: document.getElementById('sellTitle').value,
        price: parseInt(document.getElementById('sellPrice').value) || 0,
        location: document.getElementById('sellLocation').value,
        category: document.getElementById('sellCategory').value,
        condition: document.getElementById('sellCondition').value,
        image: selectedImages.length > 0 ? selectedImages[0].src : 'https://via.placeholder.com/220x200?text=No+Image',
        description: document.getElementById('sellDescription').value,
        seller: {
            name: document.getElementById('sellName').value,
            rating: 4.5
        },
        date: 'Just now',
        views: 0,
        isFree: parseInt(document.getElementById('sellPrice').value) === 0
    };

    currentListings.unshift(newListing);
    filteredListings = [...currentListings];
    currentPage = 1;

    renderListings();
    closeModal('sellModal');
    showToast('Item posted successfully! 🎉', 'success');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function contactSeller(sellerName) {
    showToast(`Message sent to ${sellerName}! 📨`, 'success');
    closeModal('listingModal');
}

function addToWishlist(listingId) {
    showToast('Added to wishlist ❤️', 'success');
}

// Utility: Format number as Indian currency
function formatINR(num) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(num);
}

// Utility: Time ago formatter
function timeAgo(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + 'y ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + 'mo ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + 'd ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + 'h ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + 'm ago';
    
    return Math.floor(seconds) + 's ago';
}

// Debounce function for search
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

// ============================================
// LOCAL STORAGE UTILITIES
// ============================================

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.log('LocalStorage not available:', e);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.log('LocalStorage not available:', e);
        return null;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.log('LocalStorage not available:', e);
    }
}

// ============================================
// ADDITIONAL FEATURES
// ============================================

// Analytics tracking (optional)
function trackEvent(eventName, data = {}) {
    console.log(`Event: ${eventName}`, data);
    // In production, send to analytics service
}

// Export listings to CSV
function exportListingsCSV() {
    const csv = [
        ['ID', 'Title', 'Price', 'Location', 'Category', 'Condition', 'Views'],
        ...filteredListings.map(l => [
            l.id,
            l.title,
            l.price,
            l.location,
            l.category,
            l.condition,
            l.views
        ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'listings.csv';
    a.click();
    showToast('Listings exported as CSV', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
