import { useState } from "react";
import citizenapi from "@/service/citizenurls";
import { useNavigate, useLocation } from "react-router-dom";

export default function VerifyResetOTP() {

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async () => {

    try {

      await citizenapi.verifyResetOtp({
        email,
        otp
      });

      navigate("/citizen/reset-password", {
        state: { email }
      });

    } catch (err) {

      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        Object.values(err.response?.data || {})[0] ||
        "Invalid OTP";

      setError(message);

    }

  };

  return (

    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow w-96">

        <h2 className="text-xl font-bold mb-4">
          Enter OTP
        </h2>

        <input
          type="text"
          placeholder="6 digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-3 rounded mb-3"
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={handleVerify}
          className="w-full bg-black text-white py-3 rounded"
        >
          Verify OTP
        </button>

      </div>

    </div>

  );
}