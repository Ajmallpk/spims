import useScrollReveal from "./useScrollReveal";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "#1a56db",
  delay = 0,
}) {
  const ref = useScrollReveal(delay);

  return (
    <div
      ref={ref}
      className="bg-white border border-[#e2e8f0] rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase font-bold text-[#94a3b8]">
          {title}
        </p>
        {Icon && <Icon size={18} color={color} />}
      </div>

      <p
        className="font-black"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem,3vw,2.5rem)",
          color,
        }}
      >
        {value}
      </p>
    </div>
  );
}