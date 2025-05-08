$(document).ready(function () {
    // Common initialization
    initTogglePassword();
    checkLoginStatus();
    handleMultiLanguage();
    optimizePerformance();
    
    // Page-specific initialization
    if ($('#loginForm').length) {
        handleLogin();
    } else if ($('#registerForm').length) {
        handleRegister();
    } else if ($('#productsTable').length) {
        handleProducts();
        handleCart();
        updateUserInfo();
    }
    
    // Prevent access to protected pages if not logged in
    if (!localStorage.getItem('isLoggedIn') && 
        !window.location.pathname.endsWith('login.html') && 
        !window.location.pathname.endsWith('register.html')) {
        window.location.href = 'login.html';
    }
    
    // Redirect to dashboard if logged in and on auth pages
    if (localStorage.getItem('isLoggedIn') && 
        (window.location.pathname.endsWith('login.html') || 
        window.location.pathname.endsWith('register.html'))) {
        window.location.href = 'index.html';
    }

    // Preloader
    $(window).on('load', function() {
        $('.preloader').fadeOut('slow');
    });

    // Sidebar Toggle
    $('.btn-toggle-sidebar').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $('.btn-close-sidebar').on('click', function() {
        $('#sidebar').removeClass('active');
    });

    // Dark Mode Toggle
    $('.btn-dark-mode').on('click', function() {
        $('body').toggleClass('dark-mode');
        localStorage.setItem('darkMode', $('body').hasClass('dark-mode'));
        
        if($('body').hasClass('dark-mode')) {
            $(this).html('<i class="fas fa-sun"></i> Chế độ sáng');
        } else {
            $(this).html('<i class="fas fa-moon"></i> Chế độ tối');
        }
    });
    
    // Áp dụng dark mode nếu đã lưu
    if (localStorage.getItem('darkMode') === 'true') {
        $('body').addClass('dark-mode');
    }

    // Initialize Charts
    if ($('#revenueChart').length) {
        var ctx = document.getElementById('revenueChart').getContext('2d');
        var revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7'],
                datasets: [{
                    label: 'Doanh thu ($)',
                    data: [12000, 19000, 15000, 20000, 17000, 25000, 22000],
                    backgroundColor: 'rgba(115, 103, 240, 0.1)',
                    borderColor: '#7367f0',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#7367f0',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#2a3042',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        boxWidth: 10,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                return ' ' + context.parsed.y.toLocaleString() + '$';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + '$';
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                }
            }
        });
    }

    if ($('#revenuePieChart').length) {
        var ctx = document.getElementById('revenuePieChart').getContext('2d');
        var revenuePieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Điện thoại', 'Laptop', 'Phụ kiện', 'Tablet', 'Khác'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#7367f0',
                        '#28c76f',
                        '#00cfe8',
                        '#ff9f43',
                        '#ea5455'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: {
                                size: 13
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#2a3042',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        boxWidth: 10,
                        usePointStyle: true,
                        callbacks: {
                            label: function(context) {
                                return ' ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Active menu item
    $('.sidebar-menu li').on('click', function() {
        $('.sidebar-menu li').removeClass('active');
        $(this).addClass('active');
    });

    // Tooltip initialization
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Prevent dropdown from closing when clicking inside
    $('.dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });

    // Animate elements on scroll
    $(window).on('scroll', function() {
        $('.summary-card').each(function() {
            var position = $(this).offset().top;
            var scroll = $(window).scrollTop();
            var windowHeight = $(window).height();
            
            if (scroll > position - windowHeight + 200) {
                $(this).addClass('animate__animated animate__fadeInUp');
            }
        });
    }).scroll();

    // Form select styling
    $('.form-select').each(function() {
        $(this).addClass('form-select-sm');
    });

    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (isLoggedIn) {
            $('body').addClass('user-logged-in');
            $('.logged-in-user').removeClass('d-none');
            
            // Lấy thông tin user nếu có
            const userData = JSON.parse(localStorage.getItem('userData') || '{}');
            if (userData.name) {
                $('.logged-in-user span').text(userData.name + '.');
                $('.profile-info h6').text(userData.name);
            }
            if (userData.avatar) {
                $('.logged-in-user .avatar img').attr('src', userData.avatar);
            }
        } else {
            $('body').removeClass('user-logged-in');
        }
    }
    
    // Xử lý đăng xuất
    $('button.btn-logout').on('click', function(e) {
        e.preventDefault();
        
        // Xóa thông tin đăng nhập
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userData');
        
        // Chuyển hướng về trang đăng nhập
        window.location.href = 'login.html';
    });
    
    // Kiểm tra ngay khi trang load
    checkLoginStatus();
});

// MockAPI configuration
const API_BASE_URL = 'https://66434cf76c6a656587067972.mockapi.io/api/v1'; // Replace with your MockAPI URL
const USERS_ENDPOINT = `${API_BASE_URL}/users`;
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;

// Login functionality
function handleLogin() {
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const remember = $('#remember').is(':checked');
        
        // Validate inputs
        if (!email || !password) {
            showError('loginError', 'Vui lòng nhập email và mật khẩu');
            return;
        }
        
        // Mock API call - replace with actual API call
        $.ajax({
            url: USERS_ENDPOINT,
            method: 'GET',
            success: function(users) {
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Login successful
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userData', JSON.stringify({
                        name: user.name,
                        email: user.email,
                        createdAt: user.createdAt
                    }));
                    
                    if (remember) {
                        localStorage.setItem('rememberMe', 'true');
                    }
                    
                    window.location.href = 'index.html';
                } else {
                    showError('loginError', 'Email hoặc mật khẩu không chính xác');
                }
            },
            error: function() {
                showError('loginError', 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
            }
        });
    });
}

