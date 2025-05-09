
$(document).ready(function() {
    // Global variables
    let products = [];
    let cart = [];
    
    // DOM elements
    const productListEl = $('#product-list');
    const cartItemsEl = $('#cart-items');
    const miniCartItemsEl = $('#mini-cart-items');
    const emptyCartMessageEl = $('#empty-cart-message');
    const cartCountEl = $('#cart-count');
    const miniCartCountEl = $('#mini-cart-count');
    const cartBadgeEl = $('#cart-badge');
    const subtotalEl = $('#subtotal');
    const totalEl = $('#total');
    const miniCartTotalEl = $('#mini-cart-total');
    const checkoutBtnEl = $('#checkout-btn');
    const searchProductEl = $('#search-product');
    
    // Initialize the app
    init();
    
    function init() {
        loadProducts();
        loadCartFromLocalStorage();
        renderCart();
        renderMiniCart();
        
        // Event listeners
        searchProductEl.on('input', filterProducts);
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
    
    // // Dark mode toggle functionality
    // Sample data fallback
    // Render products list
    function renderProducts(productsToRender) {
        productListEl.empty();
        
        if (productsToRender.length === 0) {
            productListEl.append('<p class="text-muted">No products found</p>');
            return;
        }
        
        productsToRender.forEach(product => {
            const productEl = $(`
                <div class="product-item">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    <div class="flex-grow-1">
                        <h3>${product.title}</h3>
                        <p>$${parseFloat(product.price).toFixed(2)}</p>
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            `);
            
            productEl.find('.add-to-cart-btn').click(() => addToCart(product.id));
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
        renderMiniCart();
        
        // Show success feedback
        const btn = $(`.add-to-cart-btn[data-id="${productId}"]`);
        btn.html('<i class="fas fa-check"></i>');
        btn.css('background-color', '#10b981'); // success green color
        
        // Small popup to show item was added to cart
        // const product = products.find(p => p.id === productId);
        showSmallPopup(`Added: ${product.title}`, 'success');
        
        setTimeout(() => {
            btn.html('<i class="fas fa-plus"></i>');
            btn.css('background-color', ''); // back to default color
        }, 1000);
    }
    
    // Remove product from cart
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCartToLocalStorage();
        renderCart();
        renderMiniCart();
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
        renderMiniCart();
    }
    
    // Render cart items
    function renderCart() {
        cartItemsEl.empty();
        
        if (cart.length === 0) {
            emptyCartMessageEl.show();
            cartCountEl.text('0 items');
            subtotalEl.text('$0.00');
            totalEl.text('$0.00');
            checkoutBtnEl.prop('disabled', true);
            return;
        }
        
        emptyCartMessageEl.hide();
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItemEl = $(`
                <div class="cart-item fade-in">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="flex-grow-1">
                        <h3>${item.title}</h3>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="decrease-quantity" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                        <button class="increase-quantity" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="fw-medium">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-item" data-id="${item.id}">
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
            
            cartItemEl.find('.remove-item').click(() => {
                cartItemEl.addClass('slide-out');
                setTimeout(() => removeFromCart(item.id), 300);
            });
            
            cartItemsEl.append(cartItemEl);
        });
        
        // Update summary
        cartCountEl.text(`${cart.length} ${cart.length === 1 ? 'item' : 'items'}`);
        cartBadgeEl.text(cart.length);
        subtotalEl.text(`$${subtotal.toFixed(2)}`);
        totalEl.text(`$${subtotal.toFixed(2)}`);
        checkoutBtnEl.prop('disabled', false);
    }
    
    // Render mini cart
    function renderMiniCart() {
        miniCartItemsEl.empty();
        
        if (cart.length === 0) {
            miniCartItemsEl.html('<div class="empty-mini-cart"><p>Chưa có sản phẩm</p></div>');
            miniCartCountEl.text('0');
            miniCartTotalEl.text('$0.00');
            return;
        }
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const miniCartItemEl = $(`
                <div class="mini-cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="mini-cart-item-details">
                        <div class="mini-cart-item-title">${item.title}</div>
                        <div class="mini-cart-item-price">
                            $${item.price.toFixed(2)}
                            <span class="mini-cart-item-quantity">x${item.quantity}</span>
                        </div>
                    </div>
                    <button class="mini-cart-item-remove" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `);
            
            miniCartItemEl.find('.mini-cart-item-remove').click(() => {
                removeFromCart(item.id);
            });
            
            miniCartItemsEl.append(miniCartItemEl);
        });
        
        // Update mini cart summary
        miniCartCountEl.text(cart.length);
        miniCartTotalEl.text(`$${subtotal.toFixed(2)}`);
    }
    
    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Load cart from localStorage
    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
            } catch (e) {
                console.error('Error parsing cart from localStorage:', e);
                cart = [];
            }
        }
    }
    
    // Checkout functionality
    checkoutBtnEl.click(function() {
        if (cart.length === 0) {
            showPopup('Warning', 'Your cart is empty!', 'warning');
            return;
        }
        
        // Show success popup
        showPopup('Success', 'Your purchase was completed successfully!', 'success');
        
        // Clear cart after successful purchase
        cart = [];
        saveCartToLocalStorage();
        renderCart();
        renderMiniCart();
    });
    
    // Custom popup function
    function showPopup(title, message, type) {
        // Create popup elements
        const popupOverlay = $('<div class="popup-overlay"></div>');
        const popupContainer = $('<div class="popup-container"></div>');
        const popupContent = $('<div class="popup-content"></div>');
        
        // Add appropriate icon based on type
        let iconClass = 'fa-info-circle text-info';
        if (type === 'success') {
            iconClass = 'fa-check-circle text-success';
        } else if (type === 'warning') {
            iconClass = 'fa-exclamation-triangle text-warning';
        } else if (type === 'error') {
            iconClass = 'fa-times-circle text-danger';
        }
        
        // Create popup HTML structure
        popupContent.html(`
            <div class="popup-header">
                <i class="fas ${iconClass} fs-1 mb-3"></i>
                <h3>${title}</h3>
            </div>
            <div class="popup-body">
                <p>${message}</p>
            </div>
            <div class="popup-footer">
                <button class="btn btn-primary popup-close-btn">OK</button>
            </div>
        `);
        
        // Assemble and append popup to body
        popupContainer.append(popupContent);
        popupOverlay.append(popupContainer);
        $('body').append(popupOverlay);
        
        // Add CSS to popup (normally this would be in a CSS file)
        popupOverlay.css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'height': '100%',
            'background-color': 'rgba(0, 0, 0, 0.5)',
            'display': 'flex',
            'justify-content': 'center',
            'align-items': 'center',
            'z-index': '9999',
            'opacity': '0',
            'transition': 'opacity 0.3s ease'
        });
        
        popupContainer.css({
            'background-color': $('body').hasClass('dark-mode') ? '#2d3748' : '#fff',
            'border-radius': '8px',
            'box-shadow': '0 4px 15px rgba(0, 0, 0, 0.2)',
            'width': '90%',
            'max-width': '400px',
            'transform': 'translateY(20px)',
            'transition': 'transform 0.3s ease',
            'overflow': 'hidden'
        });
        
        popupContent.css({
            'padding': '20px',
            'text-align': 'center',
            'color': $('body').hasClass('dark-mode') ? '#e2e8f0' : '#333'
        });
        
        $('.popup-header').css({
            'margin-bottom': '15px'
        });
        
        $('.popup-body').css({
            'margin-bottom': '20px'
        });
        
        $('.popup-close-btn').css({
            'min-width': '100px'
        });
        
        // Animation
        setTimeout(() => {
            popupOverlay.css('opacity', '1');
            popupContainer.css('transform', 'translateY(0)');
        }, 10);
        
        // Close popup on button click or overlay click
        $('.popup-close-btn, .popup-overlay').click(function(e) {
            if (e.target === this || $(this).hasClass('popup-close-btn')) {
                popupOverlay.css('opacity', '0');
                popupContainer.css('transform', 'translateY(20px)');
                
                setTimeout(() => {
                    popupOverlay.remove();
                }, 300);
            }
        });
    }
    
});