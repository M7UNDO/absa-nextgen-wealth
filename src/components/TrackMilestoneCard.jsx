import React from "react";

function TrackMilestoneCard({
  number,
  year,
  title,
  description,
  progressKey,
  progress,
  onUpdateProgress,
}) {
  return (
    <article className="milestone-card">
      <div className="milestone-number">{number}</div>

      <div className="milestone-content">
        <p className="milestone-year">{year}</p>

        <div className="milestone-heading">
          <h3>{title}</h3>
          <p>{description}</p>
        </div>

        <div className="status-group">
          <button
            type="button"
            className={
              progress[progressKey] === "not-started"
                ? "status-btn active"
                : "status-btn"
            }
            onClick={() =>
              onUpdateProgress(progressKey, "not-started", title)
            }
          >
            Not started
          </button>

          <button
            type="button"
            className={
              progress[progressKey] === "in-progress"
                ? "status-btn active"
                : "status-btn"
            }
            onClick={() =>
              onUpdateProgress(progressKey, "in-progress", title)
            }
          >
            In progress
          </button>

          <button
            type="button"
            className={
              progress[progressKey] === "done"
                ? "status-btn active"
                : "status-btn"
            }
            onClick={() => onUpdateProgress(progressKey, "done", title)}
          >
            Done
          </button>
        </div>
      </div>
    </article>
  );
}

export default TrackMilestoneCard;