import { useNavigate } from "react-router-dom";
import CategoryBadge from "./CategoryBadge";
import StatusBadge from "./StatusBadge";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ComplaintCard = ({ complaint, navigateTo }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(navigateTo || `/ward/reassigned-complaints/${complaint.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-400 mb-0.5 tracking-wide uppercase">
            #{complaint.id}
          </p>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug truncate group-hover:text-blue-600 transition-colors duration-150">
            {complaint.title || "Untitled Complaint"}
          </h3>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Category Badge */}
      <div className="mb-4">
        <CategoryBadge category={complaint.category} />
      </div>

      {/* Footer Row */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
        {/* Location */}
        <div className="flex items-center gap-1.5 min-w-0">
          <svg
            className="w-3.5 h-3.5 text-gray-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate max-w-[150px]">
            {complaint.location || "Location not specified"}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <svg
            className="w-3.5 h-3.5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{formatDate(complaint.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;