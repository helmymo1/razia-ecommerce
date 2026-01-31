import axios from 'axios';

// In production mode (NODE_ENV=production), use relative /api path (nginx proxies to backend)
// In development, fallback to localhost:5000
const isDev = import.meta.env.DEV;
const API_URL = isDev ? 'http://127.0.0.1:5000/api' : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  },
  getCurrentUser: async () => {
    return api.get('/auth/me'); 
  },
  googleLogin: async (idToken: string) => {
    const response = await api.post('/auth/google', { token: idToken });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  },
  appleLogin: async (idToken: string, user?: any) => {
    const response = await api.post('/auth/apple', { token: idToken, user });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
  }
};

// Helper to generate hex from color name (simple hash or basic colors)
const getColorHex = (name: string) => {
    const colors: {[key: string]: string} = {
        'red': '#ef4444', 'blue': '#3b82f6', 'green': '#22c55e', 'black': '#000000', 
        'white': '#ffffff', 'yellow': '#eab308', 'purple': '#a855f7', 'pink': '#ec4899',
        'gray': '#6b7280', 'orange': '#f97316', 'teal': '#14b8a6', 'cyan': '#06b6d4'
    };
    return colors[name.toLowerCase()] || '#cccccc'; 
};

// In production, use relative path. In dev, use localhost.
export const IMAGE_BASE_URL = import.meta.env.DEV ? 'http://127.0.0.1:5000' : '';

const transformProduct = (product: any) => {
  // Parse colors/sizes if they are strings (from getProductById)
  // or strictly ensure they are arrays
  let sizes = product.sizes;
  if (typeof sizes === 'string') {
      sizes = sizes.split(',').filter(s => s.trim());
  } else if (!Array.isArray(sizes)) {
      sizes = [];
  }

  let colors = product.colors;
  if (typeof colors === 'string') {
      colors = colors.split(',').filter(c => c.trim());
  } else if (!Array.isArray(colors)) {
      colors = [];
  }

  // Ensure colors are objects if they are strings
  colors = colors.map((c: any) => {
      if (typeof c === 'string') {
        // Check if it's already a hex code (starts with #)
        if (c.startsWith('#')) {
          return { name: c, nameAr: c, hex: c };
        }
        // Otherwise try to look up the named color
          return { name: c, nameAr: c, hex: getColorHex(c) };
      }
      return c;
  });

  let images = product.images;
  if (typeof images === 'string') {
    try {
      images = JSON.parse(images);
    } catch (e) {
      images = [];
    }
  } else if (!Array.isArray(images)) {
    images = [];
  }

  // Fallback to image_url if images is empty
  if (images.length === 0 && product.image_url) {
    images = [product.image_url];
  }

  images = images.map((img: string) => img.startsWith('http') ? img : `${IMAGE_BASE_URL}/${img.replace(/^\/+/, '')}`);
  let tags = product.tags;
  if (typeof tags === 'string') {
    try {
      if (tags.startsWith('[')) {
        tags = JSON.parse(tags);
      } else {
        tags = tags.split(',').map(t => t.trim());
      }
    } catch (e) {
      tags = [];
    }
  } else if (!Array.isArray(tags)) {
    tags = [];
  }

  return {
    ...product,
    sizes,
    colors,
    tags,
    images,
    
    // Ensure numeric prices
    price: parseFloat(product.price) || 0,
    originalPrice: product.discount_value && product.discount_type 
        ? (parseFloat(product.price) + parseFloat(product.discount_value)) // Approximation for display if needed
        : undefined,
  };
};

export const productService = {
  getProducts: async (params?: any) => {
    const response = await api.get('/products', { params });
    // Handle paginated response structure { data: [...], pagination: {...} }
    const products = response.data.data || response.data; // Fallback for safety
    return Array.isArray(products) ? products.map(transformProduct) : [];
  },
  getProduct: async (id: any) => {
    const response = await api.get(`/products/${id}`);
    return transformProduct(response.data);
  },
  list: async (params?: any) => {
      // Alias for getProducts to support consistent naming if needed
      return productService.getProducts(params);
  }
};

export const orderService = {
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
};

const transformCategory = (category: any) => {
  let image = category.image;
  if (image && typeof image === 'string' && !image.startsWith('http')) {
    image = `${IMAGE_BASE_URL}/${image.replace(/^\/+/, '')}`;
  }
  return {
    ...category,
    image
  };
};

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    const categories = response.data;
    return Array.isArray(categories) ? categories.map(transformCategory) : [];
  },
};

export default api;
