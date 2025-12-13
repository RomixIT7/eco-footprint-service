// client/src/pages/Login.jsx

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../slices/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

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

    // Скидання стану ПЕРЕНЕСЕНО в cleanup-функцію, щоб не скидати стан одразу після входу
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

    const userData = { email, password };
    dispatch(login(userData));
  };

  if (isLoading) {
    return <h1>Завантаження...</h1>;
  }

  return (
    <>
      <section className="heading">
        <h1>Вхід</h1>
        <p>Увійдіть у свій акаунт</p>
      </section>

      <section className="form">
        <form onSubmit={onSubmit}>
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
            <button type="submit" className="btn btn-block">
              Увійти
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
