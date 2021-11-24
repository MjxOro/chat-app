import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ isAuth }: { isAuth: any }) => {
  const location = useLocation();
  return isAuth._id ? (
    <Outlet />
  ) : (
    <Navigate to="/start" state={{ from: location }} />
  );
};

export default ProtectedRoute;
