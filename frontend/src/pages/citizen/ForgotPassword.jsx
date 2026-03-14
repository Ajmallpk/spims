import { useState } from "react";
import { useNavigate } from "react-router-dom";
import citizenapi from "@/service/citizenurls";
import illustration from "@/assets/illustrations/forgot-password.png.png";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSendOtp = async () => {

    if (!email) {
      setError("Email is required");
      return;
    }

    try {

      await citizenapi.forgotPassword({ email });

      navigate("/citizen/verify-reset-otp", {
        state: { email }
      });

    } catch (err) {

      setError(
        err.response?.data?.error ||
        "Failed to send OTP"
      );

    }

  };

  return (

    <div className="min-h-screen flex">
        
      {/* LEFT ILLUSTRATION PANEL */}

      <div className="w-1/2 bg-green-900 flex items-center justify-center">

        <img
          src={illustration}
          alt="Forgot password illustration"
          className="w-3/4"
        />
        
      </div>


      {/* RIGHT FORM PANEL */}

      <div className="w-1/2 flex items-center justify-center bg-gray-100">

        <div className="bg-white p-8 rounded-xl shadow-lg w-96">

          <h2 className="text-2xl font-bold mb-4">
            Forgot Password
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Enter your email to receive a password reset OTP
          </p>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-3 rounded mb-3"
          />

          {error && (
            <p className="text-red-500 text-sm mb-2">
              {error}
            </p>
          )}

          <button
            onClick={handleSendOtp}
            className="w-full bg-black text-white py-3 rounded"
          >
            Send OTP
          </button>

        </div>

      </div>

    </div>

  );
}