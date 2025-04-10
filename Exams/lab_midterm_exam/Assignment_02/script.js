let cartCount = 0;
let cart = [];


function addToCart(name, price, image) {
  const product = { name, price, image };

  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
}

function updateCartUI() {
  let totalQty = 0;
  let totalAmount = 0;
  const cartItemsDiv = document.getElementById("cart-items");
  cartItemsDiv.innerHTML = "";

  cart.forEach(item => {
    totalQty += item.qty;
    totalAmount += item.qty * item.price;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <strong>${item.name}</strong><br>
        x${item.qty} - £${(item.qty * item.price).toFixed(2)}
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  document.getElementById("cart-count").innerText = totalQty;
  document.getElementById("cart-total").innerText = totalAmount.toFixed(2);
}

function toggleCart() {
  const sidebar = document.getElementById("cart-sidebar");
  sidebar.classList.toggle("open");
}

function goToCheckout() {
  window.location.href = "../../Lab_Tasks/Lab_Task_2/checkout.html";
}


const megaMenu = document.querySelector('.mega-menu');
if (megaMenu) {
  window.addEventListener('resize', () => {
    megaMenu.style.width = window.innerWidth + 'px';
  });
}
