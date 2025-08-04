import { Navigate, Outlet } from "react-router-dom";

const getCurrentUserRole = () => {
  const role = localStorage.getItem("role");
  return role;
};

const PrivateRoute = ({ allowedRoles }) => {
  const userRole = getCurrentUserRole();
  const isAuthenticated = !!userRole; //! Check if user is authenticated
  const hasRequiredRole = allowedRoles.includes(userRole);

  if (!isAuthenticated) {
    //! Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!hasRequiredRole) {
    // !Redirect to unauthorized page or home if role doesn't match
    return <Navigate to="/unauthorized" replace />;
  }

  //! Render child routes if authenticated and role matches
  return <Outlet />;
};

export default PrivateRoute;
