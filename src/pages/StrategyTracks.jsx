import React from "react";
import "../styles/StrategyTracks.css";
import Track from "../components/Track";
import Hero from "../components/Hero";
import heroImage from "../assets/images/vitaly-gariev-FCKsQCXyWDg-unsplash.jpg";
import track1 from "../assets/images/roger-starnes-sr-YTqHwZhykMg-unsplash.jpg";
import track2 from "../assets/images/raimond-klavins-xAqrT-279UA-unsplash.jpg";
import track3 from "../assets/images/lawrence-crayton-FgwrW7wagzI-unsplash.jpg";

function StrategyTracks() {
  const trackData = [
    {
      id: 1,
      image: track1,
      title: "First Property Path",
      description:
        "When you're ready to stop renting and put down roots, this track supports you in working toward your first home. It covers saving for a deposit, understanding bond costs, and taking practical steps to get onto the property ladder within five years.",
      page: "/strategy-tracks/first-property-path",
    },
    {
      id: 2,
      image: track2,
      title: "Freedom & Flexibility Path",
      description:
        "If you value experiences over long-term commitments, this track is designed to keep your options open. It focuses on building strong cash flow, maintaining a reliable emergency fund, and investing in ways that allow you to adapt as your life changes.",
      page: "/strategy-tracks/freedom-flexibility-path",
    },
    {
      id: 3,
      image: track3,
      title: "Legacy & Impact Path",
      description:
        "Thinking beyond yourself? Build generational wealth, support your family, and create lasting impact with structures designed to stand the test of time.",
      page: "/strategy-tracks/legacy-impact-path",
    },
  ];
  return (
    <div className="strategy-tracks-page">
      <Hero
        title="Choose Your Path for the First Five Years"
        subheading="Select a strategy that matches your goals and your life style"
        src={heroImage}
        alt="Woman is using smartphone touching screen smiling sitting at desk in office room alone enjoying gadget. People, workspace and devices concept."
      />

      <section className="strategy-tracks">
        <h2>Paths to Explore</h2>

        <div className="strategy-track-container">
          {trackData.map((track) => (
            <Track
              key={track.id}
              image={track.image}
              title={track.title}
              description={track.description}
              page={track.page}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default StrategyTracks;
