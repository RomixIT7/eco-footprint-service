// server/controllers/authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Функція для генерації JWT-токена
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Токен дійсний 30 днів
  });
};

// @desc    Реєстрація нового користувача (UC1)
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Перевірка, чи користувач з таким email вже існує
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ message: "Користувач з таким email вже існує" });
    }

    // Створення нового користувача. Password хешується автоматично (див. User.js pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      role, // Можна зареєструватись як admin, але в реальному застосунку це робить лише admin
    });

    if (user) {
      // Успішна реєстрація, повертаємо токен
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role), // Крок 6 Діаграми послідовності
      });
    } else {
      res.status(400).json({ message: "Невірні дані користувача" });
    }
  } catch (error) {
    console.error("Деталі помилки реєстрації:", error);
    res.status(500).json({ message: "Помилка сервера при реєстрації" });
  }
};

// @desc    Аутентифікація користувача / Вхід (UC1)
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  // Крок 2 Діаграми послідовності: приймаємо email та password
  const { email, password } = req.body;

  try {
    // Крок 3 Діаграми послідовності: знайти користувача в БД, включно з паролем
    // .select('+password') необхідний, оскільки в моделі ми поставили select: false
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      // Крок 5 Діаграми послідовності: пароль перевірено (bcrypt)

      // Успішний вхід, повертаємо токен (Крок 6)
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role), // Крок 7 Діаграми послідовності
      });
    } else {
      res.status(401).json({ message: "Невірний email або пароль" });
    }
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера при вході" });
  }
};
