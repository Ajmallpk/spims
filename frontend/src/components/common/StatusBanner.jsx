export default function StatusBanner({
  bg,
  borderColor,
  color,
  eyebrow,
  heading,
  body,
  icon: Icon,
}) {
  return (
    <div
      className="rounded-2xl p-8"
      style={{
        background: bg,
        border: `1.5px solid ${borderColor}`,
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        {Icon && <Icon size={18} color={color} />}
        <p className="text-xs uppercase font-bold" style={{ color }}>
          {eyebrow}
        </p>
      </div>

      <h3
        className="font-black text-[#0f172a] mb-3"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {heading}
      </h3>

      <p className="text-sm text-[#475569]">
        {body}
      </p>
    </div>
  );
}