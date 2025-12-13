// server/server.js (ПОВНИЙ КОД)

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Завантаження змінних оточення з .env файлу
dotenv.config({ path: "../.env" });

const app = express();

// Middleware
app.use(express.json()); // Для парсингу JSON-тіла запитів
app.use(cors()); // Дозволяє запити з фронтенду (React)

// -------------------------------------------------------------------
// 1. Підключення до MongoDB
// -------------------------------------------------------------------
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB успішно підключено");
  } catch (error) {
    console.error("Помилка підключення до MongoDB:", error.message);
    process.exit(1);
  }
};

// Запуск функції підключення
connectDB();

// -------------------------------------------------------------------
// 2. Тестовий маршрут
// -------------------------------------------------------------------
app.get("/", (req, res) => {
  res.send("API для веб-сервісу ЕОД працює успішно!");
});

// -------------------------------------------------------------------
// 3. Підключення Маршрутів (Endpoints)
// -------------------------------------------------------------------
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const householdRoutes = require("./routes/householdRoutes");
const recordRoutes = require("./routes/recordRoutes");

// Аутентифікація (UC1)
app.use("/api/auth", authRoutes);

// Категорії (Довідники, UC6)
app.use("/api/categories", categoryRoutes);

// Домогосподарства (UC2)
app.use("/api/households", householdRoutes);

// Записи споживання (UC3, UC4)
app.use("/api/records", recordRoutes);

// -------------------------------------------------------------------
// 4. Запуск сервера
// -------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
