// ============================================
// EDIT THIS: your WhatsApp business number
// ============================================
const WHATSAPP_NUMBER = "2347071721405";

// ============================================
// EDIT THIS: your menu
// video: the YouTube video ID only (the part after "shorts/" or "v=" in the URL)
// ============================================
const MENU = [
  { id: "m1", name: "Colorful Homemade Fried Rice", price: 3200, desc: "Vibrant, veg-packed homemade fried rice.", category: "mains", image: "", video: "aT6mqfQLj28" },
  { id: "m2", name: "Delicious Fried Noodles", price: 2500, desc: "Stir-fried noodles, packed with flavor.", category: "mains", image: "", video: "aT6mqfQLj28" },
  { id: "s1", name: "Freshly Baked Meat Pie", price: 800, desc: "Flaky pastry, savory meat filling.", category: "sides", image: "", video: "d1FpdofRV94" },
  { id: "s2", name: "Soft Homemade Moi Moi", price: 1000, desc: "Steamed bean pudding, soft and rich.", category: "sides", image: "", video: "kW0J40FpJcc" },
  { id: "m3", name: "Chicken Indomie", price: 2200, desc: "Spiced instant noodles loaded with chicken.", category: "mains", image: "", video: "vsWp7ASAV5Y" },
  { id: "m4", name: "Yam and Egg Sauce", price: 2800, desc: "Boiled yam with rich, peppered egg sauce.", category: "mains", image: "", video: "klHYWombIpc" },
  { id: "m5", name: "Delicious Yam Porridge", price: 3000, desc: "Soft yam simmered in a savory red sauce.", category: "mains", image: "", video: "4W0LYgFq874" },
  { id: "m6", name: "Rich Egusi Soup", price: 3500, desc: "Melon seed soup with assorted meat.", category: "mains", image: "", video: "QX5KpBKhzy8" },
  { id: "s3", name: "Soft Milky Donuts", price: 1500, desc: "Soft, fluffy, lightly sweet donuts.", category: "sides", image: "", video: "MaNbq16d5-E" },
  { id: "m7", name: "Fresh Palm Oil Rice", price: 3000, desc: "Rice cooked in rich, fresh palm oil sauce.", category: "mains", image: "", video: "CpWXFRpckno" },
  { id: "s4", name: "Chin Chin", price: 1000, desc: "Crunchy, sweet fried snack.", category: "sides", image: "", video: "7tJYxHxSe8U" },
  { id: "m8", name: "Seasoned Chicken", price: 3200, desc: "Well-seasoned, perfectly grilled chicken.", category: "mains", image: "", video: "E95PN2xsWz0" },
  { id: "s5", name: "Akara", price: 600, desc: "Deep-fried bean cakes, crispy outside, soft inside.", category: "sides", image: "", video: "zMUx8JpBZGc" },
  { id: "m9", name: "Intestine Peppersoup", price: 3800, desc: "Spicy, hot peppersoup made with intestine.", category: "mains", image: "", video: "Ee887ldwcfY" },
  { id: "m10", name: "Fried Rice", price: 3000, desc: "Classic Nigerian-style fried rice.", category: "mains", image: "", video: "MYszkhrnx3Q" },
  { id: "m11", name: "Catfish Peppersoup & Unripe Plantain", price: 4200, desc: "Hot catfish peppersoup served with plantain.", category: "mains", image: "", video: "HNp8XPbWgtk" },
  { id: "d1", name: "Chapman", price: 2000, desc: "House-mixed Chapman, ice cold.", category: "drinks", image: "" },
  { id: "d2", name: "Zobo", price: 1500, desc: "Hibiscus zobo, ginger & fruit infused.", category: "drinks", image: "" },
  { id: "d3", name: "Soft Drink (Can)", price: 1000, desc: "Coke, Fanta, or Sprite.", category: "drinks", image: "" },
];

// ============================================
// State
// ============================================
let cart = {};
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
        ${item.video ? `<button class="watch-btn" data-video="${item.video}">▶ Watch</button>` : ""}
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

  menuGrid.querySelectorAll(".watch-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const videoId = btn.dataset.video;
      window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
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

document.getElementById("sendOrderBtn").addEventListener("click", () => {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    alert("Your tray is empty — add something first!");
    return;
  }

  const name = document.getElementById("custName").value.trim() || "Not provided";
  const
