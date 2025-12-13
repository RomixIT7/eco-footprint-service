// server/controllers/recordController.js

const Record = require("../models/Record");
const Category = require("../models/Category");

// @desc    Створити новий запис споживання та розрахувати емісію (UC3)
// @route   POST /api/records
// @access  Private
exports.createRecord = async (req, res) => {
  // 1. Отримуємо дані з тіла запиту
  const { householdId, categoryId, consumptionValue, date } = req.body;

  // UserId береться з токена (req.user)
  const userId = req.user._id;

  try {
    // 2. Знаходимо категорію, щоб отримати коефіцієнт емісії
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ message: "Категорія не знайдена" });
    }

    // 3. Розрахунок емісійного сліду (Крок 3.2.1)
    // emissionCalculated = consumptionValue * emissionFactor
    const emissionCalculated = consumptionValue * category.emissionFactor;

    // 4. Створення запису
    const record = await Record.create({
      userId,
      householdId,
      categoryId,
      consumptionValue,
      emissionCalculated, // Зберігаємо розраховане значення
      date: date || new Date(),
    });

    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Помилка при створенні запису споживання" });
  }
};

// @desc    Отримати всі записи користувача для конкретного домогосподарства (UC4)
// @route   GET /api/records/:householdId
// @access  Private
exports.getRecordsByHousehold = async (req, res) => {
  try {
    const records = await Record.find({
      userId: req.user._id,
      householdId: req.params.householdId,
    })
      .populate("categoryId", "name unit") // Підтягуємо назву та одиницю категорії
      .sort({ date: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання записів" });
  }
};
