// server/routes/categoryRoutes.js

const express = require("express");
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Маршрут доступний для всіх
router.get("/", getCategories);

// Маршрути, захищені для Адміністратора (admin)
// protect: перевіряє, чи є дійсний JWT
// admin: перевіряє, чи роль користувача 'admin'
router.route("/").post(protect, admin, createCategory); // Створення категорії

router.route("/:id").delete(protect, admin, deleteCategory); // Видалення категорії

module.exports = router;
