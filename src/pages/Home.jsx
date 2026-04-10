import React from "react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import Dashboard from "../components/Dashboard";
import "../styles/Home.css"

function Home() {
  return (
    <>
      <h1>Home</h1>
      <Dashboard />
    </>
  );
}

export default Home;
