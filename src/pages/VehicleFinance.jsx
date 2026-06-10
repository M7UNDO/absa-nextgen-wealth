import React, {useRef, useState} from "react";
import "../styles/VehicleFinance.css";
import {formatCurrency} from "../utils/formatCurrency";
import useInfoToggle from "../hooks/useInfoToggle";
import InfoPopover from "../components/InfoPopover";
import {useFinancials} from "../context/FinancialContext";
import StudioHero from "../components/StudioHero";

function VehicleFinance() {
  const {financials} = useFinancials();

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

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const resultRef = useRef(null);

  const {activeInfo, toggleInfo} = useInfoToggle();

  const selectedTerm = termOptions[termIndex];

  function scrollToResult() {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function getAffordabilityStatus(vehicleToNetRatio, cashAfterVehicle) {
    if (cashAfterVehicle < 0) {
      return {
        status: "High Risk",
        message:
          "This repayment would push your monthly cash flow below zero after your rent and retirement contribution. This may be difficult to afford unless you reduce other expenses or choose a cheaper vehicle.",
      };
    }

    if (vehicleToNetRatio > 25) {
      return {
        status: "High Risk",
        message:
          "This repayment takes up more than 25% of your estimated net income. That may create pressure on your monthly budget and reduce your flexibility.",
      };
    }

    if (vehicleToNetRatio > 15) {
      return {
        status: "Caution",
        message:
          "This repayment is possible, but it takes up a noticeable portion of your income. You may want to compare a larger deposit, a cheaper vehicle, or a different term.",
      };
    }

    return {
      status: "Manageable",
      message:
        "This repayment appears more manageable compared to your estimated net income and saved financial profile.",
    };
  }

  function getVehicleNarrative({
    balloonPercent,
    selectedTerm,
    monthlyPayment,
    totalInterest,
    balloonAmount,
    totalRepayable,
  }) {
    if (balloonPercent > 0) {
      return `This option lowers your monthly instalment to ${formatCurrency(
        monthlyPayment,
      )}, but it leaves a final balloon payment of ${formatCurrency(
        balloonAmount,
      )}. This can make the car feel more affordable month-to-month, but you need a plan for the amount still owed at the end of the term.`;
    }

    if (selectedTerm >= 72) {
      return `This longer repayment term reduces the monthly pressure, but it keeps you in debt for longer. Over the full term, you would pay about ${formatCurrency(
        totalInterest,
      )} in interest, bringing the estimated total repayable amount to ${formatCurrency(totalRepayable)}.`;
    }

    return `This is a more balanced repayment structure. Your monthly repayment may be higher than a long-term or balloon option, but you avoid a large final payment and may reduce the total interest paid over time.`;
  }

  function calculateFinance() {
    setError("");
    setResult(null);

    const price = Number(purchasePrice);
    const depositAmount = Number(deposit) || 0;
    const rate = Number(interestRate);
    const balloonPercent = Number(balloon);

    if (!vehicleType) {
      setError("Please select a vehicle type before running the simulation.");
      return;
    }

    if (!price || price <= 0) {
      setError("Please enter a valid vehicle purchase price.");
      return;
    }

    if (depositAmount < 0) {
      setError("Deposit amount cannot be negative.");
      return;
    }

    if (depositAmount >= price) {
      setError("Deposit amount must be less than the vehicle purchase price.");
      return;
    }

    const loanAmount = price - depositAmount;
    const balloonAmount = loanAmount * (balloonPercent / 100);
    const financedAmount = loanAmount - balloonAmount;

    const monthlyRate = rate / 12 / 100;
    const months = selectedTerm;

    const monthlyPayment =
      monthlyRate === 0
        ? financedAmount / months
        : (financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    const totalMonthlyRepayments = monthlyPayment * months;
    const totalRepayable = totalMonthlyRepayments + balloonAmount;
    const totalInterest = totalRepayable - loanAmount;

    const netIncome = Number(financials?.netIncome) || 0;
    const rent = Number(financials?.rent) || 0;
    const retirement = Number(financials?.retirement) || 0;

    const currentFixedCosts = rent + retirement;
    const currentRemainingCash = netIncome - currentFixedCosts;

    const vehicleToNetRatio = netIncome > 0 ? (monthlyPayment / netIncome) * 100 : 0;

    const cashAfterVehicle = netIncome - rent - retirement - monthlyPayment;

    const affordability = netIncome > 0 ? getAffordabilityStatus(vehicleToNetRatio, cashAfterVehicle) : null;

    const narrative = getVehicleNarrative({
      balloonPercent,
      selectedTerm,
      monthlyPayment,
      totalInterest,
      balloonAmount,
      totalRepayable,
    });

    setResult({
      vehicleType,
      price,
      depositAmount,
      loanAmount,
      selectedTerm,
      rate,
      balloonPercent,
      balloonAmount,
      financedAmount,
      monthlyPayment,
      totalMonthlyRepayments,
      totalRepayable,
      totalInterest,
      netIncome,
      rent,
      retirement,
      currentFixedCosts,
      currentRemainingCash,
      vehicleToNetRatio,
      cashAfterVehicle,
      affordability,
      narrative,
    });

    scrollToResult();
  }

  return (
    <section className="vehicle-finance-page">
      <StudioHero
      title="Vehicle Finance Calculator"
      subheading=""
      />

      <div className="vehicle-inputs-container">
        <div className="vehicle-field">
          <label>Vehicle Type</label>
          <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}>
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
                This is the number of months you will take to repay the vehicle loan. A longer term can reduce the
                monthly repayment, but it usually increases the total interest paid over time.
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
                This is the percentage charged for borrowing the money. A higher interest rate means a more expensive
                loan overall.
              </p>
            </InfoPopover>
          </div>

          <select value={interestRate} onChange={(e) => setInterestRate(e.target.value)}>
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
                A balloon payment is a large final amount left unpaid until the end of the loan. Choosing a higher
                balloon percentage can lower your monthly instalments, but it increases the amount still owed later.
              </p>
            </InfoPopover>
          </div>

          <select value={balloon} onChange={(e) => setBalloon(e.target.value)}>
            {balloonOptions.map((item) => (
              <option key={item} value={item}>
                {item}%
              </option>
            ))}
          </select>
        </div>

        {error && <p className="vehicle-error">{error}</p>}

        <button onClick={calculateFinance} className="sim-btn">
          Simulate Repayment <i className="fa-solid fa-flask"></i>
        </button>
      </div>
      <div className="result-container">
        {result && (
          <div className="vehicle-results vehicle-results-enter" ref={resultRef}>
            <h2>Vehicle Finance Studio Result</h2>

            <div className="vehicle-result-highlight">
              <p>Estimated Monthly Repayment</p>
              <h3>{formatCurrency(result.monthlyPayment)}</h3>
            </div>

            {result.netIncome > 0 ? (
              <div className="vehicle-affordability-card">
                <h3>Affordability Check</h3>

                <div className="vehicle-affordability-status">
                  <span>{result.affordability.status}</span>
                </div>

                <p>
                  This repayment would use <strong>{result.vehicleToNetRatio.toFixed(1)}%</strong> of your estimated net
                  income.
                </p>

                <p>
                  Based on your saved financial profile, your estimated net income is{" "}
                  <strong>{formatCurrency(result.netIncome)}</strong>. After rent, retirement, and this new vehicle
                  repayment, you would have about <strong>{formatCurrency(result.cashAfterVehicle)}</strong> left.
                </p>

                <p>{result.affordability.message}</p>
              </div>
            ) : (
              <div className="vehicle-affordability-card">
                <h3>Affordability Check</h3>
                <p>
                  Complete your financial profile first to see whether this repayment fits into your monthly budget.
                </p>
              </div>
            )}

            <div className="vehicle-result-grid">
              <div>
                <span>Vehicle Type</span>
                <strong>{result.vehicleType}</strong>
              </div>

              <div>
                <span>Purchase Price</span>
                <strong>{formatCurrency(result.price)}</strong>
              </div>

              <div>
                <span>Deposit</span>
                <strong>{formatCurrency(result.depositAmount)}</strong>
              </div>

              <div>
                <span>Loan Amount</span>
                <strong>{formatCurrency(result.loanAmount)}</strong>
              </div>

              <div>
                <span>Term</span>
                <strong>{result.selectedTerm} months</strong>
              </div>

              <div>
                <span>Interest Rate</span>
                <strong>{result.rate}%</strong>
              </div>

              <div>
                <span>Balloon Payment</span>
                <strong>{formatCurrency(result.balloonAmount)}</strong>
              </div>

              <div>
                <span>Total Monthly Repayments</span>
                <strong>{formatCurrency(result.totalMonthlyRepayments)}</strong>
              </div>

              <div>
                <span>Total Interest</span>
                <strong>{formatCurrency(result.totalInterest)}</strong>
              </div>

              <div>
                <span>Total Repayable</span>
                <strong>{formatCurrency(result.totalRepayable)}</strong>
              </div>
            </div>

            <div className="vehicle-insight-card">
              <h3>What this means</h3>
              <p>{result.narrative}</p>
            </div>

            <div className="vehicle-education-card">
              <h3>Did you know?</h3>
              <p>
                A lower monthly repayment is not always the cheapest option. A longer term or balloon payment can make
                the vehicle feel easier to afford month-to-month, but it may increase the full cost of the loan or leave
                you with a large final amount to settle.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default VehicleFinance;
