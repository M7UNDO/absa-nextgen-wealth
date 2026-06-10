import React, { useState, useEffect, useRef } from "react"; // Added useEffect and useRef
import { calculateNetIncome } from "../utils/taxCalculator";
import { formatCurrency } from "../utils/formatCurrency";
import InfoPopover from "./InfoPopover"; 
import "../styles/IncomeTiles.css";
import { gsap } from "gsap"; // Imported GSAP

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
  
  // Refs for tracking container and storing previous values for smooth recalculations
  const containerRef = useRef(null);
  const prevValues = useRef({ gross: 0, net: 0, paye: 0, uif: 0 });

  const toggleInfo = (tileName) => {
    setActiveInfo((prev) => (prev === tileName ? null : tileName));
  };

  useEffect(() => {
    
    const ctx = gsap.context(() => {
      const obj = { ...prevValues.current };

      gsap.to(obj, {
        gross: Number(gross) || 0,
        net: Number(net) || 0,
        paye: Number(paye) || 0,
        uif: Number(uif) || 0,
        duration: 1.2,
        ease: "power3.out",
        onUpdate: () => {

          const grossEl = containerRef.current?.querySelector(".gross-amount");
          const netEl = containerRef.current?.querySelector(".net-amount");
          const payeEl = containerRef.current?.querySelector(".paye-amount");
          const uifEl = containerRef.current?.querySelector(".uif-amount");

          if (grossEl) grossEl.textContent = formatCurrency(obj.gross);
          if (netEl) netEl.textContent = formatCurrency(obj.net);
          if (payeEl) payeEl.textContent = formatCurrency(obj.paye);
          if (uifEl) uifEl.textContent = formatCurrency(obj.uif);
        },
        onComplete: () => {
          prevValues.current = { gross, net, paye, uif };
        }
      });
    }, containerRef);

    return () => ctx.revert(); 
  }, [gross, net, paye, uif]);

  return (
    <div ref={containerRef} className="income-tiles">

      <div className="tile tile-light">
        <div className="tile-info-wrapper">
          <InfoPopover
            infoKey="net"
            activeInfo={activeInfo}
            toggleInfo={toggleInfo}
            title="What is Net Income?"
            buttonClassName="tile-info-btn"
            popoverClassName="tile-popover"
          >
            <p>
              Net income is the estimated amount left after PAYE tax and UIF
              have been deducted from your gross monthly income.
            </p>

            <h6>Calculation used</h6>
            <p>Net Income = Gross Income - Estimated PAYE - UIF</p>
            <p>
              In your case: {formatCurrency(gross)} - {formatCurrency(paye)} -{" "}
              {formatCurrency(uif)} = {formatCurrency(net)}
            </p>
          </InfoPopover>
        </div>

        <div className="tile-content">
          <p className="tile-label">Net Income</p>

          <h2 className="tile-amount net-income net-amount">{formatCurrency(net)}</h2>
          <p className="tile-subtext">Estimated take-home pay after PAYE and UIF</p>
        </div>
      </div>


      <div className="tile tile-dark">
        <div className="tile-info-wrapper">
          <InfoPopover
            infoKey="gross"
            activeInfo={activeInfo}
            toggleInfo={toggleInfo}
            title="What is Gross Income?"
            dark={true}
            buttonClassName="tile-info-btn tile-info-btn-dark"
            popoverClassName="tile-popover tile-popover-dark"
          >
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
          </InfoPopover>
        </div>

        <div className="tile-content">
          <p className="tile-label">Gross Income</p>

          <h2 className="tile-amount gross-amount">{formatCurrency(gross)}</h2>

          <div className="gross-breakdown">
            <p className="tile-subtext">Before tax and other deductions</p>
            <p className="tile-meta">PAYE Estimated: <span className="paye-amount">{formatCurrency(paye)}</span></p>
            <p className="tile-meta">UIF Estimated: <span className="uif-amount">{formatCurrency(uif)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IncomeTiles;