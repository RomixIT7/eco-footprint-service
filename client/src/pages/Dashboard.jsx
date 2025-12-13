// client/src/pages/Dashboard.jsx (ПОВНИЙ ЧИСТИЙ КОД)

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Компоненти
import HouseholdForm from "../components/HouseholdForm";
import RecordForm from "../components/RecordForm";

// Redux Slices
import {
  getHouseholds,
  reset as resetHousehold,
} from "../slices/householdSlice";
import { getRecords, reset as resetRecord } from "../slices/recordSlice";
import { getCategories, reset as resetCategory } from "../slices/categorySlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Отримання стану з Redux Store
  const { user } = useSelector((state) => state.auth);
  const {
    households,
    isLoading: isLoadingHousehold,
    isError: isErrorHousehold,
    message: messageHousehold,
  } = useSelector((state) => state.household);
  const {
    records,
    isLoading: isLoadingRecord,
    isError: isErrorRecord,
    message: messageRecord,
  } = useSelector((state) => state.record);
  const {
    categories,
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
    message: messageCategory,
  } = useSelector((state) => state.category);

  // Локальний стан для зберігання ID активного домогосподарства
  const [activeHouseholdId, setActiveHouseholdId] = useState(null);

  // ========================================================
  // 1. useEffect: Ініціалізація, Перевірка авторизації та Завантаження
  // ========================================================
  useEffect(() => {
    // Редирект, якщо користувач не авторизований
    if (!user) {
      navigate("/login");
      return;
    }

    // Обробка помилок
    if (isErrorHousehold) {
      console.error("Помилка завантаження домогосподарств:", messageHousehold);
    }
    if (isErrorCategory) {
      console.error("Помилка завантаження категорій:", messageCategory);
    }

    // Завантаження даних при наявності користувача
    if (user) {
      dispatch(getHouseholds());
      dispatch(getCategories());
    }

    // Cleanup: очищення станів при виході з компонента
    return () => {
      dispatch(resetHousehold());
      dispatch(resetRecord());
      dispatch(resetCategory());
    };
    // Видалено households.length та isLoadingHousehold, щоб уникнути нескінченного циклу
  }, [
    user,
    navigate,
    isErrorHousehold,
    messageHousehold,
    isErrorCategory,
    messageCategory,
    dispatch,
  ]);

  // ========================================================
  // 2. useEffect: Автоматичний вибір та Завантаження записів
  // ========================================================
  useEffect(() => {
    // Автоматичний вибір першого домогосподарства, якщо список завантажено
    if (households.length > 0 && !activeHouseholdId) {
      setActiveHouseholdId(households[0]._id);
    }

    // Завантаження записів для активного домогосподарства
    if (activeHouseholdId) {
      dispatch(getRecords(activeHouseholdId));
    }

    if (isErrorRecord) {
      console.error("Помилка завантаження записів:", messageRecord);
    }
  }, [activeHouseholdId, households, isErrorRecord, messageRecord, dispatch]);

  // Обробник кліку для вибору активного домогосподарства
  const selectHousehold = (id) => {
    setActiveHouseholdId(id);
  };

  // Відображення Завантаження, якщо будь-який ресурс завантажується
  if (isLoadingHousehold || isLoadingRecord || isLoadingCategory) {
    return <h1>Завантаження даних...</h1>;
  }

  // Якщо користувач зник (хоча redirect має спрацювати)
  if (!user) {
    return null;
  }

  const activeHousehold = households.find((h) => h._id === activeHouseholdId);
  const welcomeMessage = `Ласкаво просимо, ${user.name || user.email}!`;

  return (
    <>
      <section className="heading">
        <h1>{welcomeMessage}</h1>
        <p>Панель управління Еко Слідом</p>
      </section>

      <section className="content">
        {/* 1. Форма додавання нового домогосподарства */}
        <div
          style={{
            marginBottom: "30px",
            borderBottom: "1px solid #ddd",
            paddingBottom: "20px",
          }}
        >
          <h2>Створити Домогосподарство</h2>
          <HouseholdForm />
        </div>

        {/* 2. Відображення списку домогосподарств */}
        <h2>Ваші Домогосподарства ({households.length})</h2>

        {households.length > 0 ? (
          <div className="household-list">
            {households.map((household) => (
              <div
                key={household._id}
                className={`household-item ${
                  household._id === activeHouseholdId ? "active-household" : ""
                }`}
                onClick={() => selectHousehold(household._id)}
              >
                <h3>{household.name}</h3>
                <p>Членів: {household.membersCount}</p>
              </div>
            ))}
          </div>
        ) : (
          <h3>Створіть перше домогосподарство вище.</h3>
        )}

        <hr style={{ margin: "30px 0" }} />

        {/* 3. Форма та список записів (тільки якщо домогосподарство обрано) */}
        {activeHouseholdId && activeHousehold ? (
          <div className="records-section">
            <h2>Записи для "{activeHousehold.name}"</h2>

            {/* Форма додавання записів */}
            <RecordForm householdId={activeHouseholdId} />

            {/* Список записів */}
            <h3 style={{ marginTop: "30px" }}>Історія споживання</h3>

            {records.length > 0 ? (
              <div className="records-list">
                {records.map((record) => (
                  <div key={record._id} className="record-item">
                    <p>
                      {/* Коректне відображення назви категорії, значення та одиниці */}
                      **{record.categoryId.name}**:
                      {record.consumptionValue} {record.categoryId.unit}
                      (від {new Date(record.date).toLocaleDateString("uk-UA")})
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Записів споживання для цього домогосподарства немає.</p>
            )}
          </div>
        ) : null}
      </section>
    </>
  );
}

export default Dashboard;
