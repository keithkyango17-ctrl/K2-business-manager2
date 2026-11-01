function startSecurity() {
  let savedPIN = localStorage.getItem("k2_pin");

  let screen = document.createElement("div");

  screen.style.cssText = `
    position:fixed;
    inset:0;
    background:#071426;
    color:white;
    z-index:99999;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    padding:25px;
    text-align:center;
  `;

  screen.innerHTML = `
    <h2>K2 Business Manager</h2>
    <p id="pinMessage">
      ${savedPIN ? "Enter your PIN to continue" : "Create your 4-digit PIN"}
    </p>
    <input id="pinInput" type="password"
      inputmode="numeric" maxlength="4"
      placeholder="Enter 4-digit PIN"
      style="padding:15px;font-size:22px;width:200px;text-align:center;">
    <button id="pinButton" style="margin-top:15px;padding:12px 25px;">
      Continue
    </button>
    <p id="pinError"></p>
  `;

  document.body.appendChild(screen);

  document.getElementById("pinButton").onclick = function () {
    let pin = document.getElementById("pinInput").value;

    if (!/^[0-9]{4}$/.test(pin)) {
      document.getElementById("pinError").textContent =
        "Enter exactly 4 digits.";
      return;
    }

    if (!savedPIN) {
      localStorage.setItem("k2_pin", pin);
      savedPIN = pin;
      document.getElementById("pinMessage").textContent =
        "PIN created. Enter it to unlock.";
      document.getElementById("pinInput").value = "";
      document.getElementById("pinError").textContent = "";
      return;
    }

    if (pin === savedPIN) {
      screen.remove();
    } else {
      document.getElementById("pinError").textContent =
        "Wrong PIN. Try again.";
      document.getElementById("pinInput").value = "";
    }
  };
}

startSecurity();
