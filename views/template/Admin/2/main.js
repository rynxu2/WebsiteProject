$(document).ready(function() {
    // Preloader
    $(window).on('load', function() {
        $('.preloader').fadeOut('slow');
    });

    // Toggle Sidebar
    $('.sidebar-toggle').on('click', function() {
        $('body').toggleClass('sidebar-collapsed');
        
        // Store state in localStorage
        localStorage.setItem('sidebarCollapsed', $('body').hasClass('sidebar-collapsed'));
    });

    // Mobile Sidebar Toggle
    $('.mobile-sidebar-toggle').on('click', function() {
        $('body').toggleClass('sidebar-show');
    });

    // Check localStorage for sidebar state
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
        $('body').addClass('sidebar-collapsed');
    }

    // Dropdown Menu Toggle
    $('.has-dropdown > .nav-link').on('click', function(e) {
        if ($(window).width() > 992) {
            if ($('body').hasClass('sidebar-collapsed')) {
                e.preventDefault();
                $(this).parent().toggleClass('show');
            } else {
                e.preventDefault();
                $(this).parent().toggleClass('show');
                $(this).find('.dropdown-icon').toggleClass('fa-chevron-right fa-chevron-down');
            }
        } else {
            e.preventDefault();
            $(this).parent().toggleClass('show');
            $(this).find('.dropdown-icon').toggleClass('fa-chevron-right fa-chevron-down');
        }
    });

    // Initialize Tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();

    // Back to Top Button
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('.btn-back-to-top').addClass('show');
        } else {
            $('.btn-back-to-top').removeClass('show');
        }
    });

    $('.btn-back-to-top').click(function() {
        $('html, body').animate({scrollTop: 0}, 'smooth');
        return false;
    });

    // Close dropdown when clicking outside
    $(document).click(function(e) {
        if (!$(e.target).closest('.has-dropdown').length) {
            $('.has-dropdown').removeClass('show');
            $('.dropdown-icon').removeClass('fa-chevron-down').addClass('fa-chevron-right');
        }
    });

    // Initialize Charts
    initCharts();
});

// Chart Initialization
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
            datasets: [{
                label: 'Doanh thu',
                data: [3500, 4200, 3800, 4500, 5200, 6100, 7300, 6800, 7900, 8200, 8500, 9000],
                backgroundColor: 'rgba(115, 103, 240, 0.1)',
                borderColor: 'rgba(115, 103, 240, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: 'rgba(115, 103, 240, 1)',
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
                    backgroundColor: '#fff',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#eee',
                    borderWidth: 1,
                    padding: 10,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    callbacks: {
                        label: function(context) {
                            return '$' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    const categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: ['Điện tử', 'Thời trang', 'Gia dụng', 'Sách', 'Khác'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    'rgba(115, 103, 240, 0.8)',
                    'rgba(40, 199, 111, 0.8)',
                    'rgba(255, 159, 67, 0.8)',
                    'rgba(0, 207, 232, 0.8)',
                    'rgba(234, 84, 85, 0.8)'
                ],
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: '#fff',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#eee',
                    borderWidth: 1,
                    padding: 10,
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}