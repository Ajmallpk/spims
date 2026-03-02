import { useState, useEffect, useRef } from "react";

export default function SearchBar({ value, onChange, placeholder = "Search citizens by name, email or phone…" }) {
  const [localValue, setLocalValue] = useState(value ?? "");
  const timerRef = useRef(null);

  // Sync if parent resets value
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, 500);
  };

  const handleClear = () => {
    setLocalValue("");
    clearTimeout(timerRef.current);
    onChange("");
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Icon */}
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
        </svg>
      </span>

      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-xl shadow-sm
          text-gray-700 placeholder-gray-400 outline-none
          focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
      />

      {/* Clear */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}