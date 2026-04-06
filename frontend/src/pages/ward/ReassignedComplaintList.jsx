import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance"; // adjust path as needed
import ComplaintCard from "../../components/ward/ComplaintCard";

const ReassignedComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosInstance.get("/ward/reassigned-complaints/");
        // Filter for PENDING status on the client side as a safety net
        const pending = (response.data?.results || response.data || []).filter(
          (c) => c.status?.toUpperCase() === "PENDING"
        );
        setComplaints(pending);
      } catch (err) {
        console.error("Failed to fetch reassigned complaints:", err);
        setError("Failed to load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // ── Loading State ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Loading reassigned complaints...</p>
        </div>
      </div>
    );
  }

  // ── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-1">Something went wrong</p>
          <p className="text-xs text-gray-400 mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // ── Main Render ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span>Ward</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600">Reassigned Complaints</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reassigned Complaints</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Complaints pending action after reassignment
              </p>
            </div>
            {/* Count Pill */}
            {complaints.length > 0 && (
              <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-medium px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                {complaints.length} Pending
              </span>
            )}
          </div>
        </div>

        {/* Empty State */}
        {complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-700 mb-1">No reassigned complaints</p>
            <p className="text-sm text-gray-400">
              There are no pending complaints at the moment.
            </p>
          </div>
        ) : (
          /* Complaint Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                navigateTo={`/ward/reassigned-complaints/${complaint.id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReassignedComplaintList;