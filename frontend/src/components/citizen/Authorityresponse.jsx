import Avatar from "@/components/ui/Avatar";
import { useState } from "react";

const AuthorityResponse = ({ response }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [previewIndex, setPreviewIndex] = useState(null);
  if (!response) return null;


  return (
    <div className="bg-green-500 text-white rounded-xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <Avatar alt={response.authorityName} size="sm" className="ring-2 ring-white/40" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{response.authorityName}</span>
            <span className="bg-white text-green-600 rounded-full px-2 py-0.5 text-xs font-medium">
              ✓ Official
            </span>
          </div>
          <p className="text-green-100 text-xs mt-0.5">{response.timeAgo}</p>
        </div>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white/70 flex-shrink-0">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Message */}
      <p className="text-sm leading-relaxed">{response.message}</p>

      {/* Proof image */}
      {/* IMAGE */}
      {/* ✅ MULTIPLE MEDIA SLIDER */}
      {response.media?.length > 0 && (
        <div>
          <div className="relative overflow-hidden rounded-xl">

            <div
              className="flex transition-transform duration-300"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {response.media.map((media, index) => {
                const BASE_URL = "http://127.0.0.1:8000";

                const url = media.file.startsWith("http")
                  ? media.file
                  : `${BASE_URL}${media.file}`;

                return (
                  <div key={index} className="min-w-full">

                    {media.file_type === "IMAGE" && (
                      <img
                        src={url}
                        onClick={() => setPreviewIndex(index)}
                        className="w-full max-h-72 object-cover cursor-pointer"
                      />
                    )}

                    {media.file_type === "VIDEO" && (
                      <video
                        controls
                        onClick={() => setPreviewIndex(index)}
                        className="w-full max-h-72 cursor-pointer"
                      >
                        <source src={url} />
                      </video>
                    )}

                  </div>
                );
              })}
            </div>

            {/* LEFT BUTTON */}
            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="absolute left-2 top-1/2 bg-white p-2 rounded-full"
              >
                ‹
              </button>
            )}

            {/* RIGHT BUTTON */}
            {currentIndex < response.media.length - 1 && (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="absolute right-2 top-1/2 bg-white p-2 rounded-full"
              >
                ›
              </button>
            )}

          </div>

          {/* ✅ DOTS NOW CORRECT */}
          <div className="flex justify-center mt-2 gap-1">
            {response.media.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full ${i === currentIndex ? "bg-white" : "bg-white/40"
                  }`}
              />
            ))}
          </div>
        </div>
      )}


      {previewIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          onClick={() => setPreviewIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const media = response.media[previewIndex];
              const BASE_URL = "http://127.0.0.1:8000";

              const url = media.file.startsWith("http")
                ? media.file
                : `${BASE_URL}${media.file}`;

              return media.file_type === "IMAGE" ? (
                <img className="w-full max-h-[80vh] object-contain" src={url} />
              ) : (
                <video controls autoPlay className="w-full max-h-[80vh]">
                  <source src={url} />
                </video>
              );
            })()}

            {/* LEFT */}
            {previewIndex > 0 && (
              <button
                onClick={() => setPreviewIndex(prev => prev - 1)}
                className="absolute left-3 top-1/2 bg-white p-3 rounded-full"
              >
                ◀
              </button>
            )}

            {/* RIGHT */}
            {previewIndex < response.media.length - 1 && (
              <button
                onClick={() => setPreviewIndex(prev => prev + 1)}
                className="absolute right-3 top-1/2 bg-white p-3 rounded-full"
              >
                ▶
              </button>
            )}

            {/* CLOSE */}
            <button
              onClick={() => setPreviewIndex(null)}
              className="absolute top-3 right-3 text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorityResponse;