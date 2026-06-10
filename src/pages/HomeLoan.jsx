import React, {useState, useEffect, useCallback} from "react";
import "../styles/HomeLoan.css";
import homeLoanData from "../data/homeLoanData";
import {formatCurrency} from "../utils/formatCurrency";
import useInfoToggle from "../hooks/useInfoToggle";
import InfoPopover from "../components/InfoPopover";
import StudioHero from "../components/StudioHero";
import TrackAccordionSection from "../components/TrackAccordionSection";
import {useFinancials} from "../context/FinancialContext";

function getPropertyFee(price) {
  if (price <= 100000) return 50.0;
  if (price <= 200000) return 114.0;
  if (price <= 300000) return 727.0;
  if (price <= 600000) return 956.0;
  if (price <= 800000) return 1346.0;
  if (price <= 1000000) return 1546.0;
  if (price <= 2000000) return 1738.0;
  if (price <= 4000000) return 2408.0;
  if (price <= 6000000) return 2922.0;
  if (price <= 8000000) return 3480.0;
  if (price <= 10000000) return 4068.0;
  if (price <= 15000000) return 4844.0;
  if (price <= 20000000) return 5818.0;
  return 7751.0;
}

function getBondFee(amount) {
  if (amount <= 150000) return 561.0;
  if (amount <= 300000) return 727.0;
  if (amount <= 600000) return 956.0;
  if (amount <= 800000) return 1346.0;
  if (amount <= 1000000) return 1546.0;
  if (amount <= 2000000) return 1738.0;
  if (amount <= 4000000) return 2408.0;
  if (amount <= 6000000) return 2922.0;
  if (amount <= 8000000) return 3480.0;
  if (amount <= 10000000) return 4068.0;
  if (amount <= 15000000) return 4844.0;
  if (amount <= 20000000) return 5818.0;
  if (amount <= 30000000) return 6781.0;
  return 9690.0;
}

