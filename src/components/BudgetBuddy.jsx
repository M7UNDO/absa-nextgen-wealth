import React, { useEffect, useMemo, useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import BudgetBuddyModal from "./BudgetBuddyModal";
import { formatCurrency } from "../utils/formatCurrency";
import "../styles/BudgetBuddy.css";

const defaultCategories = [
  {
    id: 1,
    name: "Entertainment",
    limit: 2000,
    spent: 0,
    color: "#22c55e",
  },
  {
    id: 2,
    name: "Groceries",
    limit: 3000,
    spent: 0,
    color: "#a855f7",
  },
  {
    id: 3,
    name: "Dining Out",
    limit: 1200,
    spent: 0,
    color: "#f59e0b",
  },
  {
    id: 4,
    name: "Transport",
    limit: 2500,
    spent: 0,
    color: "#fb7185",
  },
];

function BudgetBuddy() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [spendInputs, setSpendInputs] = useState({});
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const bannerRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("budgetCategories");

    if (stored) {
      setCategories(JSON.parse(stored));
    } else {
      setCategories(defaultCategories);
      localStorage.setItem("budgetCategories", JSON.stringify(defaultCategories));
    }
  }, []);

  useGSAP(
    () => {
      if (!feedbackMessage || !bannerRef.current) return;

      gsap.fromTo(
        bannerRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        }
      );

      const timeout = setTimeout(() => {
        gsap.to(bannerRef.current, {
          autoAlpha: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => setFeedbackMessage(""),
        });
      }, 4000);

      return () => clearTimeout(timeout);
    },
    { dependencies: [feedbackMessage] }
  );

  function saveCategories(updated) {
    setCategories(updated);
    localStorage.setItem("budgetCategories", JSON.stringify(updated));
  }

  function handleAddCategory(newCategory) {
    const updated = [
      ...categories,
      {
        id: Date.now(),
        ...newCategory,
        spent: 0,
      },
    ];

    saveCategories(updated);
    setShowModal(false);
    setFeedbackMessage(`${newCategory.name} was added to Budget Buddy.`);
  }

  function handleDeleteCategory(id, name) {
    const updated = categories.filter((category) => category.id !== id);
    saveCategories(updated);
    setFeedbackMessage(`${name} was removed from Budget Buddy.`);
  }

  function handleSpendInputChange(id, value) {
    setSpendInputs((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleSimulateSpend(id) {
    const amount = Number(spendInputs[id]);

    if (!amount || amount <= 0) {
      setFeedbackMessage("Enter a valid spend amount first.");
      return;
    }

    let overspendMessage = "";

    const updated = categories.map((category) => {
      if (category.id !== id) return category;

      const newSpent = category.spent + amount;

      if (newSpent > category.limit) {
        overspendMessage = `Overspend alert: ${category.name} is now over budget.`;
      }

      return {
        ...category,
        spent: newSpent,
      };
    });

    saveCategories(updated);

    setSpendInputs((prev) => ({
      ...prev,
      [id]: "",
    }));

    setFeedbackMessage(overspendMessage || "Spend added successfully.");
  }

  const totalSpend = useMemo(() => {
    return categories.reduce((sum, item) => sum + item.spent, 0);
  }, [categories]);

  const totalLimit = useMemo(() => {
    return categories.reduce((sum, item) => sum + item.limit, 0);
  }, [categories]);

  return (
    <>
      {feedbackMessage && (
        <div ref={bannerRef} className="budget-feedback-banner">
          <i className="fa-solid fa-circle-check"></i>
          <p>{feedbackMessage}</p>
        </div>
      )}

      <div className="budget-buddy-card">
        <div className="budget-buddy-header">
          <div>
            <h4>Budget Buddy</h4>
            <p>{categories.length} categories</p>
          </div>

          <button
            type="button"
            className="budget-add-btn"
            onClick={() => setShowModal(true)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>

        <div className="budget-summary">
          <div className="budget-summary-row">
            <span>Total spend</span>
            <strong>
              {formatCurrency(totalSpend)} of {formatCurrency(totalLimit)}
            </strong>
          </div>

          <div className="budget-summary-bar">
            <div
              className="budget-summary-fill"
              style={{
                width: `${Math.min((totalSpend / totalLimit) * 100 || 0, 100)}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="budget-category-list">
          {categories.map((category) => {
            const percentage = (category.spent / category.limit) * 100 || 0;
            const cappedPercentage = Math.min(percentage, 100);
            const isOverspent = category.spent > category.limit;

            return (
              <div key={category.id} className="budget-category-item">
                <div className="budget-category-top">
                  <div className="budget-category-name-wrap">
                    <span
                      className="budget-category-dot"
                      style={{ backgroundColor: category.color }}
                    ></span>

                    <div>
                      <h5>{category.name}</h5>
                      <p className={isOverspent ? "spent-text overspent-text" : "spent-text"}>
                        {formatCurrency(category.spent)} of {formatCurrency(category.limit)}
                      </p>
                    </div>
                  </div>

                  <div className="budget-category-actions">
                    <span className={isOverspent ? "budget-percentage overspent-text" : "budget-percentage"}>
                      {percentage.toFixed(0)}%
                    </span>

                    <button
                      type="button"
                      className="delete-category-btn"
                      onClick={() => handleDeleteCategory(category.id, category.name)}
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                  </div>
                </div>

                <div className="budget-progress-bar">
                  <div
                    className={isOverspent ? "budget-progress-fill overspent-fill" : "budget-progress-fill"}
                    style={{
                      width: `${cappedPercentage}%`,
                      backgroundColor: isOverspent ? "" : category.color,
                    }}
                  ></div>
                </div>

                {isOverspent && (
                  <p className="overspend-warning">You have exceeded this category budget.</p>
                )}

                <div className="budget-spend-controls">
                  <input
                    type="number"
                    min="0"
                    placeholder="Amount"
                    value={spendInputs[category.id] || ""}
                    onChange={(e) => handleSpendInputChange(category.id, e.target.value)}
                    className="spend-input"
                  />

                  <button
                    type="button"
                    className="simulate-spend-btn"
                    onClick={() => handleSimulateSpend(category.id)}
                  >
                    Simulate Spend
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <BudgetBuddyModal
          onClose={() => setShowModal(false)}
          onSave={handleAddCategory}
        />
      )}
    </>
  );
}

export default BudgetBuddy;