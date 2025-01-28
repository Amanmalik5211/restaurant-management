import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  total: 0,
  subtotal: 0,
  tax: 0,
  shipping: 0,
  loading: false,
  error: null,
};

// Try to load initial state from localStorage
try {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    Object.assign(initialState, {
      items: parsedCart.items || [],
      total: parsedCart.total || 0,
      subtotal: parsedCart.subtotal || 0,
      tax: parsedCart.tax || 0,
      shipping: parsedCart.shipping || 0,
    });
  }
} catch (error) {
  console.error('Failed to load cart from localStorage:', error);
}

const calculateTotals = (state) => {
  state.subtotal = state.items.reduce(
    (sum, item) => sum + (item.pricePerServing * item.quantity),
    0
  );
  state.tax = Math.round(state.subtotal * 0.1);
  state.shipping = state.subtotal >= 5000 ? 0 : 500;
  state.total = state.subtotal + state.tax + state.shipping;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (existingItem) {
        existingItem.quantity = Math.min(10, existingItem.quantity + 1);
      } else {
        state.items.push({ ...newItem, quantity: 1 });
      }

      calculateTotals(state);
      localStorage.setItem('cart', JSON.stringify(state));
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      calculateTotals(state);
      localStorage.setItem('cart', JSON.stringify(state));
    },

    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        item.quantity = Math.max(1, Math.min(10, parseInt(quantity, 10)));
        calculateTotals(state);
        localStorage.setItem('cart', JSON.stringify(state));
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.subtotal = 0;
      state.tax = 0;
      state.shipping = 0;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    loadCart: (state) => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          state.items = parsedCart.items || [];
          state.total = parsedCart.total || 0;
          state.subtotal = parsedCart.subtotal || 0;
          state.tax = parsedCart.tax || 0;
          state.shipping = parsedCart.shipping || 0;
        }
      } catch (error) {
        console.error('Failed to load cart:', error);
        state.error = 'Failed to load cart';
      }
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  loadCart 
} = cartSlice.actions;

export default cartSlice.reducer;