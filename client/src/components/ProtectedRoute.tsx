import { Navigate } from "react-router-dom";

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
