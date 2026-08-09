// ============================================
// CART DRAWER - SHARED LOGIC
// ============================================

class CartDrawer {
  constructor() {
    this.drawer = null;
    this.overlay = null;
    this.cartBtn = null;
    this.closeBtn = null;
    this.isOpen = false;
    
    this.init();
  }

  init() {
    // Create drawer HTML if it doesn't exist
    this.createDrawerHTML();
    
    // Get references to elements
    this.drawer = document.querySelector('.cart-drawer');
    this.overlay = document.querySelector('.cart-drawer-overlay');
    this.cartBtn = document.querySelector('[aria-label="Carrito"]');
    this.closeBtn = document.querySelector('.cart-drawer-close');
    this.checkoutBtn = document.querySelector('.cart-checkout-btn');
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Render initial state
    this.renderCart();
  }

  createDrawerHTML() {
    // Check if drawer already exists
    if (document.querySelector('.cart-drawer')) {
      return;
    }

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'cart-drawer-overlay';
    document.body.appendChild(overlay);

    // Create drawer
    const drawer = document.createElement('div');
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-drawer-header">
        <h2 class="cart-drawer-title">RESUMEN DE ORDEN</h2>
        <button class="cart-drawer-close" aria-label="Cerrar carrito">×</button>
      </div>

      <div class="cart-drawer-content">
        <div class="cart-items-list"></div>
      </div>

      <div class="cart-drawer-footer">
        <div class="cart-summary">
          <div class="cart-summary-row subtotal">
            <span class="cart-summary-label">SUBTOTAL</span>
            <span class="cart-summary-value">$0.00</span>
          </div>
          <div class="cart-summary-row shipping">
            <span class="cart-summary-label">ENVÍO</span>
            <span class="cart-summary-value">GRATIS</span>
          </div>
          <div class="cart-summary-row total">
            <span class="cart-summary-label">TOTAL</span>
            <span class="cart-summary-value">$0.00</span>
          </div>
        </div>
        <button class="cart-checkout-btn">FINALIZAR COMPRA</button>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  setupEventListeners() {
    // Open cart
    if (this.cartBtn) {
      this.cartBtn.addEventListener('click', () => this.open());
    }

    // Close cart
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Go to checkout
    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        const items = this.getCartItems();
        if (items.length === 0) return;
        this.close();
        window.location.href = this.getCheckoutUrl();
      });
    }

    // Close on overlay click
    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.close());
    }

    // Prevent closing when clicking inside drawer
    if (this.drawer) {
      this.drawer.addEventListener('click', (e) => e.stopPropagation());
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.drawer.classList.add('active');
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.drawer.classList.remove('active');
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  renderCart() {
    const cartItems = this.getCartItems();
    const itemsList = document.querySelector('.cart-items-list');
    
    if (!itemsList) return;

    // Clear current items
    itemsList.innerHTML = '';

    if (cartItems.length === 0) {
      // Show empty state
      itemsList.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <div class="cart-empty-text">Tu carrito está vacío</div>
          <div class="cart-empty-subtext">Explora nuestras colecciones</div>
        </div>
      `;
    } else {
      // Render items
      cartItems.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <div class="cart-item-image">
            <img src="https://via.placeholder.com/80x80?text=Item${index + 1}" alt="${item.name}" />
          </div>
          <div class="cart-item-details">
            <div>
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-size">TALLA: ${item.size || 'M'}</div>
            </div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
          </div>
        `;
        itemsList.appendChild(itemElement);
      });
    }

    // Update summary
    this.updateSummary(cartItems);
    this.updateBadge();
  }

  updateBadge() {
    const count = this.getCartItems().length;
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;

    if (count > 0) {
      badge.hidden = false;
      badge.textContent = count > 99 ? '99+' : count;
    } else {
      badge.hidden = true;
    }
  }

  getCheckoutUrl() {
    const path = window.location.pathname;
    const inSubdir = /^\/[^/]+\//.test(path) && !path.replace(/\?.*/, '').endsWith('/');
    return inSubdir ? '../checkout/index.html' : 'checkout/index.html';
  }

  updateSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const total = subtotal; // Shipping is free in this example

    const subtotalEl = document.querySelector('.cart-summary-row.subtotal .cart-summary-value');
    const totalEl = document.querySelector('.cart-summary-row.total .cart-summary-value');

    if (subtotalEl) {
      subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    }
    if (totalEl) {
      totalEl.textContent = `$${total.toFixed(2)}`;
    }
  }

  getCartItems() {
    // This would typically come from localStorage or a state management system
    // For now, return mock data or empty array
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  }

  addItem(item) {
    try {
      const cart = this.getCartItems();
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      this.renderCart();
      this.open();
    } catch {
      console.error('Error adding item to cart');
    }
  }

  clearCart() {
    try {
      localStorage.setItem('cart', JSON.stringify([]));
      this.renderCart();
    } catch {
      console.error('Error clearing cart');
    }
  }
}

// Initialize cart drawer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cartDrawer = new CartDrawer();
  });
} else {
  window.cartDrawer = new CartDrawer();
}
