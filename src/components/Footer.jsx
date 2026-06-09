import {Link} from "react-router-dom";   

import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="logo">
              Absa Next-Gen
            </Link>

            <p className="footer-tagline">Plan Smarter. Build Wealth. Shape Your Future.</p>
          </div>

          <div className="footer-simulation-labs">
            <h4>Simulation Labs</h4>

            <ul>
              <li>
                <Link to="/simulation-lab/vehicle-finance-calculator">Vehicle Finance Calculator</Link>
              </li>
              <li>
                <Link to="/simulation-lab/home-loan-calculator">Home Loan Calculator</Link>
              </li>
              <li>
                <Link to="/simulation-lab/bnpl-vs-save-first">Buy Now vs Save First Calculator</Link>
              </li>
            </ul>
          </div>

          <div className="footer-strategy-tracks">
            <h4>Strategy Tracks</h4>

            <ul>
              <li>
                <Link to="/strategy-tracks/first-property-path">First Property Path</Link>
              </li>
              <li>
                <Link to="/strategy-tracks/freedom-flexibility-path">Freedom & Flexibility Path</Link>
              </li>
              <li>
                <Link to="/strategy-tracks/legacy-impact-path">Legacy & Impact Path</Link>
              </li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-icons">
              <a href="https://www.linkedin.com/in/mfundo-dhlamini" target="_blank" rel="noopener noreferrer">
                <i class="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="mailto:dhlaminimfundo1@gmail.com" target="_blank" rel="noopener noreferrer">
                <i class="fa-solid fa-envelope"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Absa Next-Gen Wealth Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
