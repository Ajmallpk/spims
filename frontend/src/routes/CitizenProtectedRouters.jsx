// // import { Navigate } from "react-router-dom";
// // import { useSuspension } from "@/context/SuspensionContext";

// // export default function CitizenProtectedRoute({ children }) {
// //   const { isSuspended } = useSuspension();
// //   const token =
// //     localStorage.getItem("access") ||
// //     sessionStorage.getItem("access");

// //   if (!token) {
// //     return <Navigate to="/citizen/registration" replace />;
// //   }

// //   return children;
// // }



// import { Navigate } from "react-router-dom";
// import { useSuspension } from "@/context/SuspensionContext";

// export default function CitizenProtectedRoute({ children }) {
//   const token =
//     localStorage.getItem("access") ||
//     sessionStorage.getItem("access");

//   const { isSuspended } = useSuspension();

//   if (!token) {
//     return <Navigate to="/citizen/registration" replace />;
//   }

//   if (isSuspended) {
//     return null;
//   }

//   return children;
// }




import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { useSuspension } from "@/context/SuspensionContext";

export default function CitizenProtectedRoute({ children }) {

  const [isAuth, setIsAuth] = useState(null);
  const { isSuspended } = useSuspension();

  useEffect(() => {
    axiosInstance.get("auth/me/")
      .then(() => setIsAuth(true))
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <p>Loading...</p>;

  if (!isAuth) {
    return <Navigate to="/citizen/registration" replace />;
  }

  if (isSuspended) {
    return null;
  }

  return children;
}