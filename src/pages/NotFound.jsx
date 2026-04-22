import React from "react";
import {Link, useNavigate} from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  const navigate = useNavigate();

  return (
    <section className="notfound">
      <div className="notfound-wrapper">
        <p className="notfound-label">Page not found</p>
        <h1>404</h1>
        <div>
          <p className="notfound-message">Sorry, we could not find the page you are looking for.</p>
          <p className="notfound-subtext">The page may have been moved, deleted, or the URL might be incorrect.</p>
        </div>

        <div className="btn-container">
          <button type="button" onClick={() => navigate(-1)} className="back-btn">
            Go back
          </button>

          <Link to="/" className="home-btn">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
