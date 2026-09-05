import { Navigate } from "react-router";
import useAuth from "../context/useAuth";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return user ? (
    children
  ) : (
    <Navigate
      to="/"
      replace
      state={{ message: "Please login first" }}
    />
  );
};

export default ProtectedRoute;