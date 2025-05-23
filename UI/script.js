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
  { id: 1, name: 'Smartphone', category: 'mobiles' },
  { id: 2, name: 'Tablet', category: 'mobiles' },
  { id: 3, name: 'Laptop', category: 'electronics' },
  { id: 4, name: 'Bluetooth Speaker', category: 'electronics' },
  { id: 5, name: 'LED TV', category: 'appliances' },
  { id: 6, name: 'Refrigerator', category: 'appliances' },
  { id: 7, name: 'T-Shirt', category: 'fashion' },
  { id: 8, name: 'Jeans', category: 'fashion' },
  { id: 9, name: 'Lipstick', category: 'beauty' },
  { id: 10, name: 'Perfume', category: 'beauty' },
  { id: 11, name: 'Cookware Set', category: 'home-kitchen' },
  { id: 12, name: 'Bedsheet', category: 'home-kitchen' },
  { id: 13, name: 'Sofa', category: 'furniture' },
  { id: 14, name: 'Dining Table', category: 'furniture' },
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
  window.location.href = 'order-confirmation.html';

  alert('Payment Successful');
  localStorage.setItem('orders', localStorage.getItem('cart'));
  localStorage.removeItem('cart');
  window.location.href = 'order-confirmation.html';
}

function goBackToCart() {
  window.location.href = 'order-confirmation.html';
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


// --- REGISTER PAGE LOGIC ---
if (window.location.pathname.includes('register.html')) {
  document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('regName').value;
    const customerId = document.getElementById('regCustomerId').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const user = { name, customerId, email, password };

    // Save user in localStorage (in real world: use backend and DB)
    localStorage.setItem('registeredUser', JSON.stringify(user));

    alert('Registration successful! Please login.');
    window.location.href = 'login.html';
  });
}

// --- LOGIN PAGE LOGIC ---
if (window.location.pathname.includes('login.html')) {
  document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const loginId = document.getElementById('loginId').value;
    const loginPassword = document.getElementById('loginPassword').value;

    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (registeredUser && registeredUser.customerId === loginId && registeredUser.password === loginPassword) {
      // Login successful – store session
      const sessionUser = { name: registeredUser.name, customerId: registeredUser.customerId, email: registeredUser.email };
      localStorage.setItem('loggedInUser', JSON.stringify(sessionUser));
      window.location.href = 'profile.html';
    } else {
      alert('Invalid Customer ID or Password.');
    }
  });
}

// --- PROFILE PAGE LOGIC ---
// script.js

// Generate a unique customer ID (only if not already set)
function getOrCreateCustomerId() {
  let customerId = localStorage.getItem("customerId");
  if (!customerId) {
    customerId = "CUST-" + Date.now();
    localStorage.setItem("customerId", customerId);
  }
  return customerId;
}

// Load profile data from localStorage
function loadProfile() {
  const name = localStorage.getItem("username") || "Unknown";
  const email = localStorage.getItem("email") || "N/A";
  const customerId = getOrCreateCustomerId();

  document.getElementById("profileName").textContent = name;
  document.getElementById("profileEmail").textContent = email;
  document.getElementById("profileCustomerId").textContent = customerId;
}

// Dummy update password function
function updatePassword() {
  alert("Redirecting to update password page (not implemented yet).");
}

// Sign out user
function signOut() {
  localStorage.clear();
  alert("You have been signed out.");
  window.location.href = "login.html"; // Redirect to login page
}

// Load profile on page load
window.onload = loadProfile;




// prifile
// Load profile details
window.onload = function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!user) {
    alert("No user logged in.");
    window.location.href = "register.html";
    return;
  }

  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileCustomerId').textContent = user.customerId;
  document.getElementById('profileEmail').textContent = user.email;
};

function updatePassword() {
  const newPassword = prompt("Enter your new password:");
  
  if (!newPassword) {
    alert("Password not changed.");
    return;
  }

  alert("Password updated successfully to: " + newPassword);
}


function signOut() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

