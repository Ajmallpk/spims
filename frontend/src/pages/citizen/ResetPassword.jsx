import { useState } from "react";
import citizenapi from "@/service/citizenurls";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword(){

  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error,setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleReset = async () => {

    try {

      await citizenapi.resetPassword({
        email,
        new_password: newPassword,
        confirm_password: confirmPassword
      });

      alert("Password reset successful");

      navigate("/citizen/registration");

    } catch (err) {

      setError(
        err.response?.data?.error || "Reset failed"
      );

    }

  };

  return (

    <div className="flex justify-center items-center min-h-screen">

      <div className="bg-white p-6 rounded-xl shadow w-96">

        <h2 className="text-xl font-bold mb-4">
          Reset Password
        </h2>

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleReset}
          className="w-full bg-black text-white py-3 rounded"
        >
          Reset Password
        </button>

      </div>

    </div>

  );
}