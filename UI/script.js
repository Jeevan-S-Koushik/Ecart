// Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const id = Math.floor(1000000 + Math.random() * 9000000).toString();
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

// Home Page: Show welcome message & product logic
if (document.getElementById('welcomeUser')) {
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  document.getElementById('welcomeUser').textContent = `Welcome, ${user?.name || 'Guest'}`;
}

const profileIcon = document.getElementById('profileIcon');
if (profileIcon) {
  profileIcon.addEventListener('click', () => {
    window.location.href = 'profile.html';
  });
}

// Sample product list
const products = [
  { id: 1, name: 'Smartphone', category: 'electronics' },
  { id: 2, name: 'Laptop', category: 'electronics' },
  { id: 3, name: 'T-Shirt', category: 'clothing' },
  { id: 4, name: 'Jeans', category: 'clothing' },
];

const productListEl = document.getElementById('productList');
const categoryFilter = document.getElementById('categoryFilter');

function displayProducts(category = 'all') {
  if (!productListEl) return;

  productListEl.innerHTML = '';
  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.textContent = product.name;
    div.addEventListener('click', () => addToCart(product));
    productListEl.appendChild(div);
  });
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (!cart.find(item => item.id === product.id)) {
    cart.push({ ...product, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
  } else {
    alert(`${product.name} is already in the cart.`);
  }
}

if (categoryFilter) {
  categoryFilter.addEventListener('change', e => {
    displayProducts(e.target.value);
  });
  displayProducts();
}

// Cart Page
if (document.getElementById('cartItems')) {
  const user = JSON.parse(sessionStorage.getItem('currentUser'));
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productsMap = {
    1: 'Smartphone',
    2: 'T-Shirt',
    3: 'Laptop'
  };

  const container = document.getElementById('cartItems');
  cart.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${productsMap[item.id] || item.name} x${item.qty}`;
    container.appendChild(div);
  });

  document.getElementById('cartAddress').textContent = user?.address || '';
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
  const productsMap = {
    1: 'Smartphone',
    2: 'T-Shirt',
    3: 'Laptop'
  };
  const container = document.getElementById('ordersList');
  orders.forEach(item => {
    const div = document.createElement('div');
    div.textContent = `${productsMap[item.id] || item.name} x${item.qty}`;
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
  window.location.href = 'index.html'; // Or route to a profile-edit page
}

// cart 

// Sample cart products data
const cartItems = [
  { id: 1, name: "Wireless Headphones", quantity: 1 },
  { id: 2, name: "Bluetooth Speaker", quantity: 2 },
];

// Get cart container div
const cartItemsContainer = document.getElementById("cartItems");

// Render products dynamically
function renderCart() {
  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.textContent = "Your cart is empty.";
    return;
  }

  cartItems.forEach(item => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    // Product name
    const productInfo = document.createElement("div");
    productInfo.className = "product-info";
    productInfo.textContent = item.name;

    // Quantity controls container
    const quantityControls = document.createElement("div");
    quantityControls.className = "quantity-controls";

    // Decrease button
    const btnDecrease = document.createElement("button");
    btnDecrease.textContent = "-";
    btnDecrease.onclick = () => {
      if (item.quantity > 1) {
        item.quantity--;
        renderCart();
      }
    };

    // Quantity display
    const qtyDisplay = document.createElement("span");
    qtyDisplay.textContent = item.quantity;

    // Increase button
    const btnIncrease = document.createElement("button");
    btnIncrease.textContent = "+";
    btnIncrease.onclick = () => {
      item.quantity++;
      renderCart();
    };

    quantityControls.appendChild(btnDecrease);
    quantityControls.appendChild(qtyDisplay);
    quantityControls.appendChild(btnIncrease);

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.className = "remove-btn";
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => {
      const index = cartItems.findIndex(p => p.id === item.id);
      if (index !== -1) {
        cartItems.splice(index, 1);
        renderCart();
      }
    };

    itemDiv.appendChild(productInfo);
    itemDiv.appendChild(quantityControls);
    itemDiv.appendChild(removeBtn);

    cartItemsContainer.appendChild(itemDiv);
  });
}

// Initial render
renderCart();

// Edit address button functionality (optional)
document.getElementById("editAddressBtn").addEventListener("click", () => {
  const newAddress = prompt("Enter new shipping address:", document.getElementById("cartAddress").textContent);
  if (newAddress && newAddress.trim() !== "") {
    document.getElementById("cartAddress").textContent = newAddress.trim();
  }
});
