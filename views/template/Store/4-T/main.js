$(document).ready(function() {
    // Global variables
    let products = [];
    let cart = [];
    
    // DOM elements
    const productListEl = $('#product-list');
    const cartItemsEl = $('#cart-items');
    const emptyCartMessageEl = $('#empty-cart-message');
    const cartCountEl = $('#cart-count');
    const cartBadgeEl = $('#cart-badge');
    const subtotalEl = $('#subtotal');
    const totalEl = $('#total');
    const checkoutBtnEl = $('#checkout-btn');
    const searchProductEl = $('#search-product');
    const darkModeToggleEl = $('#darkModeToggle');
    const menuToggleEl = $('.menu-toggle');
    const sidebarEl = $('.sidebar');
    
    // Initialize the app
    init();
    
    function init() {
        loadProducts();
        loadCartFromLocalStorage();
        renderCart();
        setupEventListeners();
        checkDarkMode();
    }
    
    function setupEventListeners() {
        // Search input
        searchProductEl.on('input', filterProducts);
        
        // Dark mode toggle
        darkModeToggleEl.on('click', toggleDarkMode);
        
        // Mobile menu toggle
        menuToggleEl.on('click', function() {
            sidebarEl.toggleClass('active');
        });
        
        // Checkout button
        checkoutBtnEl.on('click', handleCheckout);
    }
    
    // Load products from API
    function loadProducts() {
        $.ajax({
            url: 'https://67ff87cd58f18d7209f19525.mockapi.io/api/v1/products',
            method: 'GET',
            success: function(data) {
                products = data;
                renderProducts(products);
            },
            error: function(error) {
                console.error('Error loading products:', error);
                // Fallback to sample data if API fails
                products = getSampleProducts();
                renderProducts(products);
            }
        });
    }
    
    // Sample data fallback
    function getSampleProducts() {
        return [
            {
                id: '1',
                title: 'Wireless Headphones',
                description: 'Premium noise-cancelling wireless headphones',
                price: '199.99',
                image: 'https://via.placeholder.com/150',
                createdAt: '2023-01-15T10:30:00Z'
            },
            {
                id: '2',
                title: 'Smart Watch',
                description: 'Fitness tracking and notifications',
                price: '249.99',
                image: 'https://via.placeholder.com/150',
                createdAt: '2023-02-20T14:45:00Z'
            },
            {
                id: '3',
                title: 'Bluetooth Speaker',
                description: 'Portable waterproof speaker',
                price: '89.99',
                image: 'https://via.placeholder.com/150',
                createdAt: '2023-03-05T09:15:00Z'
            },
            {
                id: '4',
                title: 'Laptop Backpack',
                description: 'Ergonomic backpack with USB charging port',
                price: '59.99',
                image: 'https://via.placeholder.com/150',
                createdAt: '2023-03-10T11:20:00Z'
            },
            {
                id: '5',
                title: 'Wireless Mouse',
                description: 'Ergonomic wireless mouse with silent clicks',
                price: '29.99',
                image: 'https://via.placeholder.com/150',
                createdAt: '2023-03-15T16:30:00Z'
            }
        ];
    }
    
    // Render products list
    function renderProducts(productsToRender) {
        productListEl.empty();
        
        if (productsToRender.length === 0) {
            productListEl.append('<p class="text-center py-4">No products found</p>');
            return;
        }
        
        productsToRender.forEach(product => {
            const productEl = $(`
                <div class="product-item fade-in">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-info">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <div class="product-price">$${parseFloat(product.price).toFixed(2)}</div>
                    </div>
                    <button class="btn-add-cart" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `);
            
            productEl.find('.btn-add-cart').click(() => addToCart(product.id));
            productListEl.append(productEl);
        });
    }
    
    // Filter products based on search input
    function filterProducts() {
        const searchTerm = searchProductEl.val().toLowerCase();
        const filteredProducts = products.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }
    
    // Add product to cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: parseFloat(product.price),
                image: product.image,
                quantity: 1
            });
        }
        
        saveCartToLocalStorage();
        renderCart();
        
        // Show success feedback
        const btn = $(`.btn-add-cart[data-id="${productId}"]`);
        btn.html('<i class="fas fa-check"></i>');
        btn.addClass('success');
        
        setTimeout(() => {
            btn.html('<i class="fas fa-plus"></i>');
            btn.removeClass('success');
        }, 1000);
        
        // Add animation to cart icon
        cartBadgeEl.addClass('pulse');
        setTimeout(() => {
            cartBadgeEl.removeClass('pulse');
        }, 1000);
    }
    
    // Remove product from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCartToLocalStorage();
        renderCart();
    }
    
    // Update product quantity in cart
    function updateQuantity(productId, newQuantity) {
        const item = cart.find(item => item.id === productId);
        if (!item) return;
        
        newQuantity = parseInt(newQuantity);
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }
        
        item.quantity = newQuantity;
        saveCartToLocalStorage();
        renderCart();
    }
    
    // Render cart items
    function renderCart() {
        if (cart.length === 0) {
            emptyCartMessageEl.show();
            cartCountEl.text('0 items');
            cartBadgeEl.text('0');
            subtotalEl.text('$0.00');
            totalEl.text('$0.00');
            checkoutBtnEl.prop('disabled', true);
            return;
        }
        
        emptyCartMessageEl.hide();
        cartItemsEl.empty();
        
        let subtotal = 0;
        let totalItems = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            totalItems += item.quantity;
            
            const cartItemEl = $(`
                <div class="cart-item fade-in" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease-quantity" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                        <button class="quantity-btn increase-quantity" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-total">${itemTotal.toFixed(2)}</div>
                    <button class="btn-remove" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `);
            
            // Add event listeners
            cartItemEl.find('.decrease-quantity').click(() => {
                const newQuantity = item.quantity - 1;
                if (newQuantity >= 1) {
                    updateQuantity(item.id, newQuantity);
                }
            });
            
            cartItemEl.find('.increase-quantity').click(() => {
                updateQuantity(item.id, item.quantity + 1);
            });
            
            cartItemEl.find('.quantity-input').change(function() {
                updateQuantity(item.id, $(this).val());
            });
            
            cartItemEl.find('.btn-remove').click(function() {
                const cartItem = $(this).closest('.cart-item');
                cartItem.addClass('slide-out');
                setTimeout(() => removeFromCart(item.id), 300);
            });
            
            cartItemsEl.append(cartItemEl);
        });
        
        // Update summary
        cartCountEl.text(`${cart.length} ${cart.length === 1 ? 'item' : 'items'}`);
        cartBadgeEl.text(totalItems);
        subtotalEl.text(`${subtotal.toFixed(2)}`);
        totalEl.text(`${subtotal.toFixed(2)}`);
        checkoutBtnEl.prop('disabled', false);
    }
    
    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
    
    // Load cart from localStorage
    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }
    
    // Toggle dark mode
    function toggleDarkMode() {
        $('body').toggleClass('dark-mode');
        const isDarkMode = $('body').hasClass('dark-mode');
        
        // Update button text and icon
        if (isDarkMode) {
            darkModeToggleEl.html('<i class="fas fa-sun"></i> Light Mode');
        } else {
            darkModeToggleEl.html('<i class="fas fa-moon"></i> Dark Mode');
        }
        
        // Save preference
        localStorage.setItem('darkMode', isDarkMode);
    }
    
    // Check if dark mode is enabled in localStorage
    function checkDarkMode() {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            $('body').addClass('dark-mode');
            darkModeToggleEl.html('<i class="fas fa-sun"></i> Light Mode');
        }
    }
    
    // Checkout button handler
    function handleCheckout() {
        if (cart.length === 0) return;
        
        // Here you would typically send the cart data to your backend
        alert(`Order placed successfully! Total: ${totalEl.text()}`);
        
        // Clear cart after checkout
        cart = [];
        saveCartToLocalStorage();
        renderCart();
    }
});