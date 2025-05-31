import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
  genreList: [],
  categoryList: [],
  brandList: [],
};

// FETCH and ADD operations
export const getFeatureImages = createAsyncThunk("common/getFeatureImages", async () => {
  const response = await axios.get("http://localhost:5000/api/common/feature/get");
  return response.data;
});

export const addFeatureImage = createAsyncThunk("common/addFeatureImage", async (image) => {
  const response = await axios.post("http://localhost:5000/api/common/feature/add", { image });
  return response.data;
});

export const getGenres = createAsyncThunk("common/getGenres", async () => {
  const response = await axios.get("http://localhost:5000/api/genres");
  return response.data;
});

export const addGenre = createAsyncThunk("common/addGenre", async (name) => {
  const response = await axios.post("http://localhost:5000/api/genres", { name });
  return response.data;
});

export const deleteGenre = createAsyncThunk("common/deleteGenre", async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/genres/${id}`);
  return response.data;
});

export const getCategories = createAsyncThunk("common/getCategories", async () => {
  const response = await axios.get("http://localhost:5000/api/categories");
  return response.data;
});

export const addCategory = createAsyncThunk("common/addCategory", async (name) => {
  const response = await axios.post("http://localhost:5000/api/categories", { name });
  return response.data;
});

export const deleteCategory = createAsyncThunk("common/deleteCategory", async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/categories/${id}`);
  return response.data;
});

export const getBrands = createAsyncThunk("common/getBrands", async () => {
  const response = await axios.get("http://localhost:5000/api/brands");
  return response.data;
});

export const addBrand = createAsyncThunk("common/addBrand", async (name) => {
  const response = await axios.post("http://localhost:5000/api/brands", { name });
  return response.data;
});

export const deleteBrand = createAsyncThunk("common/deleteBrand", async (id) => {
  const response = await axios.delete(`http://localhost:5000/api/brands/${id}`);
  return response.data;
});


// Slice
const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {},
extraReducers: (builder) => {
  builder
    // FEATURE IMAGES
    .addCase(getFeatureImages.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getFeatureImages.fulfilled, (state, action) => {
      state.isLoading = false;
      state.featureImageList = action.payload.data;
    })
    .addCase(getFeatureImages.rejected, (state) => {
      state.isLoading = false;
      state.featureImageList = [];
    })

    // GENRE
    .addCase(getGenres.fulfilled, (state, action) => {
      state.genreList = action.payload.data;
    })
    .addCase(addGenre.fulfilled, (state, action) => {
      state.genreList.push(action.payload.data);
    })
    .addCase(deleteGenre.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      state.genreList = state.genreList.filter((g) => g._id !== deletedId);
    })

    // CATEGORY
    .addCase(getCategories.fulfilled, (state, action) => {
      state.categoryList = action.payload.data;
    })
    .addCase(addCategory.fulfilled, (state, action) => {
      state.categoryList.push(action.payload.data);
    })
    .addCase(deleteCategory.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      state.categoryList = state.categoryList.filter((c) => c._id !== deletedId);
    })

    // BRAND
    .addCase(getBrands.fulfilled, (state, action) => {
      state.brandList = action.payload.data;
    })
    .addCase(addBrand.fulfilled, (state, action) => {
      state.brandList.push(action.payload.data);
    })
    .addCase(deleteBrand.fulfilled, (state, action) => {
      const deletedId = action.meta.arg;
      state.brandList = state.brandList.filter((b) => b._id !== deletedId);
    });
},
});

export default commonSlice.reducer;
