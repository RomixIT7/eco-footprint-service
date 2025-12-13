// client/src/slices/recordSlice.js (ПОВНИЙ ЧИСТИЙ КОД REDUX SLICE)

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  records: [],
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

const API_URL = "/api/records/";

// Допоміжна функція для отримання config із токеном
const getConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth.user.token;
  if (!token || token.length < 10) {
    throw new Error("Токен авторизації відсутній.");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// =========================================================
// 1. Асинхронний Thunk: Створення Запису (POST /api/records)
// =========================================================
export const createRecord = createAsyncThunk(
  "records/create",
  async (recordData, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.post(API_URL, recordData, config);
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
// 2. Асинхронний Thunk: Отримання Записів (GET /api/records/:householdId)
// =========================================================
export const getRecords = createAsyncThunk(
  "records/getAll",
  async (householdId, thunkAPI) => {
    try {
      const config = getConfig(thunkAPI);
      const response = await axios.get(API_URL + householdId, config);
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
// 3. Record Slice
// =========================================================
export const recordSlice = createSlice({
  name: "record",
  initialState,
  reducers: {
    reset: (state) => initialState,
    resetSuccess: (state) => {
      state.isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Створення (Create)
      .addCase(createRecord.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(createRecord.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.records.unshift(action.payload);
      })
      .addCase(createRecord.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Отримання (Get All)
      .addCase(getRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.records = action.payload;
      })
      .addCase(getRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.records = [];
      });
  },
});

export const { reset, resetSuccess } = recordSlice.actions;
export default recordSlice.reducer;
