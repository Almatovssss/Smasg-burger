// script.js

document.addEventListener("DOMContentLoaded", function () {
  // 1. Dropdown menu logic
  const burgerBtn = document.querySelector(".burger-btn");
  const dropdownMenu = document.querySelector(".dropdown-menu");

  burgerBtn.addEventListener("click", function () {
    dropdownMenu.classList.toggle("open");
    burgerBtn.classList.toggle("open");
  });

  // 2. Cart logic
  const CART_KEY = 'smashBurgerCart';
  const cartCountEl = document.getElementById('cart-count');
  const cartModal = document.getElementById('cart-modal');
  const modalItemsEl = document.getElementById('modal-items');
  const modalCountEl = document.getElementById('modal-count');
  const modalTotalEl = document.getElementById('modal-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const closeCartBtn = document.getElementById('close-cart');

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  }
  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  function updateCartCount() {
    const count = getCart().length;
    if (cartCountEl) cartCountEl.textContent = count;
  }

  function renderModal() {
    const cart = getCart();
    modalItemsEl.innerHTML = '';
    let sum = 0;
    cart.forEach((item, idx) => {
      const li = document.createElement('li');
      li.textContent = `${item.name} — $${item.price.toFixed(2)}`;
      // remove button
      const remBtn = document.createElement('button');
      remBtn.classList.add('remove-btn');
      remBtn.innerText = '✖';
      remBtn.addEventListener('click', () => {
        cart.splice(idx, 1);
        saveCart(cart);
        updateCartCount();
        renderModal();
      });
      li.appendChild(remBtn);
      modalItemsEl.appendChild(li);
      sum += item.price;
    });
    modalCountEl.textContent = cart.length;
    modalTotalEl.textContent = sum.toFixed(2);
  }

  // Handle Add to Cart buttons + show modal
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      const cart = getCart();
      cart.push({ name, price });
      saveCart(cart);
      updateCartCount();
      renderModal();
      // Open modal
      cartModal.classList.add('open');

      // Feedback animation
      const originalText = btn.textContent;
      btn.textContent = '✔ Added';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1200);
    });
  });

  // Checkout navigation
  checkoutBtn.addEventListener('click', () => {
    window.location.href = 'order.html';
  });

  // Close modal
  closeCartBtn.addEventListener('click', () => {
    cartModal.classList.remove('open');
  });
  cartModal.addEventListener('click', (e) => {
    if (e.target === cartModal) cartModal.classList.remove('open');
  });

  // Init counts
  updateCartCount();
  renderModal();
});