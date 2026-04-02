const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "WATER", label: "Water" },
  { value: "ROAD", label: "Road" },
  { value: "ELECTRICITY", label: "Electricity" },
  { value: "WASTE", label: "Waste Management" },
  { value: "OTHER", label: "Other" },
];

export default function ComplaintFilter({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
        </svg>
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm
          text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100
          appearance-none cursor-pointer transition-all duration-150 min-w-[180px]"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>{cat.label}</option>
        ))}
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
}