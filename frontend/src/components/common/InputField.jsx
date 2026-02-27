import { useState } from "react";

export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}) {

  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label
        className="block text-xs font-bold uppercase mb-2"
        style={{ color: focused ? "#1a56db" : "#040a13" }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-3 bg-[#f8faff] outline-none"
        style={{
          border: focused
            ? "1.5px solid #1a56db"
            : "1.5px solid #e2e8f0",
          fontFamily: "'Outfit', sans-serif",
        }}
      />
    </div>
  );
}