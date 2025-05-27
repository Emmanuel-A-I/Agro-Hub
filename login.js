// ==============================================
// GENERAL UTILITY FUNCTIONS
// ==============================================

/**
 * Toggle password visibility
 */
function setupPasswordToggles() {
    document.querySelectorAll('.toggle-password').forEach(function(icon) {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Initialize tab switching functionality
 */
function setupAuthTabs() {
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginTab && signupTab && loginForm && signupForm) {
        loginTab.addEventListener('click', function() {
            this.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });
        
        signupTab.addEventListener('click', function() {
            this.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
}

// ==============================================
// LOGIN PAGE FUNCTIONALITY
// ==============================================

/**
 * Initialize login form functionality
 */
function setupLoginForm() {
    const loginForm = document.getElementById('loginFormContent');
    if (!loginForm) return;

    // Check for remembered credentials
    if (localStorage.getItem('rememberedEmail')) {
        document.getElementById('loginEmail').value = localStorage.getItem('rememberedEmail');
        document.getElementById('loginPassword').value = localStorage.getItem('rememberedPassword');
        document.getElementById('remember').checked = true;
    }

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const remember = document.getElementById('remember').checked;
        
        // Simple validation
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        
        // Remember credentials if checkbox is checked
        if (remember) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }
        
        // Get user data from localStorage or create empty object
        let users = JSON.parse(localStorage.getItem('users')) || {};
        
        // Check if user exists (for demo, we'll use the first user or create one)
        let user = users[email];
        
        if (!user) {
            // For demo purposes, if user doesn't exist, create a basic profile
            user = {
                fullName: email.split('@')[0], // Use email prefix as name for demo
                email: email,
                phone: '08012345678', // Default phone
                userType: 'farmer', // Default user type
                memberSince: new Date().getFullYear(),
                location: 'Lagos', // Default location
                products: ['Maize', 'Rice'], // Default products
                earnings: '₦2.4M', // Default earnings
                transactions: 87, // Default transactions
                rating: '4.9★' // Default rating
            };
            
            // Save the new user
            users[email] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        // Store current user in session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    });
}

/**
 * Initialize signup form functionality
 */
function setupSignupForm() {
    const signupForm = document.getElementById('signupFormContent');
    if (!signupForm) return;

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('phone').value;
        const userType = document.getElementById('userType').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        // Get existing users or create empty object
        let users = JSON.parse(localStorage.getItem('users')) || {};
        
        // Check if user already exists
        if (users[email]) {
            alert('User with this email already exists!');
            return;
        }
        
        // Create new user object
        const newUser = {
            fullName: fullName,
            email: email,
            phone: phone,
            userType: userType,
            memberSince: new Date().getFullYear(),
            location: 'Lagos', // Default location
            products: ['Maize', 'Rice'], // Default products
            earnings: '₦0', // Start with 0 earnings
            transactions: 0, // Start with 0 transactions
            rating: '0★' // Start with 0 rating
        };
        
        // Save user
        users[email] = newUser;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Store current user in session
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    });
}

// ==============================================
// DASHBOARD PAGE FUNCTIONALITY
// ==============================================

/**
 * Populate user data in the dashboard
 */
function populateUserData(user) {
    // Welcome message
    const welcomeHeading = document.querySelector('.profile-hero-content h2');
    if (welcomeHeading) {
        welcomeHeading.textContent = `Welcome Back, ${user.fullName}`;
    }
    
    // User stats
    const userStats = document.querySelector('.profile-hero-content p');
    if (userStats) {
        const userType = user.userType === 'farmer' ? 'Farmer' : 
                        user.userType === 'buyer' ? 'Buyer/Processor' :
                        user.userType === 'logistics' ? 'Logistics Provider' : 'Agri-business';
        userStats.textContent = `${userType} | ${user.location} | Member Since ${user.memberSince}`;
    }
    
    // Stats numbers
    const statItems = document.querySelectorAll('.stat-item h3');
    if (statItems.length > 0) {
        statItems[0].textContent = user.earnings;
        statItems[1].textContent = user.transactions;
        statItems[2].textContent = user.rating;
    }
    
    // Sidebar user card
    const sidebarUser = document.querySelector('.user-card');
    if (sidebarUser) {
        sidebarUser.querySelector('h3').textContent = user.fullName.split(' ')[0]; // First name only
        const userType = user.userType === 'farmer' ? 'Farmer' : 
                        user.userType === 'buyer' ? 'Buyer/Processor' :
                        user.userType === 'logistics' ? 'Logistics Provider' : 'Agri-business';
        sidebarUser.querySelector('p').textContent = `${userType} | ${user.location}`;
    }
}

/**
 * Setup dashboard navigation
 */
function setupDashboardNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

/**
 * Initialize dashboard functionality
 */
function setupDashboard() {
    // Get current user from session storage
    const user = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!user) {
        // If no user is logged in, redirect to login page
        window.location.href = 'index.html';
        return;
    }
    
    // Populate user data in the dashboard
    populateUserData(user);
    
    // Setup navigation
    setupDashboardNavigation();
    
    // List produce button functionality
    const listProduceBtn = document.getElementById('list-produce-btn');
    if (listProduceBtn) {
        listProduceBtn.addEventListener('click', function() {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('list-produce').classList.add('active');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
        });
    }
}

// ==============================================
// MAIN INITIALIZATION
// ==============================================

/**
 * Initialize the appropriate functionality based on current page
 */
function init() {
    // Common functionality for both pages
    setupPasswordToggles();
    
    // Check which page we're on
    if (document.getElementById('loginFormContent')) {
        // Login page specific functionality
        setupAuthTabs();
        setupLoginForm();
        setupSignupForm();
    } else if (document.querySelector('.dashboard')) {
        // Dashboard page specific functionality
        setupDashboard();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);