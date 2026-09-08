// ============================================
// VANILLA PRODUCT PAGE
// Gallery + real variant selection (Shopify data)
// ============================================

(function () {
  'use strict';

  var root = document.querySelector('.vanilla-product-page');
  if (!root) return;

  var sectionId = root.dataset.sectionId;

  /* ----------------------------------------------------------
     PRODUCT GALLERY: click the image to cycle through the real
     media attached to the product (product.media).
     ---------------------------------------------------------- */
  var imageContainer = root.querySelector('.product-image-container');
  var mediaList = root.querySelector('.product-media-list');
  var mediaItems = mediaList ? Array.from(mediaList.querySelectorAll('.product-media-item')) : [];

  function setActiveMedia(item) {
    mediaItems.forEach(function (el) {
      el.classList.remove('is-active');
    });
    item.classList.add('is-active');
  }

  if (mediaItems.length > 1 && mediaList) {
    if (imageContainer) imageContainer.classList.add('product-image-container--interactive');

    mediaList.addEventListener('click', function (event) {
      // Let native players work; only cycle when clicking away from them.
      if (event.target.closest('video, model-viewer, a, button')) return;

      var currentIndex = mediaItems.findIndex(function (item) {
        return item.classList.contains('is-active');
      });
      var nextIndex = (currentIndex + 1) % mediaItems.length;
      setActiveMedia(mediaItems[nextIndex]);
    });
  }

  /* ----------------------------------------------------------
     VARIANT CHANGE (real Shopify variants)
     Uses the theme's own <variant-selects> element. On change,
     finds the matching variant in the embedded product.variants
     JSON and syncs price, media, hidden input and button state.
     ---------------------------------------------------------- */
  var variantSelects = root.querySelector('variant-selects');
  var variants = [];
  var variantsScript = document.getElementById('VanillaProductVariants-' + sectionId);

  if (variantsScript) {
    try {
      variants = JSON.parse(variantsScript.textContent) || [];
    } catch (e) {
      variants = [];
    }
  }

  var priceEl = document.getElementById('price-' + sectionId);
  var comparePriceEl = document.getElementById('ComparePrice-' + sectionId);
  var productForm = root.querySelector('product-form');
  var idInput = root.querySelector('#product-form-' + sectionId + ' input[name="id"]');
  var moneyFormat = root.dataset.moneyFormat || '${{amount}}';
  var currencyCode = (root.dataset.currencyCode || '').trim();
  var selectedVariantScript =
    variantSelects && variantSelects.querySelector('[data-selected-variant]');

  var submitButton = productForm ? productForm.querySelector('[type="submit"]') : null;
  var submitLabelEl = submitButton ? submitButton.querySelector('span') : null;
  var atcLabel = (submitLabelEl && submitLabelEl.textContent.trim()) || 'COMPRAR \u2192';

  // Keep the buy-button label ("COMPRAR →") whenever Dawn's product-form
  // resets the submit text after a variant change (product-form.js
  // toggleSubmitButton re-uses window.variantStrings.addToCart).
  if (atcLabel) {
    window.variantStrings = window.variantStrings || {};
    window.variantStrings.addToCart = atcLabel;
  }

  function formatPrice(cents) {
    if (typeof window.formatMoney === 'function') {
      return window.formatMoney(cents, moneyFormat);
    }
    return (cents / 100).toFixed(2);
  }

  function withCurrency(value) {
    return currencyCode ? value + ' ' + currencyCode : value;
  }

  function getVariantOptions(variant) {
    var options = variant.options;
    if (!Array.isArray(options)) {
      options = [variant.option1, variant.option2, variant.option3];
    }
    return options.filter(Boolean);
  }

  function findSelectedVariant() {
    if (!variantSelects) return null;

    var optionValues = Array.from(variantSelects.querySelectorAll('input:checked')).map(function (input) {
      return input.value;
    });

    for (var i = 0; i < variants.length; i++) {
      var options = getVariantOptions(variants[i]);
      if (options.length !== optionValues.length) continue;

      var matches = options.every(function (option, index) {
        return option === optionValues[index];
      });

      if (matches) return variants[i];
    }
    return null;
  }

  function updateForVariant(variant) {
    if (idInput) idInput.value = variant ? variant.id : '';

    if (priceEl) {
      priceEl.textContent = variant ? withCurrency(formatPrice(variant.price)) : '\u2014';
    }

    if (comparePriceEl) {
      var showCompare = variant && variant.compare_at_price && variant.compare_at_price > variant.price;
      comparePriceEl.textContent = showCompare ? withCurrency(formatPrice(variant.compare_at_price)) : '';
      comparePriceEl.hidden = !showCompare;
    }

    if (productForm) {
      var available = !!(variant && variant.available);
      productForm.toggleSubmitButton(
        !available,
        available ? window.variantStrings.addToCart : window.variantStrings.soldOut
      );
    }

    // Activate the media attached to the selected variant, if present.
    if (mediaItems.length && variant && variant.featured_media && variant.featured_media.id) {
      var target = mediaList.querySelector('li[data-media-id="' + variant.featured_media.id + '"]');
      if (target) setActiveMedia(target);
    }

    // Keep Dawn's data-selected-variant payload truthful.
    if (selectedVariantScript) {
      try {
        selectedVariantScript.textContent = JSON.stringify(variant);
      } catch (e) {
        /* ignore */
      }
    }
  }

  if (variantSelects) {
    variantSelects.addEventListener('change', function () {
      updateForVariant(findSelectedVariant());
    });
  }

  // Initial state sync (keeps price/media/button consistent even when the
  // browser restores the last selected options).
  updateForVariant(findSelectedVariant() || variants[0] || null);

  /* ----------------------------------------------------------
     ADD-TO-CART CONFIRMATION (visual parity with the prototype)
     The prototype swaps the button to "✓ AGREGADO AL CARRITO"
     for ~2s after adding an item. Hook the theme's own
     cart-update pub/sub event so the real /cart/add.js flow
     keeps driving this feedback.
     ---------------------------------------------------------- */
  function showAddedConfirmation() {
    if (!submitButton || !submitLabelEl) return;
    submitLabelEl.textContent = '\u2713 AGREGADO AL CARRITO';
    submitButton.style.backgroundColor = '#2a2a2a';
    submitButton.style.color = '#ffffff';
    clearTimeout(showAddedConfirmation._timer);
    showAddedConfirmation._timer = setTimeout(function () {
      submitLabelEl.textContent = atcLabel;
      submitButton.style.backgroundColor = '';
      submitButton.style.color = '';
    }, 2000);
  }

  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.cartUpdate, function () {
      showAddedConfirmation();
    });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL (visual parity with the prototype)
     ---------------------------------------------------------- */
  var revealTargets = ['.product-card', '.craft-container', '.accessories-grid'];
  var revealElements = revealTargets.reduce(function (list, selector) {
    return list.concat(Array.from(root.querySelectorAll(selector)));
  }, []);

  function initReveal() {
    if (revealElements.length === 0 || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('vanilla-reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    revealElements.forEach(function (el) {
      el.classList.add('vanilla-reveal');
      observer.observe(el);
    });
  }

  initReveal();
})();