const SUPABASE_URL = "https://pycgdwtefotizmllnulq.supabase.co";

const SUPABASE_KEY = "sb_publishable_DawGJkYujmUDdM8qHPrHIQ_xqk3ejwe";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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
      "Enter a username, valid email and password of at least 6 characters.";
    return;
  }

  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: { username }
    }
  });

  if (error) {
    document.getElementById("authError").textContent = error.message;
    return;
  }

  document.getElementById("authError").textContent =
    "Account created! Check your email to confirm registration, then log in.";
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

supabaseClient.auth.onAuthStateChange((event, session) => {
  const screen = document.getElementById("authScreen");

  if (session) {
    screen.style.display = "none";
    window.currentK2User = session.user;
  } else {
    screen.style.display = "flex";
    window.currentK2User = null;
  }
});
