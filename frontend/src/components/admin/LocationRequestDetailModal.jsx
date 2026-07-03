import {
  X,
  MapPin,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";

export default function LocationRequestDetailModal({
  open,
  onClose,
  request,
  onComplete,
  onHold,
  onReject,
}) {
  if (!open || !request) return null;

  const statusColor = {
    PENDING: "bg-yellow-100 text-yellow-700",
    HOLD: "bg-orange-100 text-orange-700",
    COMPLETED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b p-5">

          <div>

            <h2 className="text-2xl font-bold">
              Location Request
            </h2>

            <p className="text-gray-500 text-sm">
              Review location request details
            </p>

          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>

        </div>

        <div className="p-6 space-y-6">

          {/* User */}

          <div className="grid grid-cols-2 gap-6">

            <div>

              <div className="flex items-center gap-2 mb-2">

                <User size={18} />

                <h3 className="font-semibold">
                  Requested By
                </h3>

              </div>

              <p>{request.requested_by}</p>

              <p className="text-sm text-gray-500">
                {request.role}
              </p>

            </div>

            <div>

              <div className="flex items-center gap-2 mb-2">

                <Calendar size={18} />

                <h3 className="font-semibold">
                  Requested On
                </h3>

              </div>

              <p>{request.created_at}</p>

            </div>

          </div>

          <hr />

          {/* Type */}

          <div>

            <h3 className="font-semibold mb-2">
              Request Type
            </h3>

            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">

              {request.request_type}

            </span>

          </div>

          {/* Location */}

          <div>

            <div className="flex items-center gap-2 mb-3">

              <MapPin size={18} />

              <h3 className="font-semibold">

                Requested Location

              </h3>

            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2">

              <p>

                <strong>District :</strong>{" "}

                {request.district_name || "-"}

              </p>

              <p>

                <strong>Panchayath :</strong>{" "}

                {request.panchayath_name || "-"}

              </p>

              <p>

                <strong>Ward :</strong>{" "}

                {request.ward_number || "-"}

                {request.ward_name &&
                  ` (${request.ward_name})`}

              </p>

            </div>

          </div>

          {/* Message */}

          <div>

            <div className="flex items-center gap-2 mb-2">

              <MessageSquare size={18} />

              <h3 className="font-semibold">

                Request Message

              </h3>

            </div>

            <div className="bg-gray-50 rounded-lg p-4">

              {request.message || "No message"}

            </div>

          </div>

          {/* Status */}

          <div>

            <h3 className="font-semibold mb-2">

              Status

            </h3>

            <span
              className={`px-4 py-2 rounded-full font-medium ${statusColor[request.status]}`}
            >
              {request.status}
            </span>

          </div>

          {/* Admin Note */}

          {request.admin_note && (

            <div>

              <h3 className="font-semibold mb-2">

                Admin Note

              </h3>

              <div className="bg-gray-50 p-4 rounded-lg">

                {request.admin_note}

              </div>

            </div>

          )}

        </div>

        {request.status === "PENDING" && (

          <div className="border-t p-5 flex justify-end gap-3">

            <button
              onClick={() => onComplete(request.id)}
              className="bg-green-600 text-white px-5 py-2 rounded-lg"
            >
              Complete
            </button>

            <button
              onClick={() => onHold(request.id)}
              className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
            >
              Hold
            </button>

            <button
              onClick={() => onReject(request.id)}
              className="bg-red-600 text-white px-5 py-2 rounded-lg"
            >
              Reject
            </button>

          </div>

        )}

      </div>

    </div>
  );
}