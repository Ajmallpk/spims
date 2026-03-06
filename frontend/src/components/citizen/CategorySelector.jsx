// citizen/components/CategorySelector.jsx
import { Tag } from "lucide-react";

const CATEGORIES = [
  { value: "road_damage", label: "Road Damage", emoji: "🛣️" },
  { value: "water_leakage", label: "Water Leakage", emoji: "💧" },
  { value: "garbage", label: "Garbage", emoji: "🗑️" },
  { value: "electricity", label: "Electricity", emoji: "⚡" },
  { value: "drainage", label: "Drainage", emoji: "🚰" },
  { value: "other", label: "Other", emoji: "📌" },
];

export default function CategorySelector({ value, onChange, error }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
        <Tag className="w-4 h-4 text-indigo-500" />
        Category <span className="text-red-500">*</span>
      </label>

      {/* Visual card grid */}
      <div className="grid grid-cols-3 gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={[
              "flex flex-col items-center justify-center gap-1.5 px-2 py-3 rounded-xl border-2 text-xs font-medium transition-all duration-150",
              value === cat.value
                ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-200 hover:bg-indigo-50/50",
            ].join(" ")}
          >
            <span className="text-xl leading-none">{cat.emoji}</span>
            <span className="text-center leading-tight">{cat.label}</span>
          </button>
        ))}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
}