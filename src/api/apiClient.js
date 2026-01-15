import axios from 'axios';

/**
 * @typedef {Object} Credentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} UserData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} ProductParams
 * @property {string} [search]
 * @property {string} [category]
 * @property {number} [minPrice]
 * @property {number} [maxPrice]
 */

// Environment Handling
// Defaulting to localhost for dev if not set
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios Instance
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Send Cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (Simplified - No manual token attachment needed for Cookies)
apiClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle Global Errors (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized access. Clearing token and redirecting...');
            localStorage.removeItem('token');
            // Optional: Dispatch a global event or redirect
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);

/**
 * Unified API Client
 */
const API = {
    /** Auth Methods */
    auth: {
        /**
         * Login user
         * @param {Credentials} credentials 
         */
        login: (credentials) => apiClient.post('/auth/login', credentials),
        
        /**
         * Register new user
         * @param {UserData} userData 
         */
        register: (userData) => apiClient.post('/auth/register', userData),
    },

    /** Product Methods */
    products: {
        /**
         * List all products with filters
         * @param {ProductParams} [params] 
         */
        list: (params = {}) => apiClient.get('/products', { params }),
        
        /**
         * Get single product details
         * @param {string|number} id 
         */
        getById: (id) => apiClient.get(`/products/${id}`),

        /**
         * Create product (Admin)
         * @param {FormData} formData 
         */
        create: (formData) => apiClient.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

        /**
         * Update product (Admin)
         * @param {string|number} id 
         * @param {FormData} formData 
         */
        update: (id, formData) => apiClient.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }),

        /**
         * Delete product (Admin)
         * @param {string|number} id 
         */
        delete: (id) => apiClient.delete(`/products/${id}`),
    },

    /** Order Methods */
    orders: {
        /**
         * Create a new order
         * @param {Object} orderData 
         * @param {Array<{product_id: number, quantity: number, price: number}>} orderData.order_items
         * @param {number} orderData.total_amount
         * @param {number} orderData.user_id
         */
        create: (orderData) => apiClient.post('/orders', orderData),
        
        /**
         * Get order by ID
         * @param {string|number} id 
         */
        getById: (id) => apiClient.get(`/orders/${id}`),
    },

    /** Cart Methods */
    cart: {
        get: () => apiClient.get('/cart'),
        add: (productId, quantity = 1) => apiClient.post('/cart', { product_id: productId, quantity }),
        remove: (itemId) => apiClient.delete(`/cart/${itemId}`),
    },

    /** Categories Methods */
    categories: {
        getAll: () => apiClient.get('/categories'),
    },

    /** Wishlist Methods */
    wishlist: {
        get: () => apiClient.get('/wishlist'),
        add: (productId) => apiClient.post('/wishlist', { product_id: productId }),
        remove: (productId) => apiClient.delete(`/wishlist/${productId}`),
    },
    
    /** Reviews Methods */
    reviews: {
        getByProduct: (productId) => apiClient.get(`/reviews/product/${productId}`),
        add: (reviewData) => apiClient.post('/reviews', reviewData),
    },

    /** Address Methods */
    addresses: {
        getAll: () => apiClient.get('/addresses'),
        add: (addressData) => apiClient.post('/addresses', addressData),
        delete: (id) => apiClient.delete(`/addresses/${id}`),
    },

    /** Coupon Methods */
    coupons: {
        verify: (code) => apiClient.post('/coupons/verify', { code }),
    },
};

export default API;
