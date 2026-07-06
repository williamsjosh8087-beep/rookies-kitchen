// ============================================
// EDIT THIS: your WhatsApp business number
// Format: country code + number, NO + sign, NO spaces, NO leading zero
// Example Nigeria number 0801 234 5678 -> "2348012345678"
// ============================================
const WHATSAPP_NUMBER = "2340000000000";

// ============================================
// EDIT THIS: your menu
// Add/remove items freely. category must match a tab data-cat value: mains | sides | drinks
// image: leave "" to show a placeholder, or set to an image path/URL e.g. "images/jollof.jpg"
// ============================================
const MENU = [
  { id: "m1", name: "Suya Platter", price: 4500, desc: "Char-grilled beef suya, spiced yaji, onions & tomato.", category: "mains", image: "" },
  { id: "m2", name: "Jollof & Grilled Chicken", price: 5000, desc: "Smoky party jollof rice with a quarter grilled chicken.", category: "mains", image: "" },
  { id: "m3", name: "Smash Burger", price: 4000, desc: "Double smashed beef patty, cheese, house sauce, brioche.", category: "mains", image: "" },
  { id: "m4", name: "Chicken Shawarma", price: 3500, desc: "Loaded shawarma wrap, garlic sauce, fries inside.", category: "mains", image: "" },
  { id: "s1", name: "Fried Plantain", price: 1500, desc: "Sweet, golden, crisp-edged plantain.", category: "sides", image: "" },
  { id: "s2", name: "Peppered Fries", price: 2000, desc: "Crispy fries tossed in pepper sauce.", category: "sides", image: "" },
  { id: "s3", name: "Coleslaw", price: 1200, desc: "Fresh, creamy, tangy house slaw.", category: "sides", image: "" },
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
    ticketBody.innerHTML =