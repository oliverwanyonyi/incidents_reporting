import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../store/AuthProvider/AuthProvider";

const ProtectedRoute = ({ allowedRoles }) => {

    const {authUser} = useAuth()

    const accessToken = localStorage.getItem('access_token') 

    const location = useLocation();

    const hasAllowedRole = authUser?.roles?.some((role) =>
    allowedRoles?.includes(role.name)
   );


  if (accessToken && hasAllowedRole) {
 // User has the allowed role allow access
 
  return <Outlet />;

 
}
else if (accessToken) {
 // User has an access token but doesn't have the allowed role, redirect to unauthorized
 return <Navigate to="/unauthorized" state={{ from: location }} replace />;
} else {
 // User is not authenticated, redirect to login
 return <Navigate to="/login" state={{ from: location }} replace />;
}


};

export default ProtectedRoute;
