import { useState } from "react";
import panchayathApi from "@/service/panchayathurls";
import toast from "react-hot-toast";

const PanchayathChangePasswordForm = () => {

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    // confirm password validation
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    try {

      await panchayathApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword
      });

      toast.success("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

    } catch (error) {

      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Current Password */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Current Password
        </label>

        <input
          type="password"
          value={currentPassword}
          onChange={(e)=>setCurrentPassword(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          required
        />
      </div>

      {/* New Password */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          New Password
        </label>

        <input
          type="password"
          value={newPassword}
          onChange={(e)=>setNewPassword(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          required
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>

        <input
          type="password"
          value={confirmPassword}
          onChange={(e)=>setConfirmPassword(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
      >
        {loading ? "Changing..." : "Change Password"}
      </button>

    </form>
  );
};

export default PanchayathChangePasswordForm;