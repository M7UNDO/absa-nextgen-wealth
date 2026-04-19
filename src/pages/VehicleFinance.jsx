import React, {useState} from "react";
import "../styles/VehicleFinance.css";

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

    const payment = (financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    setMonthlyPayment(payment);
  }

  return (
    <section className="vehicle-finance-page">
      <h1>Vehicle Finance Calculator</h1>

      <div className="vehicle-inputs-container">
        <div>
          <label>Vehicle Type</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
            <option value="">Please Select</option>
            <option value="Used">Used</option>
            <option value="New">New</option>
            <option value="Demo">Demo</option>
          </select>
        </div>

        <div>
          <label>Vehicle Purchase Price</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className="vehicle-inputs"
          />
        </div>

        <div>
          <label>Deposit Amount</label>
          <input
            type="number"
            placeholder="Enter deposit"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="vehicle-inputs"
          />
        </div>

        <div>
          <label>Repayment Term</label>
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

        <div>
          <label>Interest Rate %</label>
          <select value={interestRate} onChange={(e) => setInterestRate(e.target.value)}>
            {interestOptions.map((rate) => (
              <option key={rate} value={rate}>
                {rate}%
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Balloon Percentage %</label>
          <select value={balloon} onChange={(e) => setBalloon(e.target.value)}>
            {balloonOptions.map((item) => (
              <option key={item} value={item}>
                {item}%
              </option>
            ))}
          </select>
        </div>

        <button onClick={calculateFinance}>Simulate<i class="fa-solid fa-flask"></i></button>

        {monthlyPayment && (
          <div>
            <h2>Estimated Monthly Repayment</h2>
            <p>R{monthlyPayment.toFixed(0)}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default VehicleFinance;
