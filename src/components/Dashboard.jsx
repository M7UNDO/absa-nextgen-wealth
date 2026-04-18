import React, { useEffect, useState } from "react";
import IncomeTiles from "./IncomeTiles";
import ExpensesChart from "./ExpensesChart";
import FinancialSetupModal from "./FinancialSetupModal";
import Loader from "./Loader";
import "../styles/Dashboard.css";

function Dashboard() {
  const [financials, setFinancials] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("financials");

    if (stored) {
      setFinancials(JSON.parse(stored));
    } else {
      setShowModal(true);
    }
  }, []);

  // When modal completes
  const handleSetupComplete = (data) => {
    setFinancials(data);
    setShowModal(false);
  };

  if (!financials && !showModal) {
    return <Loader/>
  }

  return (
    <section className="dashboard-section">
      <h1>Hello 👋</h1>

      {financials && (
        <>
          <IncomeTiles gross={financials.grossIncome} />
          <ExpensesChart data={financials} />
        </>
      )}

      {showModal && (
        <FinancialSetupModal onComplete={handleSetupComplete} />
      )}
    </section>
  );
}

export default Dashboard;