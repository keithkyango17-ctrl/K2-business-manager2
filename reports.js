function showReports() {
  document.getElementById("inventorySection")?.remove();
  document.getElementById("salesSection")?.remove();
  document.getElementById("expenseSection")?.remove();
  document.getElementById("customerSection")?.remove();

  document.getElementById("profileSection")?.remove();

  const totalSales = salesHistory.reduce(
    (sum, sale) => sum + Number(sale.revenue || 0), 0
  );

  const totalExpenses = expenseHistory.reduce(
    (sum, expense) => sum + Number(expense.amount || 0), 0
  );

  const grossProfit = salesHistory.reduce(
    (sum, sale) => sum + Number(sale.profit || 0), 0
  );

  const netProfit = grossProfit - totalExpenses;

  const stockValue = inventory.reduce(
    (sum, product) =>
      sum + Number(product.buy || 0) * Number(product.stock || 0), 0
  );

  const receiptHistory = JSON.parse(
    localStorage.getItem("k2_receipt_history") || "[]"
  );

  // CUSTOMER SALES SUMMARY
  const customerSales = {};

  receiptHistory.forEach(receipt => {
    const key = receipt.phone || receipt.customer || "Unknown";

    if (!customerSales[key]) {
      customerSales[key] = {
        name: receipt.customer || "Unknown Customer",
        phone: receipt.phone || "No phone",
        purchases: 0,
        total: 0
      };
    }

    customerSales[key].purchases++;
    customerSales[key].total += Number(receipt.total || 0);
  });

  const customerSummary = Object.values(customerSales);

  const recentSales = receiptHistory.slice(0, 10);

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
      <p>Registered Customers</p>
      <h2>${customers.length}</h2>
    </div>

    <div style="padding:15px 0">
      <p>Total Receipts</p>
      <h2>${receiptHistory.length}</h2>
    </div>

    <div style="padding:15px 0">
      <p>Stock Value (Buying Price)</p>
      <h2>UGX ${stockValue.toLocaleString()}</h2>
    </div>

    <hr style="margin:20px 0;border-color:#263957">

    <h3>Customer Sales Information</h3>

    ${
      customerSummary.length
        ? customerSummary.map(c => `
          <div style="padding:12px 0;border-bottom:1px solid #263957">
            <strong>${escapeProductText(c.name)}</strong>
            <p>Phone: ${escapeProductText(c.phone)}</p>
            <p>Purchases: ${c.purchases}</p>
            <p>Total Spent: UGX ${c.total.toLocaleString()}</p>
          </div>
        `).join("")
        : "<p>No customer sales recorded yet.</p>"
    }

    <hr style="margin:20px 0;border-color:#263957">

    <h3>Recent Sales</h3>

    ${
      recentSales.length
        ? recentSales.map(receipt => `
          <div style="padding:12px 0;border-bottom:1px solid #263957">
            <strong>Receipt: ${escapeProductText(receipt.receiptID || "")}</strong>
            <p>Customer: ${escapeProductText(receipt.customer || "Unknown")}</p>
            <p>Product: ${escapeProductText(receipt.product || "")}</p>
            <p>Quantity: ${Number(receipt.quantity || 0)}</p>
            <p>Total: UGX ${Number(receipt.total || 0).toLocaleString()}</p>
            <small>${escapeProductText(receipt.date || "")}</small>
          </div>
        `).join("")
        : "<p>No sales recorded yet.</p>"
    }
  `;

  section.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}
