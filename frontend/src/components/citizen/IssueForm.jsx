// citizen/components/IssueForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, AlignLeft, CheckCircle2, AlertCircle } from "lucide-react";
import CategorySelector from "@/components/citizen/CategorySelector";
import WardSelector from "@/components/citizen/WardSelector";
import LocationPicker from "@/components/citizen/LocationPicker";
import MediaUpload from "@/components/citizen/MediaUpload";
import SubmitIssueButton from "@/components/citizen/SubmitIssueButton";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  ward: "",
  location: { area: "", landmark: "", maps_link: "" },
  media: null,
};

const INITIAL_ERRORS = {
  title: "",
  description: "",
  category: "",
  ward: "",
};

function Toast({ type, message, onClose }) {
  return (
    <div
      className={[
        "fixed top-6 right-6 z-50 flex items-start gap-3 px-4 py-3.5 rounded-xl shadow-xl border max-w-sm",
        type === "success"
          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
          : "bg-red-50 border-red-200 text-red-800",
      ].join(" ")}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className="text-sm font-semibold">
          {type === "success" ? "Issue Reported!" : "Submission Failed"}
        </p>
        <p className="text-xs mt-0.5 opacity-80">{message}</p>
      </div>
      <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 ml-1 text-lg leading-none">
        &times;
      </button>
    </div>
  );
}

function validate(form) {
  const errors = { title: "", description: "", category: "", ward: "" };
  let valid = true;
  if (!form.title.trim()) {
    errors.title = "Issue title is required.";
    valid = false;
  }
  if (form.description.trim().length < 15) {
    errors.description = "Description must be at least 15 characters.";
    valid = false;
  }
  if (!form.category) {
    errors.category = "Please select a category.";
    valid = false;
  }
  if (!form.ward) {
    errors.ward = "Please select a ward.";
    valid = false;
  }
  return { errors, valid };
}

export default function IssueForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const setField = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { errors: newErrors, valid } = validate(form);
    if (!valid) {
      setErrors(newErrors);
      // Scroll to first error
      document.querySelector("[data-field='title']")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access");
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("category", form.category);
      fd.append("ward", form.ward);
      // Flatten location to JSON string
      fd.append("location", JSON.stringify(form.location));
      if (form.media?.file) {
        fd.append("media_file", form.media.file);
      }

      const res = await fetch("/api/citizen/issues/create/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || data.message || "Submission failed. Please try again.");
      }

      setToast({ type: "success", message: "Your issue has been submitted to the authorities." });
      setTimeout(() => navigate("/citizen/home"), 2000);
    } catch (err) {
      setToast({ type: "error", message: err.message });
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-7">
        {/* Title */}
        <div className="space-y-1.5" data-field="title">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4 text-indigo-500" />
            Issue Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Large pothole on Nehru Road near bus stop"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            maxLength={120}
            className={[
              "w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-150",
              errors.title
                ? "border-red-300 focus:border-red-400 bg-red-50"
                : "border-gray-200 focus:border-indigo-300 bg-white",
            ].join(" ")}
          />
          <div className="flex items-center justify-between">
            {errors.title ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                {errors.title}
              </p>
            ) : <span />}
            <span className="text-xs text-gray-400 ml-auto">{form.title.length}/120</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
            <AlignLeft className="w-4 h-4 text-indigo-500" />
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Describe the issue in detail — what you observed, when it started, who it affects..."
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            rows={4}
            maxLength={1000}
            className={[
              "w-full px-4 py-2.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all duration-150 resize-none",
              errors.description
                ? "border-red-300 focus:border-red-400 bg-red-50"
                : "border-gray-200 focus:border-indigo-300 bg-white",
            ].join(" ")}
          />
          <div className="flex items-center justify-between">
            {errors.description ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-red-500 inline-block" />
                {errors.description}
              </p>
            ) : (
              <p className="text-xs text-gray-400">Minimum 15 characters</p>
            )}
            <span className="text-xs text-gray-400 ml-auto">{form.description.length}/1000</span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Category */}
        <CategorySelector
          value={form.category}
          onChange={(v) => setField("category", v)}
          error={errors.category}
        />

        {/* Ward */}
        <WardSelector
          value={form.ward}
          onChange={(v) => setField("ward", v)}
          error={errors.ward}
        />

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Location */}
        <LocationPicker
          value={form.location}
          onChange={(v) => setField("location", v)}
        />

        {/* Media */}
        <MediaUpload
          value={form.media}
          onChange={(v) => setField("media", v)}
        />

        {/* Divider */}
        <div className="h-px bg-gray-100" />

        {/* Submit */}
        <SubmitIssueButton loading={loading} />
      </form>
    </>
  );
}