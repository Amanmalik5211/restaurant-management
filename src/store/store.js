import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';
import menuReducer from './menuSlice';
import orderReducer from './orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    menu: menuReducer,
    orders: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
    
});


export default store;

store.subscribe(() => {
  const state = store.getState();
  try {
    localStorage.setItem('cart', JSON.stringify(state.cart));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }});