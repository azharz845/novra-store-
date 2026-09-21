```javascript
/* =========================
   NOVRA STORE
========================= */

const WHATSAPP_NUMBER = "6285810127651";

const products = [
  {
    id: 1,
    name: "NOVRA BOX TEE — BLACK",
    description: "Boxy fit / Heavy cotton / Black",
    price: 100000,
    oldPrice: 299000,
    image: ""
  },
  {
    id: 2,
    name: "NOVRA BOX TEE — WHITE",
    description: "Boxy fit / Heavy cotton / White",
    price: 100000,
    oldPrice: 299000,
    image: ""
  },
  {
    id: 3,
    name: "NOVRA BOX TEE — GREY",
    description: "Boxy fit / Heavy cotton / Grey",
    price: 100000,
    oldPrice: 299000,
    image: ""
  }
];

let cart = JSON.parse(localStorage.getItem("novraCart")) || [];


/* =========================
   AUTH
========================= */

function showRegister() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("registerForm").classList.remove("hidden");
  clearAuthMessage();
}

function showLogin() {
  document.getElementById("registerForm").classList.add("hidden");
  document.getElementById("loginForm").classList.remove("hidden");
  clearAuthMessage();
}

function setAuthMessage(message) {
  document.getElementById("authMessage").textContent = message;
}

function clearAuthMessage() {
  document.getElementById("authMessage").textContent = "";
}

function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirm = document.getElementById("registerConfirm").value;

  if (!username || !password) {
    setAuthMessage("Username dan password wajib diisi.");
    return;
  }

  if (password !== confirm) {
    setAuthMessage("Password tidak sama.");
    return;
  }

  const user = {
    username,
    password
  };

  localStorage.setItem("novraUser", JSON.stringify(user));

  setAuthMessage("Akun berhasil dibuat. Silakan login.");

  setTimeout(() => {
    showLogin();

    document.getElementById("loginUsername").value = username;
  }, 700);
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  const savedUser = JSON.parse(
    localStorage.getItem("novraUser")
  );

  if (!savedUser) {
    setAuthMessage("Belum ada akun. Silakan daftar dulu.");
    return;
  }

  if (
    username === savedUser.username &&
    password === savedUser.password
  ) {
    localStorage.setItem("novraLoggedIn", "true");

    document.getElementById("authPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    renderProducts();
    updateCartCount();
  } else {
    setAuthMessage("Username atau password salah.");
  }
}

function logout() {
  localStorage.removeItem("novraLoggedIn");

  document.getElementById("app").classList.add("hidden");
  document.getElementById("authPage").classList.remove("hidden");

  document.getElementById("loginPassword").value = "";
}


/* =========================
   PRODUCT
========================= */

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function renderProducts() {
  const grid = document.getElementById("productGrid");

  grid.innerHTML = products.map(product => {

    const imageHTML = product.image
      ? `<img src="${product.image}" alt="${product.name}">`
      : `<div class="product-placeholder">NOVRA</div>`;

    return `
      <article class="product">

        <div class="product-image">
          ${imageHTML}
        </div>

        <div class="product-info">

          <div class="product-name">
            ${product.name}
          </div>

          <div class="product-desc">
            ${product.description}
          </div>

          <div class="price-row">
            <span class="old-price">
              ${formatRupiah(product.oldPrice)}
            </span>

            <span class="new-price">
              ${formatRupiah(product.price)}
            </span>
          </div>

          <button
            class="add-btn"
            onclick="addToCart(${product.id})">
            ADD TO CART
          </button>

        </div>

      </article>
    `;
  }).join("");
}


/* =========================
   CART
========================= */

function addToCart(productId) {
  const product = products.find(p => p.id === productId);

  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();
  updateCartCount();

  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);

  saveCart();
  renderCart();
  updateCartCount();
}

function changeQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function saveCart() {
  localStorage.setItem(
    "novraCart",
    JSON.stringify(cart)
  );
}

function updateCartCount() {
  const count = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  document.getElementById("cartCount").textContent = count;
}

function renderCart() {
  const container = document.getElementById("cartItems");
  const totalElement = document.getElementById("cartTotal");

  if (cart.length === 0) {
    container.innerHTML = `
      <div style="
        text-align:center;
        color:#666;
        padding:60px 20px;
      ">
        Keranjang masih kosong.
      </div>
    `;

    totalElement.textContent = "Rp0";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">

      <div>
        <h4>${item.name}</h4>

        <p>
          ${formatRupiah(item.price)}
          × ${item.quantity}
        </p>

        <div style="margin-top:10px;">
          <button
            onclick="changeQuantity(${item.id}, -1)"
            class="remove-btn">
            −
          </button>

          <span style="margin:0 10px;">
            ${item.quantity}
          </span>

          <button
            onclick="changeQuantity(${item.id}, 1)"
            class="remove-btn">
            +
          </button>
        </div>
      </div>

      <div style="text-align:right;">
        <strong>
          ${formatRupiah(item.price * item.quantity)}
        </strong>

        <br>

        <button
          onclick="removeFromCart(${item.id})"
          class="remove-btn">
          Hapus
        </button>
      </div>

    </div>
  `).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  totalElement.textContent = formatRupiah(total);
}

function openCart() {
  document.getElementById("cartOverlay").classList.remove("hidden");
  renderCart();
}

function closeCart(event) {
  if (
    event &&
    event.target !== document.getElementById("cartOverlay")
  ) {
    return;
  }

  document.getElementById("cartOverlay").classList.add("hidden");
}


/* =========================
   WHATSAPP CHECKOUT
========================= */

function checkoutWhatsApp() {

  if (cart.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  let message = "Halo Novra, saya mau order:%0A%0A";

  cart.forEach(item => {
    message +=
      `• ${item.name}%0A` +
      `  ${item.quantity} × ${formatRupiah(item.price)}%0A%0A`;
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  message +=
    `Total: ${formatRupiah(total)}%0A%0A` +
    `Saya mau lanjut checkout.`;

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  window.open(url, "_blank");
}


/* =========================
   START APP
========================= */

document.addEventListener("DOMContentLoaded", () => {

  const loggedIn =
    localStorage.getItem("novraLoggedIn") === "true";

  if (loggedIn) {
    document.getElementById("authPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");

    renderProducts();
    updateCartCount();
  }

});
```
