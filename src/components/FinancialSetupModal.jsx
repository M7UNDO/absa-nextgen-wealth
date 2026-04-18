import React, { useState } from "react";
import "../styles/FinancialModal.css";

function FinancialSetupModal({ onComplete }) {
  const [form, setForm] = useState({
    grossIncome: "",
    rent: "",
    retirement: "",
    vehicle: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.grossIncome) {
      setError("Gross income is required");
      return;
    }

    setLoading(true);

    const financialData = {
      grossIncome: Number(form.grossIncome),
      rent: Number(form.rent) || 0,
      retirement: Number(form.retirement) || 0,
      vehicle: Number(form.vehicle) || 0
    };


    setTimeout(() => {
      localStorage.setItem("financials", JSON.stringify(financialData));

      setLoading(false);
      onComplete(financialData);
    }, 300);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Set Up Your Finances</h2>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="gross-income">Gross Monthly Income (ZAR)</label>
            <input
              id="gross-income"
              name="grossIncome"
              type="number"
              min="0"
              placeholder="e.g. 55000"
              value={form.grossIncome}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="rent">Rent</label>
            <input
              id="rent"
              name="rent"
              type="number"
              min="0"
              placeholder="e.g. 12000"
              value={form.rent}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="retirement">Retirement Contribution</label>
            <input
              id="retirement"
              name="retirement"
              type="number"
              min="0"
              placeholder="e.g. 3000"
              value={form.retirement}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="vehicle">Vehicle Finance</label>
            <input
              id="vehicle"
              name="vehicle"
              type="number"
              min="0"
              placeholder="e.g. 4500"
              value={form.vehicle}
              onChange={handleChange}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FinancialSetupModal;