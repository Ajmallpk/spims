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
    try {

      await adminapi.requestEmailChange(newEmail);

      toast.success("OTP sent to your email");

      setOtpSent(true);

    } catch (err) {

      // toast.error(err.response?.data?.error || "Failed to send OTP");
      handleApiError(err, "Failed to send OTP");
      

    }
  };

  const handleVerifyOTP = async () => {
    try {

      await adminapi.verifyEmailChange(otp);

      toast.success("Email updated successfully");

      setNewEmail("");
      setOtp("");
      setOtpSent(false);

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