import { useState } from "react"


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
    file_type === "AUDIO";

  const isVideo =
    file_type === "VIDEO";



  const [previewOpen, setPreviewOpen] =
    useState(false)

  if (isImage) {

    return (

      <>

        <div className="mt-1 rounded-xl overflow-hidden max-w-xs">

          <img
            src={file_url}
            alt="image"

            onClick={() =>
              setPreviewOpen(true)
            }

            className="
              w-full
              object-cover
              max-h-48
              rounded-xl
              cursor-pointer
              "
          />

        </div>

        {

          previewOpen && (

            <div

              onClick={() =>
                setPreviewOpen(false)
              }

              className="
fixed
inset-0
bg-black/90
z-[9999]
flex
justify-center
items-center
p-5
"

            >

              <img

                src={file_url}

                className="
max-h-full
max-w-full
rounded-lg
"

              />

            </div>

          )

        }

      </>

    )

  }

  if (isVideo) {

    return (

      <>

        <div className="mt-2 max-w-xs">

          <video

            controls

            onClick={() =>
              setPreviewOpen(true)
            }

            className="
rounded-xl
w-full
cursor-pointer
"

          >

            <source src={file_url} />

          </video>

        </div>

        {

          previewOpen && (

            <div

              onClick={() =>
                setPreviewOpen(false)
              }

              className="
fixed
inset-0
bg-black/90
z-[9999]
flex
justify-center
items-center
"

            >

              <video

                src={file_url}

                controls

                autoPlay

                className="
max-h-full
max-w-full
rounded-lg
"

              />

            </div>

          )

        }

      </>

    )

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
        <a
          href={file_url}
          target="_blank"
          rel="noreferrer"
          download
        >

          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />

          </svg>

        </a>
      </div>
    );
  }

  if (isVoice) {
    return (
      <div className="mt-2 max-w-xs">
        <audio
          controls
          preload="metadata"
          controlsList="nodownload"
          className="
 w-full
 min-w-[300px]
"
        >
          <source src={file_url} />
        </audio>
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

      {
        previewOpen && (

          <div
            onClick={() =>
              setPreviewOpen(false)
            }
            className="
fixed
inset-0
bg-black/90
z-[999]
flex
justify-center
items-center
p-5
"
          >

            {

              isImage && (

                <img
                  src={file_url}
                  className="
max-h-full
max-w-full
rounded-lg
"
                />

              )

            }

            {

              isVideo && (

                <video
                  src={file_url}
                  controls
                  autoPlay
                  className="
                  max-h-full
                  max-w-full
                  rounded-lg
                  "
                />

              )

            }

          </div>

        )
      }
    </div>
  );
};

export default FilePreview;