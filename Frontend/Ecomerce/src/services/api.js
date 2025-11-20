// API service for handling all backend requests
const API_BASE_URL = '/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Auth APIs
export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });
    return response.json();
  },
  
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    return response.json();
  },
  
  getUserProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  
  updateUserProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile/update/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    return response.json();
  }
};

// Product APIs
export const productAPI = {
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/products/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  
  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products/create/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  },
  
  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/update/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return response.json();
  },
  
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/delete/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Category APIs
export const categoryAPI = {
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  
  getCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  
  createCategory: async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories/create/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData)
    });
    return response.json();
  },
  
  updateCategory: async (id, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories/update/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData)
    });
    return response.json();
  },
  
  deleteCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/delete/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};

// Order APIs
export const orderAPI = {
  getOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  
  getOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return response.json();
  },
  
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/create/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return response.json();
  },
  
  updateOrder: async (id, orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders/update/${id}/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return response.json();
  },
  
  deleteOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/delete/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return response.json();
  }
};