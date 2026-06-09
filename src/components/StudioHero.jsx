import React from "react";
import "../styles/StudioHero.css"

export default function StudioHero({title, subheading}) {
  return (
    <div className="studio-hero">
      <h1>{title}</h1>
      <p>{subheading}</p>
    </div>
  );
}
