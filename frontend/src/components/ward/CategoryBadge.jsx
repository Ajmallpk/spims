const CATEGORY_CONFIG = {
  ROAD: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", label: "Road" },
  WATER: { bg: "bg-cyan-100", text: "text-cyan-700", border: "border-cyan-200", label: "Water" },
  ELECTRICITY: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", label: "Electricity" },
  SANITATION: { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", label: "Sanitation" },
  DRAINAGE: { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200", label: "Drainage" },
  STREETLIGHT: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", label: "Street Light" },
  OTHER: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: "Other" },
};

const CategoryBadge = ({ category }) => {
  const config = CATEGORY_CONFIG[category?.toUpperCase()] || CATEGORY_CONFIG.OTHER;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
    >
      {config.label}
    </span>
  );
};

export default CategoryBadge;