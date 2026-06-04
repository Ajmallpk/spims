import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

export default function PanchayathProtectedRoute({ children }) {

  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {

    axiosInstance.get("/panchayath/auth/me/")
      .then((res) => {

        if (res.data.role === "PANCHAYATH") {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }

      })
      .catch(() => {
        setIsAuth(false);
      });

  }, []);

  if (isAuth === null) {
    return <p>Loading...</p>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}