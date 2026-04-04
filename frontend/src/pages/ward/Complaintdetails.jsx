import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ComplaintInfoCard from "@/components/ward/Complaintinfocard";
import CitizenPreviewCard from "@/components/ward/Citizenpreviewcard";
import ComplaintActionPanel from "@/components/ward/Complaintactionpanel";
import ResolveModal from "@/components/ward/Resolvemodal";
import EscalateModal from "@/components/ward/Escalatemodal";
import ChatPanel from "@/pages/ward/Chatpanel";
import wardapi from "@/service/wardurls";
import complaintapi from "@/service/complaintsurls";
import toast from "react-hot-toast";
import ComplaintTimeline from "@/components/ward/ComplaintTimeline";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [complaintData, setComplaintData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(""), 4500);
    return () => clearTimeout(t);
  }, [successMessage]);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      setNotFound(false);

      const res = await wardapi.getComplaintDetail(id);
      console.log("API RESPONSE 👉", res.data);
      setComplaintData(res.data);

    } catch (err) {
      if (err.response?.status === 404) {
        setNotFound(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccess = (msg) => {
    setSuccessMessage(msg);
    fetchDetails();
  };


  const handleStartWork = async () => {
    try {
      await complaintapi.updateComplaintStatus(id, {
        status: "IN_PROGRESS"
      });

      toast.success("Marked as In Progress");

      fetchDetails(); // refresh UI
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Normalize data shape
  const complaint = complaintData;
  const citizen = complaintData?.citizen ?? null;
  const isChatClosed = complaintData?.chat_closed ?? complaint?.chat_closed ?? false;
  const status = complaint?.status ?? "";
  console.log("COMPLAINT 👉", complaint);
  console.log("STATUS 👉", status);

  if (!isLoading && notFound) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636" />
          </svg>
        </div>
        <p className="text-base font-bold text-gray-700">Complaint not found</p>
        <button onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-colors flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            {isLoading ? (
              <div className="space-y-1.5">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-52" />
                <div className="h-3.5 bg-gray-100 rounded animate-pulse w-36" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-gray-900 truncate max-w-sm">
                  {complaint?.title ?? "Complaint Details"}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Complaint #{id}</p>
              </>
            )}
          </div>
        </div>
        <button onClick={fetchDetails} disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex-shrink-0">
          <svg className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Success Toast */}
      {successMessage && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl shadow-sm text-sm font-medium">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Complaint Info + Chat (2 cols) */}
        <div className="xl:col-span-2 space-y-5">
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse space-y-4 h-64">
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
              <div className="h-20 bg-gray-100 rounded" />
            </div>
          ) : (
            <ComplaintInfoCard complaint={complaint} />
          )}

          {!isLoading && <ComplaintTimeline complaintId={id} />}

          {/* Chat Panel */}
          {chatOpen && (
            <ChatPanel complaintId={id} isChatClosed={isChatClosed} />
          )}
        </div>

        {/* Right sidebar (1 col) */}
        <div className="space-y-4">
          {/* Action Panel */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse space-y-3 h-44">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <ComplaintActionPanel
              status={status}
              chatOpen={chatOpen}
              onResolve={() => setShowResolveModal(true)}
              onEscalate={() => setShowEscalateModal(true)}
              onStartWork={handleStartWork}
              onToggleChat={() => setChatOpen((v) => !v)}
            />
          )}

          {/* Citizen Preview */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-md p-6 animate-pulse space-y-3 h-40">
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ) : citizen ? (
            <CitizenPreviewCard citizen={citizen} />
          ) : null}
        </div>
      </div>

      {/* Modals */}
      {showResolveModal && (
        <ResolveModal
          complaintId={id}
          onClose={() => setShowResolveModal(false)}
          onSuccess={handleSuccess}
        />
      )}
      {showEscalateModal && (
        <EscalateModal
          complaintId={id}
          onClose={() => setShowEscalateModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}