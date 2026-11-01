
let salesHistory = JSON.parse(localStorage.getItem("k2_sales") || "[]");

function saveSales() {
  localStorage.setItem("k2_sales", JSON.stringify(salesHistory));
}

function showSales() {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });

  document.getElementById("inventorySection")?.remove();
  document.getElementById("profileSection")?.remove();

  let section = document.getElementById("salesSection");

  if (!section) {
    section = document.createElement("section");
    section.id = "salesSection";
    section.className = "panel page";
    document.querySelector("main").insertAdjacentElement(
      "afterend", section
    );
  }

  section.innerHTML = `
    <h3>Record New Sale</h3>
    <label>Customer Name</label>
<input id="saleCustomer" placeholder="Customer name">

<label>Customer Phone</label>
<input id="saleCustomerPhone" type="tel"
placeholder="Customer phone number">

    <label>Select Product</label>
    <select id="saleProduct" onchange="updateSaleDetails()">
      <option value="">Choose a product</option>
      ${inventory.map(p => `
        <option value="${p.id}">
          ${escapeProductText(p.name)}
        </option>
      `).join("")}
    </select>

    <label>Available Stock</label>
    <input id="saleStock" readonly placeholder="Stock">

    <label>Selling Price (UGX)</label>
    <input id="salePrice" readonly placeholder="Price">

    <label>Quantity Sold</label>
    <input id="saleQuantity" type="number" min="1"
      placeholder="Enter quantity" oninput="calculateSaleTotal()">

    <h3 id="saleTotal">Total: UGX 0</h3>

    <button onclick="completeSale()">Complete Sale</button>

    <div id="salesMessage"></div>

    <h3 style="margin-top:20px">Sales History</h3>
    <div id="salesList"></div>
  `;

  section.style.display = "block";
  displaySales();

  window.scrollTo({ top: 0, behavior: "smooth" });
}
function updateSaleDetails() {
  const id = Number(document.getElementById("saleProduct").value);
  const product = inventory.find(p => p.id === id);

  document.getElementById("saleStock").value =
    product ? product.stock : "";

  document.getElementById("salePrice").value =
    product ? product.sell : "";

  calculateSaleTotal();
}

function calculateSaleTotal() {
  const price = Number(document.getElementById("salePrice").value);
  const quantity = Number(document.getElementById("saleQuantity").value);

  document.getElementById("saleTotal").textContent =
    "Total: UGX " + (price * quantity).toLocaleString();
}

function completeSale() {
  const id = Number(document.getElementById("saleProduct").value);
  const quantity = Number(document.getElementById("saleQuantity").value);
  const product = inventory.find(p => p.id === id);

  if (!product) {
    alert("Please select a product.");
    return;
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    alert("Enter a valid quantity.");
    return;
  }

  if (quantity > product.stock) {
    alert("Not enough stock available!");
    return;
  }

  const revenue = product.sell * quantity;
  const profit = (product.sell - product.buy) * quantity;

  const sale = {
    id: Date.now(),
    receiptNumber: "K2-" + Date.now(),
    product: product.name,
    quantity,
    price: product.sell,
    revenue,
    profit,
    date: new Date().toLocaleString()
  };

  product.stock -= quantity;
  salesHistory.unshift(sale);

  saveInventory();
  saveSales();

  updateActivity("Sold " + quantity + " × " + product.name);

  alert("Sale completed successfully!");

  showSales();
  updateDashboard();
}

// Keep compatibility with the earlier function name
function recordSale() {
  completeSale();
}

function displaySales() {
  const list = document.getElementById("salesList");
  if (!list) return;

  if (salesHistory.length === 0) {
    list.innerHTML = "<p>No sales recorded yet.</p>";
    return;
  }

  list.innerHTML = salesHistory.map(sale => `
    <div style="padding:12px 0;border-bottom:1px solid #263957">
      <strong>${escapeProductText(sale.product)}</strong>
      <p>Receipt: ${sale.receiptNumber || "Previous sale"}</p>
      <p>Quantity: ${sale.quantity}</p>
      <p>Revenue: UGX ${sale.revenue.toLocaleString()}</p>
      <p>Profit: UGX ${sale.profit.toLocaleString()}</p>
      <small>${escapeProductText(sale.date)}</small>
    </div>
  `).join("");
}
