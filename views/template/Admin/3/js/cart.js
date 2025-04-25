class Cart {
    constructor() {
        this.cartKey = 'ecommerce_cart';
        this.cart = JSON.parse(localStorage.getItem(this.cartKey)) || [];
    }
    
    getItems() {
        return this.cart;
    }
    
    addItem(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                ...product,
                quantity
            });
        }
        
        this.save();
    }
    
    removeItem(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.save();
    }
    
    updateQuantity(id, quantity) {
        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            this.save();
        }
    }
    
    clear() {
        this.cart = [];
        this.save();
    }
    
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
    
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    save() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.cart));
    }
}

const cart = new Cart();

// Thêm vào giỏ hàng
async function addToCart(productId) {
    try {
        const product = await fetchProductDetail(productId);
        cart.addItem(product);
        
        Swal.fire({
            icon: 'success',
            title: 'Thêm vào giỏ hàng thành công',
            showConfirmButton: false,
            timer: 1500
        });
        
        updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
        Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Không thể thêm sản phẩm vào giỏ hàng'
        });
    }
}

// Cập nhật số lượng trên icon giỏ hàng
function updateCartCount() {
    const count = cart.getTotalItems();
    $('#cartCount').text(count > 0 ? count : '');
}

// Hiển thị giỏ hàng
function renderCart() {
    const container = $('#cartItems');
    const totalContainer = $('#cartTotal');
    container.empty();
    
    const items = cart.getItems();
    
    if (items.length === 0) {
        container.html(`
            <div class="col-12 text-center py-5">
                <h5>Giỏ hàng trống</h5>
                <a href="products.html" class="btn btn-primary mt-3">Tiếp tục mua sắm</a>
            </div>
        `);
        totalContainer.addClass('d-none');
        return;
    }
    
    items.forEach(item => {
        container.append(`
            <div class="card mb-3 cart-item" data-id="${item.id}">
                <div class="row g-0">
                    <div class="col-md-2">
                        <img src="${item.image || 'assets/images/placeholder.jpg'}" 
                             class="img-fluid rounded-start cart-item-image" 
                             alt="${item.title}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
                            <h5 class="card-title">${item.title}</h5>
                            <p class="card-text">${formatPrice(item.price)}</p>
                            <div class="input-group quantity-control">
                                <button class="btn btn-outline-secondary decrease-quantity" type="button">-</button>
                                <input type="number" class="form-control text-center quantity-input" 
                                       value="${item.quantity}" min="1">
                                <button class="btn btn-outline-secondary increase-quantity" type="button">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2 d-flex align-items-center justify-content-center">
                        <button class="btn btn-danger remove-item">
                            <i class="bi bi-trash"></i> Xóa
                        </button>
                    </div>
                </div>
            </div>
        `);
    });
    
    totalContainer.removeClass('d-none');
    $('#totalItems').text(items.length);
    $('#totalPrice').text(formatPrice(cart.getTotalPrice()));
}

// Xử lý sự kiện giỏ hàng
$(document).ready(function() {
    updateCartCount();
    
    if ($('#cartItems').length) {
        renderCart();
    }
    
    // Xóa sản phẩm
    $(document).on('click', '.remove-item', function() {
        const itemId = $(this).closest('.cart-item').data('id');
        cart.removeItem(itemId);
        renderCart();
        updateCartCount();
    });
    
    // Giảm số lượng
    $(document).on('click', '.decrease-quantity', function() {
        const input = $(this).siblings('.quantity-input');
        let quantity = parseInt(input.val());
        if (quantity > 1) {
            input.val(quantity - 1).trigger('change');
        }
    });
    
    // Tăng số lượng
    $(document).on('click', '.increase-quantity', function() {
        const input = $(this).siblings('.quantity-input');
        let quantity = parseInt(input.val());
        input.val(quantity + 1).trigger('change');
    });
    
    // Thay đổi số lượng
    $(document).on('change', '.quantity-input', function() {
        const itemId = $(this).closest('.cart-item').data('id');
        const quantity = parseInt($(this).val());
        
        if (isNaN(quantity) || quantity < 1) {
            $(this).val(1);
            cart.updateQuantity(itemId, 1);
        } else {
            cart.updateQuantity(itemId, quantity);
        }
        
        renderCart();
        updateCartCount();
    });
    
    // Thanh toán
    $('#checkoutBtn').click(function() {
        Swal.fire({
            title: 'Xác nhận thanh toán?',
            text: `Tổng cộng: ${formatPrice(cart.getTotalPrice())}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Thanh toán',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Thanh toán thành công',
                    text: 'Cảm ơn bạn đã mua hàng!'
                });
                cart.clear();
                renderCart();
                updateCartCount();
            }
        });
    });
});