import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import VerificationTable from "@/components/admin/Verificationtable";
import PanchayathApprovalModal from "@/components/admin/Panchayathapprovalmodal";
import { ClipboardCheck, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { adminapi } from "@/service/adminurls";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";




const PanchayathVerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [toast, setToast] = useState(null); // { message, type }

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminapi.panchayathVerificationList()
      setRequests(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      // toast.error("Error fetching panchayath verifications");
      handleApiError(err, "Error fetching panchayath verifications");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleView = async (req) => {
    try {
      const { data } = await adminapi.getVerificationDetail(req.id);
      setSelectedRequest(data);
      setIsModalOpen(true);
    } catch (error) {
      // toast.error("Error fetching verification detail");
      handleApiError(err, "Error fetching verification detail");
      console.error(error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleActionSuccess = (message) => {
    toast.success(message);
    fetchRequests();
  };

  // Stats summary
  const pending = requests.filter(
    (r) => !r.status || r.status.toLowerCase() === "pending"
  ).length;
  const approved = requests.filter(
    (r) => r.status?.toLowerCase() === "approved"
  ).length;
  const rejected = requests.filter(
    (r) => r.status?.toLowerCase() === "rejected"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-blue-100 rounded-xl mt-0.5">
            <ClipboardCheck className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Panchayath Verification Requests
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Approve or reject Panchayath authority registrations
            </p>
          </div>
        </div>

        <button
          onClick={fetchRequests}
          disabled={loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Summary Pills */}
      {!loading && requests.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-yellow-500" />
            {pending} Pending
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            {approved} Approved
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            {rejected} Rejected
          </div>
        </div>
      )}

      {/* Table */}
      <VerificationTable
        requests={requests}
        isLoading={loading}
        onView={handleView}
      />

      {/* Modal */}
      {isModalOpen && selectedRequest && (
        <PanchayathApprovalModal
          request={selectedRequest}
          onClose={handleModalClose}
          onSuccess={handleActionSuccess}
        />
      )}

      

    </div>
  );
};

export default PanchayathVerificationRequests;