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

      // Item name, price and quantity (quantity = 1 by default)
      const nameSpan = document.createElement('span');
      nameSpan.classList.add('item-name');
      nameSpan.innerText = item.name;

      const priceSpan = document.createElement('span');
      priceSpan.classList.add('item-price');
      priceSpan.innerText = item.price.toFixed(2);

      const quantitySpan = document.createElement('span');
      quantitySpan.classList.add('item-quantity');
      quantitySpan.innerText = 1;  // hozircha 1 dona

      li.appendChild(nameSpan);
      li.appendChild(document.createTextNode(' — $'));
      li.appendChild(priceSpan);
      li.appendChild(document.createTextNode(' x '));
      li.appendChild(quantitySpan);

      // Remove button
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

  // Add to Cart buttons
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

  // Checkout navigation & send order to backend
  checkoutBtn.addEventListener('click', () => {
    const cartItems = getCart().map(item => ({
      name: item.name,
      price: item.price,
      quantity: 1 // hozircha faqat 1 ta har bir buyurtma
    }));

    fetch("https://792eebd8-751d-4107-bda0-4ca0b500e393-00-38phs9fyuh4ph.picard.replit.dev/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cartItems })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        // Cart-ni tozalaymiz:
        localStorage.removeItem(CART_KEY);
        updateCartCount();
        renderModal();
        cartModal.classList.remove('open');
      })
      .catch(err => {
        console.error("Xatolik:", err);
        alert("Buyurtma yuborishda xatolik yuz berdi");
      });
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
