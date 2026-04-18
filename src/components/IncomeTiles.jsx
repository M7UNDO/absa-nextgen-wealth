import React from "react";
import { calculatePAYE, calculateNetIncome } from "../utils/taxCalculator";

function IncomeTiles({ gross }) {
  const paye = calculatePAYE(gross);
  const net = calculateNetIncome(gross);

  return (
    <div className="income-tiles">
      <div className="tile light">
        <h4>Net Income</h4>
        <h2 className="net-income">R {net.toLocaleString()}</h2>
      </div>

      <div className="tile dark">
        <h4>Gross Income</h4>
        <h2>R {gross.toLocaleString()}</h2>
        <p>PAYE (Estimated): R {paye.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default IncomeTiles;