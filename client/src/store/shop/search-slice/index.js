import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  searchResults: [],
  autocompleteResults: [],
  isAutocompleteLoading: false,
};

export const getSearchResults = createAsyncThunk(
  "/order/getSearchResults",
  async (keyword) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/search/${keyword}`
    );

    return response.data;
  }
);

export const getAutocompleteResults = createAsyncThunk(
  "/search/getAutocompleteResults",
  async (keyword) => {
    console.log('📡 Making autocomplete API call for:', keyword);
    const response = await axios.get(
      `http://localhost:5000/api/shop/autocomplete/${keyword}`
    );

    console.log('📡 Autocomplete API response:', response.data);
    return response.data;
  }
);

const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
    resetAutocompleteResults: (state) => {
      state.autocompleteResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(getSearchResults.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      })
      .addCase(getAutocompleteResults.pending, (state) => {
        state.isAutocompleteLoading = true;
      })
      .addCase(getAutocompleteResults.fulfilled, (state, action) => {
        state.isAutocompleteLoading = false;
        state.autocompleteResults = action.payload.data;
      })
      .addCase(getAutocompleteResults.rejected, (state) => {
        state.isAutocompleteLoading = false;
        state.autocompleteResults = [];
      });
  },
});

export const { resetSearchResults, resetAutocompleteResults } = searchSlice.actions;

export default searchSlice.reducer;