// Register functionality
function handleRegister() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const password = $('#password').val();
        const confirmPassword = $('#confirmPassword').val();
        
        // Validate inputs
        if (!name || !email || !password || !confirmPassword) {
            showError('registerError', 'Vui lòng điền đầy đủ thông tin');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('registerError', 'Mật khẩu xác nhận không khớp');
            return;
        }
        
        if (password.length < 6) {
            showError('registerError', 'Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }
        
        // Mock API call - replace with actual API call
        $.ajax({
            url: USERS_ENDPOINT,
            method: 'GET',
            success: function(users) {
                const emailExists = users.some(u => u.email === email);
                
                if (emailExists) {
                    showError('registerError', 'Email đã được sử dụng');
                } else {
                    // Register new user
                    $.ajax({
                        url: USERS_ENDPOINT,
                        method: 'POST',
                        data: {
                            name: name,
                            email: email,
                            password: password,
                            createdAt: new Date().toISOString()
                        },
                        success: function() {
                            // Registration successful
                            localStorage.setItem('isLoggedIn', 'true');
                            localStorage.setItem('userData', JSON.stringify({
                                name: name,
                                email: email,
                                createdAt: new Date().toISOString()
                            }));
                            
                            window.location.href = 'index.html';
                        },
                        error: function() {
                            showError('registerError', 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
                        }
                    });
                }
            },
            error: function() {
                showError('registerError', 'Đã xảy ra lỗi khi kiểm tra email. Vui lòng thử lại.');
            }
        });
    });
}

// Helper function to show error messages
function showError(elementId, message) {
    const element = $(`#${elementId}`);
    element.text(message).removeClass('d-none');
    setTimeout(() => element.addClass('d-none'), 5000);
}

// Toggle password visibility
function initTogglePassword() {
    $('.toggle-password').on('click', function() {
        const target = $(this).data('target');
        const input = $(target);
        const icon = $(this).find('i');
        
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });
}

// Update user info in sidebar and header
function updateUserInfo() {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (userData.name) {
        const names = userData.name.split(' ');
        let displayName = names[0];
        if (names.length > 1) {
            displayName += ' ' + names[1].charAt(0) + '.';
        }
        
        $('#headerUserName').text(displayName);
        $('#sidebarUserName').text(userData.name);
    }
}

