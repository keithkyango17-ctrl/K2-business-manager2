
let inventory = JSON.parse(localStorage.getItem("k2_inventory") || "[]");

function saveInventory() {
  localStorage.setItem("k2_inventory", JSON.stringify(inventory));
}

function showProducts() {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });

  let section = document.getElementById("inventorySection");

  if (!section) {
    section = document.createElement("section");
    section.id = "inventorySection";
    section.className = "panel page";

    document.querySelector("main").insertAdjacentElement(
      "afterend", section
    );
  }

  section.innerHTML = `
    <h3>Product Inventory</h3>

    <input id="pName" placeholder="Product name">
    <input id="pCategory" placeholder="Category">
    <input id="pBuy" type="number" placeholder="Buying price (UGX)">
    <input id="pSell" type="number" placeholder="Selling price (UGX)">
    <input id="pStock" type="number" placeholder="Quantity in stock">

    <button onclick="addProduct()">Save Product</button>

    <h3 style="margin-top:20px">My Products</h3>
    <div id="productList"></div>
  `;

  section.style.display = "block";
  displayProducts();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function addProduct() {
  let name = document.getElementById("pName").value.trim();
  let category = document.getElementById("pCategory").value.trim();
  let buy = Number(document.getElementById("pBuy").value);
  let sell = Number(document.getElementById("pSell").value);
  let stock = Number(document.getElementById("pStock").value);

  if (!name || !category || buy <= 0 || sell <= 0 ||
      !Number.isInteger(stock) || stock < 0) {
    alert("Please enter valid product details.");
    return;
  }

  inventory.push({
    id: Date.now(),
    name,
    category,
    buy,
    sell,
    stock
  });

  saveInventory();
  showProducts();
  updateActivity("Product added: " + name);
  alert("Product saved successfully!");
}

function displayProducts() {
  let list = document.getElementById("productList");

  if (!list) return;

  if (inventory.length === 0) {
    list.innerHTML = "<p>No products added yet.</p>";
    return;
  }

  list.innerHTML = inventory.map(product => `
    <div style="padding:12px 0;border-bottom:1px solid #263957">
      <strong>${escapeProductText(product.name)}</strong>
      <p>Category: ${escapeProductText(product.category)}</p>
      <p>Buying: UGX ${product.buy.toLocaleString()}</p>
      <p>Selling: UGX ${product.sell.toLocaleString()}</p>
      <p>Profit per item: UGX ${(product.sell-product.buy).toLocaleString()}</p>
      <p>Stock: ${product.stock}</p>
      <button onclick="deleteProduct(${product.id})">Delete</button>
    </div>
  `).join("");
}

function escapeProductText(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  inventory = inventory.filter(product => product.id !== id);
  saveInventory();
  showProducts();
}
