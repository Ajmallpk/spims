import { useState } from "react";

export default function VerificationDetailsModal({
  verification,
  citizen,
  onClose
}) {

  if (!verification || !citizen) return null;
  const [previewImage, setPreviewImage] = useState(null);

  return (

    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

      <div className="bg-white rounded-xl shadow-lg p-6 w-[500px]">

        <h2 className="text-lg font-bold mb-4">
          Citizen Verification Details
        </h2>

        <div className="space-y-3 text-sm">

          <p>
            <strong>Name:</strong> {citizen?.full_name}
          </p>

          <p>
            <strong>Email:</strong> {citizen?.email}
          </p>

          <p>
            <strong>Phone:</strong> {citizen?.phone}
          </p>

          <p>
            <strong>Address:</strong> House {citizen?.house_number}, {citizen?.street_name}
          </p>

          <p>
            <strong>Status:</strong> {verification.status}
          </p>

          <p>
            <strong>Submitted:</strong> {new Date(
              verification.submitted_at
            ).toLocaleDateString()}
          </p>

          {verification.reject_reason && (
            <p className="text-red-600">
              <strong>Reject Reason:</strong> {verification.reject_reason}
            </p>
          )}

        </div>

        <div className="grid grid-cols-2 gap-4 mt-5">

          {verification.aadhaar_image && (
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Aadhaar Image
              </p>

              <img
                src={`http://127.0.0.1:8000${verification.aadhaar_image}`}
                className="rounded-lg border cursor-pointer hover:opacity-80 transition"
                onClick={() =>
                  setPreviewImage(`http://127.0.0.1:8000${verification.aadhaar_image}`)
                }
              />
            </div>
          )}

          {verification.selfie_image && (
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Selfie Image
              </p>

              <img
                src={`http://127.0.0.1:8000${verification.selfie_image}`}
                className="rounded-lg border cursor-pointer hover:opacity-80 transition"
                onClick={() =>
                  setPreviewImage(`http://127.0.0.1:8000${verification.selfie_image}`)
                }
              />
            </div>
          )}

        </div>

        <div className="flex justify-end mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>

        </div>

      </div>
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">

          <div className="relative max-w-4xl w-full p-4">

            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 text-white text-xl bg-black/50 px-3 py-1 rounded-lg"
            >
              ✕
            </button>

            <img
              src={previewImage}
              className="w-full max-h-[90vh] object-contain rounded-lg"
            />

          </div>

        </div>
      )}

    </div>
  );
}