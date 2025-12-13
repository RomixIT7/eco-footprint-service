// client/src/slices/householdSlice.js (ПОВНИЙ ЧИСТИЙ КОД З ПОСИЛЕНОЮ ПЕРЕВІРКОЮ)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  households: [], // Масив домогосподарств користувача
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// =========================================================
// 1. Асинхронний Thunk: Створення Домогосподарства (POST /api/households)
// =========================================================
export const createHousehold = createAsyncThunk(
  "households/create",
  async (householdData, thunkAPI) => {
    try {
      const userState = thunkAPI.getState().auth.user;
      // Отримуємо токен і перевіряємо його на дійсність
      const token = userState ? userState.token : null;

      // ПОСИЛЕНА ПЕРЕВІРКА: Якщо токен відсутній або занадто короткий
      if (!token || token.length < 10) {
        return thunkAPI.rejectWithValue(
          "Токен авторизації недійсний або відсутній."
        );
      }

      // Налаштування заголовка для авторизації
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post(
        "/api/households",
        householdData,
        config
      );
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
// 2. Асинхронний Thunk: Отримання Домогосподарств (GET /api/households)
// =========================================================
export const getHouseholds = createAsyncThunk(
  "households/getAll",
  async (_, thunkAPI) => {
    try {
      const userState = thunkAPI.getState().auth.user;
      // Отримуємо токен і перевіряємо його на дійсність
      const token = userState ? userState.token : null;

      // ПОСИЛЕНА ПЕРЕВІРКА: Якщо токен відсутній або занадто короткий
      if (!token || token.length < 10) {
        return thunkAPI.rejectWithValue(
          "Токен авторизації недійсний або відсутній."
        );
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get("/api/households", config);
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
// 3. Household Slice
// =========================================================
export const householdSlice = createSlice({
  name: "household",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Створення (Create)
      .addCase(createHousehold.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(createHousehold.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.households.push(action.payload);
      })
      .addCase(createHousehold.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Отримання (Get All)
      .addCase(getHouseholds.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
      })
      .addCase(getHouseholds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.households = action.payload;
      })
      .addCase(getHouseholds.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.households = [];
      });
  },
});

export const { reset } = householdSlice.actions;
export default householdSlice.reducer;
