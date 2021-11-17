import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import ProtectedRoute from "./Components/ProtectedRoute";
import LandingPage from "./Pages/Landing/Landing";
import AuthProvider, { AuthContext } from "./Hooks/AuthContext";

const Poggers = () => {
  return <h1> LOGGED IN </h1>;
};

const App: React.FC = () => {
  const isAuth = useContext(AuthContext);
  return (
    <>
      {isAuth !== (null || undefined) && (
        <Routes>
          <Route path="/start" element={<LandingPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuth={isAuth}>
                <Poggers />
              </ProtectedRoute>
            }
          />
          )
        </Routes>
      )}
    </>
  );
};

export default App;
