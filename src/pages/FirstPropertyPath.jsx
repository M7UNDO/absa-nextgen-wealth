import React, {useEffect, useMemo, useState} from "react";
import {Link} from "react-router-dom";
import Hero from "../components/Hero";
import track1 from "../assets/images/roger-starnes-sr-YTqHwZhykMg-unsplash.jpg";
import "../styles/FirstPropertyPath.css";

function FirstPropertyPath() {
  const [financials, setFinancials] = useState(null);
  const [progress, setProgress] = useState({
    emergencyFund: "not-started",
    creditScore: "not-started",
    depositFund: "not-started",
    homeLoanPrep: "not-started",
  });

  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    const storedFinancials = localStorage.getItem("financials");
    const storedProgress = localStorage.getItem("first-property-progress");

    if (storedFinancials) {
      setFinancials(JSON.parse(storedFinancials));
    }

    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }
  }, []);

  function updateProgress(step, value) {
    const updatedProgress = {
      ...progress,
      [step]: value,
    };

    setProgress(updatedProgress);
    localStorage.setItem("first-property-progress", JSON.stringify(updatedProgress));
  }

  const completionPercentage = useMemo(() => {
    const progressValues = Object.values(progress);
    const completedCount = progressValues.filter((item) => item === "done").length;

    return Math.round((completedCount / progressValues.length) * 100);
  }, [progress]);

  const tips = useMemo(() => {
    if (!financials) {
      return ["Complete your financial setup to unlock more personalised property tips."];
    }

    const grossIncome = financials.grossIncome || 0;
    const rent = financials.rent || 0;
    const vehicle = financials.vehicle || 0;
    const retirement = financials.retirement || 0;

    const fixedCosts = rent + vehicle + retirement;
    const remaining = grossIncome - fixedCosts;

    const dynamicTips = [];

    if (vehicle > 5000) {
      dynamicTips.push(
        "Your vehicle finance looks high. Lower transport costs could help you save for a deposit faster.",
      );
    }

    if (remaining < grossIncome * 0.2) {
      dynamicTips.push(
        "Your free cash flow looks tight for an aggressive property goal. Focus on creating more room in your budget first.",
      );
    }

    if (rent > grossIncome * 0.3) {
      dynamicTips.push(
        "Your rent is taking a large share of your income. Lower housing costs now could improve your future deposit progress.",
      );
    }

    dynamicTips.push(
      "Build your emergency fund before pushing hard on your deposit. It protects your progress when surprise costs appear.",
    );

    dynamicTips.push(
      "Use the Home Loan Calculator to estimate what kind of property range may be realistic for your income.",
    );

    return dynamicTips;
  }, [financials]);

  useEffect(() => {
    if (!tips.length) return;

    const interval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [tips]);

  const accordionItems = [
    {
      title: "Emergency fund before deposit",
      content:
        "Before committing to a bond, you need a safety buffer. Without one, a surprise cost can derail both your deposit savings and your future affordability.",
    },
    {
      title: "Deposit is not the full cost",
      content:
        "Saving for a deposit is only one part of buying a home. You also need to prepare for registration costs, legal fees, and ongoing ownership expenses.",
    },
    {
      title: "Other costs to consider",
      content:
        "Beyond the monthly repayment, you may need to budget for a monthly service fee, home owners comprehensive insurance, life assurance, rates and taxes, levies, and monthly water and electricity costs.",
    },
    {
      title: "A realistic budgeting tip",
      content:
        "A useful rule of thumb is to have about 8% of the property value available for registration costs and other buying expenses. This is separate from your deposit.",
    },
    {
      title: "Why credit score matters",
      content:
        "Your credit behaviour affects approval and affordability. Strong repayment habits now can improve your chances when you apply for a bond later.",
    },
  ];

  return (
    <div className="first-property-page">
      <Hero
        title="First Property Path"
        subheading="Build toward owning your own home in 3-5 years"
        src={track1}
        alt="Modern apartment building"
      >
        <div className="btn-container">
          <button className="select-track-btn">Apply This Track</button>
        </div>
      </Hero>

      <section className="first-property-content">
        <div className="first-property-intro-card">
          <p className="track-tag">First Property Path</p>
          <p>
            This path is for people who want home ownership to become the foundation of their long-term financial
            future. It focuses on disciplined saving, improving affordability, and preparing for the real costs of
            buying a home.
          </p>
        </div>

        <div className="first-property-progress-card">
          <div className="progress-copy">
            <p>Your progress</p>
            <h3 className="progress-text">{completionPercentage}%</h3>
          </div>

          <div className="progress-bar">
            <div className="progress-bar-fill" style={{width: `${completionPercentage}%`}}></div>
          </div>
        </div>

        <div className="property-tip-card">
          <div className="property-tip-label">
            <span>Tip</span>
            <i className="fa-solid fa-lightbulb"></i>
          </div>

          <p key={activeTipIndex} className="property-tip-text">
            {tips[activeTipIndex]}
          </p>
        </div>

        <section className="first-property-grid">
          <main className="first-property-main">
            <section className="path-section">
              <h2>Key Priorities </h2>
              <ul className="priorities-list">
                <li>Saving aggressively for a deposit</li>
                <li>Building and protecting your credit score</li>
                <li>Understanding the true costs of buying property</li>
                <li>Reducing spending that delays your property goal</li>
              </ul>
            </section>

            <section className="path-section">
              <h2>5-year roadmap</h2>

              <div className="milestone-list">
                <article className="milestone-card">
                  <div className="milestone-number">1</div>
                  <div className="milestone-content">
                    <p className="milestone-year">Year 1</p>
                    <div className="milestone-heading">
                      <h3>Build your financial base</h3>
                      <p>Save an emergency fund, check your credit score, and fix any repayment issues early.</p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.emergencyFund === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("emergencyFund", "not-started")}
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.emergencyFund === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("emergencyFund", "in-progress")}
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.emergencyFund === "done" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("emergencyFund", "done")}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </article>

                <article className="milestone-card">
                  <div className="milestone-number">2</div>
                  <div className="milestone-content">
                    <p className="milestone-year">Year 1</p>
                    <div className="milestone-heading">
                      <h3>Improve your credit profile</h3>
                      <p>
                        Check your record, pay consistently, and avoid new debt that could weaken future bond approval.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.creditScore === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("creditScore", "not-started")}
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.creditScore === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("creditScore", "in-progress")}
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.creditScore === "done" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("creditScore", "done")}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </article>

                <article className="milestone-card">
                  <div className="milestone-number">3</div>
                  <div className="milestone-content">
                    <p className="milestone-year">Years 2-3</p>
                    <div className="milestone-heading">
                      <h3>Grow your deposit fund</h3>
                      <p>Build a dedicated deposit fund and stay consistent with monthly contributions.</p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.depositFund === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("depositFund", "not-started")}
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.depositFund === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("depositFund", "in-progress")}
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.depositFund === "done" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("depositFund", "done")}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </article>

                <article className="milestone-card">
                  <div className="milestone-number">4</div>
                  <div className="milestone-content">
                    <p className="milestone-year">Years 4-5</p>
                    <div className="milestone-heading">
                      <h3>Prepare to buy</h3>
                      <p>
                        Aim for a 10%+ deposit, understand the full buying costs, and enter the market with more
                        confidence.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.homeLoanPrep === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("homeLoanPrep", "not-started")}
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.homeLoanPrep === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("homeLoanPrep", "in-progress")}
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.homeLoanPrep === "done" ? "status-btn active" : "status-btn"}
                        onClick={() => updateProgress("homeLoanPrep", "done")}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            <section className="path-section">
              <h2>Did you know?</h2>

              <div className="accordion-list">
                {accordionItems.map((item, index) => (
                  <article
                    key={item.title}
                    className={openAccordion === index ? "accordion-item open" : "accordion-item"}
                  >
                    <button
                      type="button"
                      className="accordion-trigger"
                      onClick={() => setOpenAccordion(openAccordion === index ? null : index)}
                    >
                      <span>{item.title}</span>
                      <i className={openAccordion === index ? "fa-solid fa-minus" : "fa-solid fa-plus"}></i>
                    </button>

                    {openAccordion === index && (
                      <div className="accordion-content">
                        <p>{item.content}</p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </main>

          <aside className="first-property-sidebar">
            <section className="sidebar-card warning-card">
              <h3>Trade-offs to understand</h3>
              <ul>
                <li>Property ties up money in a non-liquid asset.</li>
                <li>Other goals like offshore investing may move more slowly.</li>
                <li>Large purchases now can delay your deposit by months or years.</li>
              </ul>
            </section>

            <section className="sidebar-card">
              <h3>Recommended studios</h3>

              <div className="studio-links">
                <Link to="/simulation-lab/home-loan-calculator" className="studio-link-card">
                  <strong>Home Loan Calculator</strong>
                  <span>Estimate what property range fits your income.</span>
                </Link>

                <Link to="/simulation-lab/vehicle-finance-calculator" className="studio-link-card">
                  <strong>Vehicle Finance Calculator</strong>
                  <span>Check if car debt is hurting your property timeline.</span>
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </section>
    </div>
  );
}

export default FirstPropertyPath;
