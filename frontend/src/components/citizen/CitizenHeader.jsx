// citizen/layout/CitizenHeader.jsx
import { useState } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";

export default function CitizenHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  const getUser = () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) return { name: "Citizen", initials: "C" };
      const payload = JSON.parse(atob(token.split(".")[1]));
      const name = payload.name || payload.username || "Citizen";
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      return { name, initials };
    } catch {
      return { name: "Citizen", initials: "C" };
    }
  };

  const user = getUser();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center px-6 gap-4">
      <div className="w-64 flex-shrink-0" />
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search issues, wards, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 border border-transparent focus:outline-none focus:border-indigo-300 focus:bg-white transition-all duration-150"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-auto">
        <button className="relative w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-indigo-50 transition-colors group">
          <Bell className="w-4 h-4 text-gray-500 group-hover:text-indigo-600 transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors group">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            {user.initials}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {user.name}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
}