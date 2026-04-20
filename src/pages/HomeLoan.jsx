import React, {useState} from "react";
import "../styles/HomeLoan.css";
import {formatCurrency} from "../utils/formatCurrency";

function HomeLoan() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [salary, setSalary] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanYears, setLoanYears] = useState(20);

  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [loanNeeded, setLoanNeeded] = useState(null);
  const [budgetRange, setBudgetRange] = useState({min: null, max: null});
  const [affordabilityMessage, setAffordabilityMessage] = useState("");

  function calculateHomeLoan() {
    const homePrice = Number(purchasePrice);
    const depositAmount = Number(deposit);
    const grossIncome = Number(salary);
    const annualRate = Number(interestRate);
    const years = Number(loanYears);

    if (!homePrice || homePrice <= 0) return;
    if (depositAmount < 0 || depositAmount >= homePrice) return;
    if (!grossIncome || grossIncome <= 0) return;
    if (!annualRate || annualRate <= 0) return;

    const financedAmount = homePrice - depositAmount;

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    const payment = (financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    setMonthlyPayment(payment);
    setLoanNeeded(financedAmount);

    /* Suggested affordability range */
    const comfortableBudget = grossIncome * 0.25;
    const maxBudget = grossIncome * 0.3;

    const minLoan = (comfortableBudget * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;

    const maxLoan = (maxBudget * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;

    setBudgetRange({
      min: minLoan,
      max: maxLoan,
    });

    if (payment <= grossIncome * 0.25) {
      setAffordabilityMessage("Excellent affordability. Comfortable repayment level.");
    } else if (payment <= grossIncome * 0.3) {
      setAffordabilityMessage("Affordable, but keep room for other monthly expenses.");
    } else if (payment <= grossIncome * 0.4) {
      setAffordabilityMessage("Stretching your budget. A larger deposit may help.");
    } else {
      setAffordabilityMessage("High risk. Consider a lower purchase price or larger deposit.");
    }
  }

  return (
    <section className="home-loan-page">
      <h1>Home Loan Affordability Calculator</h1>

      <div className="home-loan-container">
        <div>
          <label>Property Purchase Price (ZAR)</label>
          <input
            type="number"
            placeholder="Enter property price"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="loan-inputs"
          />
        </div>

        <div>
          <label>Deposit Amount (ZAR)</label>
          <input
            type="number"
            placeholder="Enter deposit"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="loan-inputs"
          />
        </div>

        <div>
          <label>Gross Monthly Income (ZAR)</label>
          <input
            type="number"
            placeholder="Enter salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="loan-inputs"
          />
        </div>

        <div>
          <label>Loan Term (Years)</label>

          <input type="text" value={`${loanYears} Years`} readOnly className="loan-inputs" />

          <input
            type="range"
            min="10"
            max="30"
            step="1"
            value={loanYears}
            onChange={(e) => setLoanYears(Number(e.target.value))}
          />
        </div>

        <div>
          <label>Interest Rate %</label>
          <input
            type="number"
            min="1"
            max="100"
            step="0.01"
            placeholder="11.75"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="loan-inputs"
          />
        </div>

        <button onClick={calculateHomeLoan} className="loan-btn">
          Simulate<i class="fa-solid fa-flask"></i>
        </button>

        {monthlyPayment && (
          <div className="loan-results">
            <h2>Estimated Monthly Repayment</h2>
            <p>{formatCurrency(monthlyPayment)}</p>

            <h3>Loan Required</h3>
            <span>{formatCurrency(loanNeeded)}</span>

            <h3>Suggested Home Budget Range</h3>
            <span>
              {formatCurrency(budgetRange.min)} - {formatCurrency(budgetRange.max)}
            </span>

            <div className="loan-message">
              <small>{affordabilityMessage}</small>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeLoan;
