import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recipeAPI } from '../services/api';

export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.getAll(page, limit);
      if (!response.data || !response.data.results) {
        throw new Error('Invalid response format');
      }
      return {
        items: response.data.results,
        totalItems: response.data.totalResults || response.data.results.length
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch menu items');
    }
  }
);

export const searchMenu = createAsyncThunk(
  'menu/searchMenu',
  async ({ query, page, limit, fields }, { rejectWithValue }) => {
    try {
      const response = await recipeAPI.search({
        query,
        page,
        limit,
        fields
      });
      if (!response.data || !response.data.results) {
        throw new Error('Invalid response format');
      }
      return {
        items: response.data.results,
        totalItems: response.data.totalResults || response.data.results.length
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search menu items');
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  searchQuery: '',
  totalItems: 0,
  currentPage: 1,
  itemsPerPage: 9
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    clearSearch: (state) => {
      state.searchQuery = '';
      state.currentPage = 1;
      state.items = [];
      state.totalItems = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items.map(item => ({
          ...item,
          pricePerServing: Math.round(item.pricePerServing * 100) // Convert to cents
        }));
        state.totalItems = action.payload.totalItems;
        state.error = null;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
        state.totalItems = 0;
      })
      .addCase(searchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items.map(item => ({
          ...item,
          pricePerServing: Math.round(item.pricePerServing * 100)
        }));
        state.totalItems = action.payload.totalItems;
        state.error = null;
      })
      .addCase(searchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.totalItems = 0;
      });
  }
});

export const { 
  clearError, 
  setSearchQuery, 
  setCurrentPage, 
  setItemsPerPage, 
  clearSearch 
} = menuSlice.actions;

export default menuSlice.reducer;