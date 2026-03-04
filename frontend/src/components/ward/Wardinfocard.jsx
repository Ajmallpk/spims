function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-sm leading-none">{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5 break-words leading-snug">
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <div className="flex gap-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-100 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1.5 pt-0.5">
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
        <div className="h-3.5 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

export default function WardInfoCard({ profile, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="h-1.5 bg-gray-200 animate-pulse" />
        <div className="p-6 space-y-5 animate-pulse">
          {/* Avatar skeleton */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-5 bg-gray-100 rounded-full w-24" />
            </div>
          </div>
          <hr className="border-gray-100" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const name = profile.ward_name ?? profile.name ?? "Ward Officer";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-teal-400" />

      <div className="p-6 space-y-5">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">{name}</h2>
            <p className="text-xs text-gray-500 truncate mt-0.5">{profile.email ?? "—"}</p>
            <span className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Ward Officer
            </span>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Info rows */}
        <div className="space-y-4">
          <InfoRow icon="🏘️" label="Ward Name"       value={profile.ward_name} />
          <InfoRow icon="🏛️" label="Panchayath"      value={profile.panchayath_name} />
          <InfoRow icon="✉️" label="Email"           value={profile.email} />
          <InfoRow icon="📱" label="Phone"           value={profile.phone ?? profile.mobile} />
          <InfoRow icon="📍" label="Address"         value={profile.address} />
          <InfoRow icon="📅" label="Registered On"   value={formatDate(profile.created_at ?? profile.registered_at)} />
        </div>
      </div>
    </div>
  );
}