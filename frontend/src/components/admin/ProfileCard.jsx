import { useState } from "react";

export default function ProfileCard({ admin, onSave }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    fullName: admin.fullName,
    email: admin.email,
    phone: admin.phone,
    designation: admin.designation,
  });

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    onSave(form);
    setEditMode(false);
  };

  const handleCancel = () => {
    setForm({ fullName: admin.fullName, email: admin.email, phone: admin.phone, designation: admin.designation });
    setEditMode(false);
  };

  return (
    <div className="flex flex-col rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 overflow-hidden">

      {/* Card Header Banner */}
      <div className="relative h-24 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0f2240 0%, #1d4ed8 40%, #1e3a5f 70%, #0d1526 100%)",
          }}
        />
        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Corner decorations */}
        <div
          className="absolute top-3 right-4 w-16 h-16 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }}
        />
        <div
          className="absolute -bottom-4 left-8 w-20 h-20 rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }}
        />
      </div>

      {/* Avatar row */}
      <div className="relative px-6 pb-1">
        <div className="flex items-end justify-between -mt-10 mb-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white border-4 border-slate-900/80 shadow-xl"
              style={{
                background: "linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)",
                boxShadow: "0 0 24px rgba(29,78,216,0.4)",
              }}
            >
              {admin.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            {/* Online indicator */}
            <div
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 bg-emerald-400 flex items-center justify-center"
              style={{ boxShadow: "0 0 8px rgba(52,211,153,0.6)" }}
            />
          </div>

          {/* Edit / Save buttons */}
          <div className="flex items-center gap-2 mt-12">
            {editMode ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl text-slate-400 bg-slate-800/60 border border-slate-700/50 hover:text-slate-200 hover:bg-slate-700/60 transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl text-white bg-blue-600/80 border border-blue-500/50 hover:bg-blue-600 transition-all duration-150 active:scale-95"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl text-blue-400 bg-blue-500/10 border border-blue-500/25 hover:bg-blue-500/20 hover:border-blue-400/40 transition-all duration-150 active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Name + badges */}
        <div className="mb-5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold text-slate-100 font-mono tracking-tight">
              {editMode ? form.fullName : admin.fullName}
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full font-mono text-blue-300 bg-blue-500/15 border border-blue-500/25">
              SUPER ADMIN
            </span>
            <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              ACTIVE
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">{admin.designation}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-6 border-t border-slate-700/40" />

      {/* Info fields */}
      <div className="px-6 py-5 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-600 font-mono mb-3">
          Account Information
        </p>

        {editMode ? (
          /* Edit form */
          <div className="space-y-3">
            {[
              { label: "Full Name", field: "fullName", type: "text" },
              { label: "Email Address", field: "email", type: "email" },
              { label: "Phone Number", field: "phone", type: "tel" },
              { label: "Designation", field: "designation", type: "text" },
            ].map((f) => (
              <div key={f.field}>
                <label className="text-xs text-slate-600 font-mono block mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={form[f.field]}
                  onChange={(e) => handleChange(f.field, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm text-slate-300 bg-slate-800/60 border border-slate-700/50 focus:outline-none focus:border-blue-500/50 focus:bg-slate-800/80 transition-all duration-150 font-mono"
                />
              </div>
            ))}
          </div>
        ) : (
          /* View mode */
          <div className="space-y-3">
            {[
              {
                label: "Email Address",
                value: admin.email,
                icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              },
              {
                label: "Phone Number",
                value: admin.phone,
                icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
              },
              {
                label: "Designation",
                value: admin.designation,
                icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
              },
              {
                label: "Department",
                value: admin.department,
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5",
              },
              {
                label: "Joined Date",
                value: admin.joinedDate,
                icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
              },
            ].map((field) => (
              <div
                key={field.label}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 hover:border-slate-600/60 hover:bg-slate-800/60 transition-all duration-150"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-slate-700/60">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.8" className="w-4 h-4">
                    <path d={field.icon} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-600 font-mono">{field.label}</p>
                  <p className="text-sm font-semibold text-slate-300 mt-0.5 truncate">{field.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin ID strip */}
      <div className="mx-6 mb-5 mt-1 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-xs text-slate-600 font-mono">Admin ID</span>
        </div>
        <span className="text-xs font-bold font-mono text-slate-400 tracking-widest">{admin.adminId}</span>
      </div>
    </div>
  );
}