// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../Auth/Authslice';
import searchReducer from './features/searchSlice.js';
const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
  },
});

export default store;
