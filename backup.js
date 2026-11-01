function createBackup() {
  const backupData = {
    app: "K2 Business Manager",
    date: new Date().toLocaleString(),
    inventory: JSON.parse(localStorage.getItem("k2_inventory") || "[]"),
    sales: JSON.parse(localStorage.getItem("k2_sales") || "[]"),
    expenses: JSON.parse(localStorage.getItem("k2_expenses") || "[]"),
    customers: JSON.parse(localStorage.getItem("k2_customers") || "[]")
  };

  const file = new Blob(
    [JSON.stringify(backupData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
  link.download = "K2-Business-Backup.json";
  link.click();

  URL.revokeObjectURL(url);

  alert("Your backup has been created!");
}

function restoreBackup(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = function () {
    try {
      const data = JSON.parse(reader.result);

      if (
        data.app !== "K2 Business Manager" ||
        !Array.isArray(data.inventory) ||
        !Array.isArray(data.sales) ||
        !Array.isArray(data.expenses) ||
        !Array.isArray(data.customers)
      ) {
        alert("Invalid K2 backup file.");
        return;
      }

      if (!confirm("Restoring will replace your current records. Continue?")) {
        return;
      }

      localStorage.setItem("k2_inventory", JSON.stringify(data.inventory));
      localStorage.setItem("k2_sales", JSON.stringify(data.sales));
      localStorage.setItem("k2_expenses", JSON.stringify(data.expenses));
      localStorage.setItem("k2_customers", JSON.stringify(data.customers));

      alert("Backup restored successfully. Refresh the app.");
      location.reload();

    } catch (error) {
      alert("Could not read this backup file.");
    }
  };

  reader.readAsText(file);
}
