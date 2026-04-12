import React, {useState, useEffect} from "react";
import {useContext} from "react";
import AuthContext from "../context/AuthContext";
import {NavLink, Link, useLocation} from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
  const {user, logout} = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  //Stop scrolling
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  const navLinkStyle = ({isActive}) => ({
    color: isActive ? "#4f46e5" : "#333",
    fontWeight: isActive ? "600" : "400",
    textDecoration: "none",
  });

  return (
    <header>
      <nav className="navbar">
        <Link to="/" className="logo">
          Absa Next-Gen
        </Link>

        <div className={`nav-menu  ${menuOpen ? "active" : ""}`}>
          <ul className="navlinks">
            <li>
              <NavLink to="/" onClick={closeMenu} className={({isActive}) => (isActive ? "active" : "")}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/simulation-lab" onClick={closeMenu} className={({isActive}) => (isActive ? "active" : "")}>
                Simulation Labs
              </NavLink>
            </li>
            <li>
              <NavLink to="/strategy-tracks" onClick={closeMenu} className={({isActive}) => (isActive ? "active" : "")}>
                Strategy Tracks
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="auth-container">
          {/*<Link to="/login">Login</Link>*/}
          {user ? (
            <>
              <span>{`Hi, ${user.user_metadata?.username}`}</span>
              <div className="divider"></div>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}

          <div className="user-menu">
            <i className="fa-solid fa-user user-icon"></i>

            {user && (
              <div className="user-dropdown">

                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
                <i class="fa-solid fa-right-from-bracket"></i>
              </div>
            )}
          </div>
        </div>

        <button
          className={`menu-btn ${menuOpen ? "menu-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="menu-lines"></span>
        </button>
      </nav>
    </header>
  );
}