function HomeLoan() {
  const {financials} = useFinancials();

  const [purchasePrice, setPurchasePrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [interestRate, setInterestRate] = useState("11.75");
  const [loanYears, setLoanYears] = useState(20);

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [propertyFee, setPropertyFee] = useState(0);
  const [bondFee, setBondFee] = useState(0);
  const [budgetRange, setBudgetRange] = useState({min: 0, max: 0});
  const [affordabilityMessage, setAffordabilityMessage] = useState("");
  const [hasSimulated, setHasSimulated] = useState(false);
  const [narrativeClass, setNarrativeClass] = useState("");

  const {activeInfo, toggleInfo} = useInfoToggle();

  const calculateHomeLoan = useCallback(() => {
    const homePrice = Number(purchasePrice);
    const depositAmount = Number(deposit) || 0;
    const annualRate = Number(interestRate);
    const years = Number(loanYears);

    const grossIncome = financials?.grossIncome ? Number(financials.grossIncome) : 0;

    if (!homePrice || homePrice <= 0 || !annualRate || annualRate <= 0 || depositAmount >= homePrice) {
      setMonthlyPayment(0);
      setTotalRepayment(0);
      setTotalInterest(0);
      setPropertyFee(0);
      setBondFee(0);
      setBudgetRange({min: 0, max: 0});
      return;
    }

    const financedAmount = homePrice - depositAmount;
    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    const payment = (financedAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
    const totalAmountPaid = payment * months;
    const interest = totalAmountPaid - financedAmount;
    const propFee = getPropertyFee(homePrice);
    const bFee = getBondFee(financedAmount);

    setMonthlyPayment(payment);
    setTotalRepayment(totalAmountPaid);
    setTotalInterest(interest);
    setPropertyFee(propFee);
    setBondFee(bFee);

    if (grossIncome > 0) {
      const comfortableBudget = grossIncome * 0.25;
      const maxBudget = grossIncome * 0.3;

      const minLoan = (comfortableBudget * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;
      const maxLoan = (maxBudget * (1 - Math.pow(1 + monthlyRate, -months))) / monthlyRate;

      setBudgetRange({min: minLoan, max: maxLoan});

      const percentageOfIncome = ((payment / grossIncome) * 100).toFixed(1);

      if (payment <= grossIncome * 0.25) {
        setNarrativeClass("narrative-safe");
        setAffordabilityMessage(
          `Great news! This home is well within your budget. At ${formatCurrency(payment)} a month, it takes up ${percentageOfIncome}% of your gross monthly income of ${formatCurrency(grossIncome)}. This leaves you with a very comfortable margin for other expenses, rates, and savings. You are making a solid, low-risk financial decision.`,
        );
      } else if (payment <= grossIncome * 0.3) {
        setNarrativeClass("narrative-safe");
        setAffordabilityMessage(
          `This is a perfectly affordable option for you. The bond repayment represents ${percentageOfIncome}% of your gross income (${formatCurrency(grossIncome)}). Just ensure you continue to leave enough room in your monthly budget for home maintenance and living expenses.`,
        );
      } else if (payment <= grossIncome * 0.4) {
        setNarrativeClass("narrative-warning");
        setAffordabilityMessage(
          `This property might stretch your finances slightly, taking up ${percentageOfIncome}% of your ${formatCurrency(grossIncome)} gross income. You might want to consider putting down a larger deposit or looking at properties in a slightly lower bracket to give yourself more breathing room so you don't feel house-poor.`,
        );
      } else {
        setNarrativeClass("narrative-danger");
        setAffordabilityMessage(
          `This falls into a high-risk category. At ${percentageOfIncome}% of your gross monthly income, banks may be very hesitant to approve this loan. We strongly suggest looking at a lower purchase price or saving up for a much larger deposit to protect your financial well-being and avoid future distress.`,
        );
      }
    } else {
      setNarrativeClass("");
      setAffordabilityMessage(
        "We couldn't detect your gross income from your financial setup. Please complete your financial onboarding to get a personalised affordability breakdown.",
      );
    }
  }, [purchasePrice, deposit, interestRate, loanYears, financials]);

  useEffect(() => {
    if (hasSimulated) {
      calculateHomeLoan();
    }
  }, [purchasePrice, deposit, interestRate, loanYears, calculateHomeLoan, hasSimulated]);

  const handleSimulate = () => {
    setHasSimulated(true);
    calculateHomeLoan();
  };

  return (
    <section className="home-loan-page">
      <StudioHero
        title="Home Loan Affordability Calculator"
        subheading="Discover your home-buying budget and estimate your monthly bond repayments"
      />

      <div className="home-loan-container">
        <div className="inputs-container">
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
                <p>This is the full price of the property you want to buy before subtracting your deposit.</p>
              </InfoPopover>
            </div>
            <input
              type="number"
              placeholder="e.g. 1500000"
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
                  Your deposit is the amount you pay upfront toward the property. A larger deposit usually reduces the
                  loan amount and monthly repayment.
                </p>
              </InfoPopover>
            </div>
            <input
              type="number"
              placeholder="e.g. 20000"
              value={deposit}
              onChange={(e) => setDeposit(e.target.value)}
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
                  This is the number of years you will take to repay the home loan. A longer term can lower the monthly
                  repayment, but it usually increases the total interest paid.
                </p>
              </InfoPopover>
            </div>
            <input type="text" value={`${loanYears} Years`} readOnly className="loan-inputs" />
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={loanYears}
              onChange={(e) => setLoanYears(Number(e.target.value))}
              style={{
                "--value": `${((loanYears - 1) / (30 - 1)) * 100}%`,
              }}
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
                  This is the percentage charged by the lender for borrowing the money. A higher interest rate increases
                  the monthly repayment and the total cost of the loan.
                </p>
              </InfoPopover>
            </div>
            <input
              type="number"
              min="1"
              max="30"
              step="0.01"
              placeholder="11.75"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="loan-inputs"
            />
            <input
              type="range"
              min="1"
              max="25"
              step="0.25"
              value={interestRate || 1}
              onChange={(e) => setInterestRate(e.target.value)}
              style={{
                "--value": `${(((Number(interestRate) || 1) - 1) / (25 - 1)) * 100}%`,
              }}
            />
          </div>

          {!hasSimulated && (
            <button onClick={handleSimulate} className="loan-btn">
              Run Simulation <i className="fa-solid fa-flask"></i>
            </button>
          )}
        </div>

        <div className="results-container">
          <h2>Total Monthly Repayment</h2>
          <p className="result-subheading">
            {!hasSimulated
              ? "See what your total monthly repayment amount would be on your new home"
              : "Here is your personalised affordability breakdown and estimated costs"}
          </p>
          <p className="repayment-amount">{formatCurrency(monthlyPayment)}</p>

          <div className="result-divider"></div>

          <div className="result-container" style={{width: "100%", marginTop: "2rem"}}>
            <div className="breakdown-row">
              <span>Total Repayment</span>
              <span>{formatCurrency(totalRepayment)}</span>
            </div>

            <div className="breakdown-row">
              <span>Total Interest Added</span>
              <span style={{color: "var(--primary-colour)"}}>{formatCurrency(totalInterest)}</span>
            </div>

            <div className="result-divider" style={{margin: "1.5rem auto"}}></div>
            <h3 style={{fontSize: "1.8rem", marginBottom: "1rem"}}>Estimated Deeds Office Fees</h3>

            <div className="breakdown-row">
              <span>Property Purchase Fee</span>
              <span>{formatCurrency(propertyFee)}</span>
            </div>

            <div className="breakdown-row">
              <span>Bond Registration Fee</span>
              <span>{formatCurrency(bondFee)}</span>
            </div>

            <div className="result-divider" style={{margin: "1.5rem auto"}}></div>
            <h3 style={{fontSize: "1.8rem", marginBottom: "1rem"}}>Your Affordability Range</h3>

            <div className="breakdown-row">
              <span>Qualifying Loan Amount Range</span>
              <span style={{fontWeight: "bold"}}>
                {formatCurrency(budgetRange.min)} - {formatCurrency(budgetRange.max)}
              </span>
            </div>

            {hasSimulated && (
              <div className={`loan-message ${narrativeClass}`}>
                <span>{affordabilityMessage}</span>
              </div>
            )}

            <TrackAccordionSection title={homeLoanData.accordion.title} items={homeLoanData.accordion.items} />
          </div>
        </div>
      </div>

      <div className="disclaimer-container">
        <p className="disclaimer-text">
          Disclaimer: This studio provides estimates based on your inputs and should not be considered formal financial
          advice. We are not liable for any inaccuracies or resulting losses. Contact us for verified calculations.
        </p>
      </div>
    </section>
  );
}

export default HomeLoan;
