const API_URL = 'https://67ff87cd58f18d7209f19525.mockapi.io/api/v1';

// Đăng nhập
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Không thể kết nối đến server');
        console.log('Response:', response);
        const users = await response.json();
        const user = users.find(u => u.email === email && u.password === password);
        console.log('User:', user);
        if (!user) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Đăng ký - đã sửa logic kiểm tra email
async function register(name, email, password, avatar) {
    try {
        // Lấy tất cả người dùng để kiểm tra email
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
            throw new Error(`Lỗi server: ${response.status}`);
        }

        const allUsers = await response.json();
        console.log('All users:', allUsers);

        // Kiểm tra xem email đã tồn tại chưa
        const existingUser = allUsers.find(user => user.email === email);
        if (existingUser) {
            throw new Error('Email đã được sử dụng');
        }

        // Nếu email chưa tồn tại, tiến hành đăng ký
        const newUser = {
            'name': name,
            'avatar': avatar || '',  // Thêm giá trị mặc định cho avatar
            'email': email,
            'password': password,
            'createdAt': new Date().toISOString()
        };

        const createResponse = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        if (!createResponse.ok) throw new Error('Không thể tạo tài khoản');

        const createdUser = await createResponse.json();
        return createdUser;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Kiểm tra đăng nhập
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser;
}

