import React, {useState, useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import {supabase} from "../services/supabaseClient";
import "../styles/Authentication.css";
import {validateAuth} from "../components/ValidateAuth";

function Authentication({mode}) {
  const isLoginIn = mode === "login";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [isVisibile, setIsVisibile] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const toggleVisbility = () => {
    setIsVisibile(!isVisibile);
  };

  const toggleAuthMode = () => {
    if (isLoginIn) {
      navigate("/signup");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setError("");
  }, [mode]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const errors = validateAuth({
      mode,
      username,
      email,
      password,
      repeatPassword,
    });

    if (errors.length > 0) {
      setError(errors.join(". "));
      return;
    }

    try {
      if (isLoginIn) {
        const {error} = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        navigate(from, {replace: true});
      } else {
        const {error} = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });

        if (error) throw error;

        
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-section">
      <h1>Absa Next-Gen New Wealth Studio</h1>
      <h2>{isLoginIn ? "Log In" : "Create Account"}</h2>

      <form id="auth-form" onSubmit={handleSubmit}>
        {!isLoginIn && (
          <>
          
            <div>
              <label htmlFor="firstname-input">Name</label>
              <input
                type="text"
                name="firstname"
                className="auth-inputs"
                placeholder="Firstname"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="surname-input">Surname</label>
              <input type="text" name="surname" className="auth-inputs" placeholder="Surname" />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email-input">Email</label>
          <input
            type="email"
            className="auth-inputs"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password-input">Password</label>
          <div className="password-field">
            <input
              type={isVisibile ? "text" : "password"}
              name="password"
              className="auth-inputs"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="button" onClick={toggleVisbility} id="visibility-btn">
              <i className={isVisibile? "fa-regular fa-eye-slash": "fa-regular fa-eye"}></i>
            </button>
          </div>
        </div>

        {!isLoginIn && (
          <>
            <div>
              <label htmlFor="repeat-password-input">Repeat Password</label>
              <div className="password-field">
                <input
                  type={isVisibile ? "text" : "password"}
                  className="auth-inputs"
                  placeholder="Repeat Password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
                <button type="button" onClick={toggleVisbility} id="visibility-btn">
                  <i className={isVisibile? "fa-regular fa-eye-slash": "fa-regular fa-eye"}></i>
                </button>
              </div>
            </div>
          </>
        )}
        {error && <p style={{color: "red"}}>{error}</p>}
        <button type="submit" className="auth-btn">
          {isLoginIn ? "Login" : "Sign Up"}
        </button>
        <p className="auth-switch-text">
          {isLoginIn ? "Don't have an acount? " : "Already have an Account? "}
          <button type="button" onClick={toggleAuthMode} className=" auth-switch-btn">
            {isLoginIn ? "Sign Up" : "Log In"}
          </button>
        </p>
      </form>
    </section>
  );
}

export default Authentication;
