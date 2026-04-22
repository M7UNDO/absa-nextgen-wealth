import React from "react";
import { Link } from "react-router-dom";
import "../styles/FeatureGateway.css";

function FeatureGateway() {
  const features = [
    {
      title: "Home Loan Calculator",
      description: "See what home price range may fit your income.",
      path: "/simulation-lab/home-loan-calculator",
    },
    {
      title: "Vehicle Finance Calculator",
      description: "Understand the long-term cost of car finance.",
      path: "/simulation-lab/vehicle-finance-calculator",
    },
    {
      title: "BNPL vs Save First",
      description: "Compare convenience spending with slower smarter choices.",
      path: "/simulation-lab/bnpl-vs-save-first",
    },
    {
      title: "Strategy Tracks",
      description: "Choose a path that fits the financial future you want.",
      path: "/strategy-tracks",
    },
  ];

  return (
    <div className="feature-gateway-card">
      <div className="feature-gateway-header">
        <h4>Explore Your Next Step</h4>
        <p>Use studios and tracks to turn your snapshot into a plan.</p>
      </div>

      <div className="feature-gateway-grid">
        {features.map((feature) => (
          <Link key={feature.title} to={feature.path} className="feature-link-card">
            <strong>{feature.title}</strong>
            <span>{feature.description}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FeatureGateway;