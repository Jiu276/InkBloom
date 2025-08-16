// Enhanced interactions and animations
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation menu toggle with animation
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

    // Intersection Observer for animations
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

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.product-card, .article-card, .featured-card, .section-header');
    animateElements.forEach(el => observer.observe(el));

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            }
        });
    });

    // Load product data
    loadProducts();
    // Load article data
    loadArticles();

    // Enhanced hero button click events with animations
    const heroButtons = document.querySelectorAll('.hero-btn');
    heroButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            if (this.textContent.includes('Products') || this.textContent.includes('Explore')) {
                document.querySelector('#products').scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (this.textContent.includes('Stories') || this.textContent.includes('Read')) {
                document.querySelector('#articles').scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });

        // Add hover effects
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Enhanced featured cards interactions
    const featuredCards = document.querySelectorAll('.featured-card');
    featuredCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-12px) scale(0.98)';
            setTimeout(() => {
                // Navigate to corresponding product detail page
                const productIds = [1, 2, 3, 4, 5]; // Map to 5 products
                if (productIds[index]) {
                    window.location.href = `product-detail.html?id=${productIds[index]}`;
                }
            }, 200);
        });

        // Add enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
    });

    // Load more buttons - redirect to dedicated pages
    const loadMoreButtons = document.querySelectorAll('.load-more-btn');
    loadMoreButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent.includes('Products')) {
                // Redirect to all products page
                window.location.href = 'all-products.html';
            } else if (this.textContent.includes('Articles')) {
                // Redirect to all articles page
                window.location.href = 'all-articles.html';
            }
        });
    });
});

// Load product data
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    
    products.slice(0, 6).forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create enhanced product card with interactions
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Add click animation and navigation
    card.addEventListener('click', function() {
        this.style.transform = 'translateY(-8px) scale(0.98)';
        setTimeout(() => {
            window.location.href = `product-detail.html?id=${product.id}`;
        }, 200);
    });

    // Add enhanced hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });

    // Add loading animation to image
    const imageLoadHandler = function() {
        this.style.opacity = '0';
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.style.transition = 'all 0.5s ease';
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        }, 100);
    };
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image" onload="this.style.opacity='1'; this.style.transform='scale(1)';" style="opacity: 0; transform: scale(1.1); transition: all 0.5s ease;">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">${product.price}</div>
            <p class="product-description">${product.description}</p>
        </div>
    `;
    
    return card;
}

// Load article data
function loadArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    if (!articlesGrid) return;

    articlesGrid.innerHTML = '';
    
    // Show only the latest 3 articles on homepage
    articles.slice(0, 3).forEach(article => {
        const articleCard = createArticleCard(article);
        articlesGrid.appendChild(articleCard);
    });
}

// Create enhanced article card with interactions
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    // Add click animation and navigation
    card.addEventListener('click', function() {
        this.style.transform = 'translateY(-8px) scale(0.98)';
        setTimeout(() => {
            window.location.href = `article-detail.html?id=${article.id}`;
        }, 200);
    });

    // Add enhanced hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
    
    card.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="article-image" onload="this.style.opacity='1'; this.style.transform='scale(1)';" style="opacity: 0; transform: scale(1.1); transition: all 0.5s ease;">
        <div class="article-info">
            <h3 class="article-title">${article.title}</h3>
            <div class="article-meta">${article.date} • ${article.author}</div>
            <p class="article-excerpt">${article.excerpt}</p>
        </div>
    `;
    
    return card;
}

// Add loading spinner utility
function showLoadingSpinner(container) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="width: 40px; height: 40px; border: 3px solid var(--border-light); border-top: 3px solid var(--accent-color); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
            <p style="margin-top: 16px; color: var(--text-medium);">Loading...</p>
        </div>
    `;
}

// Add CSS animation for spinner
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);