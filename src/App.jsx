import {useState, useEffect} from "react";
import {BrowserRouter, Routes, Route, useLocation} from "react-router-dom";

import {AuthProvider} from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import SimulationLab from "./pages/SimulationLab";
import StrategyTracks from "./pages/StrategyTracks";

import FirstPropertyPath from "./pages/FirstPropertyPath";
import VehicleFinance from "./pages/VehicleFinance";
import BuyNowVsSave from "./pages/BuyNowVsSave";
import HomeLoan from "./pages/HomeLoan";

import Authentication from "./pages/Authentication";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<MainLayout />}>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              ></Route>
              <Route path="/simulation-lab" element={<SimulationLab />}></Route>
              <Route path="/simulation-lab/home-loan-calculator" element={<HomeLoan />}></Route>
              <Route path="/simulation-lab/vehicle-finance-calculator" element={<VehicleFinance />}></Route>
              <Route path="/simulation-lab/bnpl-vs-save-first" element={<BuyNowVsSave />}></Route>
              <Route path="/strategy-tracks" element={<StrategyTracks />}></Route>
              <Route path="/strategy-tracks/first-property-path" element={<FirstPropertyPath />}></Route>
            </Route>

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Authentication mode="login" />}></Route>
              <Route path="/signup" element={<Authentication mode="signup" />}></Route>
            </Route>

            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;

//Auth Status: unknown | guest | authed
//user: {displayname: Siya | null}
//mockToken - store in Local Storage
