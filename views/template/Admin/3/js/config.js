/**
 * config.js - Cấu hình hệ thống
 * Chứa các biến và cài đặt toàn cục cho ứng dụng
 */

// Cấu hình API URLs
const CONFIG = {
    API: {
        BASE_URL: 'https://67ff87cd58f18d7209f19525.mockapi.io/api/v1',
        ENDPOINTS: {
            USERS: '/users'
        },
        TIMEOUT: 10000, // Timeout sau 10 giây
        RETRY_ATTEMPTS: 2 // Số lần thử lại khi gọi API thất bại
    },
    
    PAGINATION: {
        DEFAULT_PAGE: 1,
        DEFAULT_ITEMS_PER_PAGE: 10,
        OPTIONS: [5, 10, 20, 50]
    },
    
    UI: {
        ALERT_TIMEOUT: 5000, // Thời gian hiển thị thông báo (ms)
        LOADING_FADE_DURATION: 200, // Thời gian hiệu ứng fade (ms)
        ANIMATION_DURATION: 300 // Thời gian animation (ms)
    },
    
    STORAGE: {
        DARK_MODE: 'darkMode',
        USER_SETTINGS: 'userSettings'
    }
};

// Xuất cấu hình để sử dụng trong các module khác
window.APP_CONFIG = CONFIG;