// Cart functionality
function handleCart() {
    const CART_KEY = 'luxury_cart';
    
    // Load cart from localStorage
    function loadCart() {
        return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    }
    
    // Save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    
    // Add to cart button
    $(document).on('click', '.btn-add-to-cart', function() {
        const productId = $(this).data('id');
        
        $.ajax({
            url: `${PRODUCTS_ENDPOINT}/${productId}`,
            method: 'GET',
            success: function(product) {
                let cart = loadCart();
                const existingItem = cart.find(item => item.id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                saveCart(cart);
                updateCartBadge();
                showToast('Sản phẩm đã được thêm vào giỏ hàng');
            },
            error: function() {
                showToast('Đã xảy ra lỗi khi thêm vào giỏ hàng', 'error');
            }
        });
    });
    
    // Remove from cart
    $(document).on('click', '.btn-remove-from-cart', function() {
        const productId = $(this).data('id');
        let cart = loadCart();
        
        cart = cart.filter(item => item.id !== productId);
        saveCart(cart);
        renderCart();
        updateCartBadge();
        showToast('Sản phẩm đã được xóa khỏi giỏ hàng');
    });
    
    // Update quantity
    $(document).on('change', '.cart-item-quantity', function() {
        const productId = $(this).data('id');
        const quantity = parseInt($(this).val()) || 1;
        let cart = loadCart();
        
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            saveCart(cart);
            renderCart();
        }
    });
    
    // Render cart
    function renderCart() {
        const cart = loadCart();
        const tbody = $('#cartTableBody');
        tbody.empty();
        
        if (cart.length === 0) {
            tbody.append('<tr><td colspan="5" class="text-center">Giỏ hàng trống</td></tr>');
            $('#cartTotal').text('$0.00');
            $('#btnCheckout').prop('disabled', true);
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            
            const row = `
                <tr>
                    <td>
                        <div class="d-flex align-items-center">
                            <img src="${item.image || 'https://via.placeholder.com/60'}" 
                                 alt="${item.title}" 
                                 class="img-thumbnail me-3" 
                                 style="width: 60px; height: 60px; object-fit: cover;">
                            <div>
                                <h6 class="mb-0">${item.title}</h6>
                                <small class="text-muted">ID: ${item.id}</small>
                            </div>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}
                    
                        
                    
                    $${subtotal.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger btn-remove-from-cart" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
        
        $('#cartTotal').text(`$${total.toFixed(2)}`);
        $('#btnCheckout').prop('disabled', false);
    }
    
    // Update cart badge
    function updateCartBadge() {
        const cart = loadCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        $('.cart-badge').text(totalItems).toggle(totalItems > 0);
    }
    
    // Checkout
    $('#btnCheckout').on('click', function() {
        const cart = loadCart();
        
        if (cart.length === 0) {
            showToast('Giỏ hàng trống', 'error');
            return;
        }
        
        // In a real app, you would process the payment here
        showToast('Đơn hàng đã được xử lý thành công', 'success');
        localStorage.removeItem(CART_KEY);
        $('#cartModal').modal('hide');
        updateCartBadge();
    });
    
    // Initialize cart
    if ($('#cartModal').length) {
        updateCartBadge();
    }
    
    // Show cart
    $('.btn-show-cart').on('click', function() {
        renderCart();
        $('#cartModal').modal('show');
    });
}

// Toast notification
function showToast(message, type = 'success') {
    const toast = $(`
        <div class="toast fade show align-items-center text-white bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `);
    
    $('#toastContainer').append(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Multi-language functionality
function handleMultiLanguage() {
    const LANG_KEY = 'luxury_language';
    const translations = {
        'en': {
            dashboard: "Dashboard",
            overview: "Overview",
            orders: "Orders",
            products: "Products",
            customers: "Customers",
            analytics: "Analytics",
            management: "Management",
            promotions: "Promotions",
            revenue: "Revenue",
            settings: "Settings",
            darkMode: "Dark Mode",
            login: "Login",
            register: "Register",
            logout: "Logout",
            profile: "Profile",
            search: "Search...",
            addProduct: "Add Product",
            productList: "Product List",
            image: "Image",
            productName: "Product Name",
            description: "Description",
            price: "Price",
            dateCreated: "Date Created",
            actions: "Actions",
            edit: "Edit",
            delete: "Delete",
            saveChanges: "Save Changes",
            close: "Close",
            cart: "Cart",
            unitPrice: "Unit Price",
            quantity: "Quantity",
            subtotal: "Subtotal",
            total: "Total",
            checkout: "Checkout",
            emptyCart: "Your cart is empty"
        },
        'vi': {
            dashboard: "Bảng điều khiển",
            overview: "Tổng quan",
            orders: "Đơn hàng",
            products: "Sản phẩm",
            customers: "Khách hàng",
            analytics: "Phân tích",
            management: "Quản lý",
            promotions: "Khuyến mãi",
            revenue: "Doanh thu",
            settings: "Cài đặt",
            darkMode: "Chế độ tối",
            login: "Đăng nhập",
            register: "Đăng ký",
            logout: "Đăng xuất",
            profile: "Hồ sơ",
            search: "Tìm kiếm...",
            addProduct: "Thêm sản phẩm",
            productList: "Danh sách sản phẩm",
            image: "Hình ảnh",
            productName: "Tên sản phẩm",
            description: "Mô tả",
            price: "Giá",
            dateCreated: "Ngày tạo",
            actions: "Thao tác",
            edit: "Sửa",
            delete: "Xóa",
            saveChanges: "Lưu thay đổi",
            close: "Đóng",
            cart: "Giỏ hàng",
            unitPrice: "Đơn giá",
            quantity: "Số lượng",
            subtotal: "Thành tiền",
            total: "Tổng cộng",
            checkout: "Thanh toán",
            emptyCart: "Giỏ hàng trống"
        }
    };

    // Set language
    function setLanguage(lang) {
        localStorage.setItem(LANG_KEY, lang);
        applyTranslations(lang);
        
        $('.language-item').removeClass('active');
        $(`.language-item[data-lang="${lang}"]`).addClass('active');
    }

    // Apply translations
    function applyTranslations(lang) {
        const t = translations[lang];
        if (!t) return;

        // Translate all elements with data-https://flagcdn.com/w20/us.pngi18n attribute
        $('[data-i18n]').each(function() {
            const key = $(this).data('i18n');
            console.log(t[key], key)
            $(this).text(t[key] || key);
        });

        // Translate placeholders
        $('[data-i18n-placeholder]').each(function() {
            const key = $(this).data('i18n-placeholder');
            $(this).attr('placeholder', t[key] || key);
        });
    }

    // Initialize language
    function initLanguage() {
        const savedLang = localStorage.getItem(LANG_KEY) || 'vi';
        setLanguage(savedLang);
    }

    // Language switcher event
    $('.language-item').on('click', function() {
        const lang = $(this).data('lang');
        switch (lang) {
            case 'en':
                $('#languageDropdown img').attr('src', 'https://flagcdn.com/w20/us.png');
                setLanguage('en');
                break;
            case 'vi':
                $('#languageDropdown img').attr('src', 'https://flagcdn.com/w20/vn.png');
                setLanguage('vi');
                break;
            default:
                $('#languageDropdown img').attr('src', 'https://flagcdn.com/w20/vn.png');
                setLanguage('vi');
        }
    });

    // Initialize
    if ($('[data-i18n]').length) {
        initLanguage();
    }
}

// Performance optimization
function optimizePerformance() {
    // Lazy loading images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img.lazy-load');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Debounce for search and resize events
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }

    // Debounced search
    $('#productSearch').on('keyup', debounce(function() {
        const searchTerm = $(this).val().toLowerCase();
        // Search logic here...
    }, 300));

    // Cache DOM elements
    const cache = {};
    function getElement(selector) {
        if (!cache[selector]) {
            cache[selector] = $(selector);
        }
        return cache[selector];
    }

    // Use requestAnimationFrame for animations
    function smoothScroll(target) {
        const element = getElement(target);
        if (element.length) {
            window.requestAnimationFrame(() => {
                window.scrollTo({
                    top: element.offset().top - 20,
                    behavior: 'smooth'
                });
            });
        }
    }

    // Initialize optimizations
    if ($('img.lazy-load').length) {
        console.log('Lazy loading initialized');
    }
}