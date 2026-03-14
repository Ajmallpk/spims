import { ShieldCheck, Key, UserCheck, Lock } from "lucide-react";
import ChangePasswordForm from "@/components/admin/Changepasswordform";
import ChangeEmailForm from "@/components/admin/ChangeEmailForm";
import { Mail } from "lucide-react";

const SecurityFeatureRow = ({ icon: Icon, label, description, enabled = true }) => (
  <div className="flex items-start gap-3.5 py-3.5 border-b border-gray-100 last:border-0">
    <div
      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 ${enabled ? "bg-emerald-50" : "bg-gray-100"
        }`}
    >
      <Icon
        className={`w-4 h-4 ${enabled ? "text-emerald-600" : "text-gray-400"}`}
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${enabled
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-100 text-gray-500"
            }`}
        >
          {enabled ? "Enabled" : "Disabled"}
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-0.5">{description}</p>
    </div>
  </div>
);

const SecuritySettingsCard = ({ profile }) => {
  const isVerified =
    profile?.is_verified !== undefined ? profile.is_verified : true;

  return (
    <div className="space-y-5">
      {/* Change Password Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Key className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">Change Password</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>

        <ChangePasswordForm />
        {/* Change Email Card */}

        <div className="bg-white rounded-xl shadow-md p-6">

          <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Mail className="w-4 h-4 text-blue-600" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-gray-800">
                Change Email
              </h2>

              <p className="text-xs text-gray-400">
                Update your account email with OTP verification
              </p>
            </div>
          </div>

          <ChangeEmailForm />

        </div>
      </div>

      {/* Security Info Card */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2.5 mb-1 pb-4 border-b border-gray-100">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800">
              Security Overview
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Active security features on your account
            </p>
          </div>
        </div>

        <div>
          <SecurityFeatureRow
            icon={Key}
            label="JWT Authentication"
            description="Secure token-based authentication is active for all API requests."
            enabled={true}
          />
          <SecurityFeatureRow
            icon={Lock}
            label="Role-Based Access Control"
            description="Your admin role restricts access to authorised system areas only."
            enabled={true}
          />
          <SecurityFeatureRow
            icon={UserCheck}
            label="Account Verification"
            description="Your account identity has been verified by the system."
            enabled={isVerified}
          />
        </div>

        {/* Security note */}
        <div className="mt-4 px-4 py-3 rounded-lg bg-amber-50 border border-amber-100">
          <p className="text-xs text-amber-700 font-medium">
            <span className="font-bold">Security tip:</span> Never share your
            credentials. Passwords should be at least 8 characters with a mix
            of letters and numbers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettingsCard;