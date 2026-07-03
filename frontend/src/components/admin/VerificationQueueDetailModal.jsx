import { X } from "lucide-react";

export default function VerificationQueueDetailModal({
  open,
  onClose,
  title,
  data,
  type,
}) {
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
              className="rounded-lg border"
            />

          </div>

          <div>

            <p className="font-medium mb-2">
              Selfie
            </p>

            <img
              src={data.selfie}
              className="rounded-lg border"
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

    </div>
  );
}