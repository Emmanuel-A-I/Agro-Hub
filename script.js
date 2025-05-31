// Cart functionality
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart if it doesn't exist
  if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
  }

  // Update cart count on page load
  updateCartCount();

  // Add event listeners to all "Add to Cart" buttons
  document
    .querySelectorAll(
      '.btn-action ion-icon[name="bag-add-outline"], .add-to-cart, .banner-btn'
    )
    .forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const productElement = this.closest(
          ".showcase, .product-card, .product-featured, .slider-item"
        );
        addToCart(productElement);
      });
    });

  // Function to add item to cart
  function addToCart(productElement) {
    const cart = JSON.parse(localStorage.getItem("cart"));

    // Get product details
    let productName, productPrice, productImage, productCategory;

    productName =
      productElement.querySelector(
        ".showcase-title, .product-title, .banner-title"
      )?.textContent || "Unknown Product";

    const priceElement = productElement.querySelector(".price, .banner-text b");
    productPrice = priceElement
      ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ""))
      : 0;

    productImage = productElement.querySelector("img")?.src || "";
    productCategory =
      productElement.querySelector(".showcase-category, .product-category")
        ?.textContent || "General";

    // Generate ID
    const productId =
      productName.toLowerCase().replace(/\s+/g, "-") +
      "-" +
      Math.random().toString(36).substr(2, 5);

    const product = {
      id: productId,
      name: productName,
      price: productPrice,
      image: productImage,
      category: productCategory,
      quantity: 1,
    };

    // Check if product exists in cart
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(product);
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show confirmation
    alert(`${product.name} has been added to your cart!`);
  }

  // Function to update cart count
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    // Update all cart count elements
    document
      .querySelectorAll(".cart-count, .action-btn .count")
      .forEach((element) => {
        element.textContent = totalItems;
      });
  }
});

// Checkout functionality
let totalCart = document.getElementById("total");
document.querySelector("#keep").addEventListener("click", function () {
  if (totalCart.textContent.trim() === "₦0.00") {
    alert("Your cart is empty!");
  } else {
    let name1 = prompt("Full Name");
    if (!name1) return;

    let country = prompt("Country");
    let address = prompt("Shipping Address");
    let phone = prompt("Phone Number");

    let firstChar = name1.charAt(0).toUpperCase();
    let lastChars = name1.slice(1);

    alert(`Name: ${firstChar}${lastChars}
Country: ${country}
Address: ${address}
Phone: ${phone}

If these details are correct, kindly deposit the exact amount of your items here:
8141267743 (OPay) and send your deposit slip to our online support for confirmation.`);
  }
});

// Currency configuration
const currencyRates = {
  usd: { symbol: "$", rate: 1, name: "USD" },
  ngn: { symbol: "₦", rate: 1500, name: "NGN" },
  eur: { symbol: "€", rate: 0.92, name: "EUR" },
};

// Store current currency
function setCurrency(currencyCode) {
  localStorage.setItem("selectedCurrency", currencyCode);
  applyCurrencyConversion(currencyCode);
}

// Apply currency conversion
function applyCurrencyConversion(currencyCode) {
  const currency = currencyRates[currencyCode];
  if (!currency) return;

  // Convert all price elements
  document.querySelectorAll("[data-original-price]").forEach((element) => {
    const originalPrice = parseFloat(
      element.getAttribute("data-original-price")
    );
    const convertedPrice = (originalPrice * currency.rate).toFixed(2);
    element.textContent = `${currency.symbol}${convertedPrice}`;
  });

  // Update currency selector
  const currencySelect = document.getElementById("currency");
  if (currencySelect) {
    currencySelect.value = currencyCode;
  }
}

// Initialize currency
function initCurrency() {
  const savedCurrency = localStorage.getItem("selectedCurrency") || "usd";

  if (!document.body.hasAttribute("data-prices-set")) {
    document.querySelectorAll(".price, [data-price]").forEach((element) => {
      const priceText = element.textContent;
      const priceValue = parseFloat(priceText.replace(/[^0-9.]/g, ""));
      element.setAttribute("data-original-price", priceValue);
    });
    document.body.setAttribute("data-prices-set", "true");
  }

  applyCurrencyConversion(savedCurrency);
}

// Main currency selector
document.addEventListener("DOMContentLoaded", function () {
  initCurrency();

  const currencySelect = document.getElementById("currency");
  if (currencySelect) {
    currencySelect.addEventListener("change", function () {
      setCurrency(this.value);
    });
  }
});

