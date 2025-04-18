$(document).ready(function () {
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
        
        if($('body').hasClass('dark-mode')) {
            $(this).html('<i class="fas fa-sun"></i> Chế độ sáng');
        } else {
            $(this).html('<i class="fas fa-moon"></i> Chế độ tối');
        }
    });

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
});