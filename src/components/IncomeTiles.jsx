import React, {useState} from "react";
import {calculatePAYE, calculateNetIncome} from "../utils/taxCalculator";
import {formatCurrency} from "../utils/formatCurrency";
import "../styles/IncomeTiles.css";

function IncomeTiles({gross}) {
  const paye = calculatePAYE(gross);
  const net = calculateNetIncome(gross);

  const [activeInfo, setActiveInfo] = useState(null);

  const toggleInfo = (tileName) => {
    setActiveInfo((prev) => (prev === tileName ? null : tileName));
  };

  return (
    <div className="income-tiles">
      <div className="tile tile-light">
        <button
          type="button"
          className="tile-info-btn"
          onClick={() => toggleInfo("net")}
          aria-expanded={activeInfo === "net"}
        >
          <span class="material-symbols-outlined">help</span>
        </button>

        <div className="tile-content">
          <p className="tile-label">Net Income</p>
          <h2 className="tile-amount net-income">{formatCurrency(net)}</h2>
          <p className="tile-subtext">Estimated take-home pay after PAYE</p>
        </div>

        {activeInfo === "net" && (
          <div className="tile-explainer">
            <h5>What is Net Income?</h5>
            <p>
              Net income is the amount left after estimated PAYE tax has been deducted from your gross monthly income.
            </p>

            <h6>Calculation used</h6>
            <p>Net Income = Gross Income − Estimated PAYE</p>
            <p>
              In your case: {formatCurrency(gross)} − {formatCurrency(paye)} = {formatCurrency(net)}
            </p>
          </div>
        )}
      </div>

      <div className="tile tile-dark">
        <button
          type="button"
          className="tile-info-btn tile-info-btn-dark"
          onClick={() => toggleInfo("gross")}
          aria-expanded={activeInfo === "gross"}
        >
          <span class="material-symbols-outlined">help</span>
        </button>

        <div className="tile-content">
          <p className="tile-label">Gross Income</p>
          <h2 className="tile-amount">{formatCurrency(gross)}</h2>
          <div>
            <p className="tile-subtext">Before tax and other deductions</p>
            <p className="tile-meta">PAYE (Estimated): {formatCurrency(paye)}</p>
          </div>
        </div>
        
        {activeInfo === "gross" && (
          <div className="tile-explainer tile-explainer-dark">
            <h5>What is Gross Income?</h5>
            <p>Gross income is your total monthly income before PAYE tax and other deductions are removed.</p>

            <h6>Calculation used</h6>
            <p>
              PAYE is estimated from your annualised salary using the South African tax brackets in your calculator,
              then converted back to a monthly amount.
            </p>
            <p>
              In your case: Annual income = {formatCurrency(gross * 12)} and estimated monthly PAYE ={" "}
              {formatCurrency(paye)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncomeTiles;
