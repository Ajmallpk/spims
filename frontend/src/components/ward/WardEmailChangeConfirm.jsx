import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";

const WardEmailChangeConfirm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg font-semibold">
          Invalid verification link
        </p>
      </div>
    );
  }

  const handleAllow = async () => {
    setLoading(true);

    try {
      const res = await wardapi.verifyEmailChange(token);

      toast.success(`Email changed successfully to ${res.data.email}`);

      setTimeout(() => {
        navigate("/ward/profile", {
          replace: true,
          state: {
            emailChanged: true,
            newEmail: res.data.email
          }
        });
      }, 2000);

    } catch (error) {
      toast.error("Email verification failed or expired");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/ward/profile", {
      replace: true,
      state: {
        emailCancelled: true
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Confirm Email Change
        </h2>

        <p className="text-gray-600 mb-6">
          Do you want to allow your email address to be changed?
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={handleCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleAllow}
            disabled={loading}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Allow Change"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default WardEmailChangeConfirm;