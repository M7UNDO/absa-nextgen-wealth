import React from "react";
import {useContext} from "react";
import AuthContext from "../context/AuthContext";
import Dashboard from "../components/Dashboard";

function Home() {
  return (
    <>
      <Dashboard />
    </>
  );
}

export default Home;
