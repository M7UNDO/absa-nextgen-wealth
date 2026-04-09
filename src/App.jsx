import {BrowserRouter, Routes, Route} from "react-router-dom";
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
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Footer />
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/simulation-lab" element={<SimulationLab />}></Route>
          <Route path="/strategy-tracks" element={<StrategyTracks />}></Route>
          <Route path="/login" element={<Authentication mode="login"/>}></Route>
          <Route path="/signup" element={<Authentication mode="signup"/>}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
