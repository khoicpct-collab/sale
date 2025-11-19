// Cart management functionality
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.init();
    }
    
    init() {
        this.updateCartDisplay();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const cartIcon = document.querySelector('.cart');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => this.showCartModal());
        }
    }
    
    showCartModal() {
        const modalHTML = `
            <div class="cart-modal-overlay">
                <div class="cart-modal">
                    <div class="cart-modal-header">
                        <h3>Giỏ Hàng Của Bạn</h3>
                        <button class="close-cart">&times;</button>
                    </div>
                    <div class="cart-modal-body">
                        ${this.renderCartItems()}
                    </div>
                    <div class="cart-modal-footer">
                        <div class="cart-total">
                            <strong>Tổng cộng: ${this.getTotalPrice()}</strong>
                        </div>
                        <button class="btn-primary checkout-btn">Thanh Toán</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.setupModalEvents();
    }
    
    renderCartItems() {
        if (this.cart.length === 0) {
            return '<p class="empty-cart">Giỏ hàng của bạn đang trống</p>';
        }
        
        return this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" 
                     onerror="this.src='https://via.placeholder.com/80x80/ecf0f1/2c3e50?text=Product'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">${this.formatPrice(item.price)}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="cartManager.removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.updateCartDisplay();
            this.refreshCartModal();
        }
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.refreshCartModal();
    }
    
    refreshCartModal() {
        const modalBody = document.querySelector('.cart-modal-body');
        if (modalBody) {
            modalBody.innerHTML = this.renderCartItems();
        }
        
        const cartTotal = document.querySelector('.cart-total');
        if (cartTotal) {
            cartTotal.innerHTML = `<strong>Tổng cộng: ${this.getTotalPrice()}</strong>`;
        }
    }
    
    setupModalEvents() {
        const overlay = document.querySelector('.cart-modal-overlay');
        const closeBtn = document.querySelector('.close-cart');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeCartModal();
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeCartModal());
        }
        
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }
    
    closeCartModal() {
        const modal = document.querySelector('.cart-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
    
    checkout() {
        if (this.cart.length === 0) {
            alert('Giỏ hàng của bạn đang trống!');
            return;
        }
        
        alert('Chức năng thanh toán đang được phát triển!');
    }
    
    getTotalPrice() {
        return this.formatPrice(this.cart.reduce((total, item) => total + (item.price * item.quantity), 0));
    }
    
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
    
    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }
}

// Initialize cart manager
const cartManager = new CartManager();

// Make addToCart function global
window.addToCart = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cartManager.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartManager.cart.push({
            ...product,
            quantity: 1
        });
    }

    cartManager.saveCart();
    cartManager.updateCartDisplay();
    showNotification(`Đã thêm ${product.name} vào giỏ hàng`);
};

// Add cart modal styles
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .cart-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: flex-end;
        z-index: 10000;
    }
    
    .cart-modal {
        width: 400px;
        height: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        animation: slideInRight 0.3s ease;
    }
    
    .cart-modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .cart-modal-body {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }
    
    .cart-modal-footer {
        padding: 20px;
        border-top: 1px solid #eee;
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .cart-item img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        margin-right: 15px;
    }
    
    .cart-item-info {
        flex: 1;
    }
    
    .cart-item-info h4 {
        margin: 0 0 5px 0;
        font-size: 1rem;
    }
    
    .cart-item-price {
        color: #e74c3c;
        font-weight: bold;
        margin: 0;
    }
    
    .cart-item-controls {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .quantity-btn {
        width: 30px;
        height: 30px;
        border: 1px solid #ddd;
        background: white;
        cursor: pointer;
        border-radius: 4px;
    }
    
    .quantity {
        padding: 0 10px;
        font-weight: bold;
    }
    
    .remove-btn {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
    }
    
    .empty-cart {
        text-align: center;
        padding: 40px;
        color: #7f8c8d;
    }
    
    .cart-total {
        text-align: center;
        margin-bottom: 15px;
        font-size: 1.2rem;
    }
    
    .checkout-btn {
        width: 100%;
    }
    
    .close-cart {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(cartStyles);
