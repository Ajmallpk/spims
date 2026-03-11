const Badge = ({ label, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    teal: "bg-teal-100 text-teal-700",
    green: "bg-white text-green-600",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;