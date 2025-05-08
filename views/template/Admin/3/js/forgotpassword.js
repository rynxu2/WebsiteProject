$(document).ready(function () {
    // Xử lý form yêu cầu đặt lại mật khẩu
    $('#forgotPasswordForm').on('submit', function (e) {
        e.preventDefault();

        const email = $('#email').val();

        // TODO: Gửi yêu cầu API để lấy mã xác thực
        // Ví dụ:
        // $.ajax({
        //    url: 'api/send-verification-code',
        //    method: 'POST',
        //    data: { email: email },
        //    success: function(response) {
        //        // Hiển thị phần nhập mã xác thực
        //        showVerifySection();
        //    },
        //    error: function(error) {
        //        showError('Không thể gửi mã xác thực. Vui lòng thử lại.');
        //    }
        // });

        // Demo: Giả lập gửi mã thành công
        showSuccess('Mã xác thực đã được gửi đến email của bạn');
        showVerifySection();
    });

    // Xử lý form xác thực mã
    $('#verifyForm').on('submit', function (e) {
        e.preventDefault();

        // Thu thập mã xác thực từ các ô input
        let verificationCode = '';
        $('.verification-code').each(function () {
            verificationCode += $(this).val();
        });

        // TODO: Gửi mã xác thực đến API để kiểm tra
        // Ví dụ:
        // $.ajax({
        //    url: 'api/verify-code',
        //    method: 'POST',
        //    data: { 
        //        email: $('#email').val(),
        //        code: verificationCode 
        //    },
        //    success: function(response) {
        //        // Hiển thị phần đặt lại mật khẩu
        //        showResetSection();
        //    },
        //    error: function(error) {
        //        showError('Mã xác thực không đúng. Vui lòng thử lại.');
        //    }
        // });

        // Demo: Giả lập xác thực thành công
        showSuccess('Xác thực thành công!');
        showResetSection();
    });

    // Xử lý form đặt lại mật khẩu
    $('#resetPasswordForm').on('submit', function (e) {
        e.preventDefault();

        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();

        // Kiểm tra mật khẩu trùng khớp
        if (newPassword !== confirmPassword) {
            showError('Mật khẩu không khớp. Vui lòng nhập lại.');
            return;
        }

        // TODO: Gửi yêu cầu đặt lại mật khẩu đến API
        // Ví dụ:
        // $.ajax({
        //    url: 'api/reset-password',
        //    method: 'POST',
        //    data: { 
        //        email: $('#email').val(),
        //        password: newPassword 
        //    },
        //    success: function(response) {
        //        showSuccess('Đặt lại mật khẩu thành công!');
        //        setTimeout(function() {
        //            window.location.href = 'login.html';
        //        }, 2000);
        //    },
        //    error: function(error) {
        //        showError('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
        //    }
        // });

        // Demo: Giả lập đặt lại mật khẩu thành công
        showSuccess('Đặt lại mật khẩu thành công! Đang chuyển hướng đến trang đăng nhập...');
        setTimeout(function () {
            // Chuyển hướng đến trang đăng nhập
            window.location.href = 'login.html';
        }, 2000);
    });

    // Xử lý sự kiện khi nhập mã xác thực
    $('.verification-code').on('input', function () {
        const maxLength = parseInt($(this).attr('maxlength'));
        if ($(this).val().length >= maxLength) {
            $(this).next('.verification-code').focus();
        }
    });

    // Xử lý sự kiện quay lại đăng nhập
    $('#backToLogin, #backToLogin2').on('click', function (e) {
        e.preventDefault();
        window.location.href = 'login.html';
    });

    // Xử lý sự kiện gửi lại mã
    $('#resendCode').on('click', function (e) {
        e.preventDefault();

        // TODO: Gửi lại mã xác thực
        // Ví dụ:
        // $.ajax({
        //    url: 'api/resend-verification-code',
        //    method: 'POST',
        //    data: { email: $('#email').val() },
        //    success: function(response) {
        //        showSuccess('Mã xác thực đã được gửi lại.');
        //    },
        //    error: function(error) {
        //        showError('Không thể gửi lại mã xác thực. Vui lòng thử lại.');
        //    }
        // });

        // Demo: Giả lập gửi lại mã thành công
        showSuccess('Mã xác thực đã được gửi lại thành công!');
    });

    // Hàm hiển thị phần xác thực
    function showVerifySection() {
        $('#requestSection').hide();
        $('#verifySection').show();
        $('#resetSection').hide();
        $('#mainTitle').text('Xác thực mã');
    }

    // Hàm hiển thị phần đặt lại mật khẩu
    function showResetSection() {
        $('#requestSection').hide();
        $('#verifySection').hide();
        $('#resetSection').show();
        $('#mainTitle').text('Đặt lại mật khẩu');
    }

    // Hàm hiển thị thông báo thành công
    function showSuccess(message) {
        $('#successAlert').text(message).show();
        setTimeout(function () {
            $('#successAlert').hide();
        }, 3000);
    }

    // Hàm hiển thị thông báo lỗi
    function showError(message) {
        $('#errorAlert').text(message).show();
        setTimeout(function () {
            $('#errorAlert').hide();
        }, 3000);
    }
});