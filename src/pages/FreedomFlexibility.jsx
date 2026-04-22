import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Hero from "../components/Hero";
import track2 from "../assets/images/raimond-klavins-xAqrT-279UA-unsplash.jpg";
import "../styles/FreedomFlexibilityPath.css";

function FreedomFlexibilityPath() {
  const [financials, setFinancials] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const bannerRef = useRef(null);

  const [progress, setProgress] = useState({
    emergencyFund: "not-started",
    tfsaSetup: "not-started",
    freedomFund: "not-started",
    flexibleInvesting: "not-started",
  });

  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    const storedFinancials = localStorage.getItem("financials");
    const storedProgress = localStorage.getItem("freedom-flexibility-progress");
    const storedTrack = localStorage.getItem("activeStrategyTrack");

    if (storedFinancials) {
      setFinancials(JSON.parse(storedFinancials));
    }

    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }

    if (storedTrack) {
      setActiveTrack(storedTrack);
    }
  }, []);

  useGSAP(
    () => {
      if (!celebrationMessage || !bannerRef.current) return;

      gsap.fromTo(
        bannerRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        }
      );

      const timeout = setTimeout(() => {
        gsap.to(bannerRef.current, {
          autoAlpha: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.in",
        });
      }, 4000);

      return () => clearTimeout(timeout);
    },
    { dependencies: [celebrationMessage] }
  );

  function handleApplyTrack() {
    if (!activeTrack) {
      localStorage.setItem("activeStrategyTrack", "freedom-flexibility-path");
      setActiveTrack("freedom-flexibility-path");
      setCelebrationMessage(
        "You’ve applied Freedom & Flexibility Path as your active strategy track."
      );
      return;
    }

    if (activeTrack === "freedom-flexibility-path") {
      return;
    }

    setCelebrationMessage(
      "You already have an active strategy track. Untrack it first before applying a new one."
    );
  }

  function handleUntrack() {
    localStorage.removeItem("activeStrategyTrack");
    setActiveTrack(null);
    setCelebrationMessage("Freedom & Flexibility Path has been untracked.");
  }

  function updateProgress(step, value, milestoneLabel) {
    const previousValue = progress[step];

    const updatedProgress = {
      ...progress,
      [step]: value,
    };

    setProgress(updatedProgress);
    localStorage.setItem(
      "freedom-flexibility-progress",
      JSON.stringify(updatedProgress)
    );

    if (previousValue !== "done" && value === "done") {
      setCelebrationMessage(`🎉 Milestone reached: ${milestoneLabel}`);
    }
  }

  const completionPercentage = useMemo(() => {
    const progressValues = Object.values(progress);
    const completedCount = progressValues.filter((item) => item === "done").length;

    return Math.round((completedCount / progressValues.length) * 100);
  }, [progress]);

  const tips = useMemo(() => {
    if (!financials) {
      return ["Complete your financial setup to unlock more personalised flexibility tips."];
    }

    const grossIncome = financials.grossIncome || 0;
    const rent = financials.rent || 0;
    const vehicle = financials.vehicle || 0;
    const retirement = financials.retirement || 0;

    const fixedCosts = rent + vehicle + retirement;
    const remaining = grossIncome - fixedCosts;

    const dynamicTips = [];

    if (vehicle > 0) {
      dynamicTips.push(
        "Vehicle finance reduces flexibility. Lower debt means more freedom to pivot, travel, or take opportunities."
      );
    }

    if (remaining < grossIncome * 0.2) {
      dynamicTips.push(
        "Your free cash flow looks tight for a flexibility-first strategy. Creating more breathing room would strengthen this path."
      );
    }

    if (remaining > grossIncome * 0.25) {
      dynamicTips.push(
        "You appear to have room to automate a Freedom Fund and build liquid savings faster."
      );
    }

    dynamicTips.push(
      "This path works best when your money stays accessible. Focus on liquid savings before locking money away too early."
    );

    dynamicTips.push(
      "Use BNPL vs Save First to check whether everyday spending decisions are reducing your future flexibility."
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
      title: "What does liquidity actually mean?",
      content:
        "Liquidity means how quickly you can access your money when life changes. This path values flexibility, which means keeping enough money reachable when opportunities or emergencies come up.",
    },
    {
      title: "Why low debt matters here",
      content:
        "Debt creates fixed obligations. The more monthly commitments you carry, the harder it becomes to relocate, travel, take a break, or respond to unexpected changes.",
    },
    {
      title: "Why an emergency fund is central",
      content:
        "A 6–12 month emergency fund acts like freedom insurance. It helps you stay calm during job changes, career pivots, travel plans, or periods of uncertainty.",
    },
    {
      title: "Why this path can still build wealth",
      content:
        "Freedom and flexibility does not mean avoiding wealth-building. It means building wealth in ways that stay accessible, portable, and adaptable to changing goals.",
    },
    {
      title: "What trade-off comes with this path",
      content:
        "You may delay traditional milestones like home ownership, and sometimes feel behind peers who buy assets early. But in return, you protect your ability to move and choose differently later.",
    },
  ];

  const isCurrentTrack = activeTrack === "freedom-flexibility-path";
  const anotherTrackSelected =
    activeTrack && activeTrack !== "freedom-flexibility-path";

  return (
    <div className="freedom-path-page">
      <Hero
        title="Freedom & Flexibility Path"
        subheading="Build wealth without locking yourself in too early"
        src={track2}
        alt="Open road and mountain landscape"
      >
        <div className="btn-container">
          {!activeTrack && (
            <button className="select-track-btn" onClick={handleApplyTrack}>
              Apply This Track
            </button>
          )}

          {isCurrentTrack && (
            <div className="track-btn-group">
              <button className="selected-track-btn" type="button">
                <i className="fa-solid fa-check"></i>Current Track
              </button>

              <button className="untrack-btn" onClick={handleUntrack}>
                Untrack
              </button>
            </div>
          )}

          {anotherTrackSelected && (
            <button className="track-disabled-btn" type="button" disabled>
              Untrack Current Path First
            </button>
          )}
        </div>
      </Hero>

      <section className="freedom-path-content">
        {celebrationMessage && (
          <div ref={bannerRef} className="celebration-banner">
            <i className="fa-solid fa-circle-check"></i>
            <p>{celebrationMessage}</p>
          </div>
        )}

        <div className="freedom-path-intro-card">
          <p className="track-tag">Freedom & Flexibility Path</p>
          <p>
            This path is for users who value mobility, experiences, and career agility
            over locking themselves into long-term commitments too early. It focuses on
            building flexibility through liquid savings, lower debt, and strong cash flow.
          </p>
        </div>

        <div className="freedom-path-progress-card">
          <div className="progress-copy">
            <p>Your progress</p>
            <h3 className="progress-text">{completionPercentage}%</h3>
          </div>

          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionPercentage}%` }}
            ></div>
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

        <section className="freedom-path-grid">
          <main className="freedom-path-main">
            <section className="path-section">
              <h2>Key Priorities</h2>
              <ul className="priorities-list">
                <li>Building a strong 6–12 month emergency fund</li>
                <li>Keeping investments liquid and flexible</li>
                <li>Avoiding high debt and lifestyle inflation</li>
                <li>Protecting your ability to adapt and move</li>
              </ul>
            </section>

            <section className="path-section">
              <h2>5-year roadmap</h2>

              <div className="milestone-list">
                <article className="milestone-card">
                  <div className="milestone-number">1</div>
                  <div className="milestone-content">
                    <p className="milestone-year">Years 1-2</p>
                    <div className="milestone-heading">
                      <h3>Build a 6-month emergency fund</h3>
                      <p>
                        Start with a safety buffer that protects your options and gives
                        you breathing room when life changes.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.emergencyFund === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("emergencyFund", "not-started", "Build a 6-month emergency fund")
                        }
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.emergencyFund === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("emergencyFund", "in-progress", "Build a 6-month emergency fund")
                        }
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.emergencyFund === "done" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("emergencyFund", "done", "Build a 6-month emergency fund")
                        }
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </article>

                <article className="milestone-card">
                  <div className="milestone-number">2</div>
                  <div className="milestone-content">
                    <p className="milestone-year">Years 1-2</p>
                    <div className="milestone-heading">
                      <h3>Automate your tax-free savings</h3>
                      <p>
                        Set up consistent saving into a TFSA or other flexible vehicle
                        so your money begins working while staying aligned to this path.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.tfsaSetup === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("tfsaSetup", "not-started", "Automate your tax-free savings")
                        }
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.tfsaSetup === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("tfsaSetup", "in-progress", "Automate your tax-free savings")
                        }
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.tfsaSetup === "done" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("tfsaSetup", "done", "Automate your tax-free savings")
                        }
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </article>

                <article className="milestone-card">
                  <div className="milestone-number">3</div>
                  <div className="milestone-content">
                    <p className="milestone-year">Year 3</p>
                    <div className="milestone-heading">
                      <h3>Create a Freedom Fund</h3>
                      <p>
                        Build a dedicated reserve for travel, relocation, a passion project,
                        or a career break.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.freedomFund === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("freedomFund", "not-started", "Create a Freedom Fund")
                        }
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.freedomFund === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("freedomFund", "in-progress", "Create a Freedom Fund")
                        }
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.freedomFund === "done" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("freedomFund", "done", "Create a Freedom Fund")
                        }
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
                      <h3>Strengthen long-term flexibility</h3>
                      <p>
                        Grow your emergency fund toward 12 months and diversify into
                        more flexible or offshore investments.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.flexibleInvesting === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("flexibleInvesting", "not-started", "Strengthen long-term flexibility")
                        }
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.flexibleInvesting === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("flexibleInvesting", "in-progress", "Strengthen long-term flexibility")
                        }
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.flexibleInvesting === "done" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("flexibleInvesting", "done", "Strengthen long-term flexibility")
                        }
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

          <aside className="freedom-path-sidebar">
            <section className="sidebar-card warning-card">
              <h3>Trade-offs to understand</h3>
              <ul>
                <li>Property ownership may be delayed.</li>
                <li>Wealth may feel less visible than traditional asset ownership.</li>
                <li>You may feel behind peers who buy homes earlier.</li>
              </ul>
            </section>

            <section className="sidebar-card">
              <h3>Recommended studios</h3>

              <div className="studio-links">
                <Link to="/simulation-lab/bnpl-vs-save-first" className="studio-link-card">
                  <strong>BNPL vs Save First</strong>
                  <span>Compare convenience spending with slower, more flexible choices.</span>
                </Link>

                <Link to="/simulation-lab/vehicle-finance-calculator" className="studio-link-card">
                  <strong>Vehicle Finance Calculator</strong>
                  <span>Check if vehicle debt is quietly reducing your freedom.</span>
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </section>
    </div>
  );
}

export default FreedomFlexibilityPath;