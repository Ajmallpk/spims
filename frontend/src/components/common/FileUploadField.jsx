import { useRef, useState } from "react";

export default function FileUploadField({
  label,
  hint,
  file,
  onChange,
}) {

  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange({ target: { files: [dropped] } });
  };

  return (
    <div>

      <p className="text-xs uppercase font-bold mb-2">
        {label}
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className="rounded-xl px-5 py-6 cursor-pointer"
        style={{
          border: "1.5px dashed #cbd5e1",
          background: dragging ? "#eff6ff" : "#f8faff",
        }}
      >
        {file ? (
          <p className="text-sm font-medium text-[#1a56db]">
            {file.name}
          </p>
        ) : (
          <p className="text-sm text-[#475569]">
            {hint}
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onChange}
      />
    </div>
  );
}