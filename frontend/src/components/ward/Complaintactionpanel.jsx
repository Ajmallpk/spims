export default function ComplaintActionPanel({
  status,
  chatOpen,
  wardViewed,
  onResolve,
  onEscalate,
  onHold,
  onResume,
  onToggleChat,
  onStartWork,
}) {
  const statusKey = (status ?? "").toLowerCase().replace(/ /g, "_");

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 space-y-4">
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
        Actions
      </h3>

      {/* 🟡 PENDING */}
      {statusKey === "pending" && (
        <button
          onClick={onStartWork}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl"
        >
          Start Work
        </button>
      )}


      <button
        onClick={onToggleChat}
        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl"
      >
        Open Complaint Chat
      </button>

      {/* 🔵 IN_PROGRESS */}

      {/* {statusKey === "in_progress" && (
        <div className="space-y-2.5">
          <button
            onClick={onResolve}
            className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl"
          >
            Mark as Resolved
          </button>

          <button
            onClick={onEscalate}
            className="w-full px-4 py-2.5 bg-red-600 text-white rounded-xl"
          >
            Escalate Complaint
          </button>
        </div>
      )} */}



      {statusKey === "in_progress" && (
        <div className="space-y-2.5">

          <button
            disabled={!wardViewed}
            onClick={onResolve}
            className="w-full px-4 py-2.5 bg-green-600 text-white rounded-xl"
          >
            Mark as Resolved
          </button>

          <button
            disabled={!wardViewed}
            onClick={onHold}
            className="w-full px-4 py-2.5 bg-yellow-500 text-white rounded-xl"
          >
            Put On Hold
          </button>

          <button
            disabled={!wardViewed}
            onClick={onEscalate}
            className="w-full px-4 py-2.5 bg-red-600 text-white rounded-xl"
          >
            Escalate Complaint
          </button>

        </div>
      )}



      {statusKey === "hold" && (
        <div className="space-y-3">

          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
            Complaint is currently on hold.
          </div>

          <button
            onClick={onResume}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            Resume Work
          </button>

        </div>
      )}



      {/* 🔴 ESCALATED */}
      {statusKey === "escalated" && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          Complaint escalated to Panchayath. No further actions allowed.
        </div>
      )}

      {/* 🟢 RESOLVED */}
      {statusKey === "resolved" && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          Complaint already resolved.
        </div>
      )}

      {/* 💬 CHAT */}
      {/* <button
        onClick={onToggleChat}
        className="w-full mt-2 px-4 py-2.5 text-blue-600 bg-blue-50 border border-blue-200 rounded-xl"
      >
        {chatOpen ? "Hide Chat" : "Open Chat"}
      </button> */}
    </div>
  );
}