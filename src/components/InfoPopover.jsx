import React from "react";
import "../styles/InfoPopover.css";
import InfoSymbol from "../assets/icons/help-circle.svg?react";

function InfoPopover({
  infoKey,
  activeInfo,
  toggleInfo,
  title,
  children,
  dark = false,
  className = "",
  buttonClassName = "",
  popoverClassName = "",
}) {
  const isOpen = activeInfo === infoKey;

  // Handles entering the zone: opens the popover if it isn't already
  const handleMouseEnter = () => {
    if (!isOpen) {
      toggleInfo(infoKey);
    }
  };

  // Handles exiting the zone: closes the popover by passing null (or clearing the active key)
  const handleMouseLeave = () => {
    if (isOpen) {
      toggleInfo(null); // Assuming your hook closes the popover when null or a different key is passed
    }
  };

  return (
    <div 
      className={`info-popover-wrapper ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={`info-popover-btn ${dark ? "info-popover-btn-dark" : ""} ${buttonClassName}`}
        aria-expanded={isOpen}
      >
        <InfoSymbol className="help-circle"/>
      </button>

      {isOpen && (
        <div
          className={`info-popover-panel ${dark ? "info-popover-panel-dark" : ""} ${popoverClassName}`}
        >
          {title && <h5>{title}</h5>}
          <div className="info-popover-body">{children}</div>
        </div>
      )}
    </div>
  );
}

export default InfoPopover;