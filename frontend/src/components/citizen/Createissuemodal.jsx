import { useState, useEffect } from "react";
import citizenapi from "@/service/citizenurls";

const CreateIssueModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [wards, setWards] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    ward: "",
    location: "",
    media: [],
  });

  const [submitting, setSubmitting] = useState(false);
  const [startX, setStartX] = useState(0)
  const [endX, setEndX] = useState(0)
  const [previews, setPreviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);



  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category || "",
        ward: initialData.ward || "",
        location: initialData.location || "",
        media: [],
      });
    }
  }, [isOpen, initialData]);


  useEffect(() => {
    const fetchWards = async () => {
      try {
        const res = await citizenapi.getWards();
        setWards(res.data);
      } catch (error) {
        console.error("Failed to load wards", error);
      }
    };

    fetchWards();
  }, []);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      setForm((prev) => ({
        ...prev,
        media: [...prev.media, ...files],
      }));

      const previewUrls = files.map((file) =>
        URL.createObjectURL(file)
      );

      setPreviews((prev) => [...prev, ...previewUrls]);
      setCurrentIndex(0);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.ward) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    // onSubmit?.(form);
    // setSubmitting(false);
    // onClose();

    await onSubmit?.(form);
    setSubmitting(false);
    setForm({
      title: "",
      description: "",
      category: "",
      ward: "",
      location: "",
      media: [],
    });

    setPreviews([]);
    setCurrentIndex(0);

  };



  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const distance = startX - endX;

    // swipe left
    if (distance > 50 && currentIndex < previews.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }

    // swipe right
    if (distance < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };




  const handleMouseDown = (e) => {
    setStartX(e.clientX);
  };

  const handleMouseUp = (e) => {
    const distance = startX - e.clientX;

    if (distance > 50 && currentIndex < previews.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }

    if (distance < -50 && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };



  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Report an Issue</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Issue Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Broken streetlight near park"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the issue in detail..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all resize-none"
            />
          </div>
          {/* Category */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              Category *
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-teal-300 transition-all bg-white"
            >
              <option value="">Select category</option>
              <option value="ROAD">Road Issue</option>
              <option value="WATER">Water Issue</option>
              <option value="ELECTRICITY">Electricity</option>
              <option value="WASTE">Waste Management</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Ward + Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Ward *</label>
              <select
                name="ward"
                value={form.ward}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-teal-300 transition-all bg-white"
              >
                <option value="">Select ward</option>
                {wards.map((ward) => (
                  <option key={ward.id} value={ward.id}>
                    {ward.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Landmark or area"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:ring-2 focus:ring-teal-300 transition-all"
              />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">Attach Photo</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-teal-300 transition-colors">
              {previews.length > 0 ? (
                <div
                  className="relative cursor-grab active:cursor-grabbing"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                >
                  {form.media[currentIndex]?.type.startsWith("image") ? (
                    <img
                      src={previews[currentIndex]}
                      className="rounded-lg max-h-40 object-cover w-full transition-all duration-300"
                    />
                  ) : (
                    <video
                      src={previews[currentIndex]}
                      controls
                      className="rounded-lg max-h-40 w-full transition-all duration-300"
                    />
                  )}

                  {/* DOTS */}
                  <div className="flex justify-center mt-2 gap-1">
                    {previews.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${i === currentIndex ? "bg-teal-500" : "bg-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-300 mb-2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span className="text-xs text-gray-400">Click to upload an image</span>
                </>
              )}
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title || !form.description || !form.ward || submitting}
            className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-200 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Issue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateIssueModal;