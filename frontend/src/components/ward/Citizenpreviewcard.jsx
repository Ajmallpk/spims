import { useNavigate } from "react-router-dom";

export default function CitizenPreviewCard({ citizen }) {
  const navigate = useNavigate();
  if (!citizen) return null;
  const name = citizen.full_name ?? citizen.name ?? "Unknown";
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Citizen Details</h3>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-500 truncate mt-0.5">{citizen.email ?? "—"}</p>
        </div>
      </div>
      <div className="space-y-2 pt-1 border-t border-gray-50">
        {[
          { label: "Phone", value: citizen.phone ?? citizen.mobile ?? "—" },
          { label: "Ward",  value: citizen.ward_name ?? citizen.ward ?? "—" },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-xs text-gray-400 font-medium">{label}</span>
            <span className="text-xs text-gray-700 font-semibold">{value}</span>
          </div>
        ))}
      </div>
      {citizen.id && (
        <button onClick={() => navigate("/ward/citizens/" + citizen.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl transition-colors">
          View Full Profile
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}