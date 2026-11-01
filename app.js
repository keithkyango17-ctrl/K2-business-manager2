
let sales = 0;
let expenses = 0;
let products = 0;

function updateDashboard() {
  const totalSales = typeof salesHistory !== "undefined"
    ? salesHistory.reduce((sum, sale) => sum + Number(sale.revenue || 0), 0)
    : 0;

  const totalExpenses = typeof expenseHistory !== "undefined"
    ? expenseHistory.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    : 0;

  const grossProfit = typeof salesHistory !== "undefined"
    ? salesHistory.reduce((sum, sale) => sum + Number(sale.profit || 0), 0)
    : 0;

  const netProfit = grossProfit - totalExpenses;

  const productCount = typeof inventory !== "undefined"
    ? inventory.length
    : 0;

  document.getElementById("sales").textContent =
    "UGX " + totalSales.toLocaleString();

  document.getElementById("expenses").textContent =
    "UGX " + totalExpenses.toLocaleString();

  document.getElementById("profit").textContent =
    "UGX " + netProfit.toLocaleString();

  document.getElementById("products").textContent = productCount;
}

function showMessage(action) {
  if (action === "Add Sale") {
    let amount = Number(prompt("Enter sale amount in UGX:"));

    if (amount > 0) {
      sales += amount;
      updateActivity("Sale recorded: UGX " + amount.toLocaleString());
    }
  }

  else if (action === "Add Expense") {
    let amount = Number(prompt("Enter expense amount in UGX:"));

    if (amount > 0) {
      expenses += amount;
      updateActivity("Expense recorded: UGX " + amount.toLocaleString());
    }
  }

  else if (action === "Add Product") {
    let name = prompt("Enter product name:");

    if (name && name.trim()) {
      products++;
      updateActivity("Product added: " + name);
    }
  }

  else if (action === "View Reports") {
    alert(
      "BUSINESS REPORT\n\n" +
      "Sales: UGX " + sales.toLocaleString() +
      "\nExpenses: UGX " + expenses.toLocaleString() +
      "\nProfit: UGX " + (sales - expenses).toLocaleString()
    );
  }

  updateDashboard();
}

function updateActivity(message) {
  document.getElementById("activity").textContent = message;
}

function goHome() {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });

  const dashboard = document.getElementById("dashboardPage");

  if (dashboard) {
    dashboard.style.display = "block";
  }

  document.getElementById("inventorySection")?.remove();
  document.getElementById("salesSection")?.remove();
  document.getElementById("profileSection")?.remove();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showProfile() {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
  });

  document.getElementById("inventorySection")?.remove();
  document.getElementById("salesSection")?.remove();

  let main = document.querySelector("main");

  let section = document.getElementById("profileSection");

  if (!section) {
    section = document.createElement("section");
    section.id = "profileSection";
    section.className = "panel page";
    main.appendChild(section);
  }

  section.innerHTML = `
    <h2>Business Profile</h2>
    <p>Business name: K2 Phone World</p>
    <p>Currency: UGX</p>
    <p>App: K2 Business Manager</p>
    <p>Version: 1.0</p>
  `;

  section.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("load", function() {
  document.getElementById("today").textContent =
    new Date().toDateString();

  updateDashboard();
  goHome();
});
