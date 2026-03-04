// components/WardTable.jsx
// SPIMS – Smart Panchayath Issue Management System
// Responsive data table displaying approved ward records.
//
// Props:
//   wards      {Array}   - List of ward objects to render
//   isLoading  {boolean} - Show skeleton rows when true

import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/panjayath/StatusBadge";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {/* Avatar + name */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-200 animate-pulse flex-shrink-0" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-28 bg-slate-200 rounded-lg animate-pulse" />
            <div className="h-2.5 w-16 bg-slate-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </td>
      {[60, 48, 40, 36].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div
            className="h-3.5 bg-slate-200 rounded-lg animate-pulse"
            style={{ width: `${w}%` }}
          />
        </td>
      ))}
      {/* Badge skeleton */}
      <td className="px-5 py-4">
        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
      </td>
    </tr>
  );
}

// ─── Data Row ─────────────────────────────────────────────────────────────────

function WardRow({ ward }) {
  const navigate = useNavigate();
  const name = ward.ward_name || ward.name || "—";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <tr className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40 transition-colors duration-100 group">
      {/* Ward Name + Ward No */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0 text-blue-700 text-xs font-black border border-blue-200 shadow-sm">
            {initials || (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                />
              </svg>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-none group-hover:text-blue-700 transition-colors">
              {name}
            </p>
            {ward.ward_number && (
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Ward #{ward.ward_number}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="px-5 py-3.5">
        <span className="text-sm text-slate-600 font-medium">
          {ward.email || "—"}
        </span>
      </td>

      {/* Phone */}
      <td className="px-5 py-3.5">
        <span className="text-sm text-slate-600 font-mono text-xs tracking-wide">
          {ward.phone || ward.phone_number || "—"}
        </span>
      </td>

      {/* Joined Date */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            className="w-3.5 h-3.5 text-slate-400 flex-shrink-0"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          <span className="text-sm text-slate-600">
            {formatDate(ward.joined_at || ward.approved_at || ward.created_at)}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <StatusBadge status={ward.status || "APPROVED"} />
      </td>

      {/* View action */}
      <td className="px-5 py-3.5">
        <button
         onClick={() => navigate(`/panchayath/ward/${ward.id}`)}
          className="
            inline-flex items-center gap-1.5
            px-3 py-1.5
            rounded-lg
            bg-slate-100 hover:bg-blue-600
            text-slate-600 hover:text-white
            text-xs font-bold
            border border-slate-200 hover:border-blue-600
            transition-all duration-150
            group/btn
          "
          title={`View details for ${name}`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-3.5 h-3.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          View
        </button>
      </td>
    </tr>
  );
}

// ─── Main Table Component ─────────────────────────────────────────────────────

const COLUMNS = [
  { label: "Ward Name" },
  { label: "Email" },
  { label: "Phone" },
  { label: "Joined Date" },
  { label: "Status" },
  { label: "Action" },
];

/**
 * WardTable
 * @param {Array}   wards      - Array of ward objects
 * @param {boolean} isLoading  - Show skeleton rows when true
 */
export default function WardTable({ wards, isLoading }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[700px] border-collapse">
        {/* Header */}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            {COLUMNS.map((col) => (
              <th
                key={col.label}
                className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-slate-400 whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
            : wards.map((ward) => (
                <WardRow key={ward.id} ward={ward} />
              ))}
        </tbody>
      </table>
    </div>
  );
}