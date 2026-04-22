import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import "../styles/TrackCelebrationBanner.css"

function TrackCelebrationBanner({ message }) {
  const bannerRef = useRef(null);

  useGSAP(
    () => {
      if (!message || !bannerRef.current) return;

      gsap.fromTo(
        bannerRef.current,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power3.out",
        }
      );

      const timeout = setTimeout(() => {
        gsap.to(bannerRef.current, {
          autoAlpha: 0,
          y: 20,
          duration: 0.4,
          ease: "power2.in",
        });
      }, 4000);

      return () => clearTimeout(timeout);
    },
    { dependencies: [message] }
  );

  if (!message) return null;

  return (
    <div ref={bannerRef} className="celebration-banner">
      <i className="fa-solid fa-circle-check"></i>
      <p>{message}</p>
    </div>
  );
}

export default TrackCelebrationBanner;