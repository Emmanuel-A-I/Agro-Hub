
// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart if it doesn't exist
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Update cart count on page load
    updateCartCount();

    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.btn-action ion-icon[name="bag-add-outline"], .add-to-cart, .banner-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productElement = this.closest('.showcase, .product-card, .product-featured, .slider-item');
            addToCart(productElement);
        });
    });

    // Function to add item to cart
    function addToCart(productElement) {
        const cart = JSON.parse(localStorage.getItem('cart'));
        
        // Get product details - more robust selection
        let productName, productPrice, productImage, productCategory;
        
        // Try different selectors to find product info
        productName = productElement.querySelector('.showcase-title, .product-title, .banner-title')?.textContent || 'Unknown Product';
        
        const priceElement = productElement.querySelector('.price, .banner-text b');
        productPrice = priceElement ? parseFloat(priceElement.textContent.replace(/[^0-9.]/g, '')) : 0;
        
        productImage = productElement.querySelector('img')?.src || '';
        productCategory = productElement.querySelector('.showcase-category, .product-category')?.textContent || 'General';
        
        // Generate a more reliable ID
        const productId = productName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5);
        
        const product = {
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            category: productCategory,
            quantity: 1
        };

        // Check if product already exists in cart
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push(product);
        }

        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        updateCartCount();
        
        // Show confirmation
        alert(`${product.name} has been added to your cart!`);
    }

    // Function to update cart count in the UI
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update all cart count elements
        document.querySelectorAll('.cart-count, .action-btn .count').forEach(element => {
            element.textContent = totalItems;
        });
    }
});


let totalCart = document.getElementById('total');
document.querySelector("#keep").addEventListener("click", function(){
    if (totalCart.textContent.trim() === '₦0.00') {
        alert('Your cart is empty!');
    }
    else {
        let name1 = prompt("Full Name");
        if (!name1) return; // Exit if user cancels prompt
        
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






























// Currency configuration with conversion rates
const currencyRates = {
  usd: { symbol: '$', rate: 1, name: 'USD' },
  ngn: { symbol: '₦', rate: 1500, name: 'NGN' },
  eur: { symbol: '€', rate: 0.92, name: 'EUR' }
};

// Store current currency in localStorage for cross-page consistency
function setCurrency(currencyCode) {
  localStorage.setItem('selectedCurrency', currencyCode);
  applyCurrencyConversion(currencyCode);
}

// Apply currency conversion to the current page
function applyCurrencyConversion(currencyCode) {
  const currency = currencyRates[currencyCode];
  if (!currency) return;

  // Convert all price elements
  document.querySelectorAll('[data-original-price]').forEach(element => {
    const originalPrice = parseFloat(element.getAttribute('data-original-price'));
    const convertedPrice = (originalPrice * currency.rate).toFixed(2);
    element.textContent = `${currency.symbol}${convertedPrice}`;
  });

  // Update currency selector to match
  const currencySelect = document.getElementById('currency');
  if (currencySelect) {
    currencySelect.value = currencyCode;
  }
}

// Initialize currency on page load
function initCurrency() {
  // Get stored currency or default to USD
  const savedCurrency = localStorage.getItem('selectedCurrency') || 'usd';
  
  // Set all original prices (only needs to happen once)
  if (!document.body.hasAttribute('data-prices-set')) {
    document.querySelectorAll('.price, [data-price]').forEach(element => {
      const priceText = element.textContent;
      const priceValue = parseFloat(priceText.replace(/[^0-9.]/g, ''));
      element.setAttribute('data-original-price', priceValue);
    });
    document.body.setAttribute('data-prices-set', 'true');
  }

  // Apply current currency
  applyCurrencyConversion(savedCurrency);
}

// Main currency selector handler
document.addEventListener('DOMContentLoaded', function() {
  initCurrency();

  const currencySelect = document.getElementById('currency');
  if (currencySelect) {
    currencySelect.addEventListener('change', function() {
      setCurrency(this.value);
    });
  }
});

// Cart-specific currency handling (put this in cart.html)
function initCartCurrency() {
  const savedCurrency = localStorage.getItem('selectedCurrency') || 'usd';
  const currency = currencyRates[savedCurrency];
  
  // Convert cart items
  document.querySelectorAll('.cart-item-price').forEach(element => {
    const originalPrice = parseFloat(element.getAttribute('data-original-price'));
    const convertedPrice = (originalPrice * currency.rate).toFixed(2);
    element.textContent = `${currency.symbol}${convertedPrice}`;
  });

  // Convert totals
  const subtotal = parseFloat(document.querySelector('.subtotal').getAttribute('data-original-price'));
  const total = parseFloat(document.querySelector('.total-price').getAttribute('data-original-price'));
  
  if (!isNaN(subtotal)) {
    document.querySelector('.subtotal').textContent = 
      `${currency.symbol}${(subtotal * currency.rate).toFixed(2)}`;
  }
  
  if (!isNaN(total)) {
    document.querySelector('.total-price').textContent = 
      `${currency.symbol}${(total * currency.rate).toFixed(2)}`;
  }

  // Set currency selector
  const currencySelect = document.getElementById('currency');
  if (currencySelect) {
    currencySelect.value = savedCurrency;
    currencySelect.addEventListener('change', function() {
      setCurrency(this.value);
      location.reload(); // Refresh to apply currency to cart calculations
    });
  }
}

// In cart.html, call this instead of initCurrency()
if (document.querySelector('.cart-container')) {
  document.addEventListener('DOMContentLoaded', initCartCurrency);
}