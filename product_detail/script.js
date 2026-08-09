// ============================================
// PRODUCT SIZE SELECTION
// ============================================
document.querySelectorAll('.size-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// ============================================
// BUY BUTTON FUNCTIONALITY
// ============================================
const buyBtn = document.getElementById('buyBtn');
const cartBtn = document.getElementById('cartBtn');

if (buyBtn) {
    buyBtn.addEventListener('click', function(e) {
        // Get selected size
        const selectedSize = document.querySelector('.size-btn.active');
        
        if (!selectedSize) {
            alert('Por favor, selecciona una talla');
            return;
        }

        const size = selectedSize.getAttribute('data-size');
        const product = {
            name: 'OBSIDIAN CORE HOODIE',
            price: 240.00,
            size: size,
            image: 'https://via.placeholder.com/400x500?text=OBSIDIAN+CORE+HOODIE'
        };

        // Add to cart (localStorage)
        addToCart(product);

        // Show confirmation
        const originalText = buyBtn.textContent;
        buyBtn.textContent = '✓ AGREGADO AL CARRITO';
        buyBtn.style.backgroundColor = '#2a2a2a';
        buyBtn.style.color = '#fff';

        setTimeout(() => {
            buyBtn.textContent = originalText;
            buyBtn.style.backgroundColor = '#ffffff';
            buyBtn.style.color = '#0a0a0a';
        }, 2000);
    });
}

// ============================================
// CART MANAGEMENT
// ============================================
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function getCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    return cart.length;
}

function updateCartCount() {
    const count = getCartCount();
    // You can update a cart counter badge here if needed
    console.log('Carrito actualizado:', count);
}

// ============================================
// CART BUTTON
// ============================================
if (cartBtn) {
    cartBtn.addEventListener('click', function() {
        const count = getCartCount();
        if (count > 0) {
            console.log(`Ir al carrito con ${count} producto(s)`);
            // Aquí podrías redirigir a una página de carrito
            // window.location.href = '/carrito';
        }
    });
}

// ============================================
// SMOOTH SCROLL BEHAVIOR
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// IMAGE LAZY LOADING & PLACEHOLDER
// ============================================
function handleImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Fallback for broken images
        img.addEventListener('error', function() {
            this.style.display = 'block';
            this.style.width = '100%';
            this.style.height = '100%';
            this.style.backgroundColor = '#1a1a1a';
        });

        // If image is already loaded
        if (img.complete) {
            img.dispatchEvent(new Event('load'));
        }
    });
}

// Initialize image loading
document.addEventListener('DOMContentLoaded', handleImageLoading);

// ============================================
// ANIMATE ELEMENTS ON SCROLL
// ============================================
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe product cards and sections
    document.querySelectorAll('.product-card, .craft-container, .accessories-grid').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize observer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeElements);
} else {
    observeElements();
}

// ============================================
// PRODUCT CARD HOVER EFFECTS
// ============================================
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const image = this.querySelector('.product-card-image');
        if (image) {
            image.style.transform = 'scale(1.05)';
            image.style.transition = 'transform 0.3s ease';
        }
    });

    card.addEventListener('mouseleave', function() {
        const image = this.querySelector('.product-card-image');
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
});

// ============================================
// NAV LINK HIGHLIGHTING
// ============================================
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active state from all links
        document.querySelectorAll('.nav-link').forEach(l => {
            l.style.opacity = '1';
        });
        
        // Add active state to clicked link
        this.style.opacity = '0.5';
    });
});

// ============================================
// HEADER SHADOW ON SCROLL
// ============================================
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.borderBottomColor = '#333';
        header.style.backgroundColor = 'rgba(10, 10, 10, 0.95)';
    } else {
        header.style.borderBottomColor = '#222';
        header.style.backgroundColor = '#0a0a0a';
    }
});

// ============================================
// SIZE BUTTON KEYBOARD NAVIGATION
// ============================================
document.querySelectorAll('.size-btn').forEach((btn, index) => {
    btn.addEventListener('keydown', function(e) {
        const buttons = document.querySelectorAll('.size-btn');
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIndex = (index + 1) % buttons.length;
            buttons[nextIndex].focus();
            buttons[nextIndex].click();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIndex = (index - 1 + buttons.length) % buttons.length;
            buttons[prevIndex].focus();
            buttons[prevIndex].click();
        }
    });
});

// ============================================
// PRODUCT GALLERY SIMULATION
// ============================================
const productImage = document.querySelector('.product-image');
let currentImageIndex = 0;

// Simulated gallery images (in a real app, these would come from the server)
const galleryImages = [
    'https://via.placeholder.com/400x500?text=OBSIDIAN+CORE+HOODIE+1',
    'https://via.placeholder.com/400x500?text=OBSIDIAN+CORE+HOODIE+2',
    'https://via.placeholder.com/400x500?text=OBSIDIAN+CORE+HOODIE+3'
];

if (productImage) {
    productImage.addEventListener('click', function() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        this.src = galleryImages[currentImageIndex];
        
        // Add fade animation
        this.style.opacity = '0.5';
        setTimeout(() => {
            this.style.opacity = '1';
        }, 150);
    });
    
    productImage.style.cursor = 'pointer';
    productImage.style.transition = 'opacity 0.3s ease';
}

// ============================================
// INITIALIZE APP
// ============================================
console.log('24/SIETE Product Detail Page loaded');
