
let expenseHistory = JSON.parse(
  localStorage.getItem("k2_expenses") || "[]"
);

function saveExpenses() {
  localStorage.setItem(
    "k2_expenses",
    JSON.stringify(expenseHistory)
  );
}

function showExpenses() {
  document.getElementById("inventorySection")?.remove();
  document.getElementById("salesSection")?.remove();
  document.getElementById("profileSection")?.remove();

  let main = document.querySelector("main");
  let section = document.getElementById("expenseSection");

  if (!section) {
    section = document.createElement("section");
    section.id = "expenseSection";
    section.className = "panel";
    main.appendChild(section);
  }

  section.innerHTML = `
    <h3>Record Business Expense</h3>

    <input id="expenseName" placeholder="Expense description">

    <input id="expenseAmount"
      type="number"
      min="1"
      placeholder="Amount in UGX">

    <button onclick="addExpense()">Save Expense</button>

    <h3 style="margin-top:20px">Expense History</h3>

    <div id="expenseList"></div>
  `;

  displayExpenses();

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function addExpense() {
  let name = document.getElementById("expenseName").value.trim();

  let amount = Number(
    document.getElementById("expenseAmount").value
  );

  if (!name || !Number.isFinite(amount) || amount <= 0) {
    alert("Please enter a description and valid amount.");
    return;
  }

  expenseHistory.unshift({
    id: Date.now(),
    name,
    amount,
    date: new Date().toLocaleString()
  });

  saveExpenses();

  updateActivity("Expense added: " + name);

  updateDashboard();

  alert("Expense saved successfully!");

  showExpenses();
}

function displayExpenses() {
  let list = document.getElementById("expenseList");

  if (!list) return;

  if (expenseHistory.length === 0) {
    list.innerHTML = "<p>No expenses recorded yet.</p>";
    return;
  }

  list.innerHTML = expenseHistory.map(expense => `
    <div style="padding:12px 0;border-bottom:1px solid #263957">
      <strong>${escapeProductText(expense.name)}</strong>
      <p>Amount: UGX ${expense.amount.toLocaleString()}</p>
      <small>${escapeProductText(expense.date)}</small>
    </div>
  `).join("");
}
