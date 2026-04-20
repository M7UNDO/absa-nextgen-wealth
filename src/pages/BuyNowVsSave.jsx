import React, { useState } from "react";
import "../styles/BuyNowVsSave.css";

function BuyNowVsSave() {
  const [price, setPrice] = useState("");
  const [bnplMonths, setBnplMonths] = useState(6);
  const [bnplInterest, setBnplInterest] = useState("15");
  const [saveMonths, setSaveMonths] = useState(6);

  const [bnplMonthly, setBnplMonthly] = useState(null);
  const [bnplTotal, setBnplTotal] = useState(null);
  const [saveMonthly, setSaveMonthly] = useState(null);
  const [verdict, setVerdict] = useState("");

  function compareOptions() {
    const itemPrice = Number(price);
    const interest = Number(bnplInterest);

    if (!itemPrice || itemPrice <= 0) return;

    /* BNPL */
    const totalBnpl = itemPrice + itemPrice * (interest / 100);
    const bnplPerMonth = totalBnpl / bnplMonths;

    /* Save First */
    const savingPerMonth = itemPrice / saveMonths;

    setBnplTotal(totalBnpl);
    setBnplMonthly(bnplPerMonth);
    setSaveMonthly(savingPerMonth);

    if (totalBnpl > itemPrice) {
      const extra = totalBnpl - itemPrice;

      setVerdict(
        `Saving first takes ${saveMonths} months longer but saves you R${extra.toFixed(
          0
        )} overall.`
      );
    } else {
      setVerdict("Both options cost the same overall.");
    }
  }

  return (
    <section className="bnpl-page">
      <h1>BNPL vs Save First</h1>

      <div className="bnpl-form">
        {/* Purchase Price */}
        <div>
          <label>Purchase Price (ZAR)</label>
          <input
            type="number"
            placeholder="Enter item price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="section-divider">
          <h2>Buy Now, Pay Later</h2>
        </div>

        <div>
          <label>Repayment Term (Months)</label>

          <input type="text" value={`${bnplMonths} Months`} readOnly />

          <input
            type="range"
            min="2"
            max="24"
            step="1"
            value={bnplMonths}
            onChange={(e) => setBnplMonths(Number(e.target.value))}
            className="bnpl-slider"
          />
        </div>

        <div>
          <label>Interest %</label>

          <input
            type="number"
            min="1"
            max="100"
            step="1"
            value={bnplInterest}
            onChange={(e) => setBnplInterest(e.target.value)}
          />
        </div>

        <div className="section-divider">
          <h2>Save First</h2>
        </div>

        <div>
          <label>Saving Period (Months)</label>

          <input type="text" value={`${saveMonths} Months`} readOnly />

          <input
            type="range"
            min="1"
            max="24"
            step="1"
            value={saveMonths}
            onChange={(e) => setSaveMonths(Number(e.target.value))}
            className="bnpl-slider"
          />
        </div>

        <button onClick={compareOptions} className="bnpl-btn">
          Compare Options
        </button>

        {bnplTotal && (
          <div className="results-wrap">
            <div className="result-card">
              <h3>BNPL Outcome</h3>
              <p>R{bnplTotal.toFixed(0)}</p>
              <span>R{bnplMonthly.toFixed(0)}/month</span>
              <small>{bnplMonths} months</small>
            </div>

            <div className="result-card">
              <h3>Save First Outcome</h3>
              <p>R{Number(price).toFixed(0)}</p>
              <span>R{saveMonthly.toFixed(0)}/month</span>
              <small>{saveMonths} months</small>
            </div>
          </div>
        )}

        {verdict && (
          <div className="tip-box">
            <small>{verdict}</small>
          </div>
        )}
      </div>
    </section>
  );
}

export default BuyNowVsSave;