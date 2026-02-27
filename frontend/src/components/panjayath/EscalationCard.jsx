import useScrollReveal from "@/components/common/useScrollReveal";

const STATUS_COLORS = {
  PENDING: { bg: "#fffbeb", color: "#d97706" },
  RESOLVED: { bg: "#ecfdf5", color: "#059669" },
  ESCALATED: { bg: "#fef2f2", color: "#dc2626" },
};

export default function EscalationCard({ complaint, onResolve, onEscalate, delay }) {

  const ref = useScrollReveal(delay);
  const status = STATUS_COLORS[complaint.status];

  return (
    <div
      ref={ref}
      className="bg-white border border-[#e2e8f0] rounded-2xl p-8"
    >
      <div className="flex justify-between items-start">

        <div>
          <p className="text-xs uppercase font-bold text-[#1a56db] mb-1">
            Escalated from {complaint.ward}
          </p>

          <h3
            className="font-black text-[#0f172a]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {complaint.title}
          </h3>
        </div>

        <div className="flex flex-col items-end gap-3">

          <span
            className="text-xs font-bold uppercase px-3 py-1 rounded-full"
            style={{ background: status.bg, color: status.color }}
          >
            {complaint.status}
          </span>

          {complaint.status === "PENDING" && (
            <div className="flex gap-2">
              <button
                onClick={() => onResolve(complaint.id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
              >
                Resolve
              </button>

              <button
                onClick={() => onEscalate(complaint.id)}
                className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold"
              >
                Escalate to Block
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}