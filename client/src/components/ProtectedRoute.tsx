import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Hooks/AuthContext";

const ProtectedRoute = ({
  children,
  isAuth,
}: {
  children: JSX.Element;
  isAuth: boolean;
}) => {
  return isAuth ? children : <Navigate to="/start" />;
};

export default ProtectedRoute;
