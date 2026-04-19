import React from "react";
import {useNavigate} from "react-router-dom";

function HomeLoan() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate(-1)} className="back-btn">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h1>Home Loan Calculator</h1>
    </>
  );
}

export default HomeLoan;
