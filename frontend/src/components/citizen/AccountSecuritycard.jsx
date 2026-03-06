// citizen/components/AccountSecurityCard.jsx
import { useState } from "react";
import { Shield, Mail, Key, ChevronDown } from "lucide-react";
import ChangeEmailForm from "@/components/citizen/ChangeEmailform";
import ChangePasswordForm from "@/components/citizen/ChangePasswordForm";

function Section({ id, title, icon: Icon, active, onToggle, children }) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(id)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-gray-50 hover:bg-indigo-50/60 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <Icon className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <span className="text-sm font-semibold text-gray-800">{title}</span>
        </div>
        <ChevronDown
          className={[
            "w-4 h-4 text-gray-400 transition-transform duration-200",
            active ? "rotate-180" : "",
          ].join(" ")}
        />
      </button>
      {active && (
        <div className="px-4 py-5 border-t border-gray-100 bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

export default function AccountSecurityCard() {
  const [activeSection, setActiveSection] = useState(null);

  const toggle = (id) => setActiveSection((cur) => (cur === id ? null : id));

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
          <Shield className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Account Security</h3>
          <p className="text-xs text-gray-400 mt-0.5">Manage your login credentials</p>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <Section
          id="email"
          title="Change Email Address"
          icon={Mail}
          active={activeSection === "email"}
          onToggle={toggle}
        >
          <ChangeEmailForm />
        </Section>

        <Section
          id="password"
          title="Change Password"
          icon={Key}
          active={activeSection === "password"}
          onToggle={toggle}
        >
          <ChangePasswordForm />
        </Section>
      </div>
    </div>
  );
}