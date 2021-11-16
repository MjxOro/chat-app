import { Navigate } from "react-router-dom";

const ProtectedRoute = (props: any) => {
  return props.isAuth ? props.children : <Navigate to="/start" />;
};

export default ProtectedRoute;
