import React from "react";
import "../styles/TrackProgressCard.css"

function TrackProgressCard({ completionPercentage }) {
  return (
    <div className="track-progress-card">
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
  );
}

export default TrackProgressCard;