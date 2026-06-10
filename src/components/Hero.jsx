import React, {useEffect, useRef} from "react";
import "../styles/Hero.css";
import {gsap} from "gsap";

function Hero({title, subheading, src, alt, graphicImg, graphicAlt, children}) {
  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (src) {
        tl.from(".hero-img", {
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      tl.from(
        [".hero-title", ".subheading"],
        {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
          stagger: 0.15,
        },
        src ? "-=0.6" : undefined,
      );

      if (graphicImg) {
        tl.from(
          ".hero-graphic-img",
          {
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.4)",
          },
          "-=0.5",
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [src, graphicImg]);

  return (
    <>
      <section ref={heroRef} className="hero-section">
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
