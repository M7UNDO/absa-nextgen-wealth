import React from "react";
import "../styles/Hero.css";

function Hero({title, subheading, img, alt}) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="subheading">{subheading}</p>
        </div>
        <img src={img} alt={alt} className="hero-img" />
      </section>
    </>
  );
}

export default Hero;
