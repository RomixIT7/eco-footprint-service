// server/controllers/categoryController.js

const Category = require("../models/Category");

// @desc    Отримати всі категорії
// @route   GET /api/categories
// @access  Public (або Protected, але для обліку краще Public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання категорій" });
  }
};

// @desc    Створити нову категорію (UC6)
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  const { name, unit, emissionFactor, description } = req.body;

  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Категорія вже існує" });
    }

    const category = await Category.create({
      name,
      unit,
      emissionFactor,
      description,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Помилка створення категорії" });
  }
};

// @desc    Видалити категорію (частина UC6)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Категорія не знайдена" });
    }

    res.json({ message: "Категорія успішно видалена" });
  } catch (error) {
    res.status(500).json({ message: "Помилка видалення категорії" });
  }
};
