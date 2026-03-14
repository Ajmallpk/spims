import StatusBadge from "@/components/ward/StatusBadge";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-gray-800 break-words">{value ?? "—"}</span>
    </div>
  );
}

export default function CitizenInfoCard({ citizen }) {
  if (!citizen) return null;

  const name = citizen.full_name ?? citizen.name ?? "Unknown";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header strip */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-teal-400" />

      <div className="p-6 space-y-6">
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate">{name}</h3>
            <p className="text-sm text-gray-500 truncate">{citizen.email ?? "—"}</p>
            <div className="mt-1.5">
              <StatusBadge status={citizen.status ?? "approved"} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-gray-100" />

        {/* Detail Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          <InfoRow label="Full Name" value={citizen.full_name ?? citizen.name} />
          <InfoRow label="Email" value={citizen.email} />
          <InfoRow label="Phone" value={citizen.phone ?? citizen.mobile} />
          <InfoRow label="Joined Date" value={formatDate(citizen.joined_at ?? citizen.created_at)} />
          <div className="sm:col-span-2">
            {/* <InfoRow label="Address" value={citizen.address} /> */}
          </div>
          {/* <InfoRow label="Verification ID" value={citizen.verification_id ?? citizen.id_proof_number} /> */}
          {/* <InfoRow label="Ward" value={citizen.ward_name ?? citizen.ward} /> */}
        </div>
      </div>
    </div>
  );
}