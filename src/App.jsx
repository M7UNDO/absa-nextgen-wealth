import {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import AuthContext from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import "./App.css";
import Home from "./pages/Home";
import SimulationLab from "./pages/SimulationLab";
import StrategyTracks from "./pages/StrategyTracks";
import VehicleFinance from "./pages/VehicleFinance";
import HomeLoan from "./pages/HomeLoan";
import Authentication from "./pages/Authentication";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const [authStatus, setAuthStatus] = useState("unknown"); //Initialise with unkown
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const mockToken = localStorage.getItem('mockToken')

    if(mockToken && displayName){
      setAuthStatus('authed');
      setUser({displayName});
    }
    else{
      setAuthStatus('guest');
    }
  }, [])

  /*Real word example uses Database
  Never store raw passwords on the clients browser*/
  function login(username, password) {
    if (username === "Siya" && password === "password") {
      setAuthStatus('authed');
      setUser({displayName: username})
      localStorage.setItem('userDisplayName', username);
      localStorage.setItem('mockToken', 'cujchabckbubq3ueu398q8h0cnccam');
      return true
    };
    return false;
  }

  function logout(){
    setAuthStatus('guest');
    setUser(null);
    localStorage.removeItem('mockToken');
    localStorage.removeItem('userDisplayName');
  }


  //username or email for login
  return (
    <>
      <AuthContext.Provider value={{authStatus, user, login, logout}}>
        <BrowserRouter>
          <Navbar />
          <Footer />
          <Routes>
            <Route path="/" element={<RequireAuth><Home /></RequireAuth>}></Route>
            <Route path="/simulation-lab" element={<SimulationLab />}></Route>
            <Route path="/strategy-tracks" element={<StrategyTracks />}></Route>
            <Route path="/login" element={<Authentication mode="login" />}></Route>
            <Route path="/signup" element={<Authentication mode="signup" />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </>
  );
}

export default App;

//Auth Status: unknown | guest | authed
//user: {displayname: Siya | null}
//mockToken - store in Local Storage
