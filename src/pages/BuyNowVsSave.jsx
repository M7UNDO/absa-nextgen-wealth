import React, { useState } from "react";
import "../styles/BuyNowVsSave.css";
import useInfoToggle from "../hooks/useInfoToggle";
import InfoPopover from "../components/InfoPopover";
import { formatCurrency } from "../utils/formatCurrency";

function BuyNowVsSave() {
  const [price, setPrice] = useState("");
  const [bnplMonths, setBnplMonths] = useState(6);
  const [bnplInterest, setBnplInterest] = useState("15");
  const [saveMonths, setSaveMonths] = useState(6);

  const [bnplMonthly, setBnplMonthly] = useState(null);
  const [bnplTotal, setBnplTotal] = useState(null);
  const [saveMonthly, setSaveMonthly] = useState(null);
  const [verdict, setVerdict] = useState("");

  const { activeInfo, toggleInfo } = useInfoToggle();

  function compareOptions() {
    const itemPrice = Number(price);
    const interest = Number(bnplInterest);

    if (!itemPrice || itemPrice <= 0) return;

    const totalBnpl = itemPrice + itemPrice * (interest / 100);
    const bnplPerMonth = totalBnpl / bnplMonths;

    const savingPerMonth = itemPrice / saveMonths;

    setBnplTotal(totalBnpl);
    setBnplMonthly(bnplPerMonth);
    setSaveMonthly(savingPerMonth);

    if (totalBnpl > itemPrice) {
      const extra = totalBnpl - itemPrice;

      setVerdict(
        `Saving first takes ${saveMonths} months longer but saves you ${formatCurrency(extra)} overall.`
      );
    } else {
      setVerdict("Both options cost the same overall.");
    }
  }

  return (
    <section className="bnpl-page">
      <h1>BNPL vs Save First</h1>

      <div className="bnpl-form">
        <div className="bnpl-field">
          <div className="bnpl-label-row">
            <label>Purchase Price (ZAR)</label>

            <InfoPopover
              infoKey="purchasePrice"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Purchase Price?"
              className="bnpl-info-popover-wrapper"
              buttonClassName="bnpl-info-popover-btn"
              popoverClassName="bnpl-info-popover-panel"
            >
              <p>
                This is the full price of the item you want to compare across
                both options.
              </p>
            </InfoPopover>
          </div>

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

        <div className="bnpl-field">
          <div className="bnpl-label-row">
            <label>Repayment Term (Months)</label>

            <InfoPopover
              infoKey="bnplMonths"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Repayment Term?"
              className="bnpl-info-popover-wrapper"
              buttonClassName="bnpl-info-popover-btn"
              popoverClassName="bnpl-info-popover-panel"
            >
              <p>
                This is the number of months you will take to repay the BNPL
                purchase. A longer term can lower the monthly amount, but it can
                also keep you in debt for longer.
              </p>
            </InfoPopover>
          </div>

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

        <div className="bnpl-field">
          <div className="bnpl-label-row">
            <label>Interest %</label>

            <InfoPopover
              infoKey="bnplInterest"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Interest %?"
              className="bnpl-info-popover-wrapper"
              buttonClassName="bnpl-info-popover-btn"
              popoverClassName="bnpl-info-popover-panel"
            >
              <p>
                This is the extra percentage charged on top of the item price
                for using the BNPL option. A higher percentage increases the
                total cost.
              </p>
            </InfoPopover>
          </div>

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

        <div className="bnpl-field">
          <div className="bnpl-label-row">
            <label>Saving Period (Months)</label>

            <InfoPopover
              infoKey="saveMonths"
              activeInfo={activeInfo}
              toggleInfo={toggleInfo}
              title="What is Saving Period?"
              className="bnpl-info-popover-wrapper"
              buttonClassName="bnpl-info-popover-btn"
              popoverClassName="bnpl-info-popover-panel"
            >
              <p>
                This is how long you plan to save before buying the item. A
                shorter saving period means a higher monthly saving target.
              </p>
            </InfoPopover>
          </div>

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
              <p>{formatCurrency(bnplTotal)}</p>
              <span>{formatCurrency(bnplMonthly)}/month</span>
              <small>{bnplMonths} months</small>
            </div>

            <div className="result-card">
              <h3>Save First Outcome</h3>
              <p>{formatCurrency(Number(price))}</p>
              <span>{formatCurrency(saveMonthly)}/month</span>
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