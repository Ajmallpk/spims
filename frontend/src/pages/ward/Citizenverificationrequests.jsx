import { useState, useEffect, useCallback } from "react";
import CitizenVerificationTable from "../components/CitizenVerificationTable";
import CitizenApprovalModal from "../components/CitizenApprovalModal";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function CitizenVerificationRequests() {
  const token = localStorage.getItem("access");

  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCitizen, setSelectedCitizen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchVerifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE}/api/ward/citizen-verifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : (data.results ?? []));
    } catch (err) {
      console.error("Failed to fetch citizen verifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  // Auto-dismiss success message
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleView = (citizen) => {
    setSelectedCitizen(citizen);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCitizen(null);
  };

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    fetchVerifications();
  };

  // Stats derived from requests
  const stats = {
    total: requests.length,
    pending: requests.filter((r) => (r.status ?? "pending").toLowerCase() === "pending").length,
    approved: requests.filter((r) => (r.status ?? "").toLowerCase() === "approved").length,
    rejected: requests.filter((r) => (r.status ?? "").toLowerCase() === "rejected").length,
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Citizen Verification Requests
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Approve or reject citizen registrations under your ward
          </p>
        </div>

        <button
          onClick={fetchVerifications}
          disabled={isLoading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm transition-colors disabled:opacity-50"
        >
          <svg
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Refresh
        </button>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm text-sm font-medium animate-fade-in">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Quick Stats Bar */}
      {!isLoading && requests.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
            { label: "Pending", value: stats.pending, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
            { label: "Approved", value: stats.approved, color: "text-green-700", bg: "bg-green-50 border-green-200" },
            { label: "Rejected", value: stats.rejected, color: "text-red-700", bg: "bg-red-50 border-red-200" },
          ].map((s) => (
            <div
              key={s.label}
              className={`${s.bg} border rounded-xl px-4 py-3 flex items-center justify-between`}
            >
              <span className={`text-xs font-semibold ${s.color} opacity-70`}>{s.label}</span>
              <span className={`text-xl font-extrabold ${s.color}`}>{s.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Table */}
      <CitizenVerificationTable
        requests={requests}
        isLoading={isLoading}
        onView={handleView}
      />

      {/* Modal */}
      {isModalOpen && selectedCitizen && (
        <CitizenApprovalModal
          citizen={selectedCitizen}
          onClose={handleModalClose}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}