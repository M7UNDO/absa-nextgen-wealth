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

import legacyImpactPathData from "../data/legacyImpactPathData";
import { useFinancials } from "../context/FinancialContext"; 
import "../styles/TrackDetail.css";

function LegacyImpactPath() {
  const { financials } = useFinancials();
  const [activeTrack, setActiveTrack] = useState(null);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [progress, setProgress] = useState(legacyImpactPathData.defaultProgress);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedProgress = localStorage.getItem(legacyImpactPathData.progressStorageKey);
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
      localStorage.setItem("activeStrategyTrack", legacyImpactPathData.trackId);
      setActiveTrack(legacyImpactPathData.trackId);
      setCelebrationMessage(legacyImpactPathData.messages.applied);
      return;
    }

    if (activeTrack === legacyImpactPathData.trackId) {
      return;
    }

    setCelebrationMessage(legacyImpactPathData.messages.alreadyActive);
  }

  function handleUntrack() {
    localStorage.removeItem("activeStrategyTrack");
    setActiveTrack(null);
    setCelebrationMessage(legacyImpactPathData.messages.untracked);
  }

  function updateProgress(step, value, milestoneLabel) {
    const previousValue = progress[step];

    const updatedProgress = {
      ...progress,
      [step]: value,
    };

    setProgress(updatedProgress);
    localStorage.setItem(legacyImpactPathData.progressStorageKey, JSON.stringify(updatedProgress));

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
    const basePriorities = [...legacyImpactPathData.priorities.items];
    if (!financials) return basePriorities;

    const grossIncome = Number(financials.grossIncome) || 0;
    const rent = Number(financials.rent) || 0;
    const vehicle = Number(financials.vehicle) || 0;
    const retirement = Number(financials.retirement) || 0;

    const fixedCosts = rent + vehicle + retirement;
    const remaining = grossIncome - fixedCosts;
    const targetedAdditions = [];

    if (retirement === 0) {
      targetedAdditions.push("Initiating compounding wealth structures to stabilise your future retirement baseline");
    }

    if (vehicle > 5000) {
      targetedAdditions.push("Optimising current vehicle cash layouts to protect legacy building capacity");
    }

    if (grossIncome > 0 && remaining < grossIncome * 0.2) {
      targetedAdditions.push("Addressing restricted cash flow allocations to preserve structural long-term safety nets");
    }

    return [...targetedAdditions, ...basePriorities];
  }, [financials]);

  const tips = useMemo(() => {
    if (!financials) {
      return [legacyImpactPathData.messages.defaultTip];
    }

    const grossIncome = Number(financials.grossIncome) || 0;
    const rent = Number(financials.rent) || 0;
    const vehicle = Number(financials.vehicle) || 0;
    const retirement = Number(financials.retirement) || 0;

    const fixedCosts = rent + vehicle + retirement;
    const remaining = grossIncome - fixedCosts;

    const dynamicTips = [];

    if (retirement === 0) {
      dynamicTips.push(
        "You are not contributing to retirement yet. Long-term wealth usually grows best when protection and compounding start early.",
      );
    }

    if (vehicle > 5000) {
      dynamicTips.push(
        `High vehicle finance can slow down long-term legacy goals. Protecting your cash flow matters when building for more than just yourself.`,
      );
    }

    if (grossIncome > 0 && remaining < grossIncome * 0.2) {
      dynamicTips.push(
        "Your current free cash flow looks tight. This path works best when you have enough room for protection, investing, and future-focused planning.",
      );
    }

    dynamicTips.push(
      "Start with protection before growth: emergency fund, life cover, and a will create a stronger foundation for long-term impact.",
    );

    dynamicTips.push(
      "Use the Home Loan Calculator if property is part of the wealth structure you want to build over time.",
    );

    return dynamicTips;
  }, [financials]);

  return (
    <div className="legacy-path-page">
      {showConfetti && <ConfettiOverlay />}
      <Hero
        title={legacyImpactPathData.hero.title}
        subheading={legacyImpactPathData.hero.subheading}
        src={legacyImpactPathData.hero.src}
        alt={legacyImpactPathData.hero.alt}
      >
        <TrackHeroActions
          activeTrack={activeTrack}
          currentTrackId={legacyImpactPathData.trackId}
          onApply={handleApplyTrack}
          onUntrack={handleUntrack}
        />
      </Hero>

      <section className="legacy-path-content">
        <TrackCelebrationBanner message={celebrationMessage} />

        <div className="intro-card">
          <p className="track-tag">{legacyImpactPathData.intro.tag}</p>
          <p>{legacyImpactPathData.intro.description}</p>
        </div>

        <TrackProgressCard completionPercentage={completionPercentage} />

        <TrackTipCard tips={tips} />

        <section className="legacy-path-grid">
          <div className="main-layout">
            <section className="path-section">
              <h2>{legacyImpactPathData.priorities.title}</h2>
              <ul className="priorities-list">
                {personalizedPriorities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <TrackMilestonesSection
              title={legacyImpactPathData.milestonesSectionTitle}
              milestones={legacyImpactPathData.milestones}
              progress={progress}
              onUpdateProgress={updateProgress}
            />

            <TrackAccordionSection
              title={legacyImpactPathData.accordion.title}
              items={legacyImpactPathData.accordion.items}
            />
          </div>

          <TrackSidebar
            className="legacy-path-sidebar"
            tradeOffsTitle={legacyImpactPathData.sidebar.tradeOffsTitle}
            tradeOffs={legacyImpactPathData.sidebar.tradeOffs}
            studios={legacyImpactPathData.sidebar.studios}
          />
        </section>
      </section>
    </div>
  );
}

export default LegacyImpactPath;