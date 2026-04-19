
// import { Navigate } from "react-router-dom";

// export default function AdminProtectedRoute({ children }) {

//   const role = localStorage.getItem("role");

//   // ✅ Direct check (no async, no delay, no loop)
//   if (role !== "ADMIN") {
//     return <Navigate to="/admin/login" replace />;
//   }

//   return children;
// }




import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { adminapi } from "@/service/adminurls";

export default function AdminProtectedRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await adminapi.me();

        if (data.role === "ADMIN") {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch {
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  // ⏳ Loading state
  if (isAuth === null) {
    return <div>Loading...</div>;
  }

  // ❌ Not authorized
  if (!isAuth) {
    return <Navigate to="/admin/login" replace />;
  }

  // ✅ Authorized
  return children;
}