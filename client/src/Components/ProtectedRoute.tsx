import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthenticate from "../context/AuthContext";

const ProtectedRoute = () => {
  const location = useLocation();
  const { isAuth, isLoading } = useAuthenticate();
  const [loadingText, setLoadingText] = useState("Loading...");
  setTimeout(() => {
    setLoadingText("Server may be down, Please try again later");
  }, 10000);
  return (
    <>
      {!isLoading ? (
        isAuth ? (
          <Outlet />
        ) : (
          <Navigate to="/start" state={{ from: location }} />
        )
      ) : (
        <div>{loadingText}</div>
      )}
    </>
  );
};

export default ProtectedRoute;
