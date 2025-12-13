// client/src/slices/categorySlice.js (ПОВНИЙ КОД)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  categories: [],
  isLoading: false,
  isError: false,
  message: "",
};

const API_URL = "/api/categories/";

// Допоміжна функція для отримання config із токеном (для захищених маршрутів)
const getConfig = (thunkAPI) => {
  const user = thunkAPI.getState().auth.user;
  const token = user ? user.token : null;

  if (!token || token.length < 10) {
    // Якщо категорії не захищені, ця перевірка може бути опущена,
    // але для безпеки залишаємо.
    throw new Error("Токен авторизації відсутній.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =========================================================
// 1. Асинхронний Thunk: Отримання Категорій (GET /api/categories)
// =========================================================
export const getCategories = createAsyncThunk(
  "categories/getAll",
  async (_, thunkAPI) => {
    try {
      // Категорії можуть бути незахищеним маршрутом, але ми використовуємо
      // config, якщо користувач авторизований, для універсальності.
      const config = thunkAPI.getState().auth.user ? getConfig(thunkAPI) : {};

      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// =========================================================
// 2. Category Slice
// =========================================================
export const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.categories = [];
      });
  },
});

export const { reset } = categorySlice.actions;
export default categorySlice.reducer;
