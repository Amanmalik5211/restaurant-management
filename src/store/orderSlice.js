import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { clearCart } from './cartSlice';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

export const getUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getUserOrders();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { getState, dispatch, rejectWithValue }) => {
    try {
      const { cart } = getState();
      
      // Create order with calculated totals
      const newOrder = {
        ...orderData,
        items: cart.items.map(item => ({
          ...item,
          priceAtOrder: item.price // Store the price at time of order
        })),
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        total: cart.total,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await orderAPI.create(newOrder);
      
      // Clear the cart after successful order
      dispatch(clearCart());
      toast.success('Order placed successfully!');
      
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to create order');
      return rejectWithValue(error.message);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(orderId);
      toast.success('Order cancelled successfully');
      return response.data;
    } catch (error) {
      toast.error(error.message || 'Failed to cancel order');
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.map(order => ({
          ...order,
          // Ensure all monetary values are in cents
          subtotal: Math.round(order.subtotal),
          tax: Math.round(order.tax),
          shipping: Math.round(order.shipping),
          total: Math.round(order.total)
        }));
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.orders = [];
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex(order => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;