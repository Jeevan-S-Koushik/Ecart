// Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = 'C' + Math.floor(Math.random() * 10000);
    const user = {
      id,
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      address: document.getElementById('address').value,
      password: document.getElementById('password').value,
    };
    localStorage.setItem('registeredUser', JSON.stringify(user));
    window.location.href = 'acknowledgment.html';
  });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('registeredUser'));
    const enteredId = document.getElementById('loginId').value;
    const enteredPass = document.getElementById('loginPassword').value;
    if (user && user.id === enteredId && user.password === enteredPass) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'home.html';
    } else {
      alert('Invalid login');
    }
  });
}

// Home Page: Product List
const productList = document.getElementById('productList');
if (productList) {
  const products = [
    { id: 1, name: 'Smartphone', category: 'electronics' },
    { id: 2, name: 'T-Shirt', category: 'clothing' },
    { id: 3, name: 'Laptop', category: 'electronics' },
  ];
  const filter = document.getElementById('categoryFilter');
  const renderProducts = (cat) => {
    productList.innerHTML = '';
    products.filter(p => cat === 'all' || p.category === cat).forEach(p => {
      const div = document.createElement('div');
      div.className = 'product-item';
      div.innerHTML = `<h4>${p.name}</h4><p>${p.category}</p><button onclick="addToCart(${p.id})">Add to Cart</button>`;
      productList.appendChild(div);
    });
  };
  renderProducts('all');
  filter.addEventListener('change', () => renderProducts(filter.value));
}

function addToCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const item = { id, qty: 1 };
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Added to cart');
}

// Cart Page
if (document.getElementById('cartItems')) {
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = {
    1: 'Smartphone',
    2: 'T-Shirt',
    3: 'Laptop'
  };
  const container = document.getElementById('cartItems');
  cart.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${products[item.id]} x${item.qty}`;
    container.appendChild(div);
  });
  document.getElementById('cartAddress').textContent = user.address;
}

function editAddress() {
  const newAddress = prompt('Enter new address');
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  if (newAddress) {
    user.address = newAddress;
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('registeredUser', JSON.stringify(user));
    document.getElementById('cartAddress').textContent = newAddress;
  }
}

function proceedToPayment() {
  window.location.href = 'payment.html';
}

function togglePaymentFields() {
  const mode = document.getElementById('paymentMode').value;
  document.getElementById('upiField').style.display = mode === 'upi' ? 'block' : 'none';
  document.getElementById('cardFields').style.display = mode === 'credit' ? 'block' : 'none';
}

function makePayment() {
  alert('Payment Successful');
  localStorage.setItem('orders', localStorage.getItem('cart'));
  localStorage.removeItem('cart');
  window.location.href = 'orders.html';
}

function goBackToCart() {
  window.location.href = 'cart.html';
}

// Orders Page
if (document.getElementById('ordersList')) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];
  const products = {
    1: 'Smartphone',
    2: 'T-Shirt',
    3: 'Laptop'
  };
  const container = document.getElementById('ordersList');
  orders.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${products[item.id]} x${item.qty}`;
    container.appendChild(div);
  });
}

// Profile Page
if (document.getElementById('profileName')) {
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileAddress').textContent = user.address;
}

function editProfile() {
  window.location.href = 'index.html'; // Or create profile-edit.html if needed
}