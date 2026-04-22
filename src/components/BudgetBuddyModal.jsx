import React, { useState } from "react";
/*import "../styles/BudgetBuddyModal.css";*/

function BudgetBuddyModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    limit: "",
    color: "#3b82f6",
  });

  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.limit) {
      setError("Please complete all fields.");
      return;
    }

    onSave({
      name: form.name,
      limit: Number(form.limit),
      color: form.color,
    });
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button type="button" className="modal-close-btn" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2>Add Budget Category</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="category-name">Category</label>
            <input
              id="category-name"
              name="name"
              type="text"
              placeholder="e.g. Groceries"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="category-limit">Add a limit (ZAR)</label>
            <input
              id="category-limit"
              name="limit"
              type="number"
              min="0"
              placeholder="e.g. 3000"
              value={form.limit}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="category-color">Category colour</label>
            <input
              id="category-color"
              name="color"
              type="color"
              value={form.color}
              onChange={handleChange}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" className="setup-btn">
            Save Category
          </button>
        </form>
      </div>
    </div>
  );
}

export default BudgetBuddyModal;