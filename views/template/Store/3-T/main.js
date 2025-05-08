$(document).ready(function() {
    // Global variables
    let products = [];
    let cart = [];
    
    // DOM elements
    const productListEl = $('#product-list');
    const cartItemsEl = $('#cart-items');
    const emptyCartMessageEl = $('#empty-cart-message');
    const cartCountEl = $('#cart-count');
    const subtotalEl = $('#subtotal');
    const totalEl = $('#total');
    const checkoutBtnEl = $('#checkout-btn');
    const searchProductEl = $('#search-product');
    
    // Initialize the app
    init();
    
    function init() {
        loadProducts();
        loadCartFromLocalStorage();
        renderCart();
        
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
            productListEl.append('<p class="text-gray-500">No products found</p>');
            return;
        }
        
        productsToRender.forEach(product => {
            const productEl = $(`
                <div class="product-item bg-gray-50 p-4 rounded-lg flex items-center space-x-4 hover:bg-gray-100 transition duration-200 cursor-pointer">
                    <img src="${product.image}" alt="${product.title}" class="w-16 h-16 object-cover rounded">
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-800">${product.title}</h3>
                        <p class="text-sm text-gray-600">$${parseFloat(product.price).toFixed(2)}</p>
                    </div>
                    <button class="add-to-cart-btn bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition duration-200" data-id="${product.id}">
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
        
        // Show success feedback
        const btn = $(`.add-to-cart-btn[data-id="${productId}"]`);
        btn.html('<i class="fas fa-check"></i>');
        btn.removeClass('bg-indigo-600 hover:bg-indigo-700').addClass('bg-green-500 hover:bg-green-600');
        
        setTimeout(() => {
            btn.html('<i class="fas fa-plus"></i>');
            btn.removeClass('bg-green-500 hover:bg-green-600').addClass('bg-indigo-600 hover:bg-indigo-700');
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
            subtotalEl.text('$0.00');
            totalEl.text('$0.00');
            checkoutBtnEl.prop('disabled', true);
            return;
        }
        
        emptyCartMessageEl.hide();
        cartItemsEl.empty();
        
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const cartItemEl = $(`
                <div class="cart-item bg-gray-50 p-4 rounded-lg flex flex-col md:flex-row md:items-center gap-4 transition duration-200 fade-in">
                    <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded self-start">
                    <div class="flex-1">
                        <h3 class="font-medium text-gray-800">${item.title}</h3>
                        <p class="text-sm text-gray-600">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <button class="decrease-quantity bg-gray-200 hover:bg-gray-300 text-gray-800 p-1 rounded" data-id="${item.id}">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input border rounded py-1 px-2" data-id="${item.id}">
                        <button class="increase-quantity bg-gray-200 hover:bg-gray-300 text-gray-800 p-1 rounded" data-id="${item.id}">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                    <div class="font-medium text-gray-800">$${itemTotal.toFixed(2)}</div>
                    <button class="remove-item text-red-500 hover:text-red-700 p-2" data-id="${item.id}">
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
        subtotalEl.text(`$${subtotal.toFixed(2)}`);
        totalEl.text(`$${subtotal.toFixed(2)}`);
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
    
    // Checkout button handler
    checkoutBtnEl.click(function() {
        if (cart.length === 0) return;
        
        // Here you would typically send the cart data to your backend
        alert(`Order placed successfully! Total: $${totalEl.text()}`);
        
        // Clear cart after checkout
        cart = [];
        saveCartToLocalStorage();
        renderCart();
    });
});