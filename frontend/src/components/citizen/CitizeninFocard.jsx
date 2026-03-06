// citizen/components/CitizenInfoCard.jsx
import { User, Mail, Phone, Building2, Calendar } from "lucide-react";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-indigo-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">
          {value || <span className="text-gray-400 font-normal italic">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function CitizenInfoCard({ profile, loading }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-36" />
            <div className="h-3 bg-gray-100 rounded w-24" />
          </div>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-3 py-3 border-b border-gray-50">
            <div className="w-8 h-8 bg-gray-100 rounded-lg" />
            <div className="space-y-1.5 flex-1">
              <div className="h-2.5 bg-gray-100 rounded w-16" />
              <div className="h-3.5 bg-gray-200 rounded w-32" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const initials = (profile?.full_name || profile?.name || "C")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-white rounded-xl shadow-md p-5">
      {/* Avatar header */}
      <div className="flex items-center gap-3 pb-4 mb-1 border-b border-gray-100">
        <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {initials}
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {profile?.full_name || profile?.name || "—"}
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Citizen Account</p>
        </div>
      </div>

      <InfoRow icon={Mail} label="Email" value={profile?.email} />
      <InfoRow icon={Phone} label="Phone" value={profile?.phone} />
      <InfoRow icon={Building2} label="Ward" value={profile?.ward_name || profile?.ward} />
      <InfoRow
        icon={Calendar}
        label="Member Since"
        value={formatDate(profile?.date_joined || profile?.created_at)}
      />
    </div>
  );
}