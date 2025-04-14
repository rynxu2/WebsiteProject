$(document).ready(function() {
    $('#mobile-menu-btn').click(function() {
        $('#mobile-menu').toggleClass('open');
    });
    
    $('#search-btn').click(function() {
        $('#search-bar').toggle();
    });
    
    $('#cart-btn').click(function() {
        $('#cart-preview').toggle();
    });
    
    $('#close-modal').click(function() {
        $('#quick-view-modal').addClass('hidden');
    });
    
    $('.quick-view-btn').click(function() {
        const productCard = $(this).closest('.product-card');
        const title = productCard.find('h3').text();
        const price = productCard.find('.text-indigo-600').first().text();
        const oldPrice = productCard.find('.line-through').text() || '';
        const image = productCard.find('img').attr('src');
        
        $('#modal-product-title').text(title);
        $('#modal-product-price').text(price);
        $('#modal-product-old-price').text(oldPrice);
        $('#modal-product-image').attr('src', image);
        
        $('#quick-view-modal').removeClass('hidden');
    });
    
    let cartCount = 0;
    const cartItems = $('#cart-items');
    
    $('.add-to-cart-btn').click(function() {
        cartCount++;
        $('#cart-count').text(cartCount);
        
        const productCard = $(this).closest('.product-card');
        const title = productCard.find('h3').text();
        const price = productCard.find('.text-indigo-600').first().text();
        const image = productCard.find('img').attr('src');
        
        if (cartCount === 1) {
            cartItems.empty();
        }
        
        const cartItem = `
            <div class="flex items-center mb-4 pb-4 border-b">
                <img src="${image}" alt="${title}" class="w-16 h-16 object-cover rounded">
                <div class="ml-4 flex-grow">
                    <h4 class="font-medium">${title}</h4>
                    <p class="text-gray-600">${price}</p>
                </div>
                <button class="remove-item text-gray-400 hover:text-red-500">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        cartItems.append(cartItem);
        
        $('#cart-preview').show();
        
        const successMsg = $(`<div class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">Added to cart!</div>`);
        $('body').append(successMsg);
        setTimeout(() => {
            successMsg.fadeOut();
        }, 2000);
    });
    
    $(document).on('click', '.remove-item', function() {
        $(this).closest('div').remove();
        cartCount--;
        $('#cart-count').text(cartCount);
        
        if (cartCount === 0) {
            cartItems.html('<p class="text-gray-500 text-center py-4">Your cart is empty</p>');
        }
    });
    
    $(document).mouseup(function(e) {
        const cartPreview = $("#cart-preview");
        const cartBtn = $("#cart-btn");
        
        if (!cartPreview.is(e.target) && cartPreview.has(e.target).length === 0 && 
            !cartBtn.is(e.target) && cartBtn.has(e.target).length === 0) {
            cartPreview.hide();
        }
    });
    
    $(document).mouseup(function(e) {
        const modal = $("#quick-view-modal");
        if (modal.is(e.target)) {
            modal.addClass('hidden');
        }
    });
    
    $('a[href*="#"]').on('click', function(e) {
        e.preventDefault();
        
        $('html, body').animate(
            {
                scrollTop: $($(this).attr('href')).offset().top,
            },
            500,
            'linear'
        );
    });
});