// citizen/components/WardSelector.jsx
import { useState, useEffect } from "react";
import { Building2, ChevronDown, Loader2 } from "lucide-react";

export default function WardSelector({ value, onChange, error }) {
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await fetch("/api/public/wards/");
        if (!res.ok) throw new Error("Failed to load wards");
        const data = await res.json();
        setWards(data.results || data);
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWards();
  }, []);

  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <Building2 className="w-4 h-4 text-indigo-500" />
        Ward <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        {loading ? (
          <div className="flex items-center gap-2 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading wards...
          </div>
        ) : fetchError ? (
          <div className="w-full px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-500">
            {fetchError} — <button
              type="button"
              onClick={() => window.location.reload()}
              className="underline"
            >retry</button>
          </div>
        ) : (
          <>
            <select
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={[
                "w-full appearance-none px-4 py-2.5 bg-white border rounded-xl text-sm transition-all duration-150 focus:outline-none pr-10",
                error
                  ? "border-red-300 focus:border-red-400 text-gray-700"
                  : value
                  ? "border-indigo-300 focus:border-indigo-400 text-gray-900"
                  : "border-gray-200 focus:border-indigo-300 text-gray-400",
              ].join(" ")}
            >
              <option value="">Select your ward...</option>
              {wards.map((ward) => (
                <option key={ward.id || ward.value} value={ward.id || ward.value}>
                  {ward.name || ward.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
          {error}
        </p>
      )}
    </div>
  );
}