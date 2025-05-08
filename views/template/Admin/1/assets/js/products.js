$(document).ready(function () {
    handleProducts();
})

function handleProducts() {
    // Load products
    function loadProducts() {
        $.ajax({
            url: PRODUCTS_ENDPOINT,
            method: 'GET',
            success: function(products) {
                renderProductsTable(products);
            },
            error: function() {
                alert('Đã xảy ra lỗi khi tải danh sách sản phẩm');
            }
        });
    }
    
    // Render products table
    function renderProductsTable(products) {
        const tbody = $('#productsTableBody');
        tbody.empty();
        
        if (products.length === 0) {
            tbody.append('<tr><td colspan="7" class="text-center">Không có sản phẩm nào</td></tr>');
            return;
        }
        
        products.forEach((product, index) => {
            console.log(product);
            const row = `
                <tr class="animate-fade-in">
                    <td>${index + 1}</td>
                    <td><img src="${product.avatar || 'https://via.placeholder.com/60'}" alt="${product.name}"></td>
                    <td>${product.name}</td>
                    <td>${product.description.substring(0, 50)}${product.description.length > 50 ? '...' : ''}</td>
                    <td>$${product.price}</td>
                    <td>${new Date(product.createdAt).toLocaleDateString()}</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-sm btn-primary btn-edit" data-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-danger btn-delete" data-id="${product.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
    }
    
    // Add new product
    $('#btnAddProduct').on('click', function() {
        $('#productModalTitle').text('Thêm sản phẩm mới');
        $('#productForm')[0].reset();
        $('#productId').val('');
        $('#imagePreview').addClass('d-none');
        $('#productModal').modal('show');
    });
    
    // Edit product
    $(document).on('click', '.btn-edit', function() {
        const productId = $(this).data('id');
        
        $.ajax({
            url: `${PRODUCTS_ENDPOINT}/${productId}`,
            method: 'GET',
            success: function(product) {
                $('#productModalTitle').text('Chỉnh sửa sản phẩm');
                $('#productId').val(product.id);
                $('#productTitle').val(product.title);
                $('#productDescription').val(product.description);
                $('#productPrice').val(product.price);
                
                if (product.image) {
                    $('#imagePreview').attr('src', product.image).removeClass('d-none');
                } else {
                    $('#imagePreview').addClass('d-none');
                }
                
                $('#productModal').modal('show');
            },
            error: function() {
                alert('Đã xảy ra lỗi khi tải thông tin sản phẩm');
            }
        });
    });
    
    // Save product
    $('#productForm').on('submit', function(e) {
        e.preventDefault();
        
        const productId = $('#productId').val();
        const title = $('#productTitle').val().trim();
        const description = $('#productDescription').val().trim();
        const price = parseFloat($('#productPrice').val());
        const imageFile = $('#productImage')[0].files[0];
        
        // Validate inputs
        if (!title || !description || isNaN(price) || price <= 0) {
            showError('productError', 'Vui lòng điền đầy đủ thông tin hợp lệ');
            return;
        }
        
        const productData = {
            title: title,
            description: description,
            price: price,
            createdAt: new Date().toISOString()
        };
        
        // Handle image upload (mock - in a real app you would upload to a server)
        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                productData.image = e.target.result;
                saveProduct(productId, productData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            saveProduct(productId, productData);
        }
    });
    
    function saveProduct(id, data) {
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${PRODUCTS_ENDPOINT}/${id}` : PRODUCTS_ENDPOINT;
        
        $.ajax({
            url: url,
            method: method,
            data: data,
            success: function() {
                $('#productModal').modal('hide');
                loadProducts();
            },
            error: function() {
                showError('productError', 'Đã xảy ra lỗi khi lưu sản phẩm');
            }
        });
    }
    
    // Delete product
    $(document).on('click', '.btn-delete', function() {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }
        
        const productId = $(this).data('id');
        
        $.ajax({
            url: `${PRODUCTS_ENDPOINT}/${productId}`,
            method: 'DELETE',
            success: function() {
                loadProducts();
            },
            error: function() {
                alert('Đã xảy ra lỗi khi xóa sản phẩm');
            }
        });
    });
    
    // Image preview
    $('#productImage').on('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').attr('src', e.target.result).removeClass('d-none');
            };
            reader.readAsDataURL(file);
        } else {
            $('#imagePreview').addClass('d-none');
        }
    });
    
    // Search products
    $('#productSearch').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $.ajax({
            url: PRODUCTS_ENDPOINT,
            method: 'GET',
            success: function(products) {
                const filteredProducts = products.filter(product => 
                    product.title.toLowerCase().includes(searchTerm) || 
                    product.description.toLowerCase().includes(searchTerm)
                );
                renderProductsTable(filteredProducts);
            },
            error: function() {
                alert('Đã xảy ra lỗi khi tìm kiếm sản phẩm');
            }
        });
    });
    
    // Filter products
    $('#productFilter').on('change', function() {
        const filter = $(this).val();
        
        $.ajax({
            url: PRODUCTS_ENDPOINT,
            method: 'GET',
            success: function(products) {
                let sortedProducts = [...products];
                
                if (filter === 'price_asc') {
                    sortedProducts.sort((a, b) => a.price - b.price);
                } else if (filter === 'price_desc') {
                    sortedProducts.sort((a, b) => b.price - a.price);
                }
                
                renderProductsTable(sortedProducts);
            },
            error: function() {
                alert('Đã xảy ra lỗi khi lọc sản phẩm');
            }
        });
    });
    
    // Initialize products
    if ($('#productsTable').length) {
        loadProducts();
    }
}