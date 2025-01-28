import axios from 'axios';
const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

// Create Spoonacular API instance
const spoonacularApi = axios.create({
  baseURL: SPOONACULAR_BASE_URL,
  params: {
    apiKey: SPOONACULAR_API_KEY,
  },
});

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'users',
  CURRENT_USER: 'user',
  TOKEN: 'token',
  CART: 'cart',
  ORDERS: 'orders',
  FAVORITES: 'favorites',
  MENU: 'menu'
};

// Helper functions for local storage
const getLocalData = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocalData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Recipe API endpoints
export const recipeAPI = {
   getAll: async (page = 1, limit = 9) => {
    return await spoonacularApi.get('/complexSearch', {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        offset: (page - 1) * limit,
        number: limit,
        addRecipeInformation: true,
        fillIngredients: true
      }
    });
  },

  search: async ({ query, page = 1, limit = 9, fields = ['title', 'summary', 'diets'] }) => {
    return await spoonacularApi.get('/complexSearch', {
      params: {
        apiKey: SPOONACULAR_API_KEY,
        query,
        offset: (page - 1) * limit,
        number: limit,
        addRecipeInformation: true,
        fillIngredients: true,
        // Add additional parameters for searching in specific fields
        titleMatch: fields.includes('title') ? query : undefined,
        includeIngredients: fields.includes('ingredients') ? query : undefined,
        diet: fields.includes('diets') ? query : undefined,
      }
    });
  }
};

// Order API endpoints
export const orderAPI = {
  create: async (orderData) => {
    try {
      const orders = getLocalData(STORAGE_KEYS.ORDERS, []);
      const currentUser = getLocalData(STORAGE_KEYS.CURRENT_USER);
      
      if (!currentUser) throw new Error('User not authenticated');

      const newOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        userId: currentUser.id,
        ...orderData,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      orders.push(newOrder);
      setLocalData(STORAGE_KEYS.ORDERS, orders);

      return { data: newOrder };
    } catch (error) {
      throw new Error('Failed to create order');
    }
  },

  getUserOrders: async () => {
    try {
      const orders = getLocalData(STORAGE_KEYS.ORDERS, []);
      const currentUser = getLocalData(STORAGE_KEYS.CURRENT_USER);
      
      if (!currentUser) throw new Error('User not authenticated');

      const userOrders = orders
        .filter(order => order.userId === currentUser.id)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return { data: userOrders };
    } catch (error) {
      throw new Error('Failed to fetch orders');
    }
  },

  cancelOrder: async (orderId) => {
    try {
      const orders = getLocalData(STORAGE_KEYS.ORDERS, []);
      const orderIndex = orders.findIndex(order => order.id === orderId);
      
      if (orderIndex === -1) throw new Error('Order not found');
      if (orders[orderIndex].status !== 'pending') {
        throw new Error('Only pending orders can be cancelled');
      }

      orders[orderIndex].status = 'cancelled';
      orders[orderIndex].cancelledAt = new Date().toISOString();
      
      setLocalData(STORAGE_KEYS.ORDERS, orders);
      return { data: orders[orderIndex] };
    } catch (error) {
      throw new Error('Failed to cancel order');
    }
  }
};


// Auth API endpoints
export const authAPI = {
  login: async (credentials) => {
    try {
      const users = getLocalData(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === credentials.email);

      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid email or password');
      }

      const {...userWithoutPassword } = user;
      const token = `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const userData = { user: userWithoutPassword, token };

      setLocalData(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
      setLocalData(STORAGE_KEYS.TOKEN, token);

      return { data: userData };
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  register: async (userData) => {
    try {
      const users = getLocalData(STORAGE_KEYS.USERS, []);
      
      if (users.some(user => user.email === userData.email)) {
        throw new Error('Email already exists');
      }

      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        ...userData,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      setLocalData(STORAGE_KEYS.USERS, users);

      const {...userWithoutPassword } = newUser;
      const token = `token_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      setLocalData(STORAGE_KEYS.CURRENT_USER, userWithoutPassword);
      setLocalData(STORAGE_KEYS.TOKEN, token);

      return { data: { user: userWithoutPassword, token } };
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  logout: async () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        if (key !== 'USERS') localStorage.removeItem(key);
      });
      return { data: { message: 'Logged out successfully' } };
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
};

export { spoonacularApi };