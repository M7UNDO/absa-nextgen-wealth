import React from "react";
import "../styles/InfoPopover.css";

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

  return (
    <div className={`info-popover-wrapper ${className}`}>
      <button
        type="button"
        className={`info-popover-btn ${dark ? "info-popover-btn-dark" : ""} ${buttonClassName}`}
        onClick={() => toggleInfo(infoKey)}
        aria-expanded={isOpen}
      >
        <span className="material-symbols-outlined">help</span>
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