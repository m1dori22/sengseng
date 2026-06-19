const PRODUCTS = [
  { id: 1, name: "Seng-Seng Milky Peel Firming - Bar Soap", price: 150, image: "milky-peel-firming_bar-soap.png", emoji: "\u{1F9FC}", desc: "Our signature K-Beauty bar soap with gentle exfoliating enzymes for radiant, smooth skin." },
  { id: 2, name: "Seng-Seng Gluta-Arbutin w/ Himalayan - Bar Soap", price: 150, image: "gluta-arbutin-himalayan_bar-soap.png", emoji: "\u{1F489}", desc: "Hydrating rose-infused serum that brightens and evens out skin tone." },
  { id: 3, name: "Seng-Seng Kojic Papaya Mansi - Bar Soap", price: 150, image: "kojic-papaya-mansi_bar-soap.png", emoji: "\u{1F36F}", desc: "Luxurious melting balm cleanser that dissolves makeup and impurities." },
  { id: 4, name: "Seng-Seng Ultra Whitening - Bar Soap", price: 150, image: "ultra-whitening_bar-soap.png", emoji: "\u{1F375}", desc: "Antioxidant-rich toner that refines pores and preps skin for serums." },
  { id: 5, name: "Seng-Seng Exfoliating Skin Peeling - Bar Soap", price: 150, image: "exfoliating-skin-peeling_bar-soap.png", emoji: "\u{1F9F4}", desc: "Single-use gold-infused sheet mask for instant radiance and deep hydration." },
  { id: 6, name: "Seng-Seng Lemon Zest - Bar Soap", price: 150, image: "lemon-zest-bar-soap2.png", emoji: "\u{1F35E}", desc: "Lightweight daily moisturizer with rice water extract for a dewy finish." },
  { id: 7, name: "Seng-Seng Satin Matte - Lipstick", price: 150, image: "sengseng_matte_lipstick.png", emoji: "\u{1F40C}", desc: "Repairing and hydrating essence powered by snail mucin for smoother skin." },
  { id: 8, name: "Seng-Seng Hydrating - Lip Gloss", price: 150, image: "sengseng_glossy_lipstick.png", emoji: "\u{1F4A8}", desc: "Deep-cleansing charcoal strips to unclog and minimize pores." }
];

const IMG_PATH = "images/";

function imgTag(p) {
  return `<img src="${IMG_PATH}${p.image}" alt="${p.name}" onerror="this.remove()" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"><span class="fallback"><img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmoxYzI4a3IzcndvY2R2ZjlwanB4a3B5bHhiYXl5OHh3Mmk5cmU0eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/d3e3ToBFhpkOnVyNin/giphy.gif" style="width:88px;height:85px;object-fit:cover"></span>`;
}

function getCart() {
  return JSON.parse(localStorage.getItem("seng_cart") || "[]");
}

function saveCart(cart) {
  localStorage.setItem("seng_cart", JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) { existing.qty++; } else { cart.push({ id: productId, qty: 1 }); }
  saveCart(cart);
  alert("Added to cart!");
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart(cart);
  renderCart();
}

function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? "inline" : "none";
}

function renderProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card">
      <div class="img img-wrap">${imgTag(p)}</div>
      <div class="info">
        <h3>${p.name}</h3>
        <div class="price">₱${p.price.toFixed(2)}</div>
        <div class="desc">${p.desc}</div>
        <button class="btn btn-primary" onclick="addToCart(${p.id})">Add to Cart</button>
      </div>
    </div>
  `).join("");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const summary = document.getElementById("cart-summary");
  const emptyMsg = document.getElementById("empty-cart");
  const checkoutBtn = document.getElementById("checkout-btns");
  if (!container) return;
  const cart = getCart();
  if (cart.length === 0) {
    container.innerHTML = "";
    if (emptyMsg) emptyMsg.style.display = "block";
    if (summary) summary.style.display = "none";
    if (checkoutBtn) checkoutBtn.style.display = "none";
    return;
  }
  if (emptyMsg) emptyMsg.style.display = "none";
  if (summary) summary.style.display = "block";
  if (checkoutBtn) checkoutBtn.style.display = "block";
  container.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return `<div class="cart-item">
      <div class="thumb img-wrap">${imgTag(p)}</div>
      <div class="details">
        <h3>${p.name}</h3>
        <div class="price">₱${(p.price * item.qty).toFixed(2)}</div>
        <div class="qty-controls">
          <button onclick="updateQty(${p.id},-1)">-</button>
          <span>${item.qty}</span>
          <button onclick="updateQty(${p.id},1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${p.id})">Remove</button>
    </div>`;
  }).join("");
  const total = cart.reduce((s, i) => { const p = PRODUCTS.find(x => x.id === i.id); return s + p.price * i.qty; }, 0);
  const totalEl = document.getElementById("cart-total");
  if (totalEl) totalEl.textContent = "₱" + total.toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderProducts();
  renderCart();
});
