// client/src/pages/Register.jsx (ПОВНИЙ ВИПРАВЛЕНИЙ КОД)

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register, reset } from "../slices/authSlice";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

    // Якщо успіх або користувач авторизований, перенаправляємо
    if (isSuccess || user) {
      navigate("/");
    }

    // !!! ВИПРАВЛЕННЯ: Скидання стану ПЕРЕНОСИМО в cleanup-функцію !!!
    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      console.error("Паролі не збігаються");
    } else {
      const userData = {
        name,
        email,
        password,
      };

      // Викликаємо асинхронний Thunk для реєстрації
      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <h1>Завантаження...</h1>;
  }

  return (
    <>
      <section className="heading">
        <h1>Реєстрація</h1>
        <p>Створіть свій акаунт</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              placeholder="Введіть ваше ім'я"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              placeholder="Введіть Email"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Введіть пароль"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              placeholder="Підтвердіть пароль"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-block">
              Зареєструватися
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;
