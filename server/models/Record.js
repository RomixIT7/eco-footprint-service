// server/models/Record.js

const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Користувач, який створив запис
      required: true,
    },
    householdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Household", // Домогосподарство, до якого належить запис
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category", // Категорія споживання (Електроенергія, Газ, Вода)
      required: true,
    },
    consumptionValue: {
      type: Number, // Значення споживання (наприклад, 150 кВт·год)
      required: true,
      min: 0,
    },
    emissionCalculated: {
      type: Number, // Розрахований емісійний слід (споживання * коефіцієнт)
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Record = mongoose.model("Record", RecordSchema);
module.exports = Record;
