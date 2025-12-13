// client/src/app/store.js

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import householdReducer from "../slices/householdSlice";
import recordReducer from "../slices/recordSlice";
import categoryReducer from "../slices/categorySlice"; // <-- 1. ІМПОРТ

export const store = configureStore({
  reducer: {
    auth: authReducer,
    household: householdReducer,
    record: recordReducer,
    category: categoryReducer, // <-- 2. РЕЄСТРАЦІЯ (важливо, щоб назва ключа була 'category')
  },
});
