import React, { useState } from "react";
import "../styles/VehicleFinance.css";
import { formatCurrency } from "../utils/formatCurrency";
import useInfoToggle from "../hooks/useInfoToggle";
import InfoPopover from "../components/InfoPopover";

function VehicleFinance() {
  const termOptions = [24, 36, 48, 60, 72, 78, 84, 90, 96];

  const interestOptions = [];
  for (let i = 7; i <= 14; i += 0.5) {
    interestOptions.push(i.toFixed(1));
  }

  const balloonOptions = [];
  for (let i = 0; i <= 60; i += 5) {
    balloonOptions.push(i.toFixed(1));
  }

  const [vehicleType, setVehicleType] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [termIndex, setTermIndex] = useState(3);
  const [interestRate, setInterestRate] = useState("10.0");
  const [balloon, setBalloon] = useState("0.0");
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const { activeInfo, toggleInfo } = useInfoToggle();

  const selectedTerm = termOptions[termIndex];

  function calculateFinance() {
    const price = Number(purchasePrice);
    const depositAmount = Number(deposit);
    const rate = Number(interestRate);
    const balloonPercent = Number(balloon);

    if (!price || price <= 0) return;
    if (depositAmount > price) return;

    const loanAmount = price - depositAmount;
    const balloonAmount = loanAmount * (balloonPercent / 100);
    const financedAmount = loanAmount - balloonAmount;

    const monthlyRate = rate / 12 / 100;
    const months = selectedTerm;

    const payment =
      (financedAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -months));

    setMonthlyPayment(payment);
  }

  return (
    <section className="vehicle-finance-page">
      <h1>Vehicle Finance Calculator</h1>

      <div className="vehicle-inputs-container">
        <div className="vehicle-field">
          <label>Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="">Please Select</option>
            <option value="Used">Used</option>
            <option value="New">New</option>
            <option value="Demo">Demo</option>
          </select>
        </div>

        <div className="vehicle-field">
          <label>Vehicle Purchase Price (ZAR)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="vehicle-inputs"
          />
        </div>

        <div className="vehicle-field">
          <label>Deposit Amount (ZAR)</label>
          <input
            type="number"
            placeholder="Enter deposit"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="vehicle-inputs"
          />
        </div>

        <div className="vehicle-field">
          <div className="vehicle-label-row">
            <label>Repayment Term</label>

            <InfoPopover
              infoKey="term"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Repayment Term?"
              className="vehicle-info-popover-wrapper"
              buttonClassName="vehicle-info-popover-btn"
              popoverClassName="vehicle-info-popover-panel"
            >
              <p>
                This is the number of months you will take to repay the vehicle
                loan. A longer term can reduce the monthly repayment, but it
                usually increases the total interest paid over time.
              </p>
            </InfoPopover>
          </div>

          <input type="text" value={`${selectedTerm} Months`} readOnly />

          <input
            type="range"
            min="0"
            max={termOptions.length - 1}
            step="1"
            value={termIndex}
            onChange={(e) => setTermIndex(Number(e.target.value))}
            className="vehicle-inputs"
            id="repayment-slider"
          />
        </div>

        <div className="vehicle-field">
          <div className="vehicle-label-row">
            <label>Interest Rate %</label>

            <InfoPopover
              infoKey="interest"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Interest Rate?"
              className="vehicle-info-popover-wrapper"
              buttonClassName="vehicle-info-popover-btn"
              popoverClassName="vehicle-info-popover-panel"
            >
              <p>
                This is the percentage charged for borrowing the money. A higher
                interest rate means a more expensive loan overall.
              </p>
            </InfoPopover>
          </div>

          <select
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
          >
            {interestOptions.map((rate) => (
              <option key={rate} value={rate}>
                {rate}%
              </option>
            ))}
          </select>
        </div>

        <div className="vehicle-field">
          <div className="vehicle-label-row">
            <label>Balloon Percentage %</label>

            <InfoPopover
              infoKey="balloon"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Balloon Percentage?"
              className="vehicle-info-popover-wrapper"
              buttonClassName="vehicle-info-popover-btn"
              popoverClassName="vehicle-info-popover-panel"
            >
              <p>
                A balloon payment is a large final amount left unpaid until the
                end of the loan. Choosing a higher balloon percentage can lower
                your monthly instalments, but it increases the amount still owed
                later and usually makes the vehicle more expensive overall.
              </p>
            </InfoPopover>
          </div>

          <select
            value={balloon}
            onChange={(e) => setBalloon(e.target.value)}
          >
            {balloonOptions.map((item) => (
              <option key={item} value={item}>
                {item}%
              </option>
            ))}
          </select>
        </div>

        <button onClick={calculateFinance} className="sim-btn">
          Simulate <i className="fa-solid fa-flask"></i>
        </button>

        {monthlyPayment && (
          <div className="vehicle-results">
            <h2>Estimated Monthly Repayment</h2>
            <p>{formatCurrency(monthlyPayment)}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default VehicleFinance;