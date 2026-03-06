// citizen/components/LocationPicker.jsx
import { MapPin, Landmark, Link2 } from "lucide-react";

export default function LocationPicker({ value, onChange }) {
  const handleField = (field, fieldValue) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-3">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <MapPin className="w-4 h-4 text-indigo-500" />
        Location
      </label>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
        {/* Area name */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" /> Area Name
          </label>
          <input
            type="text"
            placeholder="e.g. Near Main Market, Palakkad Road..."
            value={value?.area || ""}
            onChange={(e) => handleField("area", e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-300 transition-all"
          />
        </div>

        {/* Landmark */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <Landmark className="w-3 h-3" /> Landmark
          </label>
          <input
            type="text"
            placeholder="e.g. Opposite to St. Mary's Church..."
            value={value?.landmark || ""}
            onChange={(e) => handleField("landmark", e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-300 transition-all"
          />
        </div>

        {/* Google Maps link */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
            <Link2 className="w-3 h-3" /> Google Maps Link
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://maps.google.com/..."
            value={value?.maps_link || ""}
            onChange={(e) => handleField("maps_link", e.target.value)}
            className="w-full px-3.5 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-300 transition-all"
          />
        </div>

        {/* Future map integration hint */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-[10px] text-gray-400 whitespace-nowrap">
            Interactive map coming soon
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>
    </div>
  );
}