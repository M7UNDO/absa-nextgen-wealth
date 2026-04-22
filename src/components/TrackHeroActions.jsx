import React from "react";
import "../styles/TrackHeroActions.css"

function TrackHeroActions({
  activeTrack,
  currentTrackId,
  onApply,
  onUntrack,
}) {
  const isCurrentTrack = activeTrack === currentTrackId;
  const anotherTrackSelected =
    activeTrack && activeTrack !== currentTrackId;

  return (
    <div className="btn-container">
      {!activeTrack && (
        <button className="select-track-btn" onClick={onApply}>
          Apply This Track
        </button>
      )}

      {isCurrentTrack && (
        <div className="track-btn-group">
          <button className="selected-track-btn" type="button">
            <i className="fa-solid fa-check"></i>
            Current Track
          </button>

          <button className="untrack-btn" onClick={onUntrack}>
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
  );
}

export default TrackHeroActions;