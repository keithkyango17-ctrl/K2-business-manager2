function showReports() {
  document.getElementById("inventorySection")?.remove();
  document.getElementById("salesSection")?.remove();
  document.getElementById("expenseSection")?.remove();
  document.getElementById("customerSection")?.remove();
  document.getElementById("profileSection")?.remove();

  const totalSales = salesHistory.reduce(
    (sum, sale) => sum + sale.revenue, 0
  );

  const totalExpenses = expenseHistory.reduce(
    (sum, expense) => sum + expense.amount, 0
  );

  const grossProfit = salesHistory.reduce(
    (sum, sale) => sum + sale.profit, 0
  );

  const netProfit = grossProfit - totalExpenses;

  const stockValue = inventory.reduce(
    (sum, product) => sum + product.buy * product.stock, 0
  );

  const main = document.querySelector("main");
  let section = document.getElementById("reportSection");

  if (!section) {
    section = document.createElement("section");
    section.id = "reportSection";
    section.className = "panel";
    main.appendChild(section);
  }

  section.innerHTML = `
    <h3>Business Reports</h3>

    <div style="padding:15px 0">
      <p>Total Sales</p>
      <h2>UGX ${totalSales.toLocaleString()}</h2>
    </div>

    <div style="padding:15px 0">
      <p>Total Expenses</p>
      <h2>UGX ${totalExpenses.toLocaleString()}</h2>
    </div>

    <div style="padding:15px 0">
      <p>Gross Profit</p>
      <h2>UGX ${grossProfit.toLocaleString()}</h2>
    </div>

    <div style="padding:15px 0">
      <p>Net Profit</p>
      <h2 style="color:#36a0ff">
        UGX ${netProfit.toLocaleString()}
      </h2>
    </div>

    <div style="padding:15px 0">
      <p>Total Products</p>
      <h2>${inventory.length}</h2>
    </div>

    <div style="padding:15px 0">
      <p>Total Customers</p>
      <h2>${customers.length}</h2>
    </div>

    <div style="padding:15px 0">
      <p>Stock Value (Buying Price)</p>
      <h2>UGX ${stockValue.toLocaleString()}</h2>
    </div>
  `;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}
