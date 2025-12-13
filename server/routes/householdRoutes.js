// server/routes/householdRoutes.js

const express = require("express");
const {
  createHousehold,
  getHouseholds,
} = require("../controllers/householdController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .post(protect, createHousehold) // Створення (захищено)
  .get(protect, getHouseholds); // Отримання (захищено, UC2)

module.exports = router;
