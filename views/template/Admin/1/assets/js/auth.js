$(document).ready(function() {
    // Preloader
    $(window).on('load', function() {
        $('.preloader').fadeOut('slow');
    });

    // Toggle Password Visibility
    $('.btn-password-toggle').on('click', function() {
        const input = $(this).siblings('input');
        const icon = $(this).find('i');
        
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Form Validation
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        let isValid = true;
        
        $(this).find('input[required]').each(function() {
            if (!$(this).val()) {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        if (isValid) {
            $('.btn-auth').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...').prop('disabled', true);
            
            $.get('https://67ff87cd58f18d7209f19525.mockapi.io/api/v1/users', {
                email: $('#email').val(),
                password: $('#password').val()
            }, function (data) {
                if (data.length > 0) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userData', JSON.stringify(data[0]));
                    window.location.href = 'index.html';
                }
            }
            ).fail(function (jqXHR, textStatus, errorThrown) {
                alert('Đã xảy ra lỗi: ' + errorThrown);
            }).always(function () {
                $('.btn-auth').html('Đăng nhập <i class="fas fa-arrow-right ms-2"></i>').prop('disabled', false);
            });
        }
    });

    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        
        // Simple validation
        let isValid = true;
        
        $(this).find('input[required]').each(function() {
            if (!$(this).val()) {
                isValid = false;
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });
        
        if ($(this).attr('id') === 'registerForm') {
            const password = $('#password').val();
            const confirmPassword = $('#confirmPassword').val();
            
            if (password !== confirmPassword) {
                isValid = false;
                $('#confirmPassword').addClass('is-invalid');
                $('#confirmPassword').next('.invalid-feedback').remove();
                $('#confirmPassword').after('<div class="invalid-feedback">Mật khẩu không khớp</div>');
            }
        }
    });
});