// client/src/pages/Dashboard.jsx (ФІНАЛЬНЕ ВИПРАВЛЕННЯ)

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import HouseholdForm from "../components/HouseholdForm";
import { getHouseholds, reset } from "../slices/householdSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { households, isLoading, isError, message } = useSelector(
    (state) => state.household
  );

  useEffect(() => {
    // 1. ПЕРЕВІРКА АВТОРИЗАЦІЇ: Якщо користувача немає, перенаправляємо.
    if (!user) {
      navigate("/login");
      // НІЧОГО НЕ РОБИМО ДАЛІ В ЦЬОМУ useEffect, якщо користувач відсутній
      return;
    }

    // 2. Якщо є помилка (після успішної авторизації), виводимо її
    if (isError) {
      console.error(message);
    }

    // 3. ЗАВАНТАЖЕННЯ ДАНИХ: Викликаємо лише, якщо user існує та має ID.
    if (user && user._id) {
      dispatch(getHouseholds());
    }

    // 4. Cleanup: скидаємо стан household при виході з компонента
    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]); // user тепер є основною залежністю

  if (isLoading) {
    return <h1>Завантаження даних...</h1>;
  }

  // Якщо user = null, але navigate ще не спрацював, повертаємо null
  if (!user) {
    return null;
  }

  const welcomeMessage = `Ласкаво просимо, ${user.name}!`;

  return (
    <>
      <section className="heading">
        <h1>{welcomeMessage}</h1>
        <p>Панель управління Еко Слідом</p>
      </section>

      <section className="content">
        {/* ... (решта форми домогосподарств) ... */}
        <h2>Додати нове домогосподарство</h2>
        <HouseholdForm />

        <h2 style={{ marginTop: "30px" }}>Ваші домогосподарства</h2>

        {households.length > 0 ? (
          <div>
            {households.map((household) => (
              <div key={household._id} className="household-item">
                <h3>{household.name}</h3>
                <p>Членів: {household.membersCount}</p>
              </div>
            ))}
          </div>
        ) : (
          <h3>Ви ще не додали жодного домогосподарства.</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
