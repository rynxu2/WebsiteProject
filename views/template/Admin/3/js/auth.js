const API_URL = 'https://66434cf76c6a656587067972.mockapi.io/api/v1';

// Đăng nhập
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) throw new Error('Không thể kết nối đến server');
        
        const users = await response.json();
        const user = users.find(u => u.email === email && u.password === password);
        
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

// Đăng ký
async function register(name, email, password, avatar) {
    try {
        const checkResponse = await fetch(`${API_URL}/users?email=${email}`);
        
        if (!checkResponse.ok) {
            if (checkResponse.status === 404) {
              console.log('Email chưa được sử dụng');
            } else {
              throw new Error(`Lỗi server: ${checkResponse.status}`);
            }
          } else {
            const existingUsers = await checkResponse.json();
            console.log('Existing users:', existingUsers);
        
            if (existingUsers.length > 0) {
              throw new Error('Email đã được sử dụng');
            }
          }
        
        const newUser = {
            'name': name,
            'avatar': avatar,
            'email': email,
            'password': password,
            'createdAt': (createdAt = new Date().toISOString())
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

// Xử lý form đăng nhập
$(document).ready(function() {
    if ($('#loginForm').length) {
        $('#loginForm').submit(async function(e) {
            e.preventDefault();
            const email = $('#email').val();
            const password = $('#password').val();
            
            try {
                const btn = $('#loginBtn');
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
                $('#loginBtn').prop('disabled', false).text('Đăng nhập');
            }
        });
    }
    
    // Xử lý form đăng ký
    if ($('#registerForm').length) {
        $('#registerForm').submit(async function(e) {
            e.preventDefault();
            const name = $('#name').val();
            const email = $('#email').val();
            const password = $('#password').val();
            const confirmPassword = $('#confirmPassword').val();
            const avatar = $('#avatar').val();
            
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
                    window.location.href = 'login.html';
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
});