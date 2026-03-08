const IconButton = ({ icon, label, onClick, className = "", active = false }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
        active
          ? "bg-teal-50 text-teal-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      } ${className}`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default IconButton;