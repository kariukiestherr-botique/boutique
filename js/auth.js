// ===== AUTHENTICATION SYSTEM =====
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('elssyUsers')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('elssyCurrentUser')) || null;
        this.init();
    }

    init() {
        this.loadTheme();
        this.setupEventListeners();
        this.checkExistingSession();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signupFormElement');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Password strength
        const passwordInput = document.getElementById('signupPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Simple validation
        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        // Check if user exists (for demo, using simple check)
        // In real app, this would be API call
        if (email === 'admin@elssyboutique.com' && password === 'admin123') {
            this.currentUser = {
                id: '1',
                name: 'Store Admin',
                email: email,
                role: 'admin'
            };

            localStorage.setItem('elssyCurrentUser', JSON.stringify(this.currentUser));
            
            if (rememberMe) {
                localStorage.setItem('elssyRememberMe', 'true');
            }

            this.showMessage('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            this.showMessage('Invalid email or password', 'error');
        }
    }

    handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showMessage('Please agree to the terms and conditions', 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage('Password must be at least 6 characters long', 'error');
            return;
        }

        // Check if user already exists
        const existingUser = this.users.find(user => user.email === email);
        if (existingUser) {
            this.showMessage('User with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            password: this.hashPassword(password), // In real app, never store plain passwords
            role: 'admin',
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('elssyUsers', JSON.stringify(this.users));

        this.showMessage('Account created successfully! You can now login.', 'success');
        
        // Switch to login form
        setTimeout(() => {
            showLogin();
        }, 2000);
    }

    hashPassword(password) {
        // In a real application, use proper hashing like bcrypt
        // This is just for demonstration
        return btoa(password);
    }

    checkPasswordStrength(password) {
        const strengthBar = document.querySelector('.strength-bar');
        if (!strengthBar) return;

        let strength = 0;
        if (password.length >= 6) strength += 25;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;

        strengthBar.style.width = strength + '%';
        
        if (strength < 50) {
            strengthBar.style.background = '#e53e3e';
        } else if (strength < 75) {
            strengthBar.style.background = '#ed8936';
        } else {
            strengthBar.style.background = '#38a169';
        }
    }

    checkExistingSession() {
        if (this.currentUser) {
            // User is already logged in, redirect to admin
            window.location.href = 'admin.html';
        }
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageEl = document.createElement('div');
        messageEl.className = `auth-message auth-message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            padding: 12px 16px;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-size: 0.875rem;
            font-weight: 500;
            text-align: center;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'success') {
            messageEl.style.background = '#c6f6d5';
            messageEl.style.color = '#22543d';
            messageEl.style.border = '1px solid #9ae6b4';
        } else {
            messageEl.style.background = '#fed7d7';
            messageEl.style.color = '#742a2a';
            messageEl.style.border = '1px solid #feb2b2';
        }

        // Insert message at the top of the active form
        const activeForm = document.querySelector('.auth-form.active');
        const formHeader = activeForm.querySelector('.auth-header');
        formHeader.parentNode.insertBefore(messageEl, formHeader.nextSibling);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 5000);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        const body = document.body;
        const themeToggle = document.querySelector('.theme-toggle-auth i');
        
        if (savedTheme === 'dark') {
            body.classList.replace('light-mode', 'dark-mode');
            if (themeToggle) {
                themeToggle.classList.replace('fa-moon', 'fa-sun');
            }
        }
    }
}

// ===== FORM TOGGLE FUNCTIONS =====
function showSignup() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
}

function showLogin() {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
}

function goToHome() {
    window.location.href = 'index.html';
}

function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle-auth i');
    
    if (body.classList.contains('light-mode')) {
        body.classList.replace('light-mode', 'dark-mode');
        themeToggle.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.replace('dark-mode', 'light-mode');
        themeToggle.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    new AuthSystem();
});

// ===== GLOBAL FUNCTIONS =====
window.showSignup = showSignup;
window.showLogin = showLogin;
window.goToHome = goToHome;
window.toggleTheme = toggleTheme;
