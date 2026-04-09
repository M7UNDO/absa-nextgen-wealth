import React from "react";
import {Link} from "react-router-dom"
import "../styles/NotFound.css";

function NotFound() {
  return (
    <section className="notfound">
      <div className="notfound-wrapper">
        <h1>404 Error</h1>
        <p>Sorry, we could not find the page you are looking for</p>
        <div className="btn-container">
          <Link to="/" className="home-btn">Go Home</Link>
        </div>
      </div>
    </section>
  );
}

export default NotFound;
