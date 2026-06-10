import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "../styles/BuyNowVsSave.css";
import useInfoToggle from "../hooks/useInfoToggle";
import InfoPopover from "../components/InfoPopover";
import StudioHero from "../components/StudioHero";
import TrackAccordionSection from "../components/TrackAccordionSection";
import { formatCurrency } from "../utils/formatCurrency";
import { useFinancials } from "../context/FinancialContext";
import { calculateNetIncome } from "../utils/taxCalculator";

function BuyNowVsSave() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [bnplMonths, setBnplMonths] = useState(6);
  const [bnplInterest, setBnplInterest] = useState("15");
  const [saveMonths, setSaveMonths] = useState(6);

  const [hasCalculated, setHasCalculated] = useState(false);

  const { activeInfo, toggleInfo } = useInfoToggle();
  const { financials } = useFinancials();
  const grossIncome = Number(financials?.grossIncome) || 0;
  const rent = Number(financials?.rent) || 0;
  const retirement = Number(financials?.retirement) || 0;
  const vehicle = Number(financials?.vehicle) || 0;
  const age = Number(financials?.age) || 30;
  const medicalAidMembers = Number(financials?.medicalAidMembers) || 0;

  const incomeBreakdown = calculateNetIncome({
    grossIncome,
    retirement,
    age,
    medicalAidMembers,
  });

  const netIncome = incomeBreakdown?.netIncome || 0;
  const totalExpenses = rent + retirement + vehicle;
  const discretionaryCash = Math.max(0, netIncome - totalExpenses);

  const handleCalculate = (e) => {
    e.preventDefault();
    const itemPrice = Number(price);
    if (!itemPrice || itemPrice <= 0) return;
    setHasCalculated(true);
  };

  const itemPrice = Number(price) || 0;
  const interestRate = Number(bnplInterest) || 0;

  const bnplTotal = Number((itemPrice + itemPrice * (interestRate / 100)).toFixed(2));
  const bnplMonthly = Number((bnplTotal / bnplMonths).toFixed(2));
  const saveMonthly = Number((itemPrice / saveMonths).toFixed(2));
  const interestPenalty = Number(Math.max(0, bnplTotal - itemPrice).toFixed(2));
  
  const targetProductLabel = itemName.trim() || "this item";

  let statusClass = "narrative-safe";
  let statusTitle = "Comfortable";
  let analysisNarrative = "";

  const bnplIncomePercentage = netIncome > 0 ? (bnplMonthly / netIncome) * 100 : 0;
  const bnplDiscretionaryPercentage = discretionaryCash > 0 ? (bnplMonthly / discretionaryCash) * 100 : 0;

  if (bnplMonthly > discretionaryCash) {
    statusClass = "narrative-danger";
    statusTitle = "Financially Restrictive";
    analysisNarrative = `Warning: Committing to this BNPL plan will create a monthly deficit of ${formatCurrency(
      bnplMonthly - discretionaryCash
    )}. The repayments exceed your unallocated cash flow entirely, risking expensive debt traps.`;
  } else if (bnplDiscretionaryPercentage > 50) {
    statusClass = "narrative-warning";
    statusTitle = "Strained Budget";
    analysisNarrative = `Caution: This payment consumes ${bnplDiscretionaryPercentage.toFixed(
      0
    )}% of your remaining discretionary cash. While technically possible, it severely restricts your liquidity and vulnerability to unexpected emergencies.`;
  } else {
    statusClass = "narrative-safe";
    statusTitle = "Manageable Surplus";
    analysisNarrative = `Good news: Repayments occupy ${bnplDiscretionaryPercentage.toFixed(
      0
    )}% of your surplus cash flow. You can comfortably sustain this choice within your current spending boundaries.`;
  }

  const potentialInvestmentValue = interestPenalty * 1.5; 

  const chartData = [
    { name: "Base Purchase Price", value: itemPrice, color: "#1890ff" },
    { name: "Interest Penalty Cost", value: interestPenalty, color: "#ff4d4f" },
  ].filter((d) => d.value > 0);

  const renderPercentageLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.08) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    return (
      <text
        x={cx + radius * Math.cos(-midAngle * RADIAN)}
        y={cy + radius * Math.sin(-midAngle * RADIAN)}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        className="chart-percentage-label"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const educationalAccordionItems = [
    {
      title: "The Illusion of Low Monthly Repayments",
      content:
        "Buy Now, Pay Later models rely on making premium goods look instantly accessible by chopping total figures down into smaller, bite-sized amounts. However, hidden or delayed interest packages quietly inflate the overall retail value, decreasing your future investment capacity.",
    },
    {
      title: "Understanding Discretionary Cash Flow Opportunity Cost",
      content:
        "Every single ZAR committed to contractual interest allocations is capital pulled away from wealth creation assets. Waiting and self-funding ensures that your hard-earned money generates interest yields for your personal accounts, rather than corporate balance sheets.",
    },
  ];

  const bnplMonthsPercent = ((bnplMonths - 2) / (24 - 2)) * 100;
  const saveMonthsPercent = ((saveMonths - 1) / (24 - 1)) * 100;

  return (
    <section className="bnpl-simulator-page">
      <StudioHero
        title="Buy Now vs. Save First Coach"
        subheading="Unmask the true long-term impact of instant purchase choices on your active cash flow."
      />

      <div className="bnpl-split-container">
        <div className="bnpl-inputs-column">
          <form onSubmit={handleCalculate} className="bnpl-interactive-card">
            <div className="bnpl-field">
              <div className="bnpl-label-row">
                <label>What are you purchasing? (Optional)</label>
              </div>
              <input
                type="text"
                className="bnpl-inputs"
                placeholder="e.g., MacBook Pro, Lounge Suite"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
            </div>

            <div className="bnpl-field">
              <div className="bnpl-label-row">
                <label>Retail Purchase Price (ZAR)</label>
                <InfoPopover
                  infoKey="purchasePrice"
                  activeInfo={activeInfo}
                  toggleInfo={toggleInfo}
                  title="Purchase Price Context"
                >
                  <p>The baseline consumer price of the desired item before financing interest add-ons.</p>
                </InfoPopover>
              </div>
              <input
                type="numeric"
                className="bnpl-inputs"
                placeholder="Enter item cost value"
                value={price}
                required
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="bnpl-form-divider">
              <span>Buy Now, Pay Later Terms</span>
            </div>

            <div className="bnpl-field">
              <div className="bnpl-label-row">
                <label>Repayment Window: {bnplMonths} Months</label>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                step="1"
                value={bnplMonths}
                style={{ "--value": `${bnplMonthsPercent}%` }}
                className="bnpl-range-slider"
                onChange={(e) => setBnplMonths(Number(e.target.value))}
              />
            </div>

            <div className="bnpl-field">
              <div className="bnpl-label-row">
                <label>Financing Interest Rate (%)</label>
              </div>
              <input
                type="numeric"
                className="bnpl-inputs"
                min="0"
                max="100"
                step="1"
                value={bnplInterest}
                onChange={(e) => setBnplInterest(e.target.value)}
              />
            </div>

            <div className="bnpl-form-divider">
              <span>Save First Assumptions</span>
            </div>

            <div className="bnpl-field">
              <div className="bnpl-label-row">
                <label>Target Accumulation Target: {saveMonths} Months</label>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={saveMonths}
                style={{ "--value": `${saveMonthsPercent}%` }}
                className="bnpl-range-slider"
                onChange={(e) => setSaveMonths(Number(e.target.value))}
              />
            </div>

            <button type="submit" className="bnpl-submit-btn">
              <span>Compare Trade-Offs</span>
              <i className="fa-solid fa-chart-pie"></i>
            </button>
          </form>
        </div>

        <div className="bnpl-results-column">
          {!hasCalculated ? (
            <div className="bnpl-placeholder-state">
              <i className="fa-solid fa-calculator placeholder-icon"></i>
              <h3>Awaiting Parameters</h3>
              <p>Provide your acquisition target pricing values on the left to activate coach recommendations.</p>
            </div>
          ) : (
            <div className="bnpl-reveal-animation">
              <h2>The Breakdown Assessment</h2>
              <p className="bnpl-result-subheading">
                Side-by-side impact study comparing financed borrowing costs with standard cash reservation streams.
              </p>

              <div className={`bnpl-coach-message ${statusClass}`}>
                <div className="bnpl-message-header">
                  <span className="bnpl-message-title">Financial Coach Analysis</span>
                  <span className="bnpl-affordability-status">{statusTitle}</span>
                </div>
                <p className="bnpl-message-text">{analysisNarrative}</p>
                <p className="bnpl-message-text">
                  Opting for BNPL gets you <strong>{targetProductLabel}</strong> today, but drains an extra{" "}
                  <span className="vehicle-highlight-text">{formatCurrency(interestPenalty)}</span> in dead borrowing costs.
                </p>
              </div>

              <div className="bnpl-metric-tile-grid">
                <div className="bnpl-summary-tile border-bnpl">
                  <span className="tile-strategy-tag tag-bnpl">Financed Plan</span>
                  <span className="tile-value-large">{formatCurrency(bnplMonthly)}/mo</span>
                  <span className="tile-label-desc">Sustained for {bnplMonths} consecutive months</span>
                  <div className="tile-footer-summary">
                    Total Cost: <strong>{formatCurrency(bnplTotal)}</strong>
                  </div>
                </div>

                <div className="bnpl-summary-tile border-save">
                  <span className="tile-strategy-tag tag-save">Self-Funded Plan</span>
                  <span className="tile-value-large">{formatCurrency(saveMonthly)}/mo</span>
                  <span className="tile-label-desc">Accumulated for {saveMonths} months before buy</span>
                  <div className="tile-footer-summary">
                    Total Cost: <strong>{formatCurrency(itemPrice)}</strong>
                  </div>
                </div>
              </div>

              <div className="bnpl-chart-embed-card">
                <div className="chart-card-header">
                  <h4 className="cashflow-title">Debt Premium Anatomy</h4>
                  <p>Visualise how much interest penalty has been appended onto the core asset value</p>
                </div>

                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={75}
                        outerRadius={105}
                        paddingAngle={3}
                        cornerRadius={6}
                        stroke="none"
                        labelLine={false}
                        label={renderPercentageLabel}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [formatCurrency(value), name]}
                        contentStyle={{
                          borderRadius: "1rem",
                          background: "var(--background-colour-light)",
                          border: "1px solid var(--light-border)",
                          fontFamily: "var(--numbers-font)",
                          fontSize: "1.3rem",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-dot base-dot"></span>
                    <span>Core Value ({formatCurrency(itemPrice)})</span>
                  </div>
                  {interestPenalty > 0 && (
                    <div className="legend-item:">
                      <span className="legend-dot interest-dot"></span>
                      <span>Interest Waste ({formatCurrency(interestPenalty)})</span>
                    </div>
                  )}
                </div>
              </div>

              {interestPenalty > 0 && (
                <div className="bnpl-insight-alternative-card">
                  <h3>Alternative Wealth Opportunity</h3>
                  <p>
                    Instead of handing over <strong>{formatCurrency(interestPenalty)}</strong> to a financing company,
                    diverting that exact sum toward interest-bearing savings channels or retail market indices over the next
                    few years could value out to roughly <strong>{formatCurrency(potentialInvestmentValue)}</strong>. 
                    Protect your cash flow leverage.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bnpl-educational-wrapper">
        <TrackAccordionSection items={educationalAccordionItems} title="Strategic Consumer Finance Insights" />
      </div>

      <div className="bnpl-disclaimer-wrapper">
        <p className="bnpl-disclaimer-copy">
          Disclaimer: Simulator estimations are configured via internal baseline modeling parameters and calculations using user-provided contextual variables. This data is for informative educational purposes only and does not constitute certified financial advisory guidance.
        </p>
      </div>
    </section>
  );
}

export default BuyNowVsSave;