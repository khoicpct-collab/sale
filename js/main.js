// Product data
const products = [
    {
        id: 1,
        name: "Áo sơ mi nam cao cấp",
        price: 599000,
        image: "images/products/shirt1.jpg",
        category: "men"
    },
    {
        id: 2,
        name: "Váy liền nữ công sở",
        price: 899000,
        image: "images/products/dress1.jpg",
        category: "women"
    },
    // Thêm sản phẩm khác...
];

// Load products
function loadProducts() {
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = products.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">${formatPrice(product.price)}</div>
                <button class="btn-primary add-to-cart" onclick="addToCart(${product.id})">
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    `).join('');
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});
