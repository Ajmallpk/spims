import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import StatusBadge from "@/components/admin/Statusbadge";
import RejectReasonSection from "@/components/admin/Rejectreasonsection";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("access")}`,
});

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
      {label}
    </p>
    <p className="text-sm text-gray-800 font-medium break-words">
      {value || "—"}
    </p>
  </div>
);

const PanchayathApprovalModal = ({ request, onClose, onSuccess }) => {
  const [showRejectSection, setShowRejectSection] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [reasonError, setReasonError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && !isSubmitting) onClose();
    },
    [isSubmitting, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Reset reject section when request changes
  useEffect(() => {
    setShowRejectSection(false);
    setRejectReason("");
    setReasonError(null);
  }, [request?.id]);

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(
        `/api/admin/approve-panchayath/${request.id}/`,
        {},
        { headers: getAuthHeaders() }
      );
      onSuccess("Panchayath approved successfully.");
      onClose();
    } catch (err) {
      console.error("Error approving panchayath:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (rejectReason.trim().length < 10) {
      setReasonError("Reason must be at least 10 characters.");
      return;
    }
    setReasonError(null);
    setIsSubmitting(true);
    try {
      await axios.post(
        `/api/admin/reject-panchayath/${request.id}/`,
        { reason: rejectReason.trim() },
        { headers: getAuthHeaders() }
      );
      onSuccess("Panchayath registration rejected.");
      onClose();
    } catch (err) {
      console.error("Error rejecting panchayath:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!request) return null;

  const isPending =
    !request.status || request.status.toLowerCase() === "pending";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backdropFilter: "blur(4px)", backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      {/* Modal */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Verification Request Details
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Review and take action on this registration
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors duration-150 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-medium">Current Status:</span>
            <StatusBadge status={request.status || "Pending"} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
            <DetailRow label="Panchayath Name" value={request.panchayath_name} />
            <DetailRow label="Email" value={request.email} />
            <DetailRow label="Phone" value={request.phone} />
            <DetailRow label="License Number" value={request.license_number} />
            <DetailRow
              label="Submitted Date"
              value={formatDate(request.submitted_date || request.created_at)}
            />
            <DetailRow label="Office Address" value={request.office_address} />
          </div>

          {/* Document Preview */}
          {request.document_url && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Uploaded Document
              </p>
              {/\.(jpg|jpeg|png|gif|webp)$/i.test(request.document_url) ? (
                <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                  <img
                    src={request.document_url}
                    alt="Verification Document"
                    className="w-full max-h-64 object-contain"
                  />
                </div>
              ) : (
                <a
                  href={request.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition-colors duration-150"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  </svg>
                  View Uploaded Document
                </a>
              )}
            </div>
          )}

          {/* Reject Reason Section */}
          {showRejectSection && (
            <RejectReasonSection
              value={rejectReason}
              onChange={(val) => {
                setRejectReason(val);
                if (reasonError && val.trim().length >= 10) setReasonError(null);
              }}
              error={reasonError}
            />
          )}
        </div>

        {/* Footer Actions */}
        {isPending && (
          <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50">
            {!showRejectSection ? (
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowRejectSection(true)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors duration-150 disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors duration-150 disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Approving…
                    </>
                  ) : (
                    "Approve"
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectSection(false);
                    setRejectReason("");
                    setReasonError(null);
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-150 disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-150 disabled:opacity-60 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Rejecting…
                    </>
                  ) : (
                    "Confirm Rejection"
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PanchayathApprovalModal;