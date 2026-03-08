const Avatar = ({ src, alt = "User", size = "md", className = "" }) => {
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-11 h-11 text-base",
  };

  const initials = alt
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return src ? (
    <img
      src={src}
      alt={alt}
      className={`rounded-full object-cover flex-shrink-0 ${sizes[size]} ${className}`}
    />
  ) : (
    <div
      className={`rounded-full bg-teal-100 text-teal-700 font-semibold flex items-center justify-center flex-shrink-0 ${sizes[size]} ${className}`}
    >
      {initials}
    </div>
  );
};

export default Avatar;