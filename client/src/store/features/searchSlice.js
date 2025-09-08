import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCourses = createAsyncThunk(
  'search/fetchCourses',
  async (searchTerm, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/s', {
        params: { searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.courses;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching courses');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    searchTerm: '',
    courses: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    clearSearch(state) {
      state.searchTerm = '';
      state.courses = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, clearSearch } = searchSlice.actions;

export default searchSlice.reducer;
