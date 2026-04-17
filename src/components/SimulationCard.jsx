import React from "react";
import { Link } from "react-router-dom";

export default function SimulationCard({heading, description, icon, to}) {
  return (
    <div className="simulation-card">
      <img src={icon} className="simulation-icon"/>
      <h3 className="heading">{heading}</h3>
      <p className="simulation-description">{description}</p>
      <Link to={to} className="studio-btn">
        Lauch Studio
      </Link>
    </div>
  );
}
