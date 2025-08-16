// All Articles page functionality
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

    // Initialize articles display
    let currentFilter = 'all';
    let articlesPerPage = 6;
    let currentPage = 1;
    let filteredArticles = [];

    // Load and display all articles
    loadAllArticles();
    setupFilters();
    setupLoadMore();

    // Article filtering and categorization
    function getArticleCategory(article) {
        const title = article.title.toLowerCase();
        const content = article.content.toLowerCase();
        
        if (title.includes('fashion') || title.includes('depop') || content.includes('fashion')) {
            return 'fashion';
        } else if (title.includes('music') || title.includes('nugs') || content.includes('music')) {
            return 'technology';
        } else if (title.includes('living') || title.includes('wellness') || title.includes('detox')) {
            return 'wellness';
        } else {
            return 'lifestyle';
        }
    }

    function loadAllArticles() {
        const articlesGrid = document.getElementById('allArticlesGrid');
        const articlesCount = document.getElementById('articlesCount');
        
        if (!articlesGrid) return;

        // Apply current filter
        filteredArticles = currentFilter === 'all' 
            ? [...articles] 
            : articles.filter(article => getArticleCategory(article) === currentFilter);

        // Update count
        if (articlesCount) {
            const total = filteredArticles.length;
            const showing = Math.min(currentPage * articlesPerPage, total);
            articlesCount.textContent = `Showing ${showing} of ${total} articles`;
        }

        // Clear grid
        articlesGrid.innerHTML = '';

        // Show articles for current page
        const startIndex = 0;
        const endIndex = currentPage * articlesPerPage;
        const articlesToShow = filteredArticles.slice(startIndex, endIndex);

        articlesToShow.forEach((article, index) => {
            const articleCard = createArticleCard(article, index);
            articlesGrid.appendChild(articleCard);
        });

        // Show/hide load more button
        const loadMoreSection = document.getElementById('loadMoreSection');
        if (loadMoreSection) {
            if (endIndex < filteredArticles.length) {
                loadMoreSection.style.display = 'block';
            } else {
                loadMoreSection.style.display = 'none';
            }
        }

        // Add animation observer
        addScrollAnimations();
    }

    function createArticleCard(article, index) {
        const card = document.createElement('div');
        card.className = 'article-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add click handler
        card.addEventListener('click', function() {
            this.style.transform = 'translateY(-8px) scale(0.98)';
            setTimeout(() => {
                window.location.href = `article-detail.html?id=${article.id}`;
            }, 200);
        });

        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });

        // Get category for styling
        const category = getArticleCategory(article);
        
        card.innerHTML = `
            <div class="article-image-container">
                <img src="${article.image}" alt="${article.title}" class="article-image" 
                     onload="this.style.opacity='1'; this.style.transform='scale(1)';" 
                     style="opacity: 0; transform: scale(1.1); transition: all 0.5s ease;">
                <div class="article-category ${category}">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
            </div>
            <div class="article-info">
                <h3 class="article-title">${article.title}</h3>
                <div class="article-meta">
                    <span class="article-date">${article.date}</span>
                    <span class="article-author">by ${article.author}</span>
                </div>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-read-more">
                    Read More →
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
                
                // Reload articles
                loadAllArticles();
            });
        });
    }

    function setupLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function() {
                currentPage++;
                loadAllArticles();
                
                // Smooth scroll to new content
                setTimeout(() => {
                    const newCards = document.querySelectorAll('.article-card');
                    if (newCards.length > 0) {
                        const targetCard = newCards[Math.max(0, (currentPage - 1) * articlesPerPage)];
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

        // Observe new article cards
        const articleCards = document.querySelectorAll('.article-card');
        articleCards.forEach(card => observer.observe(card));
    }

    // Search functionality (optional enhancement)
    function setupSearch() {
        const searchInput = document.getElementById('searchInput');
        
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                
                if (searchTerm === '') {
                    filteredArticles = currentFilter === 'all' 
                        ? [...articles] 
                        : articles.filter(article => getArticleCategory(article) === currentFilter);
                } else {
                    let baseArticles = currentFilter === 'all' 
                        ? [...articles] 
                        : articles.filter(article => getArticleCategory(article) === currentFilter);
                    
                    filteredArticles = baseArticles.filter(article => 
                        article.title.toLowerCase().includes(searchTerm) ||
                        article.excerpt.toLowerCase().includes(searchTerm) ||
                        article.author.toLowerCase().includes(searchTerm)
                    );
                }
                
                currentPage = 1;
                loadAllArticles();
            });
        }
    }

    // Initialize search if search input exists
    setupSearch();
});

// Add CSS for category badges and animations
const style = document.createElement('style');
style.textContent = `
    .all-articles-main {
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

    .articles-filter {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 40px;
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

    .articles-count {
        color: var(--text-medium);
        font-size: 0.9rem;
    }

    .all-articles-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
        margin-bottom: 60px;
    }

    .article-image-container {
        position: relative;
        overflow: hidden;
        border-radius: 12px;
        margin-bottom: 20px;
    }

    .article-category {
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

    .article-category.lifestyle {
        background: rgba(99, 102, 241, 0.9);
        color: white;
    }

    .article-category.wellness {
        background: rgba(34, 197, 94, 0.9);
        color: white;
    }

    .article-category.technology {
        background: rgba(168, 85, 247, 0.9);
        color: white;
    }

    .article-category.fashion {
        background: rgba(236, 72, 153, 0.9);
        color: white;
    }

    .article-read-more {
        color: var(--accent-color);
        font-weight: 600;
        margin-top: 12px;
        transition: color 0.3s ease;
    }

    .article-card:hover .article-read-more {
        color: var(--accent-hover);
    }

    .load-more-section {
        text-align: center;
        padding: 40px 0;
    }

    @media (max-width: 768px) {
        .page-title {
            font-size: 2.2rem;
        }
        
        .articles-filter {
            flex-direction: column;
            gap: 20px;
            align-items: stretch;
        }
        
        .filter-buttons {
            justify-content: center;
        }
        
        .articles-count {
            text-align: center;
        }
        
        .all-articles-grid {
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