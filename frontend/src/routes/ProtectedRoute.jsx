// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const token = localStorage.getItem("access");
//   const role = localStorage.getItem("role");

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!allowedRoles.includes(role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// }





import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

export default function ProtectedRoute({ children, allowedRoles }) {

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    axiosInstance.get("auth/me/")
      .then((res) => {
        if (allowedRoles.includes(res.data.role)) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .catch(() => setIsAuth(false));
  }, []);

  if (isAuth === null) return <p>Loading...</p>;

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}