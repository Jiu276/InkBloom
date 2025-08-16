// All Products page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize products display
    let currentFilter = 'all';
    let currentPriceFilter = 'all';
    let productsPerPage = 6;
    let currentPage = 1;
    let filteredProducts = [];

    // Load and display all products
    loadAllProducts();
    setupFilters();
    setupPriceFilter();
    setupLoadMore();

    // Product filtering and categorization
    function getProductCategory(product) {
        const title = product.title.toLowerCase();
        
        if (title.includes('vase') || title.includes('diffuser')) {
            return 'home-decor';
        } else if (title.includes('pillow') || title.includes('tea')) {
            return 'wellness';
        } else if (title.includes('bookshelf') || title.includes('rug')) {
            return 'furniture';
        } else {
            return 'accessories';
        }
    }

    function getProductPrice(priceString) {
        return parseInt(priceString.replace('$', ''));
    }

    function filterByPrice(product, priceRange) {
        const price = getProductPrice(product.price);
        
        switch(priceRange) {
            case '0-50':
                return price < 50;
            case '50-100':
                return price >= 50 && price <= 100;
            case '100-200':
                return price > 100 && price <= 200;
            case '200+':
                return price > 200;
            default:
                return true;
        }
    }

    function loadAllProducts() {
        const productsGrid = document.getElementById('allProductsGrid');
        const productsCount = document.getElementById('productsCount');
        
        if (!productsGrid) return;

        // Apply filters
        let baseProducts = currentFilter === 'all' 
            ? [...products] 
            : products.filter(product => getProductCategory(product) === currentFilter);

        filteredProducts = currentPriceFilter === 'all'
            ? baseProducts
            : baseProducts.filter(product => filterByPrice(product, currentPriceFilter));

        // Update count
        if (productsCount) {
            const total = filteredProducts.length;
            const showing = Math.min(currentPage * productsPerPage, total);
            productsCount.textContent = `Showing ${showing} of ${total} products`;
        }

        // Clear grid
        productsGrid.innerHTML = '';

        // Show products for current page
        const startIndex = 0;
        const endIndex = currentPage * productsPerPage;
        const productsToShow = filteredProducts.slice(startIndex, endIndex);

        productsToShow.forEach((product, index) => {
            const productCard = createProductCard(product, index);
            productsGrid.appendChild(productCard);
        });

        // Show/hide load more button
        const loadMoreSection = document.getElementById('loadMoreSection');
        if (loadMoreSection) {
            if (endIndex < filteredProducts.length) {
                loadMoreSection.style.display = 'block';
            } else {
                loadMoreSection.style.display = 'none';
            }
        }

        // Add animation observer
        addScrollAnimations();
    }

    function createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add click handler
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                window.location.href = `product-detail.html?id=${product.id}`;
            }, 200);
        });

        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });

        // Get category for styling
        const category = getProductCategory(product);
        
        card.innerHTML = `
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image" 
                     onload="this.style.opacity='1'; this.style.transform='scale(1)';" 
                     style="opacity: 0; transform: scale(1.1); transition: all 0.5s ease;">
                <div class="product-category ${category}">${category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div class="product-overlay">
                    <span class="view-details">View Details</span>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">${product.price}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-features">
                    ${product.features.slice(0, 2).map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
            </div>
        `;
        
        return card;
    }

    function setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update filter and reset pagination
                currentFilter = this.dataset.filter;
                currentPage = 1;
                
                // Reload products
                loadAllProducts();
            });
        });
    }

    function setupPriceFilter() {
        const priceSelect = document.getElementById('priceRange');
        
        if (priceSelect) {
            priceSelect.addEventListener('change', function() {
                currentPriceFilter = this.value;
                currentPage = 1;
                loadAllProducts();
            });
        }
    }

    function setupLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                currentPage++;
                loadAllProducts();
                
                // Smooth scroll to new content
                setTimeout(() => {
                    const newCards = document.querySelectorAll('.product-card');
                    if (newCards.length > 0) {
                        const targetCard = newCards[Math.max(0, (currentPage - 1) * productsPerPage)];
                        if (targetCard) {
                            targetCard.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'start' 
                            });
                        }
                    }
                }, 100);
            });
        }
    }

    function addScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0.1s';
                    entry.target.style.animationFillMode = 'both';
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                }
            });
        }, observerOptions);

        // Observe new product cards
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => observer.observe(card));
    }
});

// Add CSS for product page specific styles
const style = document.createElement('style');
style.textContent = `
    .all-products-main {
        padding-top: 100px;
        min-height: 100vh;
    }

    .page-header {
        text-align: center;
        margin-bottom: 60px;
    }


    .page-title {
        font-family: var(--font-heading);
        font-size: 3rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: 16px;
    }

    .page-subtitle {
        font-size: 1.2rem;
        color: var(--text-medium);
        max-width: 600px;
        margin: 0 auto;
    }

    .products-filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding: 20px 0;
        border-bottom: 1px solid var(--border-light);
    }

    .filter-buttons {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
    }

    .filter-btn {
        padding: 8px 20px;
        border: 2px solid var(--border-light);
        background: white;
        color: var(--text-medium);
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .filter-btn:hover,
    .filter-btn.active {
        border-color: var(--accent-color);
        background: var(--accent-color);
        color: white;
    }

    .products-count {
        color: var(--text-medium);
        font-size: 0.9rem;
    }

    .price-filter {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 40px;
        padding: 15px 0;
    }

    .price-filter label {
        font-weight: 500;
        color: var(--text-primary);
    }

    .price-select {
        padding: 8px 16px;
        border: 2px solid var(--border-light);
        border-radius: 8px;
        background: white;
        color: var(--text-primary);
        cursor: pointer;
        transition: border-color 0.3s ease;
    }

    .price-select:focus {
        outline: none;
        border-color: var(--accent-color);
    }

    .all-products-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
    }

    .product-image-container {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        margin-bottom: 20px;
        cursor: pointer;
    }

    .product-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .product-card:hover .product-overlay {
        opacity: 1;
    }

    .view-details {
        color: white;
        font-weight: 600;
        font-size: 1.1rem;
    }

    .product-category {
        position: absolute;
        top: 16px;
        left: 16px;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .product-category.home-decor {
        background: rgba(99, 102, 241, 0.9);
        color: white;
    }

    .product-category.wellness {
        background: rgba(34, 197, 94, 0.9);
        color: white;
    }

    .product-category.furniture {
        background: rgba(168, 85, 247, 0.9);
        color: white;
    }

    .product-category.accessories {
        background: rgba(236, 72, 153, 0.9);
        color: white;
    }

    .product-features {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
    }

    .feature-tag {
        background: var(--bg-light);
        color: var(--text-medium);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
    }

    .load-more-section {
        text-align: center;
        padding: 40px 0;
    }

    @media (max-width: 768px) {
        .page-title {
            font-size: 2.2rem;
        }
        
        .products-filter {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
        }
        
        .filter-buttons {
            justify-content: center;
        }
        
        .products-count {
            text-align: center;
        }
        
        .price-filter {
            justify-content: center;
        }
        
        .all-products-grid {
            grid-template-columns: 1fr;
            gap: 24px;
        }
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);