import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CitizenStatsGrid from "@/components/ward/Citizenstatsgrid";
import CitizenInfoCard from "@/components/ward/Citizeninfocard";
import ComplaintHistoryTable from "@/components/ward/Complainthistorytable";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";


export default function CitizenDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [citizenData, setCitizenData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchCitizenDetails();
  }, [id]);

  const fetchCitizenDetails = async () => {
    try {
      setIsLoading(true);
      setNotFound(false);
      const res = await wardapi.getCitizenDetails(id);
      setCitizen(res.data);
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setCitizenData(data);
    } catch (err) {
      toast.error("Failed to fetch citizen details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Not Found State ──────────────────────────────────────────────────────────
  if (!isLoading && notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <p className="text-base font-bold text-gray-700">Citizen not found</p>
        <p className="text-sm text-gray-400">This citizen record may have been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const stats = citizenData?.stats ?? citizenData;
  const citizen = citizenData?.citizen ?? citizenData;
  const complaints = citizenData?.complaints ?? [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-700 shadow-sm transition-colors flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            {isLoading ? (
              <div className="space-y-1.5">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-44" />
                <div className="h-3.5 bg-gray-100 rounded animate-pulse w-32" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-gray-900">
                  {citizen?.full_name ?? citizen?.name ?? "Citizen Details"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Detailed profile and complaint history
                </p>
              </>
            )}
          </div>
        </div>

        {/* Refresh */}
        <button
          onClick={fetchCitizenDetails}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600
            bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors
            disabled:opacity-50 flex-shrink-0"
        >
          <svg
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <CitizenStatsGrid stats={stats} isLoading={isLoading} />

      {/* Two-column layout on large screens: Info Card | Complaint Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Info Card — 1 col */}
        <div className="xl:col-span-1">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4 animate-pulse h-80">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    <div className="h-3.5 bg-gray-200 rounded w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <CitizenInfoCard citizen={citizen} />
          )}
        </div>

        {/* Complaint History — 2 cols */}
        <div className="xl:col-span-2">
          <ComplaintHistoryTable complaints={complaints} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}