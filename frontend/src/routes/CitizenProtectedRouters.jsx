// import { Navigate } from "react-router-dom";
// import { useSuspension } from "@/context/SuspensionContext";

// export default function CitizenProtectedRoute({ children }) {
//   const { isSuspended } = useSuspension();
//   const token =
//     localStorage.getItem("access") ||
//     sessionStorage.getItem("access");

//   if (!token) {
//     return <Navigate to="/citizen/registration" replace />;
//   }

//   return children;
// }



import { Navigate } from "react-router-dom";
import { useSuspension } from "@/context/SuspensionContext";

export default function CitizenProtectedRoute({ children }) {
  const token =
    localStorage.getItem("access") ||
    sessionStorage.getItem("access");

  const { isSuspended } = useSuspension();

  if (!token) {
    return <Navigate to="/citizen/registration" replace />;
  }

  if (isSuspended) {
    return null;
  }

  return children;
}