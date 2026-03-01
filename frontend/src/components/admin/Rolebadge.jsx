/**
 * RoleBadge
 * Props:
 *  - role: string (e.g. "ADMIN", "SUPER_ADMIN")
 */

const roleConfig = {
  admin: {
    label: "ADMIN",
    classes: "bg-indigo-100 text-indigo-700 border-indigo-200",
    dot: "bg-indigo-500",
  },
  super_admin: {
    label: "SUPER ADMIN",
    classes: "bg-purple-100 text-purple-700 border-purple-200",
    dot: "bg-purple-500",
  },
};

const RoleBadge = ({ role = "ADMIN" }) => {
  const key = role?.toLowerCase().replace(" ", "_");
  const config = roleConfig[key] || roleConfig.admin;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default RoleBadge;