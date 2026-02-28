// components/ProfileInfoCard.jsx
// SPIMS – Smart Panchayath Issue Management System
// Displays Panchayath profile information fetched from GET /api/panchayath/profile/
//
// Props:
//   profile    {object}  - Profile data object
//   isLoading  {boolean} - Show skeleton when true

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SkeletonField() {
  return (
    <div className="py-3.5 border-b border-slate-100 last:border-0 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 w-20 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-4 w-48 bg-slate-100 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

// ─── Info Row ─────────────────────────────────────────────────────────────────

function InfoRow({ icon, label, value, mono = false }) {
  return (
    <div className="py-3.5 border-b border-slate-100 last:border-0 flex items-start gap-3.5">
      {/* Icon bubble */}
      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none mb-1">
          {label}
        </p>
        <p
          className={`text-sm font-semibold text-slate-800 break-words ${
            mono ? "font-mono text-xs bg-slate-50 px-2 py-1 rounded-lg inline-block" : ""
          }`}
        >
          {value || <span className="text-slate-400 font-normal italic">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * ProfileInfoCard
 * @param {object}  profile    - Panchayath profile object from API
 * @param {boolean} isLoading  - Show skeleton state
 */
export default function ProfileInfoCard({ profile, isLoading }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white font-black text-lg shadow-sm flex-shrink-0">
          {isLoading ? (
            <div className="w-full h-full rounded-xl bg-blue-300 animate-pulse" />
          ) : (
            (profile?.panchayath_name || profile?.name || "P")
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join("")
          )}
        </div>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <>
              <div className="h-4 w-40 bg-slate-200 rounded-lg animate-pulse mb-1.5" />
              <div className="h-3 w-24 bg-slate-100 rounded-lg animate-pulse" />
            </>
          ) : (
            <>
              <h3 className="text-base font-black text-slate-900 leading-tight truncate">
                {profile?.panchayath_name || profile?.name || "Panchayath"}
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Panchayath Authority Account
              </p>
            </>
          )}
        </div>

        {/* Gov badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 flex-shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-blue-600">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
            />
          </svg>
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
            Official
          </span>
        </div>
      </div>

      {/* Fields */}
      <div className="px-6 divide-y divide-slate-50">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonField key={i} />)
        ) : (
          <>
            <InfoRow
              label="Registered Name"
              value={profile?.panchayath_name || profile?.name}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
                  />
                </svg>
              }
            />
            <InfoRow
              label="Email Address"
              value={profile?.email}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              }
            />
            <InfoRow
              label="Phone Number"
              value={profile?.phone || profile?.phone_number}
              mono
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              }
            />
            <InfoRow
              label="Office Address"
              value={profile?.address || profile?.office_address}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              }
            />
            <InfoRow
              label="Registration Date"
              value={formatDate(profile?.registered_at || profile?.created_at || profile?.date_joined)}
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-blue-600">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              }
            />
          </>
        )}
      </div>
    </div>
  );
}