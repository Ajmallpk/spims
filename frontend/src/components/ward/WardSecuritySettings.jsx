import WardChangePasswordForm from "@/components/ward/WardChangePasswordForm";
import WardChangeEmailForm from "@/components/ward/WardChangeEmailForm";


const WardSecuritySettings = ({ profile }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-6 max-w-md mx-auto">

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
          <h2 className="text-sm font-bold text-gray-800">
            Security Settings
          </h2>

          <p className="text-xs text-gray-400 mt-0.5">
            Manage your password and email
          </p>
        </div>
      </div>

      {/* Change Password */}
      <WardChangePasswordForm />

      <div className="border-t border-gray-100" />

      {/* Change Email */}
      <WardChangeEmailForm 
        currentEmail={profile?.email}
        api="ward"
      />

    </div>
  );
};

export default WardSecuritySettings;