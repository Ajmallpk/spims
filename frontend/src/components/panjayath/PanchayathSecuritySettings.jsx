// import PanchayathChangePasswordForm from "./PanchayathChangePasswordForm";
// import PanchayathChangeEmailForm from "./PanchayathChangeEmailForm";

// const PanchayathSecuritySettings = ({ profile }) => {

//   return (

//     <div className="bg-white rounded-xl shadow-md p-6 space-y-8">

//       <div className="flex items-center gap-3 pb-4 border-b border-gray-100">

//         <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">

//           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
//             strokeWidth="2" className="w-5 h-5 text-teal-500">

//             <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />

//           </svg>

//         </div>

//         <div>
//           <h2 className="text-sm font-bold text-gray-800">
//             Security Settings
//           </h2>

//           <p className="text-xs text-gray-400">
//             Manage your password and email
//           </p>
//         </div>

//       </div>

//       <PanchayathChangePasswordForm />

//       <div className="border-t border-gray-100"></div>

//       <PanchayathChangeEmailForm
//         currentEmail={profile?.email}
//       />

//     </div>
//   );
// };

// export default PanchayathSecuritySettings;



import PanchayathChangePasswordForm from "./PanchayathChangePasswordForm";
// import PanchayathChangeEmailForm from "./PanchayathChangeEmailForm";

// ─── Section wrapper ──────────────────────────────────────────────────────────
// Gives each settings block its own icon, title and divider so the card reads
// as two clearly separated actions rather than one long form.

function SettingsSection({ icon, iconBg, iconColor, title, description, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight">{title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      <div className="pl-11">{children}</div>
    </div>
  );
}

const LockIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);

const MailIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const PanchayathSecuritySettings = ({ profile }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 21c-3.6-1.2-7-4.8-7-9V6.2L12 3l7 3.2V12c0 4.2-3.4 7.8-7 9Z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-900 leading-tight">Security Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Manage your password and email
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 space-y-8">
        <SettingsSection
          icon={LockIcon}
          iconBg="bg-blue-50 border border-blue-100"
          iconColor="text-blue-600"
          title="Password"
          description="Update the password used to sign in"
        >
          <PanchayathChangePasswordForm />
        </SettingsSection>

        <div className="border-t border-slate-100" />

        {/* <SettingsSection
          icon={MailIcon}
          iconBg="bg-emerald-50 border border-emerald-100"
          iconColor="text-emerald-600"
          title="Email Address"
          description="Change the email associated with this account"
        >
          <PanchayathChangeEmailForm currentEmail={profile?.email} />
        </SettingsSection> */}
      </div>
    </div>
  );
};

export default PanchayathSecuritySettings;