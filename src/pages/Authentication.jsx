import React, {useState} from "react";
import "../styles/Authentication.css";

function Authentication() {


  const [password, setPassword] = useState("");
  const [isVisibile, setIsVisibile] = useState(false);
  const [isLoginIn, setIsLogin] = useState(true);

  const toggleVisbility = () => {
    setIsVisibile(!isVisibile);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLoginIn);
  };

  return (
    <section className="auth-section">
      <h1>Absa Next-Gen New Wealth Studio</h1>
      <h2>{isLoginIn ? "Login" : "Create Account"}</h2>

      <form id="auth-form">
        {!isLoginIn && (
          <>
            <div>
              <label htmlFor="firstname-input">Name</label>
              <input type="text" name="firstname" className="auth-inputs" placeholder="Firstname" />
            </div>

            <div>
              <label htmlFor="surname-input">Surname</label>
              <input type="text" name="surname" className="auth-inputs" placeholder="Surname" />
            </div>
          </>
        )}

        <div>
          <label htmlFor="email-input">Email</label>
          <input type="email" name="email" className="auth-inputs" placeholder="Email Address" />
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
              <span className="material-symbols-outlined">{isVisibile ? "visibility_off" : "visibility"}</span>
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
                  name="repeat-password"
                  className="auth-inputs"
                  placeholder="Repeat Password"
                />
                <button type="button" onClick={toggleVisbility} id="visibility-btn">
                  <span className="material-symbols-outlined">{isVisibile ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>
          </>
        )}
        <button type="submit" className="auth-btn">
          {isLoginIn ? "Login" : "Sign Up"}
        </button>
        <p className="auth-switch-text">
          {isLoginIn ? "Don't have an acount? " : "Already have an Account? "}
          <button type="button" onClick={toggleAuthMode} className=" auth-switch-btn">
            {isLoginIn ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </section>
  );
}

export default Authentication;
