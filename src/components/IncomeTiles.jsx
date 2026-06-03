import React, { useState } from "react";
import { calculateNetIncome } from "../utils/taxCalculator";
import { formatCurrency } from "../utils/formatCurrency";
import InfoSymbol from "../assets/icons/help-circle.svg?react";
import "../styles/IncomeTiles.css";

function IncomeTiles({
  gross,
  retirement = 0,
  age = 30,
  medicalAidMembers = 0
}) {
  const incomeBreakdown = calculateNetIncome({
    grossIncome: Number(gross) || 0,
    retirement: Number(retirement) || 0,
    age: Number(age) || 30,
    medicalAidMembers: Number(medicalAidMembers) || 0
  });

  const paye = incomeBreakdown.monthlyPAYE;
  const uif = incomeBreakdown.monthlyUIF;
  const net = incomeBreakdown.netIncome;

  const [activeInfo, setActiveInfo] = useState(null);

  const toggleInfo = (tileName) => {
    setActiveInfo((prev) => (prev === tileName ? null : tileName));
  };

  return (
    <div className="income-tiles">
      <div className="tile tile-light">
        <div className="tile-info-wrapper">
          <button
            type="button"
            className="tile-info-btn"
            onClick={() => toggleInfo("net")}
            aria-expanded={activeInfo === "net"}
          >
            <InfoSymbol className="help-circle"/>
          </button>

          {activeInfo === "net" && (
            <div className="tile-popover">
              <h5>What is Net Income?</h5>
              <p>
                Net income is the estimated amount left after PAYE tax and UIF
                have been deducted from your gross monthly income.
              </p>

              <h6>Calculation used</h6>
              <p>Net Income = Gross Income - Estimated PAYE - UIF</p>
              <p>
                In your case: {formatCurrency(gross)} - {formatCurrency(paye)} −{" "}
                {formatCurrency(uif)} = {formatCurrency(net)}
              </p>
            </div>
          )}
        </div>

        <div className="tile-content">
          <p className="tile-label">Net Income</p>
          <h2 className="tile-amount net-income">{formatCurrency(net)}</h2>
          <p className="tile-subtext">Estimated take-home pay after PAYE and UIF</p>
        </div>
      </div>

      <div className="tile tile-dark">
        <div className="tile-info-wrapper">
          <button
            type="button"
            className="tile-info-btn tile-info-btn-dark"
            onClick={() => toggleInfo("gross")}
            aria-expanded={activeInfo === "gross"}
          >
            <InfoSymbol className="help-circle"/>
          </button>

          {activeInfo === "gross" && (
            <div className="tile-popover tile-popover-dark">
              <h5>What is Gross Income?</h5>
              <p>
                Gross income is your total monthly income before PAYE tax, UIF,
                retirement contributions, and other deductions are considered.
              </p>

              <h6>Calculation used</h6>
              <p>
                PAYE is estimated from your annualised salary, adjusted for your
                retirement contribution where applicable, then converted back to
                a monthly amount.
              </p>
              <p>
                In your case: Annual income = {formatCurrency(gross * 12)} and
                estimated monthly PAYE = {formatCurrency(paye)}.
              </p>
            </div>
          )}
        </div>

        <div className="tile-content">
          <p className="tile-label">Gross Income</p>
          <h2 className="tile-amount">{formatCurrency(gross)}</h2>

          <div className="gross-breakdown">
            <p className="tile-subtext">Before tax and other deductions</p>
            <p className="tile-meta">PAYE Estimated: {formatCurrency(paye)}</p>
            <p className="tile-meta">UIF Estimated: {formatCurrency(uif)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeTiles;