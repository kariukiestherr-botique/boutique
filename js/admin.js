// ===== ADMIN DASHBOARD SYSTEM =====
class AdminDashboard {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('elssyProducts')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('elssyCurrentUser'));
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.loadTheme();
        this.setupEventListeners();
        this.loadStats();
        this.loadProducts();
        this.loadStorePreview();
        
        // Auto-refresh products every 3 seconds for live updates
        setInterval(() => {
            this.loadProducts();
            this.loadStorePreview();
        }, 3000);
    }

    checkAuthentication() {
        if (!this.currentUser) {
            window.location.href = 'auth.html';
            return;
        }
    }

    setupEventListeners() {
        // Add product form
        const addProductForm = document.getElementById('addProductForm');
        if (addProductForm) {
            addProductForm.addEventListener('submit', (e) => this.handleAddProduct(e));
        }

        // Image upload
        const uploadArea = document.getElementById('uploadArea');
        const productImage = document.getElementById('productImage');
        
        if (uploadArea && productImage) {
            uploadArea.addEventListener('click', () => productImage.click());
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
            productImage.addEventListener('change', (e) => this.handleImageSelect(e));
        }
    }

    handleAddProduct(e) {
        e.preventDefault();
        
        const name = document.getElementById('productName').value;
        const price = parseInt(document.getElementById('productPrice').value);
        const description = document.getElementById('productDescription').value;
        const category = document.getElementById('productCategory').value;
        const status = document.getElementById('productStatus').value;
        const imageFile = document.getElementById('productImage').files[0];

        // Validation
        if (!name || !price || !category) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }

        if (price < 0) {
            this.showMessage('Price cannot be negative', 'error');
            return;
        }

        // Create product object
        const product = {
            id: Date.now().toString(),
            name: name,
            price: price,
            description: description,
            category: category,
            status: status,
            image: null,
            createdAt: new Date().toISOString(),
            createdBy: this.currentUser?.name || 'Admin'
        };

        // Handle image upload (simulated - in real app, upload to server)
        if (imageFile) {
            this.uploadImage(imageFile).then(imageUrl => {
                product.image = imageUrl;
                this.saveProduct(product);
            }).catch(error => {
                console.error('Image upload failed:', error);
                this.saveProduct(product); // Save without image
            });
        } else {
            this.saveProduct(product);
        }
    }

    uploadImage(file) {
        return new Promise((resolve, reject) => {
            // Simulate image upload - in real app, upload to Cloudinary/Server
            const reader = new FileReader();
            reader.onload = (e) => {
                // For demo purposes, we'll use the data URL
                // In production, you'd upload to a service and get a URL back
                setTimeout(() => {
                    resolve(e.target.result);
                }, 1000);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    saveProduct(product) {
        this.products.unshift(product); // Add to beginning of array
        localStorage.setItem('elssyProducts', JSON.stringify(this.products));
        
        this.showMessage('Product added successfully!', 'success');
        this.resetForm();
        this.loadProducts();
        this.loadStorePreview();
        this.loadStats();
    }

    resetForm() {
        document.getElementById('addProductForm').reset();
        this.removeImagePreview();
    }

    handleImageSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.previewImage(file);
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            document.getElementById('productImage').files = e.dataTransfer.files;
            this.previewImage(file);
        }
    }

    previewImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('imagePreview');
            const img = document.getElementById('previewImg');
            const uploadArea = document.getElementById('uploadArea');
            
            img.src = e.target.result;
            preview.classList.remove('hidden');
            uploadArea.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    removeImagePreview() {
        const preview = document.getElementById('imagePreview');
        const uploadArea = document.getElementById('uploadArea');
        const productImage = document.getElementById('productImage');
        
        preview.classList.add('hidden');
        uploadArea.classList.remove('hidden');
        productImage.value = '';
    }

    loadProducts() {
        const productsList = document.getElementById('adminProductsList');
        
        if (this.products.length === 0) {
            productsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box-open"></i>
                    <h4>No Products Yet</h4>
                    <p>Add your first product to get started</p>
                </div>
            `;
            return;
        }

        productsList.innerHTML = this.products.map(product => `
            <div class="product-item" data-id="${product.id}">
                <div class="product-item-image">
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">` : 
                        `<i class="fas fa-tshirt"></i>`
                    }
                </div>
                <div class="product-item-info">
                    <div class="product-item-name">${product.name}</div>
                    <div class="product-item-details">
                        <span class="product-item-price">KSH ${product.price.toLocaleString()}</span>
                        <span class="product-item-category">${product.category}</span>
                        <span class="product-item-status status-${product.status.replace('-', '-')}">
                            ${product.status === 'in-stock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
                <div class="product-item-actions">
                    <button class="btn-edit" onclick="admin.editProduct('${product.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="admin.deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    loadStorePreview() {
        const storePreview = document.getElementById('storePreview');
        const previewProducts = this.products.slice(0, 6); // Show first 6 products
        
        if (previewProducts.length === 0) {
            storePreview.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-store"></i>
                    <h4>No Products in Store</h4>
                    <p>Add products to see how they appear to customers</p>
                </div>
            `;
            return;
        }

        storePreview.innerHTML = `
            <div class="preview-grid">
                ${previewProducts.map(product => `
                    <div class="preview-item">
                        <div class="preview-image">
                            ${product.image ? 
                                `<img src="${product.image}" alt="${product.name}">` : 
                                `<i class="fas fa-tshirt fa-2x"></i>`
                            }
                        </div>
                        <div class="preview-info">
                            <div class="preview-name">${product.name}</div>
                            <div class="preview-price">KSH ${product.price.toLocaleString()}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            ${this.products.length > 6 ? `
                <div style="text-align: center; margin-top: 1rem; color: var(--text-muted);">
                    + ${this.products.length - 6} more products in store
                </div>
            ` : ''}
        `;
    }

    loadStats() {
        document.getElementById('totalProducts').textContent = this.products.length;
        
        // For demo purposes - in real app, you'd get these from your backend
        const totalOrders = Math.floor(this.products.length * 2.5); // Simulated
        document.getElementById('totalOrders').textContent = totalOrders;
    }

    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (product) {
            // Populate form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productStatus').value = product.status;
            
            // Scroll to form
            document.getElementById('addProductForm').scrollIntoView({ behavior: 'smooth' });
            
            this.showMessage(`Editing: ${product.name} - Update the fields and click "Add Product" to save changes`, 'success');
        }
    }

    deleteProduct(productId) {
        if (confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            this.products = this.products.filter(p => p.id !== productId);
            localStorage.setItem('elssyProducts', JSON.stringify(this.products));
            
            this.showMessage('Product deleted successfully', 'success');
            this.loadProducts();
            this.loadStorePreview();
            this.loadStats();
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.admin-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `admin-message message-${type}`;
        messageEl.textContent = message;

        // Insert at the top of the admin container
        const adminContainer = document.querySelector('.admin-container .container');
        adminContainer.insertBefore(messageEl, adminContainer.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const body = document.body;
        const themeToggle = document.querySelector('.theme-toggle-admin i');
        
        if (savedTheme === 'dark') {
            body.classList.replace('light-mode', 'dark-mode');
            if (themeToggle) {
                themeToggle.classList.replace('fa-moon', 'fa-sun');
            }
        }
    }
}

// ===== GLOBAL FUNCTIONS =====
function viewStore() {
    window.location.href = 'index.html';
}

function logout() {
    localStorage.removeItem('elssyCurrentUser');
    window.location.href = 'auth.html';
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle-admin i');
    
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

// Global remove image function
function removeImage() {
    if (window.admin) {
        window.admin.removeImagePreview();
    }
}

// ===== INITIALIZATION =====
let admin;

document.addEventListener('DOMContentLoaded', function() {
    admin = new AdminDashboard();
    window.admin = admin; // Make admin globally available
});

// ===== GLOBAL EXPORTS =====
window.viewStore = viewStore;
window.logout = logout;
window.toggleTheme = toggleTheme;
window.removeImage = removeImage;
