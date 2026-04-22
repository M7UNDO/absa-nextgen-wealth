import React from "react";
import TrackMilestoneCard from "./TrackMilestoneCard";
import "../styles/TrackMilestoneCard.css"

function TrackMilestonesSection({
  title = "5-year roadmap",
  milestones,
  progress,
  onUpdateProgress,
}) {
  return (
    <section className="path-section">
      <h2>{title}</h2>

      <div className="milestone-list">
        {milestones.map((milestone, index) => (
          <TrackMilestoneCard
            key={milestone.progressKey}
            number={milestone.number || index + 1}
            year={milestone.year}
            title={milestone.title}
            description={milestone.description}
            progressKey={milestone.progressKey}
            progress={progress}
            onUpdateProgress={onUpdateProgress}
          />
        ))}
      </div>
    </section>
  );
}

export default TrackMilestonesSection;