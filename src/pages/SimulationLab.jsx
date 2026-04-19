import Hero from "../components/Hero";
import graphicImage from "../assets/images/Simulation-lab-graphic.svg";
import SimulationCard from "../components/SimulationCard";
import "../styles/SimulationLab.css";

import HomeLoanImage from "../assets/images/loan.png";
import VehicleImage from "../assets/images/car.png";
import SaveImage from "../assets/images/piggy-bank.png";

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
        <SimulationCard
          icon={HomeLoanImage}
          heading="Home Loan Calculator"
          description="Find out how much home you can actually afford. We'll show you what monthly bond repayment fits your income
            and what property price range you should be looking at, no surprises later."
          to="/simulation-lab/home-loan-calculator"
        />
        <SimulationCard
          icon={VehicleImage}
          heading="Vehicle Finance Calculator"
          description="That monthly payment might look manageable, but what does the car really cost you? See how deposit, term, and balloon payments affect your total bill before you sign."
          to="/simulation-lab/vehicle-finance-calculator"
        />
        <SimulationCard
          icon={SaveImage}
          heading="BNPL vs Save First"
          description="Buy Now, Pay Later feels convenient, but what does it actually cost? Compare instalment plans, store credit, and saving upfront, so you know the true price of convenience."
          to="/simulation-lab/bnpl-vs-save-first"
        />
      </div>
    </div>
  );
}

export default SimulationLab;
