    import useScrollReveal from "@/components/common/useScrollReveal";

const STATUS = {
  PENDING: { label: "Pending", bg: "#fffbeb", color: "#d97706" },
  APPROVED: { label: "Approved", bg: "#ecfdf5", color: "#059669" },
  REJECTED: { label: "Rejected", bg: "#fef2f2", color: "#dc2626" },
};

export default function WardRequestCard({ req, onApprove, onReject, delay }) {

  const ref = useScrollReveal(delay);
  const status = STATUS[req.status];

  return (
    <div
      ref={ref}
      className="bg-white border border-[#e2e8f0] rounded-2xl p-8"
    >
      <div className="flex justify-between items-start">

        <div>
          <p className="text-[0.63rem] uppercase font-bold text-[#1a56db] mb-1">
            Ward Authority
          </p>

          <h3
            className="font-black text-[#0f172a]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {req.name}
          </h3>

          <p className="text-sm text-[#475569] mt-1">
            Member: <span className="font-medium">{req.member}</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span
            className="text-xs font-bold uppercase px-3 py-1 rounded-full"
            style={{ background: status.bg, color: status.color }}
          >
            {status.label}
          </span>

          {req.status === "PENDING" && (
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(req.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Approve
              </button>

              <button
                onClick={() => onReject(req.id)}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold"
              >
                Reject
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}