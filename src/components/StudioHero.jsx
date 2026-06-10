import React, { useEffect, useRef } from "react";
import "../styles/StudioHero.css";
import { gsap } from "gsap";

export default function StudioHero({title, subheading}) {
  const heroRef = useRef(null);

  useEffect(() => {

    const ctx = gsap.context(() => {
      gsap.from([ "h1", "p" ], {
        opacity: 0,
        y: 30,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="studio-hero">
      <h1>{title}</h1>
      <p>{subheading}</p>
    </div>
  );
}