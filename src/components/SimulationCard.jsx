import React from "react";
import { Link } from "react-router-dom";

export default function SimulationCard({heading, description, to}) {
  return (
    <div className="simulation-card">
      <h3 className="heading">{heading}</h3>
      <p>{description}</p>
      <Link to={to} className="studio-btn">
        Lauch Studio
      </Link>
    </div>
  );
}
