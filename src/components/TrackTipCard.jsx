import React, { useEffect, useState } from "react";
import "../styles/TrackTipCard.css";

function TrackTipCard({ tips, interval = 8000 }) {
  const [activeTipIndex, setActiveTipIndex] = useState(0);

  useEffect(() => {
    if (!tips || !tips.length) return;

    const sliderInterval = setInterval(() => {
      setActiveTipIndex((prev) => (prev + 1) % tips.length);
    }, interval);

    return () => clearInterval(sliderInterval);
  }, [tips, interval]);

  if (!tips || !tips.length) return null;

  return (
    <div className="property-tip-card">
      <div className="property-tip-label">
        <span>Tip</span>
        <i className="fa-solid fa-lightbulb"></i>
      </div>

      <p key={activeTipIndex} className="property-tip-text">
        {tips[activeTipIndex]}
      </p>
    </div>
  );
}

export default TrackTipCard;