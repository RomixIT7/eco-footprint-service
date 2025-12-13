// client/src/main.jsx (ВИМКНЕННЯ STRISE MODE)

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { store } from "./app/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  // !!! React.StrictMode ВИДАЛЕНО, ЩОБ УНИКНУТИ ПОДВІЙНОГО РЕНДЕРУ !!!
  <Provider store={store}>
    <App />
  </Provider>
);
