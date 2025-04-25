document.addEventListener('DOMContentLoaded', function() {
    // Preloader Animation
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.preloader__progress__bar');
    
    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Hide preloader when loading is complete
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                
                // Initialize animations after preloader is hidden
                initAnimations();
            }, 500);
        }
        progressBar.style.width = `${progress}%`;
    }, 300);

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Smooth transition
        body.style.transition = 'background-color 0.5s ease';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const icon = this.querySelector('i');
        if (newTheme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
            this.setAttribute('title', 'Chế độ sáng');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            this.setAttribute('title', 'Chế độ tối');
        }
        
        // Reset transition after change
        setTimeout(() => {
            body.style.transition = '';
        }, 500);
    });

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        const icon = themeToggle.querySelector('i');
        if (savedTheme === 'dark') {
            icon.classList.replace('fa-moon', 'fa-sun');
            themeToggle.setAttribute('title', 'Chế độ sáng');
        }
    }

    // Custom Cursor
    const cursorOuter = document.querySelector('.cursor--outer');
    const cursorInner = document.querySelector('.cursor--inner');
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        cursorOuter.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
        cursorInner.style.transform = `translate3d(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%), 0)`;
    });

    // Magnetic Effect
    magneticElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const distanceX = x - centerX;
            const distanceY = y - centerY;
            
            gsap.to(this, {
                x: distanceX * 0.2,
                y: distanceY * 0.2,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        element.addEventListener('mouseleave', function() {
            gsap.to(this, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });

    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
    });

    // Initialize Animations
    function initAnimations() {
        // GSAP Animations
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero Title Animation
        gsap.from('.hero__title .line', {
            y: '100%',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.1,
            delay: 0.3
        });
        
        // Hero Content Animation
        gsap.from('.hero__text, .hero .btn', {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.2,
            delay: 0.8
        });
        
        // Section Headers Animation
        gsap.from('.section-header', {
            scrollTrigger: {
                trigger: '.section-header',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power2.out'
        });
        
        // Category Cards Animation
        gsap.from('.category-card', {
            scrollTrigger: {
                trigger: '.categories',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1
        });
        
        // Product Cards Animation
        gsap.from('.product-card', {
            scrollTrigger: {
                trigger: '.products',
                start: 'top 70%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            duration: 0.6,
            ease: 'power2.out',
            stagger: 0.1
        });
        
        // 3D Product Viewer
        init3DViewer();
        
        // Floating Particles
        initParticles();
    }

    // 3D Product Viewer
    function init3DViewer() {
        const container = document.getElementById('product-viewer');
        if (!container) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Product Model
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x5e72e4,
            roughness: 0.2,
            metalness: 0.7
        });
        const product = new THREE.Mesh(geometry, material);
        scene.add(product);
        
        camera.position.z = 5;
        
        // Mouse Rotation
        let mouseX = 0;
        let mouseY = 0;
        
        container.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        // Animation Loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate product based on mouse position
            product.rotation.y = mouseX * 0.5;
            product.rotation.x = mouseY * 0.5;
            
            renderer.render(scene, camera);
        }
        
        // Handle Window Resize
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
        
        animate();
    }

    // Floating Particles
    function initParticles() {
        const container = document.getElementById('particles-js');
        if (!container) return;
        
        // Configuration
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#5e72e4"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#5e72e4",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    // Product Color Change
    const colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Here you would change the product color
            // For demo, we'll just log the selected color
            console.log('Selected color:', this.style.backgroundColor);
        });
    });

    // Quick View Modal
    const quickViewBtns = document.querySelectorAll('[data-tooltip="Xem nhanh"]');
    const quickView = document.getElementById('quick-view');
    const quickViewClose = document.querySelector('.quick-view__close');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            quickView.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Here you would load the product data via AJAX
            // For demo, we'll just show the modal
        });
    });
    
    quickViewClose.addEventListener('click', function() {
        quickView.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    quickView.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Add to Cart Animation
    const addToCartBtns = document.querySelectorAll('.product-card__add');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animation effect
            const btnRect = this.getBoundingClientRect();
            const flyingItem = document.createElement('div');
            flyingItem.style.position = 'fixed';
            flyingItem.style.left = btnRect.left + 'px';
            flyingItem.style.top = btnRect.top + 'px';
            flyingItem.style.width = '20px';
            flyingItem.style.height = '20px';
            flyingItem.style.backgroundColor = '#f5365c';
            flyingItem.style.borderRadius = '50%';
            flyingItem.style.zIndex = '9999';
            flyingItem.style.transition = 'all 0.5s ease-in-out';
            document.body.appendChild(flyingItem);
            
            // Get cart position
            const cartBtn = document.querySelector('.cart-btn');
            const cartRect = cartBtn.getBoundingClientRect();
            
            // Animate
            setTimeout(() => {
                flyingItem.style.left = cartRect.left + 'px';
                flyingItem.style.top = cartRect.top + 'px';
                flyingItem.style.transform = 'scale(0.1)';
                flyingItem.style.opacity = '0';
            }, 10);
            
            // Remove after animation
            setTimeout(() => {
                flyingItem.remove();
                
                // Update cart count
                const countElement = document.querySelector('.cart-btn .count');
                let count = parseInt(countElement.textContent);
                countElement.textContent = count + 1;
                
                // Show added notification
                const notification = document.createElement('div');
                notification.textContent = 'Đã thêm vào giỏ hàng!';
                notification.style.position = 'fixed';
                notification.style.bottom = '20px';
                notification.style.left = '50%';
                notification.style.transform = 'translateX(-50%)';
                notification.style.backgroundColor = '#2dce89';
                notification.style.color = '#fff';
                notification.style.padding = '10px 20px';
                notification.style.borderRadius = '4px';
                notification.style.zIndex = '9999';
                notification.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                notification.style.animation = 'slideUp 0.3s ease-out';
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.animation = 'slideDown 0.3s ease-out';
                    setTimeout(() => {
                        notification.remove();
                    }, 300);
                }, 2000);
            }, 500);
        });
    });

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
});

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const mainMenu = document.querySelector('.main-menu');

menuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    mainNav.classList.toggle('active');
    document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
});

// Mobile Submenu Toggle
if (window.innerWidth < 992) {
    const menuItemsWithChildren = document.querySelectorAll('.menu-item-has-children');
    
    menuItemsWithChildren.forEach(item => {
        const link = item.querySelector('.menu-link');
        
        link.addEventListener('click', function(e) {
            if (mainNav.classList.contains('active')) {
                e.preventDefault();
                item.classList.toggle('active');
            }
        });
    });
}

// Dropdown Menus
const actionItems = document.querySelectorAll('.action-item');
actionItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.querySelector('.search-dropdown, .account-menu, .cart-menu').classList.add('active');
    });
    
    item.addEventListener('mouseleave', function() {
        this.querySelector('.search-dropdown, .account-menu, .cart-menu').classList.remove('active');
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.action-item')) {
        document.querySelectorAll('.search-dropdown, .account-menu, .cart-menu').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});

// Cart Item Remove
const cartItemRemoveBtns = document.querySelectorAll('.cart-item-remove');
cartItemRemoveBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        const cartItem = this.closest('.cart-item');
        cartItem.style.opacity = '0';
        cartItem.style.height = '0';
        cartItem.style.padding = '0';
        cartItem.style.margin = '0';
        setTimeout(() => {
            cartItem.remove();
            // Update cart count and total here
        }, 300);
    });
});

// Sticky Header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Search Toggle for Mobile
const searchToggle = document.querySelector('.search-toggle');
const searchDropdown = document.querySelector('.search-dropdown');

if (window.innerWidth < 992) {
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchDropdown.classList.toggle('active');
    });
}

// Close search when clicking outside on mobile
document.addEventListener('click', function(e) {
    if (window.innerWidth < 992 && !e.target.closest('.search-box')) {
        searchDropdown.classList.remove('active');
    }
});