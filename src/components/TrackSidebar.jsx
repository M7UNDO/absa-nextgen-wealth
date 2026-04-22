import React from "react";
import { Link } from "react-router-dom";
import "../styles/TrackSidebar.css"

function TrackSidebar({ tradeOffs, studios, tradeOffsTitle = "Trade-offs to understand" }) {
  return (
    <aside className="track-sidebar">
      <section className="sidebar-card warning-card">
        <h3>{tradeOffsTitle}</h3>
        <ul>
          {tradeOffs.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="sidebar-card">
        <h3>Recommended studios</h3>

        <div className="studio-links">
          {studios.map((studio) => (
            <Link
              key={studio.title}
              to={studio.path}
              className="studio-link-card"
            >
              <strong>{studio.title}</strong>
              <span>{studio.description}</span>
            </Link>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default TrackSidebar;