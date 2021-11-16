import React, { useContext } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.scss";
import ProtectedRoute from "./Components/ProtectedRoute";
import LandingPage from "./Pages/Landing/Landing";
import { myContext } from "./Hooks/Context";

const Poggers = () => {
  return <h1> LOGGED IN </h1>;
};

const App: React.FC = () => {
  const isAuth = useContext(myContext);
  console.log(isAuth);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/start" element={<LandingPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute isAuth>
              <Poggers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
