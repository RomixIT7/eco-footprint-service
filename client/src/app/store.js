// client/src/app/store.js (ОНОВЛЕННЯ)

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import householdReducer from "../slices/householdSlice"; // <-- ІМПОРТ

export const store = configureStore({
  reducer: {
    auth: authReducer,
    household: householdReducer, // <-- ДОДАВАННЯ
    // Тут будуть додаватися інші редьюсери (record, etc.)
  },
});
