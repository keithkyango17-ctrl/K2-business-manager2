function showDashboard() {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });

  document.getElementById('dashboardPage').style.display = 'block';
}
function showSettings() {
  document.querySelectorAll('.page').forEach(page => {
    page.style.display = 'none';
  });

  document.getElementById('settingsPage').style.display = 'block';

  let settings = JSON.parse(
    localStorage.getItem('k2_business_settings')
  ) || {};

  document.getElementById('businessName').value =
    settings.name || 'K2 Phone World';

  document.getElementById('businessPhone').value =
    settings.phone || '';

  document.getElementById('businessAddress').value =
    settings.address || '';

  document.getElementById('businessCurrency').value =
    settings.currency || 'UGX';
}

function saveBusinessSettings() {
  let settings = {
    name: document.getElementById('businessName').value,
    phone: document.getElementById('businessPhone').value,
    address: document.getElementById('businessAddress').value,
    currency: document.getElementById('businessCurrency').value
  };

  localStorage.setItem(
    'k2_business_settings',
    JSON.stringify(settings)
  );

  alert('Business settings saved successfully!');
}


let receiptHistory = JSON.parse(
  localStorage.getItem("k2_receipt_history") || "[]"
);

let receiptCounter = Number(
  localStorage.getItem("k2_last_receipt") || 0
);

function showReceipts() {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });

  document.getElementById("inventorySection")?.remove();
  document.getElementById("salesSection")?.remove();
  document.getElementById("profileSection")?.remove();

  const page = document.getElementById("receiptsPage");

  if (page) {
    page.style.display = "block";
  }

  displayReceiptHistory();
  loadReceiptProducts();

  window.scrollTo({ top: 0, behavior: "smooth" });
}


function createReceipt() {
  const customer = document.getElementById("receiptCustomer").value.trim();
  const phone = document.getElementById("receiptPhone").value.trim();

  const productSelect = document.getElementById("receiptProduct");
  const product = productSelect.options[productSelect.selectedIndex]?.text || "";

  const quantity = Number(document.getElementById("receiptQuantity").value);
  const price = Number(document.getElementById("receiptPrice").value);

  if (!productSelect.value || quantity <= 0 || price <= 0) {
    alert("Please enter valid receipt details.");
    return;
  }

  receiptCounter++;

  const receiptID = "K2-" + String(receiptCounter).padStart(4, "0");
  const total = quantity * price;
  const date = new Date().toLocaleString();

  const receipt = {
    receiptID,
    customer: customer || "Walk-in Customer",
    phone,
    product,
    quantity,
    price,
    total,
    date
  };

  receiptHistory.unshift(receipt);

  localStorage.setItem("k2_last_receipt", receiptCounter);
  localStorage.setItem(
    "k2_receipt_history",
    JSON.stringify(receiptHistory)
  );

  displayReceipt(receipt);
  displayReceiptHistory();

  document.getElementById("receiptCustomer").value = "";
  document.getElementById("receiptPhone").value = "";
  productSelect.value = "";
  document.getElementById("receiptQuantity").value = "";
  document.getElementById("receiptPrice").value = "";
}


function displayReceipt(receipt) {
  const business = JSON.parse(
    localStorage.getItem("k2_business_settings") || "{}"
  );

  const currency = business.currency || "UGX";
  const businessName = business.name || "K2 Phone World";
  const businessPhone = business.phone || "";
  const businessAddress = business.address || "";
  const products = JSON.parse(
  localStorage.getItem("k2_inventory") || "[]"
);

const selectedProduct = products.find(
  p => String(p.name) === String(receipt.product)
);

const stockAvailable = selectedProduct
  ? (selectedProduct.stock ?? selectedProduct.quantity ?? 0)
  : "Not found";

  document.getElementById("receiptResult").innerHTML = `
    <div id="printReceipt" style="
      background:white;
      color:#111;
      padding:20px;
      margin-top:20px;
      font-family:Arial;
      max-width:400px;
      border-top:6px solid #087bff;">

      <div style="text-align:center;">
        <h2>${businessName}</h2>
        <p>${businessAddress}</p>
        <p>${businessPhone}</p>
        <h3>SALES RECEIPT</h3>
      </div>

      <hr>

      <p><strong>Receipt No:</strong> ${receipt.receiptID}</p>
      <p><strong>Date:</strong> ${receipt.date}</p>
      <p><strong>Customer:</strong> ${receipt.customer}</p>
      <p><strong>Phone:</strong> ${receipt.phone || "N/A"}</p>

      <hr>

      <p><strong>Product:</strong> ${receipt.product}</p>
      <p><strong>Quantity:</strong> ${receipt.quantity}</p>
      <p><strong>Unit Price:</strong> ${currency} ${receipt.price.toLocaleString()}</p>

      <hr>

      <h2 style="text-align:center;">
        TOTAL: ${currency} ${receipt.total.toLocaleString()}
      </h2>

      <p style="text-align:center;">
        Thank you for shopping with us!
      </p>

      <button class="no-print" onclick="window.print()">
        Print Receipt
      </button>
    </div>
  `;
}

function displayReceiptHistory() {
  const list = document.getElementById("receiptHistory");
  if (!list) return;

  if (receiptHistory.length === 0) {
    list.innerHTML = "<p>No receipts yet.</p>";
    return;
  }

  list.innerHTML = receiptHistory.map(r => `
    <div style="padding:12px;border-bottom:1px solid #263957;">
      <strong>${r.receiptID}</strong>
      <p>${r.customer}</p>
      <p>${r.product} × ${r.quantity}</p>
      <p>Total: UGX ${r.total.toLocaleString()}</p>
      <small>${r.date}</small>
      <button onclick="reprintReceipt('${r.receiptID}')">Reprint</button>
    </div>
  `).join("");
}

function reprintReceipt(id) {
  const receipt = receiptHistory.find(r => r.receiptID === id);
  if (receipt) displayReceipt(receipt);
}

function calculateReceiptTotal() {
  const quantity = Number(
    document.getElementById("receiptQuantity").value
  );

  const price = Number(
    document.getElementById("receiptPrice").value
  );

  const total = quantity * price;

  document.getElementById("receiptLiveTotal").textContent =
    "TOTAL: UGX " + total.toLocaleString();
}


function loadReceiptProducts() {
  const products = JSON.parse(
    localStorage.getItem("k2_inventory") || "[]"
  );

  const select = document.getElementById("receiptProduct");

  if (!select) return;

  select.innerHTML = '<option value="">Choose a product</option>';

  products.forEach(product => {
    select.innerHTML += `
      <option value="${product.name}">
        ${product.name}
      </option>
    `;
  });
}

function updateReceiptProduct() {
  const products = JSON.parse(
    localStorage.getItem("k2_inventory") || "[]"
  );

  const selectedId = document.getElementById("receiptProduct").value;

  const product = products.find(
    item => String(item.id) === selectedId
  );

  if (!product) return;

  document.getElementById("receiptStock").value = product.stock;
  document.getElementById("receiptPrice").value = product.sell;

  calculateReceiptTotal();
}
