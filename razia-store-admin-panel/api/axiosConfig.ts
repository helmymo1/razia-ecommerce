import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  // @ts-ignore
  baseURL: `${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}/api`, // Dynamic Config
  withCredentials: true, // Enable sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    // 1. Diagnostic Logging
    const userInfoStr = localStorage.getItem('userInfo');
    console.log('🔍 [Axios] Raw userInfo:', userInfoStr);
    
    let token = localStorage.getItem('token');

    // 2. Safe Parsing & Extraction
    if (!token && userInfoStr) {
        try {
            const parsed = JSON.parse(userInfoStr);
            console.log('🔍 [Axios] Parsed userInfo:', parsed);

            // Check multiple paths for token
            if (parsed.token) token = parsed.token;
            else if (parsed.data && parsed.data.token) token = parsed.data.token;
            // Handle case where userInfo IS the token (rare)
            else if (typeof parsed === 'string') token = parsed;
            
        } catch (e) {
            console.error('❌ [Axios] Error parsing userInfo:', e);
        }
    }

    // Check adminInfo as fallback
    if (!token) {
        const adminInfoStr = localStorage.getItem('adminInfo');
        if (adminInfoStr) {
             try {
                const parsed = JSON.parse(adminInfoStr);
                if (parsed.token) token = parsed.token;
                else if (parsed.data && parsed.data.token) token = parsed.data.token;
             } catch (e) { console.error('Error parsing adminInfo:', e); }
        }
    }

    console.log('✅ [Axios] Final Token to Use:', token ? token.substring(0, 10) + '...' : 'undefined');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper to safely extract array from response
const getArrayData = (response: any) => {
  if (Array.isArray(response.data)) return response.data;
  if (response.data && Array.isArray(response.data.data)) return response.data.data;
  if (response.data && Array.isArray(response.data.products)) return response.data.products;
  if (response.data && Array.isArray(response.data.users)) return response.data.users;
  if (response.data && Array.isArray(response.data.categories)) return response.data.categories;
  return [];
};

export const productService = {
  getAll: async () => {
    const response = await api.get('/products?limit=1000'); // Fetch all for admin
    return getArrayData(response);
  },
  create: async (data: any) => {
    // Check if FormData (file uploads)
    if (data instanceof FormData) {
      return api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' } // Let Axios set boundary
      });
    }
    return api.post('/products', data);
  },
  update: async (id: string, data: any) => {
    if (data instanceof FormData) {
      return api.put(`/products/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put(`/products/${id}`, data);
  },
  delete: async (id: string) => api.delete(`/products/${id}`),
};

export const userService = {
  getAll: async () => {
    const response = await api.get('/users');
    return getArrayData(response);
  },
  create: async (data: any) => api.post('/users', data), // Usually register
  update: async (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: async (id: string) => api.delete(`/users/${id}`),
};

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return getArrayData(response);
  },
  create: async (data: any) => {
    if (data instanceof FormData) {
      return api.post('/categories', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/categories', data);
  },
  update: async (id: string, data: any) => {
    if (data instanceof FormData) {
      return api.put(`/categories/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put(`/categories/${id}`, data);
  },
  delete: async (id: string) => api.delete(`/categories/${id}`),
};


export const authService = {
  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('adminInfo');
    window.location.href = '/#/login';
  }
};

export const orderService = {
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  getAll: async () => {
    // Uses /api/orders/admin to fetch all orders for admin view
    const response = await api.get('/orders/admin');
    return getArrayData(response);
  },
  updateStatus: async (id: string, status: string) => {
    return api.put(`/orders/${id}/status`, { status });
  },
  delete: async (id: string) => {
    return api.delete(`/orders/${id}`);
  },
  processRefund: async (id: string, requestId: string, decision: 'approved' | 'rejected') => {
    return api.put(`/orders/${id}/refund/${requestId}/process`, { decision });
  },
  manageRequest: async (id: string, data: any) => {
    return api.put(`/orders/${id}/manage-request`, data);
  }
};

export default api;
