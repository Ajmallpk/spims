import { useState } from "react";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";

const WardChangePasswordForm = () => {

const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
e.preventDefault();


if (newPassword !== confirmPassword) {
  toast.error("New password and confirm password do not match");
  return;
}

setLoading(true);

try {
  await wardapi.changePassword({
    current_password: currentPassword,
    new_password: newPassword
  });

  toast.success("Password changed successfully. Your new password is now active.");

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

return ( <form onSubmit={handleSubmit} className="space-y-4">


  <div>
    <label className="text-sm font-medium text-gray-700">
      Current Password
    </label>
    <input
      type="password"
      value={currentPassword}
      onChange={(e) => setCurrentPassword(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded-lg"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium text-gray-700">
      New Password
    </label>
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="w-full mt-1 px-3 py-2 border rounded-lg"
      required
    />
  </div>

  <div>
    <label className="text-sm font-medium text-gray-700">
      Confirm New Password
    </label>
    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
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

export default WardChangePasswordForm;
