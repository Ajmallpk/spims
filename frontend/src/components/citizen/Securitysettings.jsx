/**
 * SecuritySettings.jsx
 * Container card for all security-related sub-forms.
 *
 * Props:
 *   profile : object – citizen profile (used for current email)
 *   token   : string – Bearer auth token
 */

import ChangePasswordForm from "@/components/citizen/Changepasswordform";
import ChangeEmailForm from "@/components/citizen/Changeemailform";

const SecuritySettings = ({ profile, token }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-8">
      {/* Section header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="w-5 h-5 text-teal-500"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-800">Security Settings</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Manage your password and email address
          </p>
        </div>
      </div>

      {/* Password section */}
      <ChangePasswordForm token={token} />

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Email section */}
      <ChangeEmailForm currentEmail={profile?.email} token={token} />
    </div>
  );
};

export default SecuritySettings;