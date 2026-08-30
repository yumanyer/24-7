document.addEventListener('DOMContentLoaded', function () {
  const paymentButtons = document.querySelectorAll('.payment-option');
  paymentButtons.forEach((button) => {
    button.addEventListener('click', function () {
      paymentButtons.forEach((item) => item.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  function getCart() {
    try {
      const cart = localStorage.getItem('cart');
      return cart ? JSON.parse(cart) : [];
    } catch {
      return [];
    }
  }

  const itemsContainer = document.getElementById('summaryItems');
  const subtotalEl = document.querySelector('.js-subtotal');
  const totalEl = document.querySelector('.js-total');
  const finalizeBtn = document.getElementById('finalizeBtn');

  const items = getCart();
  const subtotal = items.reduce((sum, item) => sum + Number(item.price || 0), 0);

  if (items.length === 0) {
    if (itemsContainer) {
      itemsContainer.innerHTML = `
        <div class="summary-empty">
          <p>TU CARRITO ESTÁ VACÍO</p>
          <a href="../collection/index.html" class="summary-empty-link">IR AL CATÁLOGO →</a>
        </div>
      `;
    }
  } else {
    if (itemsContainer) {
      itemsContainer.innerHTML = items
        .map(
          (item, index) => `
        <div class="summary-item">
          <div class="summary-item-media">
            <img src="${item.image || 'https://via.placeholder.com/96x96?text=ITEM'}" alt="${item.name || 'Producto'}" />
          </div>
          <div class="summary-item-info">
            <div class="summary-item-title">${item.name || 'PRODUCTO'}</div>
            <div class="summary-item-meta">SIZE: ${item.size || 'M'}</div>
          </div>
          <div class="summary-item-price">$${Number(item.price || 0).toFixed(2)}</div>
        </div>
      `
        )
        .join('');
    }
  }

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

  if (finalizeBtn) {
    finalizeBtn.addEventListener('click', function () {
      if (items.length === 0) return;
      finalizeBtn.textContent = '✓ COMPRA REALIZADA';
      finalizeBtn.disabled = true;
      localStorage.setItem('cart', JSON.stringify([]));
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1500);
    });
  }
});
