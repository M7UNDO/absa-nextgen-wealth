import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import Hero from "../components/Hero";
import track3 from "../assets/images/lawrence-crayton-FgwrW7wagzI-unsplash.jpg";
import "../styles/LegacyImpactPath.css";

function LegacyImpactPath() {
  const [financials, setFinancials] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const bannerRef = useRef(null);

  const [progress, setProgress] = useState({
    protectionSetup: "not-started",
    educationFund: "not-started",
    growthAssets: "not-started",
    legacyStructures: "not-started",
  });

  const [activeTipIndex, setActiveTipIndex] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    const storedFinancials = localStorage.getItem("financials");
    const storedProgress = localStorage.getItem("legacy-impact-progress");
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
      localStorage.setItem("activeStrategyTrack", "legacy-impact-path");
      setActiveTrack("legacy-impact-path");
      setCelebrationMessage(
        "You’ve applied Legacy & Impact Path as your active strategy track."
      );
      return;
    }

    if (activeTrack === "legacy-impact-path") {
      return;
    }

    setCelebrationMessage(
      "You already have an active strategy track. Untrack it first before applying a new one."
    );
  }

  function handleUntrack() {
    localStorage.removeItem("activeStrategyTrack");
    setActiveTrack(null);
    setCelebrationMessage("Legacy & Impact Path has been untracked.");
  }

  function updateProgress(step, value, milestoneLabel) {
    const previousValue = progress[step];

    const updatedProgress = {
      ...progress,
      [step]: value,
    };

    setProgress(updatedProgress);
    localStorage.setItem("legacy-impact-progress", JSON.stringify(updatedProgress));

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
      return ["Complete your financial setup to unlock more personalised legacy-building tips."];
    }

    const grossIncome = financials.grossIncome || 0;
    const rent = financials.rent || 0;
    const vehicle = financials.vehicle || 0;
    const retirement = financials.retirement || 0;

    const fixedCosts = rent + vehicle + retirement;
    const remaining = grossIncome - fixedCosts;

    const dynamicTips = [];

    if (retirement === 0) {
      dynamicTips.push(
        "You are not contributing to retirement yet. Long-term wealth usually grows best when protection and compounding start early."
      );
    }

    if (vehicle > 5000) {
      dynamicTips.push(
        "High vehicle finance can slow down long-term legacy goals. Protecting cash flow matters when building for more than just yourself."
      );
    }

    if (remaining < grossIncome * 0.2) {
      dynamicTips.push(
        "Your current free cash flow looks tight. This path works best when you have enough room for protection, investing, and future-focused planning."
      );
    }

    dynamicTips.push(
      "Start with protection before growth: emergency fund, life cover, and a will create a stronger foundation for long-term impact."
    );

    dynamicTips.push(
      "Use the Home Loan Calculator if property is part of the wealth structure you want to build over time."
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
      title: "Why a will matters early",
      content:
        "A will is not only for later life. It helps make sure your assets go to the people and causes you choose, instead of leaving those decisions uncertain.",
    },
    {
      title: "Protection before growth",
      content:
        "Legacy starts with reducing vulnerability. Life cover, an emergency fund, and proper planning protect the people who may depend on you.",
    },
    {
      title: "Impact is more than donations",
      content:
        "Impact can include helping fund education, supporting family members sustainably, or building assets that create security across generations.",
    },
    {
      title: "Why offshore and equity exposure matter",
      content:
        "Long-term wealth often benefits from diversified growth. Offshore exposure and equities can help a legacy strategy grow beyond one local context over time.",
    },
    {
      title: "What legacy building can cost you",
      content:
        "This path may slow personal consumption in the short term. It often asks you to choose long-term structure and protection over immediate lifestyle upgrades.",
    },
  ];

  const isCurrentTrack = activeTrack === "legacy-impact-path";
  const anotherTrackSelected =
    activeTrack && activeTrack !== "legacy-impact-path";

  return (
    <div className="legacy-path-page">
      <Hero
        title="Legacy & Impact Path"
        subheading="Build wealth that protects others and lasts beyond you"
        src={track3}
        alt="Community and long-term impact"
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

      <section className="legacy-path-content">
        {celebrationMessage && (
          <div ref={bannerRef} className="celebration-banner">
            <i className="fa-solid fa-circle-check"></i>
            <p>{celebrationMessage}</p>
          </div>
        )}

        <div className="legacy-path-intro-card">
          <p className="track-tag">Legacy & Impact Path</p>
          <p>
            This path is for users who want to build wealth that supports family,
            future generations, or long-term community impact. It focuses on
            protection, planning, and building structures that can outlast short-term spending.
          </p>
        </div>

        <div className="legacy-path-progress-card">
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

        <section className="legacy-path-grid">
          <main className="legacy-path-main">
            <section className="path-section">
              <h2>Key Priorities</h2>
              <ul className="priorities-list">
                <li>Building generational wealth through long-term assets</li>
                <li>Putting protection structures in place early</li>
                <li>Planning for family support and future impact</li>
                <li>Balancing growth, stability, and responsibility</li>
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
                      <h3>Protect the foundation</h3>
                      <p>
                        Put life insurance in place, create a will, and build an emergency fund.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.protectionSetup === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("protectionSetup", "not-started", "Protect the foundation")
                        }
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.protectionSetup === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("protectionSetup", "in-progress", "Protect the foundation")
                        }
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.protectionSetup === "done" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("protectionSetup", "done", "Protect the foundation")
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
                    <p className="milestone-year">Year 2</p>
                    <div className="milestone-heading">
                      <h3>Start future-focused investing</h3>
                      <p>
                        Begin an education fund and start offshore or diversified long-term investing.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.educationFund === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("educationFund", "not-started", "Start future-focused investing")
                        }
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.educationFund === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("educationFund", "in-progress", "Start future-focused investing")
                        }
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.educationFund === "done" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("educationFund", "done", "Start future-focused investing")
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
                      <h3>Grow meaningful assets</h3>
                      <p>
                        Work toward a first investment property or a significant long-term equity portfolio.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.growthAssets === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("growthAssets", "not-started", "Grow meaningful assets")
                        }
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.growthAssets === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("growthAssets", "in-progress", "Grow meaningful assets")
                        }
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.growthAssets === "done" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("growthAssets", "done", "Grow meaningful assets")
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
                      <h3>Formalise legacy structures</h3>
                      <p>
                        Explore establishing a trust and review your net worth, beneficiaries, and long-term structures.
                      </p>
                    </div>

                    <div className="status-group">
                      <button
                        type="button"
                        className={progress.legacyStructures === "not-started" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("legacyStructures", "not-started", "Formalise legacy structures")
                        }
                      >
                        Not started
                      </button>
                      <button
                        type="button"
                        className={progress.legacyStructures === "in-progress" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("legacyStructures", "in-progress", "Formalise legacy structures")
                        }
                      >
                        In progress
                      </button>
                      <button
                        type="button"
                        className={progress.legacyStructures === "done" ? "status-btn active" : "status-btn"}
                        onClick={() =>
                          updateProgress("legacyStructures", "done", "Formalise legacy structures")
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

          <aside className="legacy-path-sidebar">
            <section className="sidebar-card warning-card">
              <h3>Trade-offs to understand</h3>
              <ul>
                <li>Family responsibilities can place pressure on cash flow.</li>
                <li>Some investment choices may feel conservative in the short term.</li>
                <li>Personal consumption may grow more slowly while you build long-term structures.</li>
              </ul>
            </section>

            <section className="sidebar-card">
              <h3>Recommended studios</h3>

              <div className="studio-links">
                <Link to="/simulation-lab/home-loan-calculator" className="studio-link-card">
                  <strong>Home Loan Calculator</strong>
                  <span>Explore whether property fits into your long-term legacy plan.</span>
                </Link>

                <Link to="/simulation-lab/vehicle-finance-calculator" className="studio-link-card">
                  <strong>Vehicle Finance Calculator</strong>
                  <span>Check whether car debt is weakening your long-term wealth-building capacity.</span>
                </Link>

                <Link to="/simulation-lab/bnpl-vs-save-first" className="studio-link-card">
                  <strong>BNPL vs Save First</strong>
                  <span>Protect future-focused goals by avoiding unnecessary short-term costs.</span>
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </section>
    </div>
  );
}

export default LegacyImpactPath;