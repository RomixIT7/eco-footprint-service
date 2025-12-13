// client/src/components/RecordForm.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД)

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRecord, resetSuccess } from "../slices/recordSlice";
import { getCategories } from "../slices/categorySlice";

function RecordForm({ householdId }) {
  const dispatch = useDispatch();

  // Отримуємо категорії та статус запису
  const { isSuccess, isLoading, isError, message } = useSelector(
    (state) => state.record
  );
  const { categories, isLoading: isLoadingCategory } = useSelector(
    (state) => state.category
  );

  // Початковий стан форми
  const [formData, setFormData] = useState({
    // Встановлюємо ID першої категорії (або порожній рядок, якщо їх немає)
    categoryId: categories.length > 0 ? categories[0]._id : "",
    consumptionValue: 0,
  });

  // ========================================================
  // 1. Завантаження категорій та оновлення початкового стану
  // ========================================================
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(getCategories());
    } else if (formData.categoryId === "") {
      // Якщо категорії завантажилися, але state ще не оновлено
      setFormData((prev) => ({
        ...prev,
        categoryId: categories[0]._id,
      }));
    }
  }, [dispatch, categories, formData.categoryId]);

  // ========================================================
  // 2. Очищення форми після успішного додавання
  // ========================================================
  useEffect(() => {
    if (isSuccess) {
      setFormData((prev) => ({
        ...prev,
        consumptionValue: 0, // Скидаємо лише значення
      }));
      dispatch(resetSuccess());
    }
    if (isError) {
      console.error("Помилка створення запису:", message);
    }
  }, [isSuccess, isError, message, dispatch]);

  // Обробник змін полів форми
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!formData.categoryId || formData.consumptionValue <= 0) {
      console.error("Оберіть категорію та введіть дійсне значення.");
      return;
    }

    // Формуємо об'єкт для відправки
    const newRecord = {
      householdId,
      categoryId: formData.categoryId,
      consumptionValue: Number(formData.consumptionValue),
    };

    // Відправляємо дані на сервер
    dispatch(createRecord(newRecord));
  };

  const activeCategory = categories.find((c) => c._id === formData.categoryId);

  if (isLoadingCategory || categories.length === 0) {
    return <p>Завантаження категорій...</p>;
  }

  return (
    <section className="form">
      <h3>Додати новий запис споживання</h3>
      <form onSubmit={onSubmit}>
        {/* Категорія (CategoryId) */}
        <div className="form-group">
          <label htmlFor="categoryId">Тип споживання</label>
          <select
            name="categoryId"
            id="categoryId"
            value={formData.categoryId}
            onChange={onChange}
          >
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Значення (ConsumptionValue) */}
        <div className="form-group">
          <label htmlFor="consumptionValue">Значення</label>
          <input
            type="number"
            name="consumptionValue"
            id="consumptionValue"
            value={formData.consumptionValue}
            onChange={onChange}
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Одиниця виміру (Тільки для відображення) */}
        <div className="form-group">
          <label htmlFor="unit">Одиниця виміру</label>
          <input
            type="text"
            name="unit"
            id="unit"
            value={activeCategory ? activeCategory.unit : ""}
            readOnly
            className="form-control-readonly"
          />
        </div>

        <div className="form-group">
          <button className="btn btn-block" type="submit">
            Зберегти Запис
          </button>
        </div>
      </form>
    </section>
  );
}

export default RecordForm;
