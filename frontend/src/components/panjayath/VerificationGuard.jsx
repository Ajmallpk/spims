// import { Navigate } from "react-router-dom";

// export default function VerificationGuard({ status, children }) {

//   if (status === "NOT_SUBMITTED") {
//     return <Navigate to="/panchayath/profile" replace />;
//   }

//   if (status === "PENDING") {
//     return <Navigate to="/panchayath/profile" replace />;
//   }

//   return children;
// }

import { Navigate } from "react-router-dom";

export default function VerificationGuard({ children }) {
  const isVerified = localStorage.getItem("is_verified") === "true";
  const submitted = localStorage.getItem("verification_submitted") === "true";

  // Not submitted → redirect to profile
  if (!submitted) {
    return <Navigate to="/panchayath/profile" replace />;
  }

  // Submitted but not approved
  if (!isVerified) {
    return <Navigate to="/panchayath/profile" replace />;
  }

  return children;
}