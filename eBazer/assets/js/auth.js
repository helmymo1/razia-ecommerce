// Global Auth Object (Compatible with login.html)
const auth = {
    async login(email, password) {
        try {
            // Using the universal 'api' object from api.js
            const response = await window.api.post('/auth/login', {
                email: email,
                password: password
            });

            // The response from api.post is directly the data object
            const data = response;

            // 1. Role Verification
            if (data.user && data.user.role !== 'admin') {
                alert("Access Denied: Admins Only.");
                return false;
            }

            // 2. Success: Save Token & User
            if (data.token) {
                localStorage.setItem('admin_token', data.token);
                localStorage.setItem('admin_user', JSON.stringify(data.user));
                localStorage.setItem('isLoggedIn', 'true');
                return true;
            } else {
                console.error("Login failed: No token received.");
                return false;
            }

        } catch (err) {
            console.error('Login Error:', err);
            // Show user-friendly error
            const errorMsg = err.response?.data?.message || err.message || 'Login failed';
            alert(errorMsg);
            return false;
        }
    },

    logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    },

    isAuthenticated() {
        return !!localStorage.getItem('admin_token');
    },

    getUser() {
        try {
            return JSON.parse(localStorage.getItem('admin_user'));
        } catch (e) {
            return null;
        }
    },

    checkAuth() {
        if (!localStorage.getItem('admin_token') && !window.location.href.includes('login.html')) {
            window.location.href = 'login.html';
        }
    }
};

// Alpine.js Handler (for future use with Alpine-based forms)
if (typeof Alpine !== 'undefined') {
    document.addEventListener('alpine:init', () => {
        Alpine.data('authHandler', () => ({
            email: '',
            password: '',
            loading: false,
            error: null,

            async login() {
                this.loading = true;
                this.error = null;

                try {
                    const response = await window.api.post('/auth/login', {
                        email: this.email,
                        password: this.password
                    });

                    const data = response;

                    // Role Verification
                    if (data.user && data.user.role !== 'admin') {
                        throw new Error("Access Denied: Admins Only.");
                    }

                    // Success: Save Token & User
                    if (data.token) {
                        localStorage.setItem('admin_token', data.token);
                        localStorage.setItem('admin_user', JSON.stringify(data.user));
                        localStorage.setItem('isLoggedIn', 'true');
                        
                        window.location.href = 'index.html';
                    } else {
                        throw new Error("Login failed: No token received.");
                    }

                } catch (err) {
                    console.error('Login Error:', err);
                    this.error = err.response?.data?.message || err.message || 'Login failed';
                    
                    // Ensure no partial auth state exists
                    auth.logout();
                } finally {
                    this.loading = false;
                }
            },

            logout() {
                auth.logout();
            }
        }));
    });
}

// Auto-check on load (skip if on login page)
if (!window.location.href.includes('login.html')) {
    auth.checkAuth();
}

// Expose globally
window.auth = auth;
