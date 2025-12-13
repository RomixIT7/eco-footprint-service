// server/models/User.js (ВИПРАВЛЕНИЙ ПОВНИЙ КОД)

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Бібліотека для хешування

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Гарантує унікальність email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Не вибирати пароль за замовчуванням
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Роль може бути тільки 'user' або 'admin'
      default: "user",
    },
  },
  {
    timestamps: true, // Додає поля createdAt та updatedAt
  }
);

// ПЕРЕД збереженням (Pre-save hook): хешування пароля
// !!! ВИПРАВЛЕННЯ: У async hook не передаємо та не викликаємо next() !!!
UserSchema.pre("save", async function () {
  // Хешуємо пароль, тільки якщо він був змінений
  if (!this.isModified("password")) {
    return; // Просто виходимо
  }
  // Хешування
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // Mongoose сам зробить наступний крок після завершення цієї async-функції
});

// МЕТОД: порівняння введеного пароля з хешованим (відповідно до Рисунку 2.3)
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Порівняння відбувається з хешем, збереженим в БД
  // Оскільки ми викликали .select('+password') в контролері, пароль буде доступний
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
