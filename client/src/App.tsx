import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.scss";
import ProtectedRoute from "./Components/ProtectedRoute";
import LandingPage from "./Pages/Landing/Landing";
import Dashboard from "./Pages/Dashboard/Dashboard";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/start" element={<LandingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
