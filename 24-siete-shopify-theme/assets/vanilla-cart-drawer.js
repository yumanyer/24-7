// ============================================
// CART DRAWER - SHARED LOGIC
// In the Shopify theme this drawer is backed by
// the real Shopify cart (/cart.js, /cart/add.js).
// ============================================

class CartDrawer {
  constructor() {
    this.drawer = null;
    this.overlay = null;
    this.cartBtn = null;
    this.closeBtn = null;
    this.isOpen = false;

    this.shopifyCartItems = null;
    this._refreshing = null;

    this.init();
  }

  init() {
    // Create drawer HTML if it doesn't exist
    this.createDrawerHTML();

    // Get references to elements
    this.drawer = document.querySelector('.cart-drawer');
    this.overlay = document.querySelector('.cart-drawer-overlay');
    this.cartBtn =
      document.querySelector('[data-cart-trigger]') || document.querySelector('[aria-label="Carrito"]');
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
    if (!this.drawer) return;
    this.drawer.classList.add('active');
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Keep the drawer in sync with the real Shopify cart.
    if (window.routes && window.routes.cart_url) {
      this.refreshFromServer();
    }
  }

  close() {
    this.isOpen = false;
    if (!this.drawer) return;
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

  /* ---------------------------------------------------------------
     Rendering (works with either localStorage mock items from the
     prototype or real Shopify line items).
     --------------------------------------------------------------- */
  renderCart() {
    const cartItems = this.getCartItems();
    const itemsList = document.querySelector('.cart-items-list');
    if (!itemsList) return;

    if (cartItems.length === 0) {
      this.renderEmptyState(itemsList);
    } else {
      this.renderItems(itemsList, cartItems);
    }

    this.updateSummary(cartItems);
    this.updateBadge(cartItems.length);
  }

  renderEmptyState(itemsList) {
    itemsList.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <div class="cart-empty-text">Tu carrito está vacío</div>
        <div class="cart-empty-subtext">Explora nuestras colecciones</div>
      </div>
    `;
  }

  renderItems(itemsList, cartItems) {
    itemsList.innerHTML = '';

    cartItems.forEach((item) => {
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';

      const name = item.product_title || item.name || item.title || 'Producto';
      const image = this.getItemImage(item);
      const variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? item.variant_title : '';
      const quantity = item.quantity || 1;
      const linePrice = item.final_line_price || item.line_price || item.price || 0;

      const sizeLine = [variantTitle ? `TALLA: ${this.escapeHtml(variantTitle)}` : '', quantity > 1 ? `× ${quantity}` : '']
        .filter(Boolean)
        .join(' ');

      itemElement.innerHTML = `
        <div class="cart-item-image">
          <img src="${image}" alt="${this.escapeHtml(name)}" />
        </div>
        <div class="cart-item-details">
          <div>
            <div class="cart-item-name">${this.escapeHtml(name)}</div>
            <div class="cart-item-size">${sizeLine}</div>
          </div>
          <div class="cart-item-price">${this.formatMoney(linePrice)}</div>
        </div>
      `;
      itemsList.appendChild(itemElement);
    });
  }

  getItemImage(item) {
    if (item.featured_image) {
      if (typeof item.featured_image === 'string') return item.featured_image;
      if (item.featured_image.url) return item.featured_image.url;
    }
    if (item.image && typeof item.image === 'string') return item.image;
    return 'https://via.placeholder.com/80x80?text=24%2F7';
  }

  updateBadge(count) {
    const badge = document.querySelector('.cart-badge');
    if (!badge) return;

    const items = typeof count === 'number' ? count : this.getCartItems().length;
    if (items > 0) {
      badge.hidden = false;
      badge.textContent = items > 99 ? '99+' : items;
    } else {
      badge.hidden = true;
    }
  }

  getCheckoutUrl() {
    if (window.routes && window.routes.cart_url) {
      return '/checkout';
    }
    const path = window.location.pathname;
    const inSubdir = /^\/[^/]+\//.test(path) && !path.replace(/\?.*/, '').endsWith('/');
    return inSubdir ? '../checkout/index.html' : 'checkout/index.html';
  }

  updateSummary(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.final_line_price || item.line_price || item.price || 0), 0);
    const total = subtotal; // Shipping is free in this store

    const subtotalEl = document.querySelector('.cart-summary-row.subtotal .cart-summary-value');
    const totalEl = document.querySelector('.cart-summary-row.total .cart-summary-value');

    if (subtotalEl) subtotalEl.textContent = this.formatMoney(subtotal);
    if (totalEl) totalEl.textContent = this.formatMoney(total);
  }

  getCartItems() {
    // Real Shopify cart data takes precedence; falls back to the
    // localStorage list used by the standalone prototype pages.
    if (this.shopifyCartItems) return this.shopifyCartItems;

    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  }

  /* ---------------------------------------------------------------
     Shopify integration
     --------------------------------------------------------------- */
  refreshFromServer() {
    if (!window.routes || !window.routes.cart_url || this._refreshing) {
      return Promise.resolve();
    }

    this._refreshing = fetch(window.routes.cart_url + '.js', {
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
    })
      .then((response) => response.json())
      .then((cart) => {
        this.renderShopifyCart(cart);
      })
      .catch(() => {})
      .finally(() => {
        this._refreshing = null;
      });

    return this._refreshing;
  }

  renderShopifyCart(cart) {
    this.shopifyCartItems = (cart.items || []).map((item) => ({
      id: item.id,
      product_title: item.product_title,
      title: item.title,
      variant_title: item.variant_title,
      quantity: item.quantity,
      price: item.final_line_price || item.line_price || item.price,
      final_line_price: item.final_line_price || item.line_price || item.price,
      image: this.getItemImage(item),
    }));

    const itemsList = document.querySelector('.cart-items-list');
    if (!itemsList) return;

    if (this.shopifyCartItems.length === 0) {
      this.renderEmptyState(itemsList);
    } else {
      this.renderItems(itemsList, this.shopifyCartItems);
    }

    const subtotal = cart.items_subtotal_price || cart.total_price || 0;
    const subtotalEl = document.querySelector('.cart-summary-row.subtotal .cart-summary-value');
    const totalEl = document.querySelector('.cart-summary-row.total .cart-summary-value');
    if (subtotalEl) subtotalEl.textContent = this.formatMoney(subtotal);
    if (totalEl) totalEl.textContent = this.formatMoney(cart.total_price || subtotal);

    this.updateBadge(cart.item_count || this.shopifyCartItems.length);
  }

  /* ---------------------------------------------------------------
     Helpers
     --------------------------------------------------------------- */
  formatMoney(cents) {
    if (typeof window.formatMoney === 'function') {
      const moneyFormat =
        (document.querySelector('.vanilla-product-page') &&
          document.querySelector('.vanilla-product-page').dataset.moneyFormat) ||
        '${{amount}}';
      return window.formatMoney(cents, moneyFormat);
    }
    return `$${(cents / 100).toFixed(2)}`;
  }

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
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

/* ---------------------------------------------------------------
   Bridge element `<cart-drawer>`
   Dawn's product-form.js looks for `cart-notification` or
   `cart-drawer` to render the cart after /cart/add.js. We expose a
   tiny element that drives the vanilla drawer above.
   --------------------------------------------------------------- */
if (!customElements.get('cart-drawer')) {
  class VanillaCartDrawerBridge extends HTMLElement {
    getSectionsToRender() {
      return [];
    }

    setActiveElement(element) {
      this.activeElement = element;
    }

    open() {
      if (window.cartDrawer) window.cartDrawer.open();
    }

    close() {
      if (window.cartDrawer) window.cartDrawer.close();
    }

    renderContents(parsedState) {
      if (!window.cartDrawer) return;
      // Open immediately; refreshFromServer() replaces the stale content
      // with the authoritative cart once /cart.js responds.
      window.cartDrawer.open();
    }
  }

  customElements.define('cart-drawer', VanillaCartDrawerBridge);
}

// Initialize cart drawer when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.cartDrawer = new CartDrawer();
  });
} else {
  window.cartDrawer = new CartDrawer();
}