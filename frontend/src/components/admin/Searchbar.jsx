import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar
 * Props:
 *  - onSearch: (query: string) => void  — called after 500ms debounce
 *  - placeholder: string
 *  - initialValue: string
 */
const SearchBar = ({ onSearch, placeholder = "Search…", initialValue = "" }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  const handleClear = () => {
    setValue("");
    onSearch("");
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={16}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-9 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-150"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-150"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;