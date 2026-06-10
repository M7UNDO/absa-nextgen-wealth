import React from "react";
import "../styles/ConfettiOverlay.css";
import Confetti from "../assets/images/animated/Confetti.svg"

function ConfettiOverlay() {
  return (
    <div className="confetti-overlay">
      <img src={Confetti} alt="" />
    </div>
  );
}

export default ConfettiOverlay;