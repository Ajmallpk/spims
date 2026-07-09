import { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import { adminapi } from "@/service/adminurls";
import { handleApiError } from "@/utils/handleApiError";

const ChangeEmailForm = () => {

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async () => {

    if (!newEmail.trim()) {

      handleApiError(
        {},
        "Email is required"
      );

      return;

    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newEmail)) {

      handleApiError(
        {},
        "Enter a valid email address"
      );

      return;

    }

    try {

      await adminapi.requestEmailChange(
        newEmail
      );



      setOtpSent(true);

      toast.success("OTP sent successfully. Please check your email.");

    } catch (err) {

      handleApiError(
        err,
        "Failed to send OTP"
      );

    }

  };

  const handleVerifyOTP = async () => {
    try {


      if (!otp.trim()) {

        handleApiError(
          {},
          "OTP is required"
        )

        return

      }

      await adminapi.verifyEmailChange(otp);


      setNewEmail("");
      setOtp("");
      setOtpSent(false);

      toast.success("Email changed successfully.");

    } catch (err) {

      // toast.error(err.response?.data?.error || "Invalid OTP");
      handleApiError(err, "Invalid OTP");

    }
  };

  return (
    <div className="space-y-4">

      {/* New Email Input */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          New Email
        </label>

        <div className="relative mt-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />

          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email"
            className="w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm"
          />
        </div>
      </div>

      {!otpSent && (
        <button
          onClick={handleSendOTP}
          className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700"
        >
          Send OTP
        </button>
      )}

      {otpSent && (
        <>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Enter OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6 digit OTP"
              className="w-full mt-1 px-3 py-2.5 border rounded-lg text-sm"
            />
          </div>

          <button
            onClick={handleVerifyOTP}
            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700"
          >
            Verify OTP
          </button>
        </>
      )}

    </div>
  );
};

export default ChangeEmailForm;