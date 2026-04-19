import React, {useEffect, useState} from "react";
import IncomeTiles from "./IncomeTiles";
import ExpensesChart from "./ExpensesChart";
import FinancialSetupModal from "./FinancialSetupModal";
import Loader from "./Loader";
import "../styles/Dashboard.css";

function Dashboard() {
  const [financials, setFinancials] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("financials");

    if (stored) {
      setFinancials(JSON.parse(stored));
    } else {
      setShowModal(true);
    }
  }, []);

  const handleSetupComplete = (data) => {
    setFinancials(data);
    setShowModal(false);
  };

  const handleEditClick = () => {
    setShowModal(!false);
  };

  if (!financials && !showModal) {
    return <Loader />;
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <h1>Welcome to ABSA Next-Gen</h1>

        {financials && (
          <button className="edit-btn" onClick={handleEditClick}>
            <i class="fa-regular fa-pen-to-square"></i>
            Edit Finances
          </button>
        )}
      </div>

      {financials && (
        <>
          <IncomeTiles gross={financials.grossIncome} />
          <ExpensesChart data={financials} />
        </>
      )}

      {showModal && <FinancialSetupModal onComplete={handleSetupComplete} initialData={financials} />}
    </section>
  );
}

export default Dashboard;
