import React, { useEffect, useMemo, useState } from "react";
import Hero from "../components/Hero";

import TrackHeroActions from "../components/TrackHeroActions";
import TrackProgressCard from "../components/TrackProgressCard";
import TrackMilestonesSection from "../components/TrackMilestonesSection";
import TrackCelebrationBanner from "../components/TrackCelebrationBanner";
import TrackTipCard from "../components/TrackTipCard";
import TrackSidebar from "../components/TrackSidebar";
import TrackAccordionSection from "../components/TrackAccordionSection";
import ConfettiOverlay from "../components/ConfettiOverlay";

import freedomFlexibilityPathData from "../data/freedomFlexibilityPathData";
import { useFinancials } from "../context/FinancialContext";
import { formatCurrency } from "../utils/formatCurrency";
import "../styles/TrackDetail.css";

function FreedomFlexibilityPath() {
  const { financials } = useFinancials();
  const [activeTrack, setActiveTrack] = useState(null);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [progress, setProgress] = useState(freedomFlexibilityPathData.defaultProgress);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedProgress = localStorage.getItem(freedomFlexibilityPathData.progressStorageKey);
    const storedTrack = localStorage.getItem("activeStrategyTrack");

    if (storedProgress) {
      setProgress(JSON.parse(storedProgress));
    }

    if (storedTrack) {
      setActiveTrack(storedTrack);
    }
  }, []);

  function handleApplyTrack() {
    if (!activeTrack) {
      localStorage.setItem("activeStrategyTrack", freedomFlexibilityPathData.trackId);
      setActiveTrack(freedomFlexibilityPathData.trackId);
      setCelebrationMessage(freedomFlexibilityPathData.messages.applied);
      return;
    }

    if (activeTrack === freedomFlexibilityPathData.trackId) {
      return;
    }

    setCelebrationMessage(freedomFlexibilityPathData.messages.alreadyActive);
  }

  function handleUntrack() {
    localStorage.removeItem("activeStrategyTrack");
    setActiveTrack(null);
    setCelebrationMessage(freedomFlexibilityPathData.messages.untracked);
  }

  function updateProgress(step, value, milestoneLabel) {
    const previousValue = progress[step];

    const updatedProgress = {
      ...progress,
      [step]: value,
    };

    setProgress(updatedProgress);
    localStorage.setItem(freedomFlexibilityPathData.progressStorageKey, JSON.stringify(updatedProgress));

    if (previousValue !== "done" && value === "done") {
      setCelebrationMessage(`🎉 Milestone reached: ${milestoneLabel}`);
    }
  }

  const completionPercentage = useMemo(() => {
    const progressValues = Object.values(progress);
    const completedCount = progressValues.filter((item) => item === "done").length;

    return Math.round((completedCount / progressValues.length) * 100);
  }, [progress]);

  useEffect(() => {
    if (completionPercentage === 100) {
      setShowConfetti(true);

      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowConfetti(false);
    }
  }, [completionPercentage]);


  const personalizedPriorities = useMemo(() => {
    const basePriorities = [...freedomFlexibilityPathData.priorities.items];
    if (!financials) return basePriorities;

    const grossIncome = Number(financials.grossIncome) || 0;
    const rent = Number(financials.rent) || 0;
    const vehicle = Number(financials.vehicle) || 0;
    const retirement = Number(financials.retirement) || 0;

    const fixedCosts = rent + vehicle + retirement;
    const remaining = grossIncome - fixedCosts;
    const targetedAdditions = [];

    if (vehicle > 0) {
      targetedAdditions.push(`Minimizing your ${formatCurrency(vehicle)} monthly vehicle exposure to maximize choice isolation`);
    }

    if (grossIncome > 0 && remaining < grossIncome * 0.2) {
      const currentMarginPercent = Math.max(0, Math.round((remaining / grossIncome) * 100));
      targetedAdditions.push(`Expanding your suppressed liquid margins (currently at ${currentMarginPercent}% of gross income)`);
    }

    return [...targetedAdditions, ...basePriorities];
  }, [financials]);

  const tips = useMemo(() => {
    if (!financials) {
      return [freedomFlexibilityPathData.messages.defaultTip];
    }

    const grossIncome = Number(financials.grossIncome) || 0;
    const rent = Number(financials.rent) || 0;
    const vehicle = Number(financials.vehicle) || 0;
    const retirement = Number(financials.retirement) || 0;

    const fixedCosts = rent + vehicle + retirement;
    const remaining = grossIncome - fixedCosts;

    const dynamicTips = [];

    if (vehicle > 0) {
      dynamicTips.push(
        `Vehicle finance reduces flexibility. Lowering your current ${formatCurrency(vehicle)} debt footprint means more freedom to pivot, travel, or take opportunities.`,
      );
    }

    if (grossIncome > 0 && remaining < grossIncome * 0.2) {
      dynamicTips.push(
        "Your free cash flow looks tight for a flexibility-first strategy. Creating more breathing room would strengthen this path.",
      );
    }

    if (grossIncome > 0 && remaining > grossIncome * 0.25) {
      dynamicTips.push("You appear to have room to automate a Freedom Fund and build liquid savings faster.");
    }

    dynamicTips.push(
      "This path works best when your money stays accessible. Focus on liquid savings before locking money away too early.",
    );

    dynamicTips.push(
      "Use BNPL vs Save First to check whether everyday spending decisions are reducing your future flexibility.",
    );

    return dynamicTips;
  }, [financials]);

  return (
    <div className="freedom-path-page">
      {showConfetti && <ConfettiOverlay />}
      <Hero
        title={freedomFlexibilityPathData.hero.title}
        subheading={freedomFlexibilityPathData.hero.subheading}
        src={freedomFlexibilityPathData.hero.src}
        alt={freedomFlexibilityPathData.hero.alt}
      >
        <TrackHeroActions
          activeTrack={activeTrack}
          currentTrackId={freedomFlexibilityPathData.trackId}
          onApply={handleApplyTrack}
          onUntrack={handleUntrack}
        />
      </Hero>

      <section className="freedom-path-content">
        <TrackCelebrationBanner message={celebrationMessage} />

        <div className="intro-card">
          <p className="track-tag">{freedomFlexibilityPathData.intro.tag}</p>
          <p>{freedomFlexibilityPathData.intro.description}</p>
        </div>

        <TrackProgressCard completionPercentage={completionPercentage} />

        <TrackTipCard tips={tips} />

        <section className="freedom-path-grid">
          <div className="main-layout">
            <section className="path-section">
              <h2>{freedomFlexibilityPathData.priorities.title}</h2>
              <ul className="priorities-list">
                {personalizedPriorities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <TrackMilestonesSection
              title={freedomFlexibilityPathData.milestonesSectionTitle}
              milestones={freedomFlexibilityPathData.milestones}
              progress={progress}
              onUpdateProgress={updateProgress}
            />

            <TrackAccordionSection
              title={freedomFlexibilityPathData.accordion.title}
              items={freedomFlexibilityPathData.accordion.items}
            />
          </div>

          <TrackSidebar
            className="freedom-path-sidebar"
            tradeOffsTitle={freedomFlexibilityPathData.sidebar.tradeOffsTitle}
            tradeOffs={freedomFlexibilityPathData.sidebar.tradeOffs}
            studios={freedomFlexibilityPathData.sidebar.studios}
          />
        </section>
      </section>
    </div>
  );
}

export default FreedomFlexibilityPath;