// ============================================
// EDIT THIS: your WhatsApp business number
// Format: country code + number, NO + sign, NO spaces, NO leading zero
// Example Nigeria number 0801 234 5678 -> "2348012345678"
// ============================================
const WHATSAPP_NUMBER = "2347071721405";

// ============================================
// EDIT THIS: your menu
// Add/remove items freely. category must match a tab data-cat value: mains | sides | drinks
// image: leave "" to show a placeholder, or set to an image path/URL e.g. "images/jollof.jpg"
// ============================================
const MENU = [
  { id: "m1", name: "Jollof Rice & Chicken", price: 3500, desc: "Smoky party jollof rice with a quarter grilled chicken.", category: "mains", image: "" },
  { id: "m2", name: "Egusi Soup & Pounded Yam", price: 4000, desc: "Melon seed soup with assorted meat and pounded yam.", category: "mains", image: "" },
  { id: "m3", name: "Ofada Rice & Ayamase Sauce", price: 4500, desc: "Local rice with spicy green pepper sauce and assorted meat.", category: "mains", image: "" },
  { id: "m4", name: "Pepper Soup (Goat Meat)", price: 3800, desc: "Hot, spicy broth with tender goat meat.", category: "mains", image: "" },
  { id: "m5", name: "Fried Rice & Turkey", price: 3700, desc: "Nigerian-style fried rice with mixed vegetables and turkey.", category: "mains", image: "" },
  { id: "s1", name: "Moin Moin", price: 1000, desc: "Steamed bean pudding with egg and fish.", category: "sides", image: "" },
  { id: "s2", name: "Fried Plantain (Dodo)", price: 1200, desc: "Sweet, golden, crisp-edged plantain.", category: "sides", image: "" },
  { id: "s3", name: "Efo Riro", price: 1800, desc: "Rich vegetable soup with assorted meat and fish.", category: "sides", image: "" },
  { id: "d1", name: "Chapman", price: 2000, desc: "House-mixed Chapman, ice cold.", category: "drinks", image: "" },
  { id: "d2", name: "Zobo", price: 1500, desc: "Hibiscus zobo, ginger & fruit infused.", category: "drinks", image: "" },
  { id: "d3", name: "Soft Drink (Can)", price: 1000, desc: "Coke, Fanta, or Sprite.", category: "drinks", image: "" },
];

// ============================================
// State
// ============================================
let cart = {}; // { itemId: qty }
let activeCategory = "mains";

const menuGrid = document.getElementById("menuGrid");
const cartCount = document.getElementById("cartCount");
const ticket = document.getElementById("ticket");
const ticketOverlay = document.getElementById("ticketOverlay");
const ticketBody = document.getElementById("ticketBody");
const ticketTotal = document.getElementById("ticketTotal");

function formatNaira(n) {
  return "₦" + n.toLocaleString("en-NG");
}

function renderMenu() {
  const items = MENU.filter(i => i.category === activeCategory);
  menuGrid.innerHTML = items.map(item => `
    <div class="dish-card">
      <div class="dish-img" style="${item.image ? `background-image:url('${item.image}')` : ""}">
        ${item.image ? "" : "Add photo here"}
      </div>
      <div class="dish-body">
        <div class="dish-name">${item.name}</div>
        <div class="dish-desc">${item.desc}</div>
        <div class="dish-footer">
          <span class="dish-price">${formatNaira(item.price)}</span>
          <button class="add-btn" data-id="${item.id}" aria-label="Add ${item.name} to order">+</button>
        </div>
      </div>
    </div>
  `).join("");

  menuGrid.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      cart[id] = (cart[id] || 0) + 1;
      updateCartUI();
      openTicket();
    });
  });
}

function updateCartUI() {
  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);
  cartCount.textContent = totalQty;

  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    ticketBody.innerHTML = `<p class="ticket-empty">Your tray is empty. Go pick something good.</p>`;
    ticketTotal.textContent = formatNaira(0);
    return;
  }

  let total = 0;
  ticketBody.innerHTML = entries.map(([id, qty]) => {
    const item = MENU.find(i => i.id === id);
    const lineTotal = item.price * qty;
    total += lineTotal;
    return `
      <div class="ticket-item">
        <div>
          <div class="ticket-item-name">${item.name}</div>
          <div class="ticket-item-price">${formatNaira(item.price)} each</div>
        </div>
        <div class="qty-controls">
          <button data-id="${id}" data-action="dec" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button data-id="${id}" data-action="inc" aria-label="Increase quantity">+</button>
        </div>
      </div>
    `;
  }).join("");
  ticketTotal.textContent = formatNaira(total);

  ticketBody.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (btn.dataset.action === "inc") cart[id]++;
      else {
        cart[id]--;
        if (cart[id] <= 0) delete cart[id];
      }
      updateCartUI();
    });
  });
}

function openTicket() {
  ticket.classList.add("show");
  ticketOverlay.classList.add("show");
}
function closeTicket() {
  ticket.classList.remove("show");
  ticketOverlay.classList.remove("show");
}

document.getElementById("cartBtn").addEventListener("click", openTicket);
document.getElementById("ticketClose").addEventListener("click", closeTicket);
ticketOverlay.addEventListener("click", closeTicket);

document.getElementById("menuTabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  activeCategory = tab.dataset.cat;
  renderMenu();
});

// ============================================
// Build the WhatsApp message and send
// ============================================
document.getElementById("sendOrderBtn").addEventListener("click", () => {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    alert("Your tray is empty — add something first!");
    return;
  }

  const name = document.getElementById("custName").value.trim() || "Not provided";
  const address = document.getElementById("custAddress").value.trim() || "Not provided";

  let message = "🧾 *NEW ORDER — The Rookies Kitchen*\n\n";
  let total = 0;
  entries.forEach(([id, qty]) => {
    const item = MENU.find(i => i.id === id);
    const lineTotal = item.price * qty;
    total += lineTotal;
    message += `• ${item.name} x${qty} — ${formatNaira(lineTotal)}\n`;
  });
  message += `\n*Total: ${formatNaira(total)}*\n\n`;
  message += `👤 Name: ${name}\n📍 Address: ${address}\n`;

  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  window.open(url, "_blank");
});

// ============================================
// Nav background on scroll + footer year
// ============================================
document.getElementById("year").textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  const nav = document.getElementById("nav");
  nav.style.boxShadow = window.scrollY > 20 ? "0 4px 20px rgba(0,0,0,.3)" : "none";
});

renderMenu();
updateCartUI();
