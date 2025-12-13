// server/routes/authRoutes.js

const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Маршрути аутентифікації
router.post("/register", registerUser); // Реєстрація
router.post("/login", loginUser); // Вхід

module.exports = router;
