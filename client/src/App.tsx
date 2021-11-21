import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import ProtectedRoute from "./Components/ProtectedRoute";
import LandingPage from "./Pages/Landing/Landing";
import Dashboard from "./Pages/Dashboard/Dashboard";
import useAuthenticate from "./context/AuthContext";

const App: React.FC = () => {
  const isAuth = useAuthenticate();
  return (
    <>
      {isAuth && (
        <Routes>
          <Route path="/start" element={<LandingPage />} />
          <Route element={<ProtectedRoute isAuth={isAuth} />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
      )}
    </>
  );
};

export default App;
