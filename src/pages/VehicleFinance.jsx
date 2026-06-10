import React, { useRef, useState, useEffect, useCallback } from "react";
import "../styles/VehicleFinance.css";
import { formatCurrency } from "../utils/formatCurrency";
import useInfoToggle from "../hooks/useInfoToggle";
import InfoPopover from "../components/InfoPopover";
import { useFinancials } from "../context/FinancialContext";
import StudioHero from "../components/StudioHero";
import TrackAccordionSection from "../components/TrackAccordionSection";

function VehicleFinance() {
  const { financials } = useFinancials();

  // Configuration arrays
  const termOptions = [24, 36, 48, 60, 72, 78, 84, 90, 96];

  const balloonOptions = [];
  for (let i = 0; i <= 60; i += 5) {
    balloonOptions.push(i.toFixed(1));
  }

  // State
  const [vehicleType, setVehicleType] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [termIndex, setTermIndex] = useState(3); // Default 60 months
  const [interestRate, setInterestRate] = useState("10.0");
  const [balloon, setBalloon] = useState("0.0");

  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [hasSimulated, setHasSimulated] = useState(false);

  const resultRef = useRef(null);
  const { activeInfo, toggleInfo } = useInfoToggle();
  const selectedTerm = termOptions[termIndex];

  function scrollToResult() {
    if (window.innerWidth < 992) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }

  const getAffordabilityStatus = useCallback((vehicleToNetRatio, cashAfterVehicle) => {
    if (cashAfterVehicle < 0) {
      return {
        status: "High Risk",
        message:
          "This repayment would push your monthly cash flow below zero after your rent and retirement contributions. This may be difficult to afford unless you reduce other expenses or choose a cheaper vehicle.",
        narrativeClass: "narrative-danger"
      };
    }

    if (vehicleToNetRatio > 25) {
      return {
        status: "High Risk",
        message:
          "This repayment takes up more than 25% of your estimated net income. That may create pressure on your monthly budget and restrict your financial flexibility.",
        narrativeClass: "narrative-danger"
      };
    }

    if (vehicleToNetRatio > 15) {
      return {
        status: "Caution",
        message:
          "This repayment is possible, but it takes up a noticeable portion of your income. You may want to compare a larger deposit, a cheaper vehicle, or a different repayment term.",
        narrativeClass: "narrative-warning"
      };
    }

    return {
      status: "Manageable",
      message:
        "This repayment appears manageable when factored into your monthly financial data.",
      narrativeClass: "narrative-safe"
    };
  }, []);

  const getVehicleNarrative = useCallback(({
    balloonPercent,
    selectedTerm,
    monthlyPayment,
    totalInterest,
    balloonAmount,
    totalRepayable,
  }) => {
    if (balloonPercent > 0) {
      return `This option lowers your monthly instalment to ${formatCurrency(
        monthlyPayment,
      )}, but it leaves a final balloon payment of ${formatCurrency(
        balloonAmount,
      )}. This can make the car feel more affordable month-to-month, but you need a solid plan for the amount still owed at the end of the term.`;
    }

    if (selectedTerm >= 72) {
      return `This longer repayment term reduces the monthly pressure, but keeps you in debt for longer. Over the full term, you would pay about ${formatCurrency(
        totalInterest,
      )} in interest, bringing the estimated total repayable amount to ${formatCurrency(totalRepayable)}.`;
    }

    return `This is a highly balanced repayment structure. Your monthly instalment may be higher than a long-term or balloon option, but you avoid a large final payment and minimise the total interest paid over time.`;
  }, []);

  const calculateFinance = useCallback(() => {
    setError("");

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
  }, [
    vehicleType, purchasePrice, deposit, interestRate, balloon,
    selectedTerm, financials, getAffordabilityStatus, getVehicleNarrative
  ]);

  // Live updates once the user has clicked "Simulate" at least once
  useEffect(() => {
    if (hasSimulated) {
      calculateFinance();
    }
  }, [vehicleType, purchasePrice, deposit, termIndex, interestRate, balloon, calculateFinance, hasSimulated]);

  const handleSimulate = () => {
    setHasSimulated(true);
    calculateFinance();
    scrollToResult();
  };

  // Provide fallback default data so the right column is fully populated before simulation
  const displayData = result || {
    vehicleType: "-",
    price: 0,
    depositAmount: 0,
    loanAmount: 0,
    selectedTerm: selectedTerm,
    rate: Number(interestRate) || 0,
    balloonAmount: 0,
    totalInterest: 0,
    totalRepayable: 0,
    monthlyPayment: 0,
    netIncome: Number(financials?.netIncome) || 0,
    vehicleToNetRatio: 0,
    cashAfterVehicle: 0,
    affordability: null,
    narrative: "Fill in your details and simulate to generate your personalised insight."
  };

  // Helper for R0.00 rendering
  const renderCurrency = (val) => (val && val > 0 ? formatCurrency(val) : "R 0.00");

  // Calculate percentages for the slider fill logic
  const termPercent = (termIndex / (termOptions.length - 1)) * 100;
  const interestValueNum = Number(interestRate) || 0;
  // Interest slider mapped from 1 to 100 for the fill percentage
  const interestPercent = Math.min(Math.max(((interestValueNum - 1) / (100 - 1)) * 100, 0), 100);

  // Educational insights for the accordion
  const educationItems = [
    {
      title: "Balloon Payments: Lower Monthlies vs. Future Debt",
      content: "A balloon payment drastically lowers your monthly instalment, but leaves a massive lump sum at the end of your term. If you don't have cash saved up to settle it when the time comes, you might be forced to trade in the car or take out another loan just to pay off the balance."
    },
    {
      title: "Long Term vs. Short Term Loans",
      content: "Structuring a loan over 72 to 96 months makes more expensive cars look affordable on a monthly basis, but you will pay significantly more in total interest. Additionally, cars depreciate fast; a long loan often means owing more than the car is worth for several years (known as negative equity)."
    },
    {
      title: "The Power of a Deposit",
      content: "Putting down a cash deposit or a high-value trade-in not only lowers your monthly repayment and reduces total interest, but it also protects you against the instant depreciation that occurs the moment you drive a new or demo vehicle off the floor."
    },
    {
      title: "New vs. Used vs. Demo",
      content: "New cars offer peace of mind with full warranties but suffer the steepest depreciation in the first year. Demo models offer a middle ground with slightly lower prices and active warranties. Used cars provide the best value regarding depreciation, but you should factor in potential higher maintenance costs."
    }
  ];

  return (
    <section className="vehicle-finance-page">
      <StudioHero title="Vehicle Finance Calculator" subheading="Compare repayment scenarios and understand the long-term cost of ownership." />
      
      <div className="vehicle-page-container">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="vehicle-inputs-column">
          <div className="vehicle-field">
            <div className="vehicle-label-row">
              <label>Vehicle Type</label>
            </div>
            <select 
              value={vehicleType} 
              onChange={(e) => setVehicleType(e.target.value)}
              className="vehicle-inputs"
            >
              <option value="">Please Select</option>
              <option value="Used">Used</option>
              <option value="New">New</option>
              <option value="Demo">Demo</option>
            </select>
          </div>

          <div className="vehicle-field">
            <div className="vehicle-label-row">
              <label>Vehicle Purchase Price (ZAR)</label>
            </div>
            <input
              type="number"
              placeholder="e.g. 350000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="vehicle-inputs"
            />
          </div>

          <div className="vehicle-field">
            <div className="vehicle-label-row">
              <label>Deposit Amount (ZAR)</label>
            </div>
            <input
              type="number"
              placeholder="e.g. 35000"
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
            <input type="text" value={`${selectedTerm} Months`} readOnly className="vehicle-inputs" />
            <input
              type="range"
              min="0"
              max={termOptions.length - 1}
              step="1"
              value={termIndex}
              onChange={(e) => setTermIndex(Number(e.target.value))}
              className="vehicle-range-slider"
              style={{ "--value": `${termPercent}%` }}
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
            <input
              type="number"
              min="1"
              max="100"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="vehicle-inputs"
              placeholder="e.g. 11.5"
            />
            <input
              type="range"
              min="1"
              max="100"
              step="0.1"
              value={interestValueNum}
              onChange={(e) => setInterestRate(e.target.value)}
              className="vehicle-range-slider"
              style={{ "--value": `${interestPercent}%` }}
            />
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
            <select 
              value={balloon} 
              onChange={(e) => setBalloon(e.target.value)}
              className="vehicle-inputs"
            >
              {balloonOptions.map((item) => (
                <option key={item} value={item}>
                  {item}%
                </option>
              ))}
            </select>
          </div>

          {error && <p className="vehicle-error">{error}</p>}

          {!hasSimulated && (
            <button onClick={handleSimulate} className="vehicle-btn">
              Simulate Repayment <i className="fa-solid fa-flask"></i>
            </button>
          )}
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="vehicle-results-column" ref={resultRef}>
          <h2>Monthly Repayment</h2>
          <p className="vehicle-result-subheading">
            {!hasSimulated
              ? "Fill in your details and simulate to see your vehicle finance breakdown."
              : "Here is your personalised vehicle finance breakdown."}
          </p>
          
          <p className="vehicle-repayment-amount">
            {renderCurrency(displayData.monthlyPayment)}
          </p>

          <div className="vehicle-result-divider"></div>

          <div className="vehicle-result-content" style={{ width: "100%", marginTop: "2rem" }}>
            
            {/* Financial Profile Context Message */}
            {hasSimulated && displayData.netIncome > 0 && displayData.affordability ? (
              <div className={`vehicle-message ${displayData.affordability.narrativeClass}`}>
                <div className="vehicle-message-header">
                  <span className="vehicle-message-title">Affordability Status</span>
                  <div className="vehicle-affordability-status">
                    <span>{displayData.affordability.status}</span>
                  </div>
                </div>
                <p className="vehicle-message-text">
                  This repayment uses <span className="vehicle-highlight-text">{displayData.vehicleToNetRatio.toFixed(1)}%</span> of your estimated net income.
                </p>
                <p className="vehicle-message-text">
                  Based on your financial data, your estimated net income is <span className="vehicle-highlight-text">{renderCurrency(displayData.netIncome)}</span>. 
                  After rent, retirement, and this vehicle repayment, you will have about <span className="vehicle-highlight-text">{renderCurrency(displayData.cashAfterVehicle)}</span> left.
                </p>
                <p className="vehicle-message-text">{displayData.affordability.message}</p>
              </div>
            ) : null}

            {hasSimulated && displayData.netIncome <= 0 ? (
              <div className="vehicle-message">
                <p className="vehicle-message-text">Complete your financial data profile first to see whether this repayment fits into your monthly budget.</p>
              </div>
            ) : null}

            {/* Vehicle Result Grid Tiles */}
            <div className="vehicle-result-grid">
              <div className="vehicle-tile">
                <span className="vehicle-tile-label">Vehicle Type</span>
                <span className="vehicle-tile-value">{displayData.vehicleType}</span>
              </div>
              <div className="vehicle-tile">
                <span className="vehicle-tile-label">Purchase Price</span>
                <span className="vehicle-tile-value">{renderCurrency(displayData.price)}</span>
              </div>
              <div className="vehicle-tile">
                <span className="vehicle-tile-label">Deposit</span>
                <span className="vehicle-tile-value">{renderCurrency(displayData.depositAmount)}</span>
              </div>
              <div className="vehicle-tile">
                <span className="vehicle-tile-label">Loan Amount</span>
                <span className="vehicle-tile-value">{renderCurrency(displayData.loanAmount)}</span>
              </div>
              <div className="vehicle-tile">
                <span className="vehicle-tile-label">Term</span>
                <span className="vehicle-tile-value">{displayData.selectedTerm} months</span>
              </div>
              <div className="vehicle-tile">
                <span className="vehicle-tile-label">Interest Rate</span>
                <span className="vehicle-tile-value">{displayData.rate}%</span>
              </div>
              <div className="vehicle-tile">
                <span className="vehicle-tile-label">Balloon Payment</span>
                <span className={`vehicle-tile-value ${displayData.balloonAmount > 0 ? "vehicle-tile-warning" : ""}`}>
                  {renderCurrency(displayData.balloonAmount)}
                </span>
              </div>
              <div className="vehicle-tile">
                <span className="vehicle-tile-label">Total Interest</span>
                <span className="vehicle-tile-value vehicle-tile-primary">
                  {renderCurrency(displayData.totalInterest)}
                </span>
              </div>
              
              {/* Full Width Tile */}
              <div className="vehicle-tile vehicle-tile-full">
                <span className="vehicle-tile-label">Total Repayable</span>
                <span className="vehicle-tile-value">{renderCurrency(displayData.totalRepayable)}</span>
              </div>
            </div>

            {/* Narrative Insight */}
            <div className="vehicle-insight-card">
              <h3>What this means</h3>
              <p>{displayData.narrative}</p>
            </div>

            {/* Educational Accordion */}
            <div className="vehicle-educational-section">
              <TrackAccordionSection title="Finance Trade-Offs & Knowledge" items={educationItems} />
            </div>

          </div>
        </div>
      </div>

      <div className="vehicle-disclaimer-container">
        <p className="vehicle-disclaimer-text">
          Disclaimer: This calculator is for estimation purposes only. We do not guarantee its accuracy and accept no liability for financial decisions or losses resulting from its use. Please consult with us to verify these results.
        </p>
      </div>
    </section>
  );
}

export default VehicleFinance;