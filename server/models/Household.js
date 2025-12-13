// server/models/Household.js

const mongoose = require("mongoose");

const HouseholdSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId, // Зв'язок (FK) з моделлю User
      ref: "User",
      required: true,
    },
    membersCount: {
      type: Number,
      default: 1,
      min: 1,
    },
    // Додаткові поля, якщо потрібні (наприклад, адреса, площа)
  },
  {
    timestamps: true,
  }
);

const Household = mongoose.model("Household", HouseholdSchema);
module.exports = Household;
