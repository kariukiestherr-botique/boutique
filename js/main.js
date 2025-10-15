// ===== THEME MANAGEMENT =====
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        themeToggle.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        themeToggle.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    if (savedTheme === 'dark') {
        body.classList.replace('light-mode', 'dark-mode');
        themeToggle.classList.replace('fa-moon', 'fa-sun');
    }
}

// ===== PRODUCTS MANAGEMENT =====
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const products = JSON.parse(localStorage.getItem('elssyProducts')) || [];
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-products">
                <i class="fas fa-box-open"></i>
                <h3>No Products Available</h3>
                <p>Check back soon for new arrivals!</p>
                <a href="admin.html" class="btn-primary">Add Products as Admin</a>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">` : 
                    `<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                        <i class="fas fa-image fa-2x"></i>
                    </div>`
                }
                <div class="product-badge ${product.status === 'out-of-stock' ? 'badge-soldout' : 'badge-hot'}">
                    ${product.status === 'out-of-stock' ? 'SOLD OUT' : 'HOT'}
                </div>
            </div>
            <div class="product-info">
                <div class="product-header">
                    <h4 class="product-name">${product.name}</h4>
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </div>
                </div>
                <p class="product-description">${product.description || 'Premium quality product'}</p>
                <div class="product-footer">
                    <span class="product-price">KSH ${product.price?.toLocaleString() || '0'}</span>
                    <button class="add-to-cart" 
                            onclick="addToCart('${product.id}', '${product.name.replace(/'/g, "\\'")}', ${product.price})"
                            ${product.status === 'out-of-stock' ? 'disabled' : ''}>
                        ${product.status === 'out-of-stock' ? 'SOLD OUT' : 'ADD TO CART'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== NAVIGATION =====
function goToAuth() {
    window.location.href = 'auth.html';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    loadProducts();
    
    // Check for new products every 5 seconds
    setInterval(loadProducts, 5000);
});

// ===== CART FUNCTIONS =====
function addToCart(productId, productName, productPrice) {
    const cart = JSON.parse(localStorage.getItem('elssyCart')) || [];
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    localStorage.setItem('elssyCart', JSON.stringify(cart));
    updateCartCount();
    showAddedToCartMessage(productName);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('elssyCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

function showAddedToCartMessage(productName) {
    // Create toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent-red);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 1002;
        animation: slideIn 0.3s ease;
    `;
    toast.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${productName} added to cart!
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== CART TOGGLE =====
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('show');
    loadCartItems();
}

function closeCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('show');
}

// Load cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
