// Cấu hình API URLs
const API_BASE_URL = 'https://67ff87cd58f18d7209f19525.mockapi.io/api/v1';
const GET_USERS_API = API_BASE_URL + '/users';
const CREATE_USER_API = API_BASE_URL + '/users';
const UPDATE_USER_API = API_BASE_URL + '/users/{id}';
const DELETE_USER_API = API_BASE_URL + '/users/{id}';

// Các biến toàn cục
let currentPage = 1;
let itemsPerPage = 10;
let totalItems = 0;
let totalPages = 0;
let searchKeyword = '';
let usersList = [];
let isEditMode = false;

// Các modals
const userModal = new bootstrap.Modal(document.getElementById('userModal'));
const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

// Khi tài liệu đã sẵn sàng
$(document).ready(function () {
    // Khởi tạo
    loadUsers();
    setupEventListeners();
});

// Thiết lập các sự kiện lắng nghe
function setupEventListeners() {
    // Nút thêm người dùng
    $('#addUserBtn').on('click', function () {
        showAddUserModal();
    });

    // Nút lưu người dùng (thêm hoặc cập nhật)
    $('#saveUserBtn').on('click', function () {
        if (validateForm()) {
            saveUser();
        }
    });

    // Nút tìm kiếm
    $('#searchBtn').on('click', function () {
        searchUsers();
    });

    // Tìm kiếm khi nhấn Enter
    $('#searchInput').on('keyup', function (e) {
        if (e.key === 'Enter') {
            searchUsers();
        }
    });

    // Thay đổi số lượng hiển thị trên mỗi trang
    $('#itemsPerPage').on('change', function () {
        itemsPerPage = parseInt($(this).val());
        currentPage = 1;
        loadUsers();
    });

    // Chuyển đổi hiển thị mật khẩu
    $('#togglePassword').on('click', function () {
        const passwordInput = $('#userPassword');
        const icon = $(this).find('i');

        if (passwordInput.attr('type') === 'password') {
            passwordInput.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            passwordInput.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    // Xác nhận xóa người dùng
    $('#confirmDeleteBtn').on('click', function () {
        deleteUser();
    });
}

// Tải danh sách người dùng từ API
function loadUsers() {
    showLoading();

    let url = `${GET_USERS_API}?page=${currentPage}&limit=${itemsPerPage}`;
    if (searchKeyword) {
        url += `&search=${encodeURIComponent(searchKeyword)}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();

            // Lưu dữ liệu người dùng
            usersList = data.users || data.data || data.items || data;
            totalItems = data.totalItems || data.total || data.count || usersList.length;
            totalPages = data.totalPages || Math.ceil(totalItems / itemsPerPage);

            // Hiển thị dữ liệu
            renderUsers(usersList);
            renderPagination();
        })
        .catch(error => {
            hideLoading();
            console.error('Error loading users:', error);

            // Dữ liệu mẫu để hiển thị khi API gặp lỗi
            showAlert('Không thể tải dữ liệu người dùng. Vui lòng thử lại sau.', 'danger');

            // Hiển thị dữ liệu mẫu cho mục đích demo
            const sampleUsers = getSampleUsers();
            usersList = sampleUsers;
            totalItems = sampleUsers.length;
            totalPages = Math.ceil(totalItems / itemsPerPage);

            renderUsers(sampleUsers);
            renderPagination();
        });
}

// Hiển thị danh sách người dùng
function renderUsers(users) {
    const tableBody = $('#userTableBody');
    tableBody.empty();

    if (users.length === 0) {
        $('#noDataMessage').removeClass('d-none');
        $('.table-responsive, .pagination').addClass('d-none');
        return;
    }

    $('#noDataMessage').addClass('d-none');
    $('.table-responsive, .pagination').removeClass('d-none');

    let start = (currentPage - 1) * itemsPerPage;
    let end = Math.min(start + itemsPerPage, users.length);
    let displayedUsers = users;

    // Nếu chúng ta đã có phân trang từ phía server, hiển thị tất cả người dùng đã nhận được
    if (users.length <= itemsPerPage) {
        start = 0;
        end = users.length;
    }

    for (let i = 0; i < displayedUsers.length; i++) {
        const user = displayedUsers[i];
        const rowNum = start + i + 1;

        // Tạo lớp CSS cho vai trò
        let roleClass = '';
        switch (user.role?.toLowerCase() || 'user') {
            case 'admin':
                roleClass = 'role-admin';
                break;
            case 'editor':
                roleClass = 'role-editor';
                break;
            default:
                roleClass = 'role-user';
                break;
        }

        // Định dạng ngày tạo
        const createdAt = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString('vi-VN')
            : 'N/A';

        // Tạo avatar bằng chữ cái đầu của tên
        const nameInitial = (user.name || '').charAt(0).toUpperCase();

        const row = `
              <tr class="fade-in">
                  <td>${rowNum}</td>
                  <td>
                      <div class="d-flex align-items-center">
                          <div class="user-avatar me-2">${nameInitial}</div>
                          ${user.name || 'Không có tên'}
                      </div>
                  </td>
                  <td>${user.email || 'Không có email'}</td>
                  <td><span class="badge user-role ${roleClass}">${user.role || 'user'}</span></td>
                  <td>${createdAt}</td>
                  <td class="text-center actions-column">
                      <button class="btn btn-sm btn-primary btn-action me-1" onclick="showEditUserModal(${user.id})">
                          <i class="fas fa-edit"></i> Sửa
                      </button>
                      <button class="btn btn-sm btn-danger btn-action" onclick="showDeleteConfirmation(${user.id})">
                          <i class="fas fa-trash"></i> Xóa
                      </button>
                  </td>
              </tr>
          `;

        tableBody.append(row);
    }
}

// Hiển thị phân trang
function renderPagination() {
    const paginationElement = $('#pagination');
    paginationElement.empty();

    if (totalPages <= 1) {
        return;
    }

    // Nút Previous
    const prevDisabled = currentPage === 1 ? 'disabled' : '';
    paginationElement.append(`
          <li class="page-item ${prevDisabled}">
              <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                  <i class="fas fa-chevron-left"></i>
              </a>
          </li>
      `);

    // Xác định số trang hiển thị
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
        startPage = Math.max(1, endPage - 4);
    }

    // Nút trang đầu (nếu không bao gồm trang 1)
    if (startPage > 1) {
        paginationElement.append(`
              <li class="page-item">
                  <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
              </li>
          `);

        if (startPage > 2) {
            paginationElement.append(`
                  <li class="page-item disabled">
                      <a class="page-link" href="#">...</a>
                  </li>
              `);
        }
    }

    // Các nút trang giữa
    for (let i = startPage; i <= endPage; i++) {
        const active = i === currentPage ? 'active' : '';
        paginationElement.append(`
              <li class="page-item ${active}">
                  <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
              </li>
          `);
    }

    // Nút trang cuối (nếu không bao gồm trang cuối)
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationElement.append(`
                  <li class="page-item disabled">
                      <a class="page-link" href="#">...</a>
                  </li>
              `);
        }

        paginationElement.append(`
              <li class="page-item">
                  <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
              </li>
          `);
    }

    // Nút Next
    const nextDisabled = currentPage === totalPages ? 'disabled' : '';
    paginationElement.append(`
          <li class="page-item ${nextDisabled}">
              <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                  <i class="fas fa-chevron-right"></i>
              </a>
          </li>
      `);
}

// Chuyển đến trang được chọn
function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) {
        return;
    }

    currentPage = page;
    loadUsers();
}

// Tìm kiếm người dùng
function searchUsers() {
    searchKeyword = $('#searchInput').val().trim();
    currentPage = 1;
    loadUsers();
}

// Hiển thị modal thêm người dùng
function showAddUserModal() {
    isEditMode = false;
    $('#userModalLabel').text('Thêm Người dùng Mới');
    $('#userForm')[0].reset();
    $('#userId').val('');
    $('#passwordContainer').show();
    $('#passwordRequired').show();
    $('#userPassword').attr('required', true);

    userModal.show();
}

// Hiển thị modal chỉnh sửa người dùng
function showEditUserModal(userId) {
    isEditMode = true;
    $('#userModalLabel').text('Chỉnh Sửa Người dùng');
    $('#userForm')[0].reset();

    const user = usersList.find(u => u.id === userId);
    if (!user) return;

    $('#userId').val(user.id);
    $('#userName').val(user.name || '');
    $('#userEmail').val(user.email || '');
    $('#userRole').val(user.role || 'user');
    $('#passwordContainer').show();
    $('#passwordRequired').hide();
    $('#userPassword').attr('required', false);

    userModal.show();
}

// Hiển thị modal xác nhận xóa
function showDeleteConfirmation(userId) {
    $('#confirmDeleteBtn').data('userId', userId);
    deleteModal.show();
}

// Xác thực form
function validateForm() {
    const form = $('#userForm')[0];

    if (!form.checkValidity()) {
        $(form).find(':input').each(function () {
            if (!this.validity.valid) {
                $(this).addClass('is-invalid');
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        return false;
    }

    return true;
}

// Lưu người dùng (thêm mới hoặc cập nhật)
function saveUser() {
    showLoading();

    const userId = $('#userId').val();
    const userData = {
        name: $('#userName').val(),
        email: $('#userEmail').val(),
        role: $('#userRole').val()
    };

    const password = $('#userPassword').val();
    if (password) {
        userData.password = password;
    }

    let url, method;

    if (isEditMode) {
        // Cập nhật người dùng hiện có
        url = UPDATE_USER_API.replace('{id}', userId);
        method = 'PUT';
    } else {
        // Thêm người dùng mới
        url = CREATE_USER_API;
        method = 'POST';
    }

    fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            userModal.hide();

            const message = isEditMode
                ? 'Người dùng đã được cập nhật thành công!'
                : 'Người dùng mới đã được thêm thành công!';

            showAlert(message, 'success');
            loadUsers();
        })
        .catch(error => {
            hideLoading();
            console.error('Error saving user:', error);

            // Giả lập thành công để demo
            userModal.hide();

            const message = isEditMode
                ? 'Đã cập nhật người dùng (chế độ demo)'
                : 'Đã thêm người dùng mới (chế độ demo)';

            showAlert(message, 'success');

            // Cập nhật dữ liệu mẫu
            if (isEditMode) {
                const userIndex = usersList.findIndex(u => u.id === parseInt(userId));
                if (userIndex !== -1) {
                    usersList[userIndex] = {
                        ...usersList[userIndex],
                        name: userData.name,
                        email: userData.email,
                        role: userData.role
                    };
                }
            } else {
                // Thêm người dùng mới vào danh sách mẫu
                const newId = Math.max(...usersList.map(u => u.id), 0) + 1;
                usersList.unshift({
                    id: newId,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    createdAt: new Date().toISOString()
                });
            }

            renderUsers(usersList);
        });
}

// Xóa người dùng
function deleteUser() {
    showLoading();

    const userId = $('#confirmDeleteBtn').data('userId');
    const url = DELETE_USER_API.replace('{id}', userId);

    fetch(url, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            deleteModal.hide();

            showAlert('Người dùng đã được xóa thành công!', 'success');
            loadUsers();
        })
        .catch(error => {
            hideLoading();
            console.error('Error deleting user:', error);

            // Giả lập xóa để demo
            deleteModal.hide();

            showAlert('Người dùng đã được xóa (chế độ demo)', 'success');

            // Cập nhật dữ liệu mẫu
            usersList = usersList.filter(u => u.id !== parseInt(userId));
            renderUsers(usersList);
        });
}