// Simplified form handling - only signup functionality
document.addEventListener("DOMContentLoaded", function () {
  // Tab switching between login and signup
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupFormDiv = document.getElementById("signupForm");

  loginTab.addEventListener("click", function () {
    loginTab.classList.add("active");
    signupTab.classList.remove("active");
    loginForm.classList.add("active");
    signupFormDiv.classList.remove("active");
  });

  signupTab.addEventListener("click", function () {
    signupTab.classList.add("active");
    loginTab.classList.remove("active");
    signupFormDiv.classList.add("active");
    loginForm.classList.remove("active");
  });

  // Signup form submission - no validation
  const signupForm = document.getElementById("signupFormContent");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      createNewProfile();
    });
  }

  // Toggle password visibility
  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", function () {
      const input = this.previousElementSibling;
      if (input.type === "password") {
        input.type = "text";
        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");
      } else {
        input.type = "password";
        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");
      }
    });
  });
});

// Create profile without validation
function createNewProfile() {
  // Get form values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const userType = document.getElementById("userType").value;

  // Create user profile object
  const userProfile = {
    fullName: fullName,
    email: email,
    phone: phone,
    userType: userType,
    joinDate: new Date().toLocaleDateString(),
    verified: false,
    profilePic: "images/default-avatar.jpg",
  };

  // Store in localStorage
  localStorage.setItem("currentUser", JSON.stringify(userProfile));

  // Redirect to dashboard
  window.location.href = "dashboard.html";

  // Show success message
  alert("Account created successfully! Welcome to Agro Hub.");
}

// Add this script at the end of your existing JavaScript, before the closing </script> tag

// ======================
// USER SETTINGS SECTION
// ======================

// User settings data model
const userSettings = {
  profile: {
    firstName: "Ngozi",
    lastName: "Okonkwo",
    email: "ngozi.okonkwo@example.com",
    phone: "+2348123456789",
    location: "Abuja",
    farmSize: "5 acres",
    farmType: "Maize Farming",
    bio: "Experienced maize farmer with 10 years of experience",
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: true,
    priceAlerts: true,
    marketTrends: true,
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
  },
  kycStatus: {
    verified: false,
    documents: [],
    verificationDate: null,
  },
};

// Create settings section (hidden by default)
const settingsSection = document.createElement("section");
settingsSection.id = "settings";
settingsSection.className = "section";
settingsSection.style.display = "none"; // Hide by default
settingsSection.innerHTML = `
    <div class="card">
        <div class="card-header">
            <h3>Account Settings</h3>
            <a href="#" class="nav-link" data-section="dashboard"><i class="fas fa-arrow-left"></i> Back to Dashboard</a>
        </div>
        <div class="settings-tabs">
            <div class="tabs-header">
                <button class="tab-btn active" data-tab="profile">Profile</button>
                <button class="tab-btn" data-tab="notifications">Notifications</button>
                <button class="tab-btn" data-tab="security">Security</button>
                <button class="tab-btn" data-tab="kyc">KYC Verification</button>
            </div>
            
            <div class="tab-content active" id="profile-tab">
                <form id="profile-form">
                    <!-- Form content remains the same -->
                </form>
            </div>
            
            <div class="tab-content" id="notifications-tab">
                <form id="notifications-form">
                    <!-- Form content remains the same -->
                </form>
            </div>
            
            <div class="tab-content" id="security-tab">
                <form id="security-form">
                    <!-- Form content remains the same -->
                </form>
            </div>
            
            <div class="tab-content" id="kyc-tab">
                <!-- KYC content remains the same -->
            </div>
        </div>
    </div>
`;

// Add settings section to container
document.querySelector(".container").appendChild(settingsSection);

// Add CSS for settings and KYC
const styleElement = document.createElement("style");
styleElement.innerHTML = `
    /* All the CSS styles from previous implementation */
`;
document.head.appendChild(styleElement);

// Initialize settings forms with current values
function initializeSettingsForms() {
  // Same initialization code as before
}

// Tab switching functionality
function setupTabSwitching() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // Same tab switching code as before
    });
  });
}

// Form submission handlers
function setupFormHandlers() {
  // Same form handler code as before
}

// Helper function to show alerts
function showAlert(message, type) {
  // Same alert code as before
}

// Initialize everything when settings link is clicked
document
  .querySelector('.menu a[href="#"]:last-child')
  .addEventListener("click", function (e) {
    e.preventDefault();

    // Hide all sections
    document.querySelectorAll(".section").forEach((section) => {
      section.style.display = "none";
    });

    // Show settings section
    settingsSection.style.display = "block";

    // Initialize forms and handlers if not already done
    if (!settingsSection.dataset.initialized) {
      initializeSettingsForms();
      setupTabSwitching();
      setupFormHandlers();
      settingsSection.dataset.initialized = "true";
    }

    // Update active nav link
    navLinks.forEach((nav) => nav.classList.remove("active"));
  });

// Update your existing showSection function to hide settings when showing other sections
const originalShowSection = showSection;
showSection = function (sectionId) {
  // Hide settings when showing other sections
  if (sectionId !== "settings") {
    settingsSection.style.display = "none";
  }
  originalShowSection(sectionId);
};
