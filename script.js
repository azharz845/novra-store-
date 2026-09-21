const WHATSAPP_NUMBER = "6285810127651";

const products = [
  {
    id: 1,
    name: "NOVRA BOX TEE — BLACK",
    description: "Boxy Fit / Heavy Cotton / Black",
    price: 100000,
    oldPrice: 299000
  },
  {
    id: 2,
    name: "NOVRA BOX TEE — WHITE",
    description: "Boxy Fit / Heavy Cotton / White",
    price: 100000,
    oldPrice: 299000
  },
  {
    id: 3,
    name: "NOVRA BOX TEE — GREY",
    description: "Boxy Fit / Heavy Cotton / Grey",
    price: 100000,
    oldPrice: 299000
  }
];

let cart = JSON.parse(localStorage.getItem("novraCart") || "[]");

/* =========================
   AUTH
========================= */

function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
  document.getElementById("authMessage").textContent = "";
}

function showLogin() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("authMessage").textContent = "";
}

function register() {
  const username =
    document.getElementById("registerUsername").value.trim();

  const password =
    document.getElementById("registerPassword").value;

  const confirm =
    document.getElementById("registerConfirm").value;

  const message =
    document.getElementById("authMessage");

  if (!username || !password || !confirm) {
    message.textContent = "Isi semua kolom terlebih dahulu.";
    return;
  }

  if (password.length < 4) {
    message.textContent = "Password minimal 4 karakter.";
    return;
  }

  if (password !== confirm) {
    message.textContent = "Password tidak sama.";
    return;
  }

  const user = {
    username: username,
    password: password
  };

  localStorage.setItem(
    "novraUser",
    JSON.stringify(user)
  );

  message.textContent =
    "Akun berhasil dibuat. Silakan login.";

  document.getElementById("loginUsername").value = username;
  document.getElementById("loginPassword").value = "";

  setTimeout(function () {
    showLogin();
  }, 700);
}

function login() {
  const username =
    document.getElementById("loginUsername").value.trim();

  const password =
    document.getElementById("loginPassword").value;

  const message =
    document.getElementById("authMessage");

  const savedUser =
    JSON.parse(
      localStorage.getItem("novraUser") || "null"
    );

  if (!savedUser) {
    message.textContent =
      "Belum punya akun. Klik Daftar terlebih dahulu.";
    return;
  }

  if (
    username === savedUser.username &&
    password === savedUser.password
  ) {
    localStorage.setItem(
      "novraLoggedIn",
      "true"
    );

    openStore();
  } else {
    message.textContent =
      "Username atau password salah.";
  }
}

function openStore() {
  document.getElementById("authPage").style.display = "none";
  document.getElementById("app").style.display = "block";

  renderProducts();
  updateCartCount();
}

function logout() {
  localStorage.removeItem("novraLoggedIn");

  document.getElementById("app").style.display = "none";
  document.getElementById("authPage").style.display = "flex";

  document.getElementById("loginPassword").value = "";
}


/* =========================
   PRODUCTS
========================= */

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(number);
}

function renderProducts() {
  const grid =
    document.getElementById("productGrid");

  if (!grid) return;

  grid.innerHTML = "";

  products.forEach(function (product) {

    const card =
      document.createElement("article");

    card.className = "product";

    card.innerHTML = `
      <div class="product-image">
        <div class="product-placeholder">
          NOVRA
        </div>
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
    `;

    grid.appendChild(card);
  });
}


/* =========================
   CART
========================= */

function addToCart(id) {
  const product =
    products.find(function (item) {
      return item.id === id;
    });

  if (!product) return;

  const existing =
    cart.find(function (item) {
      return item.id === id;
    });

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    });
  }

  saveCart();
  updateCartCount();
  renderCart();

  document
    .getElementById("cartOverlay")
    .classList.remove("hidden");
}

function saveCart() {
  localStorage.setItem(
    "novraCart",
    JSON.stringify(cart)
  );
}

function updateCartCount() {
  const element =
    document.getElementById("cartCount");

  if (!element) return;

  const count =
    cart.reduce(function (total, item) {
      return total + item.quantity;
    }, 0);

  element.textContent = count;
}

function renderCart() {
  const container =
    document.getElementById("cartItems");

  const totalElement =
    document.getElementById("cartTotal");

  if (!container || !totalElement) return;

  if (cart.length === 0) {
    container.innerHTML =
      `<p style="color:#777;text-align:center;padding:50px 0;">
        Keranjang masih kosong.
      </p>`;

    totalElement.textContent = "Rp0";
    return;
  }

  let total = 0;

  container.innerHTML = "";

  cart.forEach(function (item) {

    const subtotal =
      item.price * item.quantity;

    total += subtotal;

    const div =
      document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>

        <p>
          ${formatRupiah(item.price)}
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
          ${formatRupiah(subtotal)}
        </strong>

        <br>

        <button
          onclick="removeFromCart(${item.id})"
          class="remove-btn">
          Hapus
        </button>
      </div>
    `;

    container.appendChild(div);
  });

  totalElement.textContent =
    formatRupiah(total);
}

function changeQuantity(id, amount) {
  const item =
    cart.find(function (item) {
      return item.id === id;
    });

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart();
  renderCart();
  updateCartCount();
}

function removeFromCart(id) {
  cart =
    cart.filter(function (item) {
      return item.id !== id;
    });

  saveCart();
  renderCart();
  updateCartCount();
}

function openCart() {
  document
    .getElementById("cartOverlay")
    .classList.remove("hidden");

  renderCart();
}

function closeCart(event) {
  if (
    event &&
    event.target !==
    document.getElementById("cartOverlay")
  ) {
    return;
  }

  document
    .getElementById("cartOverlay")
    .classList.add("hidden");
}


/* =========================
   WHATSAPP
========================= */

function checkoutWhatsApp() {

  if (cart.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }

  let message =
    "Halo Novra, saya mau order:%0A%0A";

  cart.forEach(function (item) {
    message +=
      "• " +
      item.name +
      "%0A" +
      item.quantity +
      " x " +
      formatRupiah(item.price) +
      "%0A%0A";
  });

  const total =
    cart.reduce(function (sum, item) {
      return sum +
        item.price * item.quantity;
    }, 0);

  message +=
    "Total: " +
    formatRupiah(total) +
    "%0A%0A";

  message +=
    "Saya mau lanjut checkout.";

  window.open(
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    message,
    "_blank"
  );
}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const loggedIn =
      localStorage.getItem(
        "novraLoggedIn"
      ) === "true";

    if (loggedIn) {
      openStore();
    } else {
      document.getElementById("authPage").style.display = "flex";
      document.getElementById("app").style.display = "none";
    }

    updateCartCount();
  }
);
