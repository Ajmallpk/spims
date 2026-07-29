// import { useState } from "react";
// import panchayathApi from "@/service/panchayathurls";
// import toast from "react-hot-toast";
// import { handleApiError } from "@/utils/handleApiError";

// const PanchayathChangePasswordForm = () => {

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {

//     e.preventDefault();


//     if (!currentPassword.trim()) {
//       toast.error("Current password is required");
//       return;
//     }

//     if (!newPassword.trim()) {
//       toast.error("New password is required");
//       return;
//     }

//     if (!confirmPassword.trim()) {
//       toast.error("Confirm password is required");
//       return;
//     }

//     if (newPassword.length < 8) {
//       toast.error("Password must be at least 8 characters");
//       return;
//     }

//     if (currentPassword === newPassword) {
//       toast.error("New password must be different from your current password");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       toast.error("New password and confirm password do not match");
//       return;
//     }

    

//     setLoading(true);

//     try {

//       await panchayathApi.changePassword({
//         current_password: currentPassword,
//         new_password: newPassword
//       });

//       // toast.success("Password changed successfully");

//       setCurrentPassword("");
//       setNewPassword("");
//       setConfirmPassword("");

//     } catch (error) {

//       handleApiError(
//         error,
//         "Failed to change password"
//       );

//     } finally {
//       setLoading(false);
//     }
//   };

//   return (

//     <form onSubmit={handleSubmit} className="space-y-4">

//       {/* Current Password */}
//       <div>
//         <label className="text-sm font-medium text-gray-700">
//           Current Password
//         </label>

//         <input
//           type="password"
//           value={currentPassword}
//           onChange={(e) => setCurrentPassword(e.target.value)}
//           className="w-full mt-1 px-3 py-2 border rounded-lg"
//           required
//         />
//       </div>

//       {/* New Password */}
//       <div>
//         <label className="text-sm font-medium text-gray-700">
//           New Password
//         </label>

//         <input
//           type="password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           className="w-full mt-1 px-3 py-2 border rounded-lg"
//           required
//         />
//       </div>

//       {/* Confirm Password */}
//       <div>
//         <label className="text-sm font-medium text-gray-700">
//           Confirm Password
//         </label>

//         <input
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="w-full mt-1 px-3 py-2 border rounded-lg"
//           required
//         />
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
//       >
//         {loading ? "Changing..." : "Change Password"}
//       </button>

//     </form>
//   );
// };

// export default PanchayathChangePasswordForm;




import { useState } from "react";
import panchayathApi from "@/service/panchayathurls";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

// ─── Password field with show/hide toggle ─────────────────────────────────────
// Visual/UX only — does not change what is submitted.

function PasswordField({ label, value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-slate-700">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="
            w-full pl-4 pr-11 py-2.5
            rounded-xl border border-slate-300
            text-sm text-slate-800
            placeholder:text-slate-400
            bg-white
            outline-none
            transition-all duration-150
            hover:border-slate-400
            focus:border-blue-500 focus:ring-1 focus:ring-blue-200
          "
          required
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PanchayathChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("New password is required");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.error("Confirm password is required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from your current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    setLoading(true);

    try {
      await panchayathApi.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      toast.success("Password changed successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      handleApiError(error, "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordField
        label="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter current password"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PasswordField
          label="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
        />

        <PasswordField
          label="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="
          flex items-center justify-center gap-2
          px-5 py-2.5 rounded-xl
          text-sm font-bold text-white
          bg-gradient-to-r from-blue-600 to-blue-500
          hover:from-blue-700 hover:to-blue-600
          shadow-sm shadow-blue-200 hover:shadow-md
          transition-all duration-150
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
            </svg>
            Changing…
          </>
        ) : (
          "Change Password"
        )}
      </button>
    </form>
  );
};

export default PanchayathChangePasswordForm;