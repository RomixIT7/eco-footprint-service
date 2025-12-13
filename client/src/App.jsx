// client/src/App.jsx (ОНОВЛЕННЯ)

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; // <-- ІМПОРТ
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header /> {/* <-- ДОДАЄМО HEADER */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
