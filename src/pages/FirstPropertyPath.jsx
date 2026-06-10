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

import firstPropertyPathData from "../data/firstPropertyPathData";
import { useFinancials } from "../context/FinancialContext";
import { formatCurrency } from "../utils/formatCurrency";
import "../styles/TrackDetail.css";

function FirstPropertyPath() {
  const { financials } = useFinancials(); 
  const [activeTrack, setActiveTrack] = useState(null);
  const [celebrationMessage, setCelebrationMessage] = useState("");
  const [progress, setProgress] = useState(firstPropertyPathData.defaultProgress);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const storedProgress = localStorage.getItem(firstPropertyPathData.progressStorageKey);
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
      localStorage.setItem("activeStrategyTrack", firstPropertyPathData.trackId);
      setActiveTrack(firstPropertyPathData.trackId);
      setCelebrationMessage(firstPropertyPathData.messages.applied);
      return;
    }

    if (activeTrack === firstPropertyPathData.trackId) {
      return;
    }

    setCelebrationMessage(firstPropertyPathData.messages.alreadyActive);
  }

  function handleUntrack() {
    localStorage.removeItem("activeStrategyTrack");
    setActiveTrack(null);
    setCelebrationMessage(firstPropertyPathData.messages.untracked);
  }

  function updateProgress(step, value, milestoneLabel) {
    const previousValue = progress[step];

    const updatedProgress = {
      ...progress,
      [step]: value,
    };

    setProgress(updatedProgress);
    localStorage.setItem(firstPropertyPathData.progressStorageKey, JSON.stringify(updatedProgress));

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
    const basePriorities = [...firstPropertyPathData.priorities.items];
    if (!financials) return basePriorities;

    const grossIncome = Number(financials.grossIncome) || 0;
    const rent = Number(financials.rent) || 0;
    const vehicle = Number(financials.vehicle) || 0;

    const targetedAdditions = [];

    if (vehicle > 5000) {
      targetedAdditions.push(`Restructuring your ${formatCurrency(vehicle)} monthly vehicle layout to recover debt capacity`);
    }
    if (grossIncome > 0 && rent > grossIncome * 0.3) {
      targetedAdditions.push(`Addressing your current housing premium (${Math.round((rent / grossIncome) * 100)}% of gross income) to maximize free cash`);
    }

    return [...targetedAdditions, ...basePriorities];
  }, [financials]);

  const tips = useMemo(() => {
    if (!financials) {
      return [firstPropertyPathData.messages.defaultTip];
    }

    const grossIncome = Number(financials.grossIncome) || 0;
    const rent = Number(financials.rent) || 0;
    const vehicle = Number(financials.vehicle) || 0;
    const retirement = Number(financials.retirement) || 0;

    const fixedCosts = rent + vehicle + retirement;
    const remaining = grossIncome - fixedCosts;

    const dynamicTips = [];

    if (vehicle > 5000) {
      dynamicTips.push(
        `Your vehicle finance looks high (${formatCurrency(vehicle)}/mo). Lower transport costs could help you save for a deposit faster.`,
      );
    }

    if (grossIncome > 0 && remaining < grossIncome * 0.2) {
      dynamicTips.push(
        "Your free cash flow looks tight for an aggressive property goal. Focus on creating more room in your budget first.",
      );
    }

    if (grossIncome > 0 && rent > grossIncome * 0.3) {
      dynamicTips.push(
        `Your rent is taking a large share (${Math.round((rent / grossIncome) * 100)}%) of your income. Lower housing costs now could improve your future deposit progress.`,
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

  return (
    <div className="first-property-page">
      {showConfetti && <ConfettiOverlay />}

      <Hero
        title={firstPropertyPathData.hero.title}
        subheading={firstPropertyPathData.hero.subheading}
        src={firstPropertyPathData.hero.src}
        alt={firstPropertyPathData.hero.alt}
      >
        <TrackHeroActions
          activeTrack={activeTrack}
          currentTrackId={firstPropertyPathData.trackId}
          onApply={handleApplyTrack}
          onUntrack={handleUntrack}
        />
      </Hero>

      <section className="first-property-content">
        <TrackCelebrationBanner message={celebrationMessage} />

        <div className="intro-card">
          <p className="track-tag">{firstPropertyPathData.intro.tag}</p>
          <p>{firstPropertyPathData.intro.description}</p>
        </div>

        <TrackProgressCard completionPercentage={completionPercentage} />

        <TrackTipCard tips={tips} />

        <section className="first-property-grid">
          <div className="main-layout">
            <section className="path-section">
              <h2>{firstPropertyPathData.priorities.title}</h2>
              <ul className="priorities-list">
                {personalizedPriorities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>

            <TrackMilestonesSection
              title={firstPropertyPathData.milestonesSectionTitle}
              milestones={firstPropertyPathData.milestones}
              progress={progress}
              onUpdateProgress={updateProgress}
            />

            <TrackAccordionSection
              title={firstPropertyPathData.accordion.title}
              items={firstPropertyPathData.accordion.items}
            />
          </div>

          <TrackSidebar
            className="first-property-sidebar"
            tradeOffsTitle={firstPropertyPathData.sidebar.tradeOffsTitle}
            tradeOffs={firstPropertyPathData.sidebar.tradeOffs}
            studios={firstPropertyPathData.sidebar.studios}
          />
        </section>
      </section>
    </div>
  );
}

export default FirstPropertyPath;