// import {
//   X,
//   MapPin,
//   User,
//   Calendar,
//   MessageSquare,
// } from "lucide-react";

// export default function LocationRequestDetailModal({
//   open,
//   onClose,
//   request,
//   onComplete,
//   onHold,
//   onReject,
// }) {
//   if (!open || !request) return null;

//   const statusColor = {
//     PENDING: "bg-yellow-100 text-yellow-700",
//     HOLD: "bg-orange-100 text-orange-700",
//     COMPLETED: "bg-green-100 text-green-700",
//     REJECTED: "bg-red-100 text-red-700",
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

//       <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">

//         {/* Header */}

//         <div className="flex justify-between items-center border-b p-5">

//           <div>

//             <h2 className="text-2xl font-bold">
//               Location Request
//             </h2>

//             <p className="text-gray-500 text-sm">
//               Review location request details
//             </p>

//           </div>

//           <button onClick={onClose}>
//             <X size={22} />
//           </button>

//         </div>

//         <div className="p-6 space-y-6">

//           {/* User */}

//           <div className="grid grid-cols-2 gap-6">

//             <div>

//               <div className="flex items-center gap-2 mb-2">

//                 <User size={18} />

//                 <h3 className="font-semibold">
//                   Requested By
//                 </h3>

//               </div>

//               <p>{request.requested_by}</p>

//               <p className="text-sm text-gray-500">
//                 {request.role}
//               </p>

//             </div>

//             <div>

//               <div className="flex items-center gap-2 mb-2">

//                 <Calendar size={18} />

//                 <h3 className="font-semibold">
//                   Requested On
//                 </h3>

//               </div>

//               <p>{request.created_at}</p>

//             </div>

//           </div>

//           <hr />

//           {/* Type */}

//           <div>

//             <h3 className="font-semibold mb-2">
//               Request Type
//             </h3>

//             <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700">

//               {request.request_type}

//             </span>

//           </div>

//           {/* Location */}

//           <div>

//             <div className="flex items-center gap-2 mb-3">

//               <MapPin size={18} />

//               <h3 className="font-semibold">

//                 Requested Location

//               </h3>

//             </div>

//             <div className="bg-gray-50 rounded-lg p-4 space-y-2">

//               <p>

//                 <strong>District :</strong>{" "}

//                 {request.district_name || "-"}

//               </p>

//               <p>

//                 <strong>Panchayath :</strong>{" "}

//                 {request.panchayath_name || "-"}

//               </p>

//               <p>

//                 <strong>Ward :</strong>{" "}

//                 {request.ward_number || "-"}

//                 {request.ward_name &&
//                   ` (${request.ward_name})`}

//               </p>

//             </div>

//           </div>

//           {/* Message */}

//           <div>

//             <div className="flex items-center gap-2 mb-2">

//               <MessageSquare size={18} />

//               <h3 className="font-semibold">

//                 Request Message

//               </h3>

//             </div>

//             <div className="bg-gray-50 rounded-lg p-4">

//               {request.message || "No message"}

//             </div>

//           </div>

//           {/* Status */}

//           <div>

//             <h3 className="font-semibold mb-2">

//               Status

//             </h3>

//             <span
//               className={`px-4 py-2 rounded-full font-medium ${statusColor[request.status]}`}
//             >
//               {request.status}
//             </span>

//           </div>

//           {/* Admin Note */}

//           {request.admin_note && (

//             <div>

//               <h3 className="font-semibold mb-2">

//                 Admin Note

//               </h3>

//               <div className="bg-gray-50 p-4 rounded-lg">

//                 {request.admin_note}

//               </div>

//             </div>

//           )}

//         </div>

//         {request.status === "PENDING" && (

//           <div className="border-t p-5 flex justify-end gap-3">

//             <button
//               onClick={() => onComplete(request.id)}
//               className="bg-green-600 text-white px-5 py-2 rounded-lg"
//             >
//               Complete
//             </button>

//             <button
//               onClick={() => onHold(request.id)}
//               className="bg-yellow-500 text-white px-5 py-2 rounded-lg"
//             >
//               Hold
//             </button>

//             <button
//               onClick={() => onReject(request.id)}
//               className="bg-red-600 text-white px-5 py-2 rounded-lg"
//             >
//               Reject
//             </button>

//           </div>

//         )}

//       </div>

//     </div>
//   );
// }


import {
  X,
  MapPin,
  User,
  Calendar,
  MessageSquare,
  Building2,
  Flag,
  StickyNote,
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
    PENDING: "bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-200",
    HOLD: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
    REJECTED: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  };

  const typeLabels = {
    DISTRICT: { label: "District", icon: "📍" },
    PANCHAYATH: { label: "Panchayath", icon: "🏛" },
    WARD: { label: "Ward", icon: "🏘" },
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex justify-center items-center z-50 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">

        {/* Header */}

        <div className="flex justify-between items-center border-b border-gray-100 p-5 shrink-0">

          <div>

            <h2 className="text-xl font-bold text-gray-900">
              Location Request
            </h2>

            <p className="text-gray-500 text-sm mt-0.5">
              Review location request details
            </p>

          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>

        </div>

        <div className="p-6 space-y-6 overflow-y-auto">

          {/* User */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">

                <User size={18} />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
                  Requested By
                </p>

                <p className="font-semibold text-gray-800">{request.requested_by}</p>

                <p className="text-sm text-gray-500">
                  {request.role}
                </p>

              </div>

            </div>

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

                <Calendar size={18} />

              </div>

              <div>

                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-0.5">
                  Requested On
                </p>

                <p className="font-semibold text-gray-800">{request.created_at}</p>

              </div>

            </div>

          </div>

          <hr className="border-gray-100" />

          {/* Type */}

          <div>

            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Request Type
            </h3>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-medium text-sm">

              <span>{typeLabels[request.request_type]?.icon}</span>

              <span>{typeLabels[request.request_type]?.label || request.request_type}</span>

            </span>

          </div>

          {/* Location */}

          <div>

            <div className="flex items-center gap-2 mb-3">

              <MapPin size={16} className="text-gray-400" />

              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                Requested Location

              </h3>

            </div>

            <div className="bg-gray-50 rounded-xl p-4 space-y-3">

              <div className="flex items-center gap-2.5 text-sm">

                <MapPin size={15} className="text-blue-500 shrink-0" />

                <span className="text-gray-500 w-24 shrink-0">District</span>

                <span className="font-medium text-gray-800">{request.district_name || "-"}</span>

              </div>

              <div className="flex items-center gap-2.5 text-sm">

                <Building2 size={15} className="text-emerald-500 shrink-0" />

                <span className="text-gray-500 w-24 shrink-0">Panchayath</span>

                <span className="font-medium text-gray-800">{request.panchayath_name || "-"}</span>

              </div>

              <div className="flex items-center gap-2.5 text-sm">

                <Flag size={15} className="text-orange-500 shrink-0" />

                <span className="text-gray-500 w-24 shrink-0">Ward</span>

                <span className="font-medium text-gray-800">

                  {request.ward_number || "-"}

                  {request.ward_name &&
                    ` (${request.ward_name})`}

                </span>

              </div>

            </div>

          </div>

          {/* Message */}

          <div>

            <div className="flex items-center gap-2 mb-2">

              <MessageSquare size={16} className="text-gray-400" />

              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                Request Message

              </h3>

            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">

              {request.message || "No message"}

            </div>

          </div>

          {/* Status */}

          <div>

            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">

              Status

            </h3>

            <span
              className={`inline-block px-3.5 py-1.5 rounded-full font-semibold text-sm ${statusColor[request.status]}`}
            >
              {request.status}
            </span>

          </div>

          {/* Admin Note */}

          {request.admin_note && (

            <div>

              <div className="flex items-center gap-2 mb-2">

                <StickyNote size={16} className="text-gray-400" />

                <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">

                  Admin Note

                </h3>

              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed">

                {request.admin_note}

              </div>

            </div>

          )}

        </div>

        {(request.status === "PENDING" || request.status === "HOLD") && (

          <div className="border-t border-gray-100 p-5 flex flex-col sm:flex-row justify-end gap-3">

            <button
              onClick={() => onComplete(request.id)}
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg"
            >
              Complete
            </button>

            {request.status === "PENDING" && (
              <button
                onClick={() => onHold(request.id)}
                className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg"
              >
                Hold
              </button>
            )}

            <button
              onClick={() => onReject(request.id)}
              className="bg-red-600 text-white px-5 py-2.5 rounded-lg"
            >
              Reject
            </button>

          </div>

        )}

      </div>

    </div>
  );
}