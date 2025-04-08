import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user:  JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUserStart: (state) => {
      state.loading = true;
    },
    registerUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.userData;
      state.token = action.payload.token; // Store token in Redux
    },
    registerUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  registerUserStart,
  registerUserSuccess,
  registerUserFailure,
} = authSlice.actions;

export default authSlice.reducer;
