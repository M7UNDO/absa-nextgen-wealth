import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import IncomeTiles from "./IncomeTiles";
import ExpensesChart from "./ExpensesChart";
import BudgetBuddy from "./BudgetBuddy";
import FeatureGateway from "./FeatureGateway";
import FinancialSetupModal from "./FinancialSetupModal";
import Loader from "./Loader";
import "../styles/Dashboard.css";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [financials, setFinancials] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isFirstTimeUser = !financials;

  useEffect(() => {
    const stored = localStorage.getItem("financials");

    if (stored) {
      setFinancials(JSON.parse(stored));
    } else {
      setShowModal(true);
      setIsEditing(false);
    }
  }, []);

  const handleSetupComplete = (data) => {
    setFinancials(data);
    setShowModal(false);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setShowModal(true);
    setIsEditing(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
  };

  if (!financials && !showModal) {
    return <Loader />;
  }

  return (
    <section className="dashboard-section">
      <div className="dashboard-header">
        <h1>
          {isFirstTimeUser
            ? "Welcome to ABSA Next-Gen"
            : `Welcome back, ${user.user_metadata?.username}`}
        </h1>

        {financials && (
          <button className="edit-btn" onClick={handleEditClick}>
            <i className="fa-regular fa-pen-to-square"></i>
            Edit Finances
          </button>
        )}
      </div>

      {financials ? (
        <>
          <IncomeTiles gross={financials.grossIncome} />

          <div className="dashboard-grid">
            <ExpensesChart data={financials} />
            <BudgetBuddy />
            <FeatureGateway />
          </div>
        </>
      ) : (
        <div className="dashboard-placeholder"></div>
      )}

      {showModal && (
        <FinancialSetupModal
          onComplete={handleSetupComplete}
          onClose={handleCloseModal}
          initialData={financials}
          isEditing={isEditing}
        />
      )}
    </section>
  );
}

export default Dashboard;