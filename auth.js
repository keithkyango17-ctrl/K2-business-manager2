const SUPABASE_URL = "https://pycgdwtefotizmllnulq.supabase.co";
const SUPABASE_KEY = "sb_publishable_DawGJkYujmUDdM8qHPrHIQ_xqk3ejwe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

window.currentK2User = null;

const K2_DATA_KEYS = [
  "k2_inventory",
  "k2_sales",
  "k2_expenses",
  "k2_customers",
  "k2_receipt_history",
  "k2_last_receipt",
  "k2_business_settings"
];

let cloudSaveTimer = null;
let loadingK2Data = false;

function showSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("authError").textContent = "";
  document.getElementById("authMessage").textContent = "Create your K2 account";
}

function showLogin() {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("authError").textContent = "";
  document.getElementById("authMessage").textContent = "Welcome back!";
}

async function registerUser() {
  const username = document.getElementById("signupUsername").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  if (!username || !email || password.length < 6) {
    document.getElementById("authError").textContent =
      "Enter a username, email and password of at least 6 characters.";
    return;
  }

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
  data: { username },
  emailRedirectTo: "https://keithkyango17-ctrl.github.io/K2-business-manager2/"
  });

  if (error) {
    document.getElementById("authError").textContent = error.message;
    return;
  }

  document.getElementById("authError").textContent =
    "Account created! Check your email if confirmation is required, then log in.";
}

async function loginUser() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    document.getElementById("authError").textContent = error.message;
  }
}

async function loadK2UserData(user) {
  loadingK2Data = true;

  try {
    const { data, error } = await supabaseClient
      .from("k2_business_data")
      .select("business_data")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    const savedData = data?.business_data || {};

    K2_DATA_KEYS.forEach(key => {
      if (Object.prototype.hasOwnProperty.call(savedData, key)) {
        localStorage.setItem(key, savedData[key]);
      } else {
        localStorage.removeItem(key);
      }
    });

    // Refresh the existing app variables
    inventory = JSON.parse(localStorage.getItem("k2_inventory") || "[]");
    salesHistory = JSON.parse(localStorage.getItem("k2_sales") || "[]");
    expenseHistory = JSON.parse(localStorage.getItem("k2_expenses") || "[]");
    customers = JSON.parse(localStorage.getItem("k2_customers") || "[]");
    receiptHistory = JSON.parse(localStorage.getItem("k2_receipt_history") || "[]");
    receiptCounter = Number(localStorage.getItem("k2_last_receipt") || 0);

    window.currentK2User = user;

    document.getElementById("authScreen").style.display = "none";

    updateDashboard();
    goHome();

    if (!data) {
      await saveK2UserData();
    }

  } catch (error) {
    document.getElementById("authError").textContent =
      "Could not load your business data: " + error.message;

    document.getElementById("authScreen").style.display = "flex";

  } finally {
    loadingK2Data = false;
  }
}

async function saveK2UserData() {
  const user = window.currentK2User;
  if (!user || loadingK2Data) return;

  const businessData = {};

  K2_DATA_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      businessData[key] = value;
    }
  });

  const { error } = await supabaseClient
    .from("k2_business_data")
    .upsert({
      user_id: user.id,
      business_data: businessData,
      updated_at: new Date().toISOString()
    });

  if (error) {
    console.error("K2 cloud save failed:", error.message);
  }
}

function scheduleK2CloudSave(key) {
  if (!K2_DATA_KEYS.includes(key) || loadingK2Data) return;

  clearTimeout(cloudSaveTimer);

  cloudSaveTimer = setTimeout(() => {
    saveK2UserData();
  }, 1000);
}

const originalSetItem = localStorage.setItem.bind(localStorage);

localStorage.setItem = function(key, value) {
  originalSetItem(key, value);
  scheduleK2CloudSave(key);
};

async function logoutUser() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    alert("Could not log out: " + error.message);
  }
}

async function startK2Authentication() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) {
    document.getElementById("authError").textContent = error.message;
    return;
  }

  if (data.session) {
    await loadK2UserData(data.session.user);
  } else {
    document.getElementById("authScreen").style.display = "flex";
    document.getElementById("dashboardPage").style.display = "none";
  }
}

supabaseClient.auth.onAuthStateChange((event, session) => {
  if (session && event === "SIGNED_IN") {
    loadK2UserData(session.user);
  }

  if (event === "SIGNED_OUT") {
    window.currentK2User = null;

    K2_DATA_KEYS.forEach(key => {
      localStorage.removeItem(key);
    });

    document.getElementById("authScreen").style.display = "flex";
    document.getElementById("dashboardPage").style.display = "none";
    showLogin();
  }
});

window.addEventListener("load", startK2Authentication);
