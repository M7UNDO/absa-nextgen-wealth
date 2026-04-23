import React, { useState } from "react";
import "../styles/HomeLoan.css";
import { formatCurrency } from "../utils/formatCurrency";
import useInfoToggle from "../hooks/useInfoToggle";
import InfoPopover from "../components/InfoPopover";

function HomeLoan() {
  const [purchasePrice, setPurchasePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [salary, setSalary] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanYears, setLoanYears] = useState(20);

  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [loanNeeded, setLoanNeeded] = useState(null);
  const [budgetRange, setBudgetRange] = useState({ min: null, max: null });
  const [affordabilityMessage, setAffordabilityMessage] = useState("");

  const { activeInfo, toggleInfo } = useInfoToggle();

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

    const payment =
      (financedAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -months));

    setMonthlyPayment(payment);
    setLoanNeeded(financedAmount);

    const comfortableBudget = grossIncome * 0.25;
    const maxBudget = grossIncome * 0.3;

    const minLoan =
      (comfortableBudget * (1 - Math.pow(1 + monthlyRate, -months))) /
      monthlyRate;

    const maxLoan =
      (maxBudget * (1 - Math.pow(1 + monthlyRate, -months))) /
      monthlyRate;

    setBudgetRange({
      min: minLoan,
      max: maxLoan,
    });

    if (payment <= grossIncome * 0.25) {
      setAffordabilityMessage(
        "Excellent affordability. Comfortable repayment level."
      );
    } else if (payment <= grossIncome * 0.3) {
      setAffordabilityMessage(
        "Affordable, but keep room for other monthly expenses."
      );
    } else if (payment <= grossIncome * 0.4) {
      setAffordabilityMessage(
        "Stretching your budget. A larger deposit may help."
      );
    } else {
      setAffordabilityMessage(
        "High risk. Consider a lower purchase price or larger deposit."
      );
    }
  }

  return (
    <section className="home-loan-page">
      <h1>Home Loan Affordability Calculator</h1>

      <div className="home-loan-container">
        <div className="loan-field">
          <div className="loan-label-row">
            <label>Property Purchase Price (ZAR)</label>

            <InfoPopover
              infoKey="purchasePrice"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Property Purchase Price?"
              className="loan-info-popover-wrapper"
              buttonClassName="loan-info-popover-btn"
              popoverClassName="loan-info-popover-panel"
            >
              <p>
                This is the full price of the property you want to buy before
                subtracting your deposit.
              </p>
            </InfoPopover>
          </div>

          <input
            type="number"
            placeholder="Enter property price"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="loan-inputs"
          />
        </div>

        <div className="loan-field">
          <div className="loan-label-row">
            <label>Deposit Amount (ZAR)</label>

            <InfoPopover
              infoKey="deposit"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Deposit Amount?"
              className="loan-info-popover-wrapper"
              buttonClassName="loan-info-popover-btn"
              popoverClassName="loan-info-popover-panel"
            >
              <p>
                Your deposit is the amount you pay upfront toward the property.
                A larger deposit usually reduces the loan amount and monthly
                repayment.
              </p>
            </InfoPopover>
          </div>

          <input
            type="number"
            placeholder="Enter deposit"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="loan-inputs"
          />
        </div>

        <div className="loan-field">
          <div className="loan-label-row">
            <label>Gross Monthly Income (ZAR)</label>

            <InfoPopover
              infoKey="salary"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Gross Monthly Income?"
              className="loan-info-popover-wrapper"
              buttonClassName="loan-info-popover-btn"
              popoverClassName="loan-info-popover-panel"
            >
              <p>
                Gross monthly income is your income before tax and other
                deductions. This calculator uses it to estimate how affordable
                the home loan may be.
              </p>
            </InfoPopover>
          </div>

          <input
            type="number"
            placeholder="Enter salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="loan-inputs"
          />
        </div>

        <div className="loan-field">
          <div className="loan-label-row">
            <label>Loan Term (Years)</label>

            <InfoPopover
              infoKey="loanTerm"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Loan Term?"
              className="loan-info-popover-wrapper"
              buttonClassName="loan-info-popover-btn"
              popoverClassName="loan-info-popover-panel"
            >
              <p>
                This is the number of years you will take to repay the home
                loan. A longer term can lower the monthly repayment, but it
                usually increases the total interest paid.
              </p>
            </InfoPopover>
          </div>

          <input
            type="text"
            value={`${loanYears} Years`}
            readOnly
            className="loan-inputs"
          />

          <input
            type="range"
            min="10"
            max="30"
            step="1"
            value={loanYears}
            onChange={(e) => setLoanYears(Number(e.target.value))}
          />
        </div>

        <div className="loan-field">
          <div className="loan-label-row">
            <label>Interest Rate %</label>

            <InfoPopover
              infoKey="interestRate"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Interest Rate?"
              className="loan-info-popover-wrapper"
              buttonClassName="loan-info-popover-btn"
              popoverClassName="loan-info-popover-panel"
            >
              <p>
                This is the percentage charged by the lender for borrowing the
                money. A higher interest rate increases the monthly repayment
                and the total cost of the loan.
              </p>
            </InfoPopover>
          </div>

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
          Simulate <i className="fa-solid fa-flask"></i>
        </button>

        {monthlyPayment && (
          <div className="loan-results">
            <h2>Estimated Monthly Repayment</h2>
            <p>{formatCurrency(monthlyPayment)}</p>

            <h3>Loan Required</h3>
            <span>{formatCurrency(loanNeeded)}</span>

            <h3>Suggested Home Budget Range</h3>
            <span>
              {formatCurrency(budgetRange.min)} -{" "}
              {formatCurrency(budgetRange.max)}
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