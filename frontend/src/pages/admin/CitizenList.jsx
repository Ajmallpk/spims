import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { adminapi } from "@/service/adminurls";
import { handleApiError } from "@/utils/handleApiError";
import { useNavigate } from "react-router-dom";
const CitizenList = () => {
  const navigate = useNavigate();
  const [wardFilter, setWardFilter] = useState("");
  const [panchayathFilter, setPanchayathFilter] = useState("");
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [actionModal, setActionModal] = useState({
    open: false,
    type: null,
    id: null,
  });

  const fetchCitizens = async () => {
    setLoading(true);

    try {
      const { data } = await adminapi.getCitizens({
        ward: wardFilter,
        panchayath: panchayathFilter,
      });
      setCitizens(data);
    } catch (err) {
      handleApiError(err, "Failed to fetch citizens");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizens();
  }, []);

  const handleSuspend = (id) => {
    setActionModal({ open: true, type: "suspend", id });
  };

  const handleActivate = (id) => {
    setActionModal({ open: true, type: "activate", id });
  };

  const handleConfirmAction = async () => {
    try {

      if (actionModal.type === "suspend") {
        await adminapi.suspendCitizen(actionModal.id);
      } else {
        await adminapi.activateCitizen(actionModal.id);
      }

      setActionModal({ open: false, type: null, id: null });

      fetchCitizens();

    } catch (err) {
      handleApiError(err, "Citizen action failed");
    }
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center gap-3">
        <Users className="w-6 h-6 text-indigo-600" />
        <h1 className="text-xl font-bold">Citizen List</h1>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="flex gap-3 mb-4">

          <input
            type="text"
            placeholder="Filter by Ward Name"
            value={wardFilter}
            onChange={(e) => setWardFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />

          <input
            type="text"
            placeholder="Filter by Panchayath Name"
            value={panchayathFilter}
            onChange={(e) => setPanchayathFilter(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />

          <button
            onClick={fetchCitizens}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
          >
            Apply
          </button>

        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Ward</th>
              <th className="px-4 py-3 text-left">Panchayath</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : citizens.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  No citizens found
                </td>
              </tr>
            ) : (
              citizens.map((c) => (
                <tr
                  key={c.id}
                  className="border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/admin/citizens/${c.id}`)}
                >

                  <td className="px-4 py-3">{c.name}</td>

                  <td className="px-4 py-3">{c.email}</td>

                  <td className="px-4 py-3">{c.ward || "—"}</td>

                  <td className="px-4 py-3">{c.panchayath || "—"}</td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${c.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}
                    >
                      {c.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">

                    {c.status === "ACTIVE" ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSuspend(c.id);
                        }}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Suspend
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();   
                          handleActivate(c.id);
                        }}
                        className="text-green-600 hover:underline text-sm"
                      >
                        Activate
                      </button>
                    )}

                  </td>

                </tr>
              ))
            )}

          </tbody>
        </table>

      </div>

      {actionModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

            <h2 className="text-lg font-bold mb-3">
              Confirm {actionModal.type === "suspend" ? "Suspension" : "Activation"}
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to{" "}
              <span className="font-semibold">
                {actionModal.type === "suspend" ? "suspend" : "activate"}
              </span>{" "}
              this citizen?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() =>
                  setActionModal({ open: false, type: null, id: null })
                }
                className="px-4 py-2 bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white rounded-lg ${actionModal.type === "suspend"
                  ? "bg-red-600"
                  : "bg-green-600"
                  }`}
              >
                Confirm
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenList;