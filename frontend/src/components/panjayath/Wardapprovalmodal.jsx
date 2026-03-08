// components/WardApprovalModal.jsx
// SPIMS – Smart Panchayath Issue Management System
// Modal for reviewing a single ward verification request.
//
// Shows full ward details, uploaded documents.
// Approve  → POST /api/panchayath/approve-ward/{id}/
// Reject   → POST /api/panchayath/reject-ward/{id}/  { reason }
// On success: calls onSuccess() so parent can refresh list & show toast.

import { useState, useEffect, useRef } from "react";
import panchayathApi from "@/service/panchayathurls";
import RejectReasonSection from "@/components/panjayath/Rejectreasonsection";
import StatusBadge from "@/components/panjayath/StatusBadge";
import toast from "react-hot-toast";
// ─── Helpers ─────────────────────────────────────────────────────────────────



function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Detail Row ───────────────────────────────────────────────────────────────
function DetailRow({ label, value, mono = false }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 sm:w-36 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span
        className={`text-sm text-slate-800 font-medium flex-1 break-words ${mono ? "font-mono text-xs bg-slate-50 px-2 py-1 rounded-lg" : ""
          }`}
      >
        {value || <span className="text-slate-400 font-normal">—</span>}
      </span>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────
function DocumentCard({ doc, index }) {
  const filename =
    typeof doc === "string"
      ? doc.split("/").pop()
      : doc?.name || `Document ${index + 1}`;
  const url = typeof doc === "string" ? doc : doc?.file || doc?.url;
  const ext = filename.split(".").pop()?.toLowerCase();

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPdf = ext === "pdf";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all duration-150 group"
    >
      {/* Icon */}
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isPdf
          ? "bg-rose-100 text-rose-600"
          : isImage
            ? "bg-blue-100 text-blue-600"
            : "bg-slate-200 text-slate-500"
          }`}
      >
        {isPdf ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
          </svg>
        ) : isImage ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
          </svg>
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-700 truncate group-hover:text-blue-700 transition-colors">
          {filename}
        </p>
        <p className="text-[10px] text-slate-400 uppercase mt-0.5">{ext} file</p>
      </div>

      {/* Open icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors flex-shrink-0"
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
        />
      </svg>
    </a>
  );
}

// ─── Main Modal Component ─────────────────────────────────────────────────────
/**
 * WardApprovalModal
 *
 * @param {object}   ward        - Full ward verification request object
 * @param {Function} onClose     - Called to close the modal
 * @param {Function} onSuccess   - Called after successful approve/reject (refresh + toast)
 */
export default function WardApprovalModal({ ward, onClose, onSuccess }) {
  const [wardDetail, setWardDetail] = useState(null);
  const [showRejectSection, setShowRejectSection] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectError, setRejectError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const modalRef = useRef(null);


  useEffect(() => {
    const fetchWardDetail = async () => {
      try {
        const res = await panchayathApi.wardDetail(ward.id);
        setWardDetail(res.data);
      } catch (err) {
        console.error("Failed to load ward details", err);
      }
    };

    fetchWardDetail();
  }, [ward.id]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, isSubmitting]);

  // Trap focus — close when clicking backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    };
  }

  // ── Approve ────────────────────────────────────────────────────────────────
  const handleApprove = async () => {
    if (isSubmitting) return;
    setApiError("");
    setIsSubmitting(true);
    try {
      await panchayathApi.approveWard(ward.id);
      onSuccess("approved");
      onClose();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized: JWT may be expired.");
      }
      setApiError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to approve ward. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Reject ─────────────────────────────────────────────────────────────────
  const handleRejectClick = () => {
    setShowRejectSection(true);
    setRejectError("");
    setApiError("");
  };

  const handleRejectSubmit = async () => {
    if (isSubmitting) return;
    if (rejectReason.trim().length < 10) {
      setRejectError("Rejection reason must be at least 10 characters.");
      return;
    }
    if (rejectReason.length > 500) {
      setRejectError("Rejection reason must not exceed 500 characters.");
      return;
    }

    setRejectError("");
    setApiError("");
    setIsSubmitting(true);

    try {
      await panchayathApi.rejectWard(ward.id, rejectReason.trim());
      onSuccess("rejected");
      onClose();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized: JWT may be expired.");
      }
      setApiError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to reject ward. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const documents = (wardDetail?.documents || []).filter(Boolean);
  const isPending = (ward.status || "").toUpperCase() === "PENDING";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ── */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                  />
                </svg>
              </div>
              <div>
                <h2
                  id="modal-title"
                  className="text-base font-black text-slate-900 tracking-tight leading-none"
                >
                  Ward Verification Request
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Review details and take action</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Status row */}
          <div className="flex items-center justify-between">
            <StatusBadge status={ward.status} />
            <span className="text-xs text-slate-400 font-medium">
              ID: <span className="font-bold text-slate-600">#{ward.id}</span>
            </span>
          </div>

          {/* Ward details card */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-1 divide-y divide-slate-100">
            <DetailRow label="Ward Name" value={ward.ward_name} />
            <DetailRow label="Officer Name" value={wardDetail?.officer_name} />
            <DetailRow label="Email" value={wardDetail?.email} />
            <DetailRow label="Phone" value={wardDetail?.phone} />
            <DetailRow label="Address" value={wardDetail?.address} />
            <DetailRow
              label="Submitted"
              value={formatDate(wardDetail?.submitted_at || ward.created_at)}
            />
            {ward.rejection_reason && (
              <DetailRow
                label="Prev. Rejection"
                value={ward.rejection_reason}
              />
            )}
          </div>

          {/* Documents */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Uploaded Documents
            </p>
            {documents.length > 0 ? (
              <div className="space-y-2">
                {documents.map((doc, i) => (
                  <DocumentCard key={i} doc={doc} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-slate-50 border border-slate-200">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  className="w-4 h-4 text-slate-400"
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
                <span className="text-xs text-slate-400 font-medium">No documents uploaded.</span>
              </div>
            )}
          </div>

          {/* Reject reason section */}
          {showRejectSection && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 px-4 pt-4 pb-4">
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                  />
                </svg>
                Rejection Details
              </p>
              <RejectReasonSection
                value={rejectReason}
                onChange={(val) => {
                  setRejectReason(val);
                  if (rejectError) setRejectError("");
                }}
                error={rejectError}
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* API error */}
          {apiError && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                />
              </svg>
              <p className="text-sm text-rose-700 font-medium">{apiError}</p>
            </div>
          )}
        </div>

        {/* ── Footer / Actions ── */}
        {isPending && (
          <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4">
            {!showRejectSection ? (
              /* Initial action row */
              <div className="flex gap-3">
                <button
                  onClick={handleRejectClick}
                  disabled={isSubmitting}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    px-4 py-2.5 rounded-xl
                    border border-rose-200
                    bg-rose-50 hover:bg-rose-100
                    text-rose-700 text-sm font-bold
                    transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    px-4 py-2.5 rounded-xl
                    bg-emerald-600 hover:bg-emerald-700
                    text-white text-sm font-bold
                    shadow-sm shadow-emerald-200
                    transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                      </svg>
                      Processing…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      Approve Ward
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Reject confirmation row */
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectSection(false);
                    setRejectReason("");
                    setRejectError("");
                    setApiError("");
                  }}
                  disabled={isSubmitting}
                  className="
                    flex-1 px-4 py-2.5 rounded-xl
                    border border-slate-200
                    text-slate-600 text-sm font-semibold
                    hover:bg-slate-50
                    transition-colors duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={isSubmitting}
                  className="
                    flex-1 flex items-center justify-center gap-2
                    px-4 py-2.5 rounded-xl
                    bg-rose-600 hover:bg-rose-700
                    text-white text-sm font-bold
                    shadow-sm shadow-rose-200
                    transition-all duration-150
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                      Confirm Rejection
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Non-pending close button */}
        {!isPending && (
          <div className="flex-shrink-0 border-t border-slate-100 px-6 py-4">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold transition-colors duration-150"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}