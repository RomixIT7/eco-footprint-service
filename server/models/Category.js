// server/models/Category.js

const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    unit: {
      type: String, // Наприклад: 'кВт·год', 'м³', 'кг'
      required: true,
    },
    emissionFactor: {
      type: Number, // Коефіцієнт переведення одиниці в CO2-еквівалент
      required: true,
      min: 0,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
