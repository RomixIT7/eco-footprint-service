// client/src/components/HouseholdForm.jsx

import { useState } from "react";
import { useDispatch } from "react-redux";
import { createHousehold } from "../slices/householdSlice";

function HouseholdForm() {
  const [name, setName] = useState("");
  const [membersCount, setMembersCount] = useState(1);
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    // Відправляємо дані на створення
    dispatch(createHousehold({ name, membersCount }));

    // Очищуємо форму
    setName("");
    setMembersCount(1);
  };

  return (
    <section className="form">
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Назва Домогосподарства</label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Наприклад: Квартира в Києві, Будинок за містом"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="membersCount">Кількість членів</label>
          <input
            type="number"
            name="membersCount"
            id="membersCount"
            value={membersCount}
            min="1"
            onChange={(e) => setMembersCount(Number(e.target.value))}
            required
          />
        </div>
        <div className="form-group">
          <button className="btn btn-block" type="submit">
            Додати Домогосподарство
          </button>
        </div>
      </form>
    </section>
  );
}

export default HouseholdForm;
