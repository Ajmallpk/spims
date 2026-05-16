const FilePreview = ({
  file,
  file_url,
  file_type,
  isSent,
}) => {
  const isImage =
    file_type === "IMAGE";

  const isPdf =
    file_type === "PDF";

  const isVoice =
    file_type === "VOICE";

  if (isImage) {
    return (
      <div className="mt-1 rounded-xl overflow-hidden max-w-xs">
        <img
          src={file_url}
          alt={file.name || "Image"}
          className="w-full object-cover max-h-48 rounded-xl"
        />
        {file.name && (
          <p className={`text-xs mt-1 ${isSent ? "text-blue-100" : "text-gray-400"}`}>
            {file.name}
          </p>
        )}
      </div>
    );
  }

  if (isPdf) {
    return (
      <div
        className={`flex items-center gap-3 mt-1 p-3 rounded-xl ${isSent ? "bg-blue-700" : "bg-gray-100"
          } max-w-xs`}
      >
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSent ? "bg-blue-800" : "bg-red-100"}`}>
          <svg className={`w-5 h-5 ${isSent ? "text-red-300" : "text-red-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium truncate ${isSent ? "text-white" : "text-gray-700"}`}>
            {file.name || "Document.pdf"}
          </p>
          <p className={`text-xs ${isSent ? "text-blue-200" : "text-gray-400"}`}>
            {file.size || "PDF Document"}
          </p>
        </div>
        <button className={`flex-shrink-0 ${isSent ? "text-blue-200 hover:text-white" : "text-gray-400 hover:text-gray-600"} transition-colors`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    );
  }

  if (isVoice) {
    return (
      <div
        className={`flex items-center gap-3 mt-1 px-3 py-2 rounded-xl ${isSent ? "bg-blue-700" : "bg-gray-100"
          } w-52`}
      >
        <button className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isSent ? "bg-white text-blue-600" : "bg-blue-600 text-white"}`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-0.5 h-6">
            {[3, 5, 8, 6, 4, 7, 5, 3, 6, 8, 4, 5].map((h, i) => (
              <div
                key={i}
                className={`w-1 rounded-full ${isSent ? "bg-blue-300" : "bg-blue-400"}`}
                style={{ height: `${h * 3}px` }}
              />
            ))}
          </div>
          <p className={`text-xs mt-0.5 ${isSent ? "text-blue-200" : "text-gray-400"}`}>
            {file.duration || "0:32"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 mt-1 p-3 rounded-xl ${isSent ? "bg-blue-700" : "bg-gray-100"} max-w-xs`}>
      <svg className={`w-5 h-5 ${isSent ? "text-blue-200" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
      </svg>
      <span className={`text-sm truncate ${isSent ? "text-white" : "text-gray-700"}`}>
        {file.name || "Attachment"}
      </span>
    </div>
  );
};

export default FilePreview;