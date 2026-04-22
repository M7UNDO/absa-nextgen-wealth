import React from "react";
import "../styles/Hero.css";

function Hero({title, subheading, src, alt, graphicImg, graphicAlt, children}) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-content">
          {graphicImg && <img src={graphicImg} alt={graphicAlt || ""} className="hero-graphic-img" />}
          <div className="hero-info">
            <h1 className="hero-title">{title}</h1>
            <p className="subheading">{subheading}</p>

            {children}
          </div>
        </div>
        {src && <img src={src} alt={alt || ""} className="hero-img" />}
      </section>
    </>
  );
}

export default Hero;
