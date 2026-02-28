// components/WardSearchBar.jsx
// SPIMS – Smart Panchayath Issue Management System
// Debounced search bar for filtering wards by name or email.
//
// Props:
//   value       {string}   - Current search query (controlled from parent)
//   onChange    {Function} - Called with debounced value after 500ms delay
//   disabled    {boolean}  - Disable input during loading (optional)

import { useState, useEffect, useRef } from "react";

const DEBOUNCE_MS = 500;

export default function WardSearchBar({ value, onChange, disabled = false }) {
  // Local state drives the visible input; debounce propagates to parent
  const [localValue, setLocalValue] = useState(value ?? "");
  const debounceTimer = useRef(null);

  // If parent resets value (e.g. clear all), sync local state
  useEffect(() => {
    setLocalValue(value ?? "");
  }, [value]);

  const handleChange = (e) => {
    const raw = e.target.value;
    setLocalValue(raw);

    // Cancel any pending debounce
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      onChange(raw);
    }, DEBOUNCE_MS);
  };

  // Clear button
  const handleClear = () => {
    setLocalValue("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    onChange("");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const hasValue = localValue.length > 0;

  return (
    <div className="relative w-full max-w-sm">
      {/* Search icon */}
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`w-4 h-4 transition-colors duration-150 ${
            hasValue ? "text-blue-500" : "text-slate-400"
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Search ward by name or email..."
        autoComplete="off"
        spellCheck={false}
        className={`
          w-full
          pl-10 pr-9 py-2.5
          rounded-xl
          border
          text-sm text-slate-800
          placeholder:text-slate-400
          bg-white
          outline-none
          transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
          ${
            hasValue
              ? "border-blue-400 ring-1 ring-blue-200 shadow-sm"
              : "border-slate-300 hover:border-slate-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
          }
        `}
      />

      {/* Clear button — only visible when there's text */}
      {hasValue && (
        <button
          onClick={handleClear}
          disabled={disabled}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="w-3.5 h-3.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}