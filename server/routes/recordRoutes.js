// server/routes/recordRoutes.js

const express = require("express");
const {
  createRecord,
  getRecordsByHousehold,
} = require("../controllers/recordController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, createRecord); // Створення запису (UC3)

router.route("/:householdId").get(protect, getRecordsByHousehold); // Отримання записів (UC4)

module.exports = router;
