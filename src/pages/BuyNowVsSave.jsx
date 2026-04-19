import React from "react";
import {useNavigate} from "react-router-dom";

function BuyNowVsSave() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate(-1)} className="back-btn">
        <i class="fa-solid fa-arrow-left"></i>Back
      </button>
      <h1>BNPL v Save First</h1>
    </>
  );
}

export default BuyNowVsSave;
