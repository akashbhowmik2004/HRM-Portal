import { Navigate } from "react-router";
import useAuth from "../context/useAuth";

const dashboardByRole = {
  employee: "/employee-dashboard",
  hr: "/hr-dashboard",
  admin: "/admin-dashboard",
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait for /verify to finish
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but trying to access another role's dashboard
  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={dashboardByRole[user.role]}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;