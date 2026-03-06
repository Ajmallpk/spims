import { useState } from "react";
import StatusBadge from "@/components/ward/StatusBadge";
import RejectReasonSection from "@/components/ward/RejectReasonSection";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-800 font-medium break-words">{value ?? "—"}</span>
    </div>
  );
}

export default function CitizenApprovalModal({ citizen, onClose, onSuccess }) {


  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPending = (citizen?.status ?? "pending").toLowerCase() === "pending";

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await wardapi.approveCitizen(citizen.id);
      onSuccess("Citizen verification approved successfully.");
      onClose();
    } catch (err) {
      toast.error("Approve citizen error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (rejectReason.trim().length < 10) {
      setRejectError("Reason must be at least 10 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      await wardapi.rejectCitizen(citizen.id, rejectReason.trim());
      onSuccess("Citizen verification rejected.");
      onClose();
    } catch (err) {
      toast.error("Reject citizen error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectReasonChange = (val) => {
    setRejectReason(val);
    if (rejectError && val.trim().length >= 10) setRejectError("");
  };

  if (!citizen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Citizen Verification Request</h2>
            <p className="text-xs text-gray-400 mt-0.5">Review details and take action</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <svg className="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Citizen Avatar + Status */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {(citizen.full_name ?? citizen.name ?? "?")[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-gray-900 truncate">
                {citizen.full_name ?? citizen.name ?? "—"}
              </p>
              <p className="text-xs text-gray-500 truncate mt-0.5">{citizen.email ?? "—"}</p>
            </div>
            <StatusBadge status={citizen.status} />
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow label="Full Name" value={citizen.full_name ?? citizen.name} />
            <DetailRow label="Email" value={citizen.email} />
            <DetailRow label="Phone" value={citizen.phone ?? citizen.mobile} />
            <DetailRow label="Submitted Date" value={formatDate(citizen.submitted_at ?? citizen.created_at)} />
            <div className="col-span-2">
              <DetailRow label="Address" value={citizen.address} />
            </div>
          </div>

          {/* ID Proof */}
          {citizen.id_proof && (
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">ID Proof</span>
              <a
                href={citizen.id_proof}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-sm font-medium text-blue-700 transition-colors w-fit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                View ID Proof Document
              </a>
            </div>
          )}

          {/* Reject Reason Section */}
          {showReject && (
            <div className="pt-1 border-t border-red-100">
              <RejectReasonSection
                value={rejectReason}
                onChange={handleRejectReasonChange}
                error={rejectError}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {isPending && (
          <div className="px-6 py-4 border-t border-gray-100 flex-shrink-0 bg-gray-50/60">
            {!showReject ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReject(true)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Approving…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowReject(false); setRejectReason(""); setRejectError(""); }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Rejecting…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Confirm Rejection
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}