document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Get product ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        loadProductDetail(productId);
        loadRelatedProducts(productId);
    } else {
        // If no ID parameter, redirect to homepage
        window.location.href = 'index.html';
    }
});

// Load product details
function loadProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.title = `${product.title} - InkBloom`;
    
    const productDetailContainer = document.getElementById('productDetail');
    if (!productDetailContainer) return;

    productDetailContainer.innerHTML = `
        <div class="product-detail-image-container">
            <img src="${product.image}" alt="${product.title}" class="product-detail-image">
        </div>
        <div class="product-detail-info">
            <h1>${product.title}</h1>
            <div class="product-detail-price">${product.price}</div>
            <div class="product-detail-description">
                <p>${product.fullDescription || product.description}</p>
            </div>
            ${product.features ? `
                <div class="product-features">
                    <h3>Key Features</h3>
                    <ul>
                        ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            <button class="buy-button" onclick="handlePurchase('${product.title}')">
                Add to Cart
            </button>
        </div>
    `;
}

// Load related products
function loadRelatedProducts(currentProductId) {
    const relatedProductsContainer = document.getElementById('relatedProducts');
    if (!relatedProductsContainer) return;

    // Get other products excluding the current one, max 3 items
    const relatedProducts = products
        .filter(p => p.id !== currentProductId)
        .slice(0, 3);

    relatedProductsContainer.innerHTML = '';
    
    relatedProducts.forEach(product => {
        const productCard = createProductCard(product);
        relatedProductsContainer.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.addEventListener('click', () => {
        window.location.href = `product-detail.html?id=${product.id}`;
    });
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="product-image">
        <div class="product-info">
            <h3 class="product-title">${product.title}</h3>
            <div class="product-price">${product.price}</div>
            <p class="product-description">${product.description.substring(0, 80)}...</p>
        </div>
    `;
    
    return card;
}

// Handle purchase button click
function handlePurchase(productTitle) {
    alert(`Thank you for your interest in "${productTitle}"! This is a demo website, so actual purchasing isn't available yet.`);
}