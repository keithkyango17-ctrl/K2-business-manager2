
let customers = JSON.parse(
  localStorage.getItem("k2_customers") || "[]"
);

function saveCustomers() {
  localStorage.setItem(
    "k2_customers",
    JSON.stringify(customers)
  );
}

function showCustomers() {
  document.getElementById("inventorySection")?.remove();
  document.getElementById("salesSection")?.remove();
  document.getElementById("expenseSection")?.remove();
  document.getElementById("profileSection")?.remove();

  let main = document.querySelector("main");
  let section = document.getElementById("customerSection");

  if (!section) {
    section = document.createElement("section");
    section.id = "customerSection";
    section.className = "panel";
    main.appendChild(section);
  }

  section.innerHTML = `
    <h3>Customer Management</h3>

    <input id="customerName" placeholder="Customer name">

    <input id="customerPhone"
      type="tel"
      placeholder="Phone number">

    <input id="customerLocation"
      placeholder="Customer location">

    <button onclick="addCustomer()">Save Customer</button>

    <h3 style="margin-top:20px">My Customers</h3>

    <div id="customerList"></div>
  `;

  displayCustomers();

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function addCustomer() {
  let name = document.getElementById("customerName").value.trim();
  let phone = document.getElementById("customerPhone").value.trim();
  let location = document.getElementById("customerLocation").value.trim();

  if (!name || !phone) {
    alert("Enter customer name and phone number.");
    return;
  }

  customers.unshift({
    id: Date.now(),
    name,
    phone,
    location,
    date: new Date().toLocaleString()
  });

  saveCustomers();

  updateActivity("Customer added: " + name);

  alert("Customer saved successfully!");

  showCustomers();
}

function displayCustomers() {
  let list = document.getElementById("customerList");

  if (!list) return;

  if (customers.length === 0) {
    list.innerHTML = "<p>No customers added yet.</p>";
    return;
  }

  list.innerHTML = customers.map(customer => `
    <div style="padding:12px 0;border-bottom:1px solid #263957">
      <strong>${escapeProductText(customer.name)}</strong>
      <p>Phone: ${escapeProductText(customer.phone)}</p>
      <p>Location: ${escapeProductText(customer.location || "Not provided")}</p>
      <small>${escapeProductText(customer.date)}</small>
      <br><br>
      <button onclick="deleteCustomer(${customer.id})">Delete</button>
    </div>
  `).join("");
}

function deleteCustomer(id) {
  if (!confirm("Delete this customer?")) return;

  customers = customers.filter(customer => customer.id !== id);

  saveCustomers();
  showCustomers();
