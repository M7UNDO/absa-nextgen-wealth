import React from "react";
import {useContext} from "react";
import ThemeContext from "../context/ThemeContext";
import SunIcon from "../assets/icons/sun.svg?react";
import MoonIcon from "../assets/icons/moon.svg?react";
import "../styles/ThemeToggle.css";

export default function ThemeToggle() {
  const {theme, toggleTheme} = useContext(ThemeContext);
  return (
    <button className="theme-btn" onClick={toggleTheme} >
      <span className="theme-icon">{theme === "light" ? <MoonIcon className /> : <SunIcon />}</span>
    </button>
  );
}
