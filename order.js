// order.js – dynamic checkout page

const CART_KEY = 'smashBurgerCart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderOrderList() {
  const cart = getCart();
  const listEl = document.getElementById('order-items');
  const totalEl = document.getElementById('order-total');
  listEl.innerHTML = '';
  let sum = 0;

  cart.forEach((item, idx) => {
    const li = document.createElement('li');
    li.textContent = `${item.name} — $${item.price.toFixed(2)}`;

    const remBtn = document.createElement('button');
    remBtn.classList.add('remove-btn');
    remBtn.innerHTML = '&times;';
    remBtn.title = 'Remove';
    remBtn.addEventListener('click', () => {
      cart.splice(idx, 1);
      saveCart(cart);
      renderOrderList();
    });

    li.appendChild(remBtn);
    listEl.appendChild(li);
    sum += item.price;
  });

  totalEl.textContent = sum.toFixed(2);
}

document.addEventListener('DOMContentLoaded', () => {
  renderOrderList();

  // FORMATTING: Card Number
  const cardNumberInput = document.querySelector('input[name="cardnumber"]');
  cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.match(/.{1,4}/g)?.join(' ') || '';
    e.target.value = value;
  });

  // FORMATTING: Expiry Date MM/YY
  const expiryInput = document.querySelector('input[name="expiry"]');
  expiryInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
  });

  // CVV as password style
  const cvcInput = document.querySelector('input[name="cvc"]');
  cvcInput.type = 'password';

  // Submit
  document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Thank you for your order! 🚀');
    localStorage.removeItem(CART_KEY);
    window.location.href = 'index.html';
  });
});
