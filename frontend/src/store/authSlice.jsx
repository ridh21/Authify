import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (token) => {
    const response = await axios.get('http://localhost:8000/api/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  }
);

export const initAuth = createAsyncThunk(
  'auth/initAuth',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token) {
      try {
        const profileData = await dispatch(fetchUserProfile(token)).unwrap();
        localStorage.setItem('user', JSON.stringify(profileData));
        return profileData;
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return null;
      }
    } else if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(initAuth.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { setUser, logout } = authSlice.actions;

export const login = (token, userData = null) => async (dispatch) => {
  localStorage.setItem('token', token);
  
  if (userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch(setUser(userData));
  } else {
    try {
      const profileData = await dispatch(fetchUserProfile(token)).unwrap();
      localStorage.setItem('user', JSON.stringify(profileData));
      dispatch(setUser(profileData));
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }
};

export const updateUser = (userData) => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const profileData = await dispatch(fetchUserProfile(token)).unwrap();
      localStorage.setItem('user', JSON.stringify(profileData));
      dispatch(setUser(profileData));
    } catch (error) {
      localStorage.setItem('user', JSON.stringify(userData));
      dispatch(setUser(userData));
    }
  } else {
    localStorage.setItem('user', JSON.stringify(userData));
    dispatch(setUser(userData));
  }
};

export default authSlice.reducer;
