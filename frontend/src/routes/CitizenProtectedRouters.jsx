import { Navigate } from "react-router-dom";

export default function CitizenProtectedRoute({ children }) {
  const token =
    localStorage.getItem("access") ||
    sessionStorage.getItem("access");

  if (!token) {
    return <Navigate to="/citizen/registration" replace />;
  }

  return children;
}