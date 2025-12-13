// client/src/components/Header.jsx

import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, reset } from "../slices/authSlice";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout()); // Видаляємо токен з localStorage
    dispatch(reset()); // Очищуємо стан Redux
    navigate("/"); // Перенаправляємо на головну сторінку
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          Еко Слід | <small>Головна</small>
        </Link>
      </div>
      <ul>
        {user ? (
          // 1. Користувач авторизований (показуємо кнопку Вихід)
          <li>
            <button className="btn" onClick={onLogout}>
              <FaSignOutAlt /> Вихід
            </button>
          </li>
        ) : (
          // 2. Користувач не авторизований (показуємо Вхід та Реєстрацію)
          <>
            <li>
              <Link to="/login">
                <FaSignInAlt /> Вхід
              </Link>
            </li>
            <li>
              <Link to="/register">
                <FaUser /> Реєстрація
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
