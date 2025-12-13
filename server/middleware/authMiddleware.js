// server/middleware/authMiddleware.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware для перевірки JWT токена
exports.protect = async (req, res, next) => {
  let token;

  // 1. Перевіряємо, чи є токен у заголовку Authorization (Bearer Token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Отримуємо токен, відкидаючи 'Bearer '
      token = req.headers.authorization.split(" ")[1];

      // 2. Верифікація токена (перевірка підпису за допомогою JWT_SECRET)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Знаходимо користувача за ID з токена (без пароля)
      req.user = await User.findById(decoded.id).select("-password");

      // Якщо користувач знайдений, передаємо керування наступному middleware/контролеру
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Не авторизовано, токен недійсний" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Не авторизовано, токен відсутній" });
  }
};

// Middleware для перевірки ролі (наприклад, тільки для 'admin')
exports.admin = (req, res, next) => {
  // req.user був встановлений попереднім middleware 'protect'
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Недостатньо прав, потрібна роль Адміністратора" });
  }
};
