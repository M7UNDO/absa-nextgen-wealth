import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import graphicImage from "../assets/images/Simulation-lab-graphic.svg";
import "../styles/SimulationLab.css";

function SimulationLab() {
  return (
    <div className="simulation-lab-page">
      <Hero
        title="Know Your Money Studio"
        subheading="Experiment with real financial decisions. See the impact before you act."
        graphicImg={graphicImage}
        graphicAlt="save money"
      />
      
      <h2>Simulation Lab Overview</h2>
      <div className="simulation-studio-container">
        

        <div className="simulation-card">
          <h2>Home Loan Calculator</h2>
          <p>
            Find out how much home you can actually afford. We'll show you what monthly bond repayment fits your income
            and what property price range you should be looking at, no surprises later.
          </p>
          <Link className="studio-btn">Lauch Studio</Link>

        </div>
      </div>
    </div>
  );
}

export default SimulationLab;
