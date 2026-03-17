import { useSuspension } from "@/context/SuspensionContext";

export default function SuspendedModal() {

  const { isSuspended } = useSuspension();

  if (!isSuspended) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

      <div className="bg-white rounded-xl p-6 w-[350px] text-center">

        <h2 className="text-lg font-bold text-red-600">
          Account Suspended
        </h2>

        <p className="text-sm text-gray-600 mt-3">
          Your account has been suspended by the administrator.
        </p>

        <button
          onClick={() => window.location.href = "/"}
          className="mt-5 px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Go to Landign Page
        </button>

      </div>

    </div>
  );
}