import React from "react";
import "../styles/StrategyTracks.css";
import Track from "../components/Track";
import Hero from "../components/Hero";
import heroImage from "../assets/images/vitaly-gariev-FCKsQCXyWDg-unsplash.jpg";

function StrategyTracks() {
  const trackData = [
    {
      id: 1,
      image: "",
      title: "First Property Path",
      description:
        "For when you're ready to stop renting and put down roots. This track helps you save for a deposit, understand bond costs, and get your foot on the property ladder within five years.",
      page: "/strategy-tracks/first-property-path",
    },
    {
      id: 2,
      image: "",
      title: "Freedom & Flexibilty Path",
      description:
        "For those who value experiences over assets. This track prioritises cash flow, a strong emergency fund, and investments you can access easily—so you're always ready for the next adventure or career move.",
      page: "/strategy-tracks/freedom-flexibility-path",
    },
    {
      id: 3,
      image: "",
      title: "Leagcy & Impact Path",
      description:
        "For when you're thinking beyond yourself—whether that's supporting family, building generational wealth, or making a difference in your community. This track helps you set up structures that last.",
      page: "/strategy-tracks/legacy-impact-path",
    },
  ];
  return (
    <>

      <Hero
        title="Choose Your Path to the First Five Years"
        subheading="Select a strategy that matches your goals and your life style"
        img={heroImage}
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
    </>
  );
}

export default StrategyTracks;
