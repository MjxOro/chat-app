import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAuth }: { isAuth: object }) => {
  const location = useLocation();
  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/start" state={{ from: location }} />
  );
};

export default ProtectedRoute;
