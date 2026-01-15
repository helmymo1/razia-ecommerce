// Universal API Client Adapter
// Unifies the API layer while maintaining backward compatibility for legacy scripts.
// This replaces the old fetch-based api.js with an Axios-based one mirroring src/api/apiClient.js

const BASE_URL = 'http://localhost:5000/api';
const IMAGE_BASE_URL = 'http://localhost:5000'; // For static uploads

// Create Axios Instance (Modern Core)
const apiClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Key for Cookie-based Auth
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token (Fallback for when cookies fail)
// Request Interceptor: Attach Token (Fallback for when cookies fail)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized globally
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized access. Redirecting to login...');
            if (!window.location.pathname.includes('login.html')) {
                localStorage.removeItem('admin_token');
                window.location.href = 'login.html';
            }
        }
        return Promise.reject(error);
    }
);

// Modern API Object (Mirrors src/api/apiClient.js structure)
const API = {
    auth: {
        login: (creds) => apiClient.post('/auth/login', creds),
        logout: () => apiClient.post('/auth/logout'),
        register: (data) => apiClient.post('/auth/register', data),
        me: () => apiClient.get('/auth/me')
    },
    products: {
        list: (params) => apiClient.get('/products', { params }),
        getById: (id) => apiClient.get(`/products/${id}`),
        create: (data) => apiClient.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
        update: (id, data) => apiClient.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
        delete: (id) => apiClient.delete(`/products/${id}`)
    },
    categories: { getAll: () => apiClient.get('/categories') },
    orders: { 
        list: (params) => apiClient.get('/orders', { params }), 
        getById: (id) => apiClient.get(`/orders/${id}`) 
    },
    users: { 
        list: () => apiClient.get('/users'), 
        getById: (id) => apiClient.get(`/users/${id}`),
        create: (d) => apiClient.post('/users', d), 
        update: (id, d) => apiClient.put(`/users/${id}`, d), 
        delete: (id) => apiClient.delete(`/users/${id}`) 
    },
    dashboard: { 
        getStats: () => apiClient.get('/dashboard/stats'),
        getRecentOrders: () => apiClient.get('/dashboard/recent-orders'),
        getBestSellers: () => apiClient.get('/dashboard/best-sellers'),
        getLowStock: () => apiClient.get('/dashboard/low-stock'),
        getSalesChart: () => apiClient.get('/dashboard/sales-chart')
    }
};

// Legacy 'api' Adapter (The Bridge)
// dashboard.js, users.js, etc. expect 'api.get(url)' and return direct data.
const api = {
    get: async (url, config) => {
        const res = await apiClient.get(url, config);
        return res.data;
    },
    post: async (url, data, config) => {
        const res = await apiClient.post(url, data, config);
        return res.data;
    },
    put: async (url, data, config) => {
        const res = await apiClient.put(url, data, config);
        return res.data;
    },
    delete: async (url, config) => {
        const res = await apiClient.delete(url, config);
        return res.data;
    }
};

// Legacy 'ProductService' Adapter (if used)
const ProductService = {
    createProduct: (data) => API.products.create(data).then(res => res.data),
    updateProduct: (id, data) => API.products.update(id, data).then(res => res.data),
    deleteProduct: (id) => API.products.delete(id).then(res => res.data)
};

// Expose Globals
window.apiClient = apiClient; // Raw Axios instance
window.API = API;             // Modern Interface
window.IMAGE_BASE_URL = IMAGE_BASE_URL; // Expose Image Base URL
window.api = api;             // Legacy Interface (CRITICAL for current frontend)
window.ProductService = ProductService; // Legacy Service

console.log('Universal API Client Loaded');
