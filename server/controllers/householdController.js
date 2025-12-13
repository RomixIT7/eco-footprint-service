// server/controllers/householdController.js

const Household = require("../models/Household");

// @desc    Створити домогосподарство
// @route   POST /api/households
// @access  Private
exports.createHousehold = async (req, res) => {
  const { name, membersCount } = req.body;
  // userId береться з токена (req.user), встановленого middleware protect
  const ownerId = req.user._id;

  try {
    const household = await Household.create({
      name,
      ownerId,
      membersCount: membersCount || 1,
    });

    res.status(201).json(household);
  } catch (error) {
    res.status(500).json({ message: "Помилка створення домогосподарства" });
  }
};

// @desc    Отримати домогосподарства користувача (UC2)
// @route   GET /api/households
// @access  Private
exports.getHouseholds = async (req, res) => {
  try {
    // Знайти всі домогосподарства, де поточний користувач є власником
    const households = await Household.find({ ownerId: req.user._id });
    res.json(households);
  } catch (error) {
    res.status(500).json({ message: "Помилка отримання домогосподарств" });
  }
};
