/**
 * CitizenInfoCard.jsx
 * Displays citizen profile details on the verification page.
 * Props:
 *   profile: object from GET /api/citizen/profile/
 *   loading: boolean
 */

const Field = ({ label, value }) => (
  <div className="space-y-0.5">
    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</p>
    <p className="text-sm text-gray-800 font-medium">{value || "—"}</p>
  </div>
);

const SkeletonField = () => (
  <div className="space-y-1">
    <div className="h-2.5 w-16 bg-gray-100 rounded animate-pulse" />
    <div className="h-3.5 w-32 bg-gray-200 rounded animate-pulse" />
  </div>
);

const CitizenInfoCard = ({ profile, loading }) => {
  const initials = profile?.fullName
    ? profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "CZ";

  const registrationDate = profile?.registrationDate
    ? new Date(profile.registrationDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-5">
      {/* Avatar + name header */}
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 shadow-sm">
          {loading ? (
            <div className="w-6 h-6 rounded-full bg-teal-400 animate-pulse" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          {loading ? (
            <>
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
            </>
          ) : (
            <>
              <h3 className="font-bold text-gray-900 text-base leading-tight truncate">
                {profile?.fullName || "Citizen"}
              </h3>
              <p className="text-xs text-teal-600 font-medium mt-0.5">
                {profile?.wardName || "Unassigned Ward"}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Contact section */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Contact Information
        </p>
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3].map((n) => <SkeletonField key={n} />)
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-teal-500">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <Field label="Email" value={profile?.email} />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-teal-500">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" />
                  </svg>
                </div>
                <Field label="Phone" value={profile?.phone} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Address section */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Address Details
        </p>
        <div className="space-y-3">
          {loading ? (
            [1, 2, 3, 4].map((n) => <SkeletonField key={n} />)
          ) : (
            <>
              <Field label="House Number" value={profile?.houseNumber} />
              <Field label="Street Name" value={profile?.streetName} />
              <Field label="Ward" value={profile?.wardName} />
              <Field label="Full Address" value={profile?.address} />
            </>
          )}
        </div>
      </div>

      {/* Registration date */}
      {!loading && registrationDate && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Registered on {registrationDate}
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenInfoCard;