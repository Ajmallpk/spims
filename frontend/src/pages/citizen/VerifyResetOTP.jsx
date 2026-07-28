import { useState, useEffect } from "react";
import citizenapi from "@/service/citizenurls";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyResetOTP() {

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;




  useEffect(() => {
    let interval;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {

    if (isSubmitting) return;

    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    try {

      setIsSubmitting(true);

      await citizenapi.verifyResetOtp({
        email,
        otp,
      });

      toast.success("OTP verified successfully");

      navigate("/citizen/reset-password", {
        state: { email },
      });

    } catch (err) {

      const message =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.response?.data?.message ||
        Object.values(err.response?.data || {})[0] ||
        "Invalid OTP";

      setError(message);
      toast.error(message);

    } finally {

      setIsSubmitting(false);

    }

  };




  const handleResendOtp = async () => {

    if (!canResend || isResending) return;

    try {

      setIsResending(true);

      await citizenapi.resendResetOtp({
        email,
      });

      toast.success("OTP resent successfully");

      setTimer(60);
      setCanResend(false);
      setError("");

    } catch (err) {

      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to resend OTP";

      setError(message);
      toast.error(message);

    } finally {

      setIsResending(false);

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
          disabled={isSubmitting}
          className="w-full bg-black text-white py-3 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify OTP"}
        </button>



        <div className="text-center mt-4">

          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="text-blue-600 underline"
            >
              {isResending ? "Resending..." : "Resend OTP"}
            </button>
          ) : (
            <p className="text-gray-500">
              Resend OTP in {timer}s
            </p>
          )}

        </div>

      </div>

    </div>

  );
}