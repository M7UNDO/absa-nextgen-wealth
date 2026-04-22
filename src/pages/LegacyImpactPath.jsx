import React, {useEffect, useMemo, useState} from "react";
import Hero from "../components/Hero";

import TrackHeroActions from "../components/TrackHeroActions";
import TrackProgressCard from "../components/TrackProgressCard";
import TrackMilestonesSection from "../components/TrackMilestonesSection";
import TrackCelebrationBanner from "../components/TrackCelebrationBanner";
import TrackTipCard from "../components/TrackTipCard";
import TrackSidebar from "../components/TrackSidebar";
import TrackAccordionSection from "../components/TrackAccordionSection";

import legacyImpactPathData from "../data/legacyImpactPathData";
import "../styles/LegacyImpactPath.css";

function LegacyImpactPath() {
  const [financials, setFinancials] = useState(null);
  const [activeTrack, setActiveTrack] = useState(null);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [progress, setProgress] = useState(legacyImpactPathData.defaultProgress);

  useEffect(() => {
    const storedFinancials = localStorage.getItem("financials");
    const storedProgress = localStorage.getItem(legacyImpactPathData.progressStorageKey);
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

  const tips = useMemo(() => {
    if (!financials) {
      return [legacyImpactPathData.messages.defaultTip];
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
        "You are not contributing to retirement yet. Long-term wealth usually grows best when protection and compounding start early.",
      );
    }

    if (vehicle > 5000) {
      dynamicTips.push(
        "High vehicle finance can slow down long-term legacy goals. Protecting cash flow matters when building for more than just yourself.",
      );
    }

    if (remaining < grossIncome * 0.2) {
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
                {legacyImpactPathData.priorities.items.map((item) => (
                  <li key={item}>{item}</li>
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
