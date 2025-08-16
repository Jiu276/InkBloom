document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Get article ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = parseInt(urlParams.get('id'));
    
    if (articleId) {
        loadArticleDetail(articleId);
        loadRelatedArticles(articleId);
    } else {
        // If no ID parameter, redirect to homepage
        window.location.href = 'index.html';
    }
});

// Load article details
function loadArticleDetail(articleId) {
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.title = `${article.title} - InkBloom`;
    
    const articleDetailContainer = document.getElementById('articleDetail');
    if (!articleDetailContainer) return;

    articleDetailContainer.innerHTML = `
        <header class="article-header">
            <h1>${article.title}</h1>
            <div class="article-detail-meta">
                <span>By ${article.author}</span> • 
                <span>Published ${article.date}</span>
            </div>
        </header>
        <img src="${article.image}" alt="${article.title}" class="article-detail-image">
        <div class="article-content">
            ${article.content}
        </div>
        <div class="article-footer">
            <p><strong>About the Author:</strong> Thank you for reading this article. We hope it brings some inspiration and insight to your journey toward mindful living.</p>
        </div>
    `;
}

// Load related articles
function loadRelatedArticles(currentArticleId) {
    const relatedArticlesContainer = document.getElementById('relatedArticles');
    if (!relatedArticlesContainer) return;

    // Get other articles excluding the current one, max 3 items
    const relatedArticles = articles
        .filter(a => a.id !== currentArticleId)
        .slice(0, 3);

    relatedArticlesContainer.innerHTML = '';
    
    relatedArticles.forEach(article => {
        const articleCard = createArticleCard(article);
        relatedArticlesContainer.appendChild(articleCard);
    });
}

// Create article card
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    card.addEventListener('click', () => {
        window.location.href = `article-detail.html?id=${article.id}`;
    });
    
    card.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="article-image">
        <div class="article-info">
            <h3 class="article-title">${article.title}</h3>
            <div class="article-meta">${article.date} • ${article.author}</div>
            <p class="article-excerpt">${article.excerpt.substring(0, 120)}...</p>
        </div>
    `;
    
    return card;
}