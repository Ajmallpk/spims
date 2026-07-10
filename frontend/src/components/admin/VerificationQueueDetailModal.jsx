import { X } from "lucide-react";
import { useState } from "react";

export default function VerificationQueueDetailModal({
  open,
  onClose,
  title,
  data,
  type,
}) {

  const [previewImage, setPreviewImage] = useState(null);



  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6">
          {title}
        </h2>

        <div className="space-y-3">

          <div>
            <b>Name :</b>{" "}
            {data.full_name || data.officer_name}
          </div>

          <div>
            <b>Phone :</b>{" "}
            {data.phone || "-"}
          </div>

          <div>
            <b>District :</b>{" "}
            {data.district}
          </div>

          <div>
            <b>Panchayath :</b>{" "}
            {data.panchayath}
          </div>

          <div>
            <b>Ward :</b>{" "}
            {data.ward}
          </div>

          <div>
            <b>Submitted :</b>{" "}
            {data.submitted_at}
          </div>

        </div>

        <hr className="my-6" />

        <h3 className="font-bold mb-3">
          Documents
        </h3>

        <div className="grid grid-cols-2 gap-5">

          <div>

            <p className="font-medium mb-2">
              Aadhaar
            </p>

            <img
              src={data.aadhaar}
              alt="Aadhaar"
              onClick={() => setPreviewImage(data.aadhaar)}
              className="rounded-lg border cursor-pointer hover:scale-105 transition"
            />

          </div>

          <div>

            <p className="font-medium mb-2">
              Selfie
            </p>

            <img
              src={data.selfie}
              alt="Selfie"
              onClick={() => setPreviewImage(data.selfie)}
              className="rounded-lg border cursor-pointer hover:scale-105 transition"
            />

          </div>

        </div>

        {type === "ward" &&
          data.supporting_document && (

            <div className="mt-6">

              <a
                href={data.supporting_document}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Supporting Document
              </a>

            </div>

          )}

      </div>


      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999]"
          onClick={() => setPreviewImage(null)}
        >
          <button
            onClick={() => setPreviewImage(null)}
            className="absolute top-5 right-5 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <X size={24} />
          </button>

          <img
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl object-contain"
          />
        </div>
      )}

    </div>
  );
}