import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ===================================================================
// 💡 ВИПРАВЛЕННЯ: Конфігурація URL для деплойменту (Netlify -> Render)
// ===================================================================

// Отримуємо базовий URL (з Netlify: https://eco-footprint-service.onrender.com)
// Якщо змінна оточення відсутня (наприклад, локально), використовуємо порожній рядок.
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || "";

// Формуємо повний URL для ресурсів користувача
const API_URL = `${API_BASE_URL}/api/auth/`;

// ===================================================================

// Отримуємо користувача з Local Storage
const user = JSON.parse(localStorage.getItem("user"));

const initialState = {
  // Встановлюємо user з LS, якщо він є
  user: user ? user : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

// Реєстрація користувача
export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      // response тепер відправлятиме запит на: https://eco-footprint-service.onrender.com/api/users/
      const response = await axios.post(API_URL, user);

      if (response.data) {
        // Зберігаємо користувача в Local Storage
        localStorage.setItem("user", JSON.stringify(response.data));
      }
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

// Вхід користувача
export const login = createAsyncThunk("auth/login", async (user, thunkAPI) => {
  try {
    // response тепер відправлятиме запит на: https://eco-footprint-service.onrender.com/api/users/login
    const response = await axios.post(API_URL + "login", user);

    if (response.data) {
      // Зберігаємо користувача в Local Storage
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Вихід (Logout)
export const logout = createAsyncThunk("auth/logout", async () => {
  // Видаляємо користувача з Local Storage
  localStorage.removeItem("user");
});

// Слайс
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Редюсер для очищення стану (використовується в Login/Register useEffect cleanup)
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Реєстрація (Register)
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // <-- ЗБЕРЕЖЕННЯ КОРИСТУВАЧА З ТОКЕНОМ
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Вхід (Login)
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload; // <-- ЗБЕРЕЖЕННЯ КОРИСТУВАЧА З ТОКЕНОМ
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Вихід (Logout)
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