$(document).ready(function () {
    $('.input').each(function () {
        $(this).on('blur', function () {
            if ($(this).val().trim() != "") {
                $(this).addClass('has-val');
            } else {
                $(this).removeClass('has-val');
            }
        });
    });

    // Kiểm tra giá trị trong ô nhập mật khẩu
    $('input[name="password"]').on('input', function () {
        const togglePassword = $(this).siblings('.toggle-password');
        if ($(this).val().trim() !== "") {
            togglePassword.show();
        } else {
            togglePassword.hide();
        }
    });

    $('.toggle-password').hide();

    // Toggle password visibility
    $('.toggle-password').click(function () {
        const passwordInput = $(this).siblings('input');
        const icon = $(this).find('i');
        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // // Toggle password visibility trong ô confirm password
    // $('.toggle-password').click(function () {
    //     const passwordInput = $(this).siblings('input');
    //     const icon = $(this).find('i');
    //     if (passwordInput.attr('type') === 'password') {
    //         passwordInput.attr('type', 'text');
    //         icon.removeClass('fa-eye').addClass('fa-eye-slash');
    //     } else {
    //         passwordInput.attr('type', 'password');
    //         icon.removeClass('fa-eye-slash').addClass('fa-eye');
    //     }
    // });

    // Ô xác nhận mật khẩu
    $('input[name="confirmPassword"]').on('input', function () {
        const togglePassword = $(this).siblings('.toggle-password');
        if ($(this).val().trim() !== "") {
            togglePassword.show();
        } else {
            togglePassword.hide();
        }
    });

    $('.toggle-password').hide();



    // Xử lý form đăng nhập
    if ($('#login-form').length) {
        $('#login-btn').submit(async function (e) {
            e.preventDefault();
            const email = $('#email').val();
            const password = $('#password').val();

            try {
                const btn = $(this);
                btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...');

                await login(email, password);

                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = 'index.html';
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi đăng nhập',
                    text: error.message
                });
            } finally {
                $('#login-btn').prop('disabled', false).text('Đăng nhập');
            }
        });
    }

    // Xử lý form đăng ký
    if ($('#register-form').length) {
        $('#register-form').submit(async function (e) {
            e.preventDefault();
            const name = $('#name').val();
            const email = $('#email').val();
            const password = $('#password').val();
            const confirmPassword = $('#confirmPassword').val();
            const avatar = $('#avatar').val() || ''; // Thêm xử lý avatar

            if (password !== confirmPassword) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Mật khẩu xác nhận không khớp'
                });
                return;
            }

            try {
                const btn = $('#registerBtn');
                btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...');

                await register(name, email, password, avatar);

                Swal.fire({
                    icon: 'success',
                    title: 'Đăng ký thành công',
                    text: 'Bạn có thể đăng nhập ngay bây giờ',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = '../login.html';
                });
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi đăng ký',
                    text: error.message
                });
            } finally {
                $('#registerBtn').prop('disabled', false).text('Đăng ký');
            }
        });
    }

    // THÊM MỚI: Hàm xử lý quên mật khẩu
    async function forgotPassword(email) {
        try {
            console.log(`Đang kiểm tra email: ${email}`);
            const response = await fetch(`${API_URL}/users`);

            if (!response.ok) {
                console.error('Lỗi API:', response.status, response.statusText);
                throw new Error('Không thể kết nối đến server');
            }

            const users = await response.json();
            console.log('Đã nhận dữ liệu từ API, số lượng user:', users.length);

            // Kiểm tra xem email có tồn tại không
            const user = users.find(u => u.email === email);

            if (!user) {
                console.log('Không tìm thấy user với email:', email);
                throw new Error('Email không tồn tại trong hệ thống');
            }

            // Mô phỏng gửi mã xác nhận (trong ứng dụng thực tế sẽ gửi email)
            console.log('Đã tìm thấy user, mô phỏng gửi mã xác nhận đến email:', email);

            // Tạo và lưu mã xác nhận (trong ứng dụng thực tế sẽ có API riêng)
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Trong thực tế, cần lưu mã này vào server để xác thực sau
            // Tạm thời lưu vào localStorage cho mục đích demo
            localStorage.setItem('verificationCode', JSON.stringify({
                email: email,
                code: verificationCode,
                expiry: new Date(Date.now() + 15 * 60000).toISOString() // Hết hạn sau 15 phút
            }));

            console.log('Đã tạo mã xác nhận:', verificationCode);
            return { success: true, message: `Mã xác nhận đã được gửi đến email ${email}` };
        } catch (error) {
            console.error('Chi tiết lỗi quên mật khẩu:', error);
            throw error;
        }
    }

    // THÊM MỚI: Hàm hiển thị thông báo dùng Bootstrap Modal
    function showNotification(title, message, icon, callback) {
        // Cập nhật tiêu đề modal nếu có
        if (title) {
            $('#notificationModalLabel').text(title);
        }

        // Tạo nội dung modal với biểu tượng
        let iconHtml = '';
        let iconColor = '';

        if (icon === 'success') {
            iconHtml = '<i class="bi bi-check-circle-fill me-2"></i>'; // Bootstrap Icons
            iconColor = 'text-success';
        } else if (icon === 'error') {
            iconHtml = '<i class="bi bi-x-circle-fill me-2"></i>'; // Bootstrap Icons
            iconColor = 'text-danger';
        } else if (icon === 'warning') {
            iconHtml = '<i class="bi bi-exclamation-triangle-fill me-2"></i>'; // Bootstrap Icons
            iconColor = 'text-warning';
        } else if (icon === 'info') {
            iconHtml = '<i class="bi bi-info-circle-fill me-2"></i>'; // Bootstrap Icons
            iconColor = 'text-info';
        }

        // Nếu không có Bootstrap Icons, dùng text đơn giản
        if (!$('link[href*="bootstrap-icons"]').length) {
            if (icon === 'success') {
                iconHtml = '<span class="text-success fw-bold me-2">✓</span>';
            } else if (icon === 'error') {
                iconHtml = '<span class="text-danger fw-bold me-2">✗</span>';
            } else if (icon === 'warning') {
                iconHtml = '<span class="text-warning fw-bold me-2">!</span>';
            } else if (icon === 'info') {
                iconHtml = '<span class="text-info fw-bold me-2">i</span>';
            }
        }

        // Cập nhật nội dung
        $('#notificationModalBody').html(`
        <div class="d-flex align-items-center ${iconColor}">
            ${iconHtml}
            <span>${message}</span>
        </div>
    `);

        // Lấy đối tượng modal
        const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));

        // Đăng ký callback nếu có
        if (typeof callback === 'function') {
            $('#notificationModal').one('hidden.bs.modal', callback);
        }

        // Hiển thị modal
        notificationModal.show();

        return notificationModal;
    }

    // THÊM MỚI: jQuery document ready cho trang quên mật khẩu
    $(document).ready(function () {
        // Xử lý form quên mật khẩu
        if ($('#forgotpassword-form').length) {
            console.log('Form quên mật khẩu đã được tìm thấy');

            // Áp dụng hiệu ứng cho input fields (sao chép từ login/register)
            $('.input').each(function () {
                $(this).on('blur', function () {
                    if ($(this).val().trim() != "") {
                        $(this).addClass('has-val');
                    } else {
                        $(this).removeClass('has-val');
                    }
                });
            });

            // Xử lý sự kiện submit của form quên mật khẩu
            $('#forgotpassword-form').submit(function (e) {
                e.preventDefault();
                console.log('Form quên mật khẩu đã được submit');

                const email = $('#email').val();
                console.log('Email đã nhập:', email);

                handleForgotPassword(email);
            });

            // Hàm xử lý quên mật khẩu
            async function handleForgotPassword(email) {
                console.log('Bắt đầu xử lý quên mật khẩu');

                try {
                    // Hiển thị trạng thái đang xử lý
                    const btn = $('#forgotpassword-btn');
                    btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...');

                    console.log('Gọi hàm forgotPassword');
                    const result = await forgotPassword(email);
                    console.log('Kết quả quên mật khẩu:', result);

                    // Hiển thị thông báo thành công bằng modal
                    showNotification(
                        'Thành công',
                        result.message,
                        'success',
                        function () {
                            // Callback sau khi đóng modal - có thể thêm chuyển hướng ở đây nếu cần
                            // window.location.href = 'verification.html';
                        }
                    );

                } catch (error) {
                    console.error('Lỗi trong quá trình xử lý quên mật khẩu:', error);

                    // Hiển thị thông báo lỗi bằng modal
                    showNotification(
                        'Lỗi',
                        error.message || 'Có lỗi xảy ra trong quá trình xử lý',
                        'error'
                    );

                } finally {
                    // Khôi phục trạng thái nút
                    $('#forgotpassword-btn').prop('disabled', false).text('Gửi mã xác nhận');
                }
            }
        }
    });
});