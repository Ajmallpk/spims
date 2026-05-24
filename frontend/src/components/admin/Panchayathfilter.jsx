import { useState, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { handleApiError } from "@/utils/handleApiError";
import { adminapi } from "@/service/adminurls";


/**
 * PanchayathFilter
 * Props:
 *  - value: string (selected panchayath id, "" = all)
 *  - onChange: (id: string) => void
 */
const PanchayathFilter = ({ value, onChange }) => {
  const [panchayaths, setPanchayaths] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetch = async () => {

      try {

        const { data } =
          await adminapi.getPanchayaths(
            {
              status: "approved"
            }
          );

        const list =

          Array.isArray(data)

            ? data

            : data.results || [];

        setPanchayaths(list);

      }

      catch (err) {

        handleApiError(
          err,
          "Failed to load panchayaths"
        );

      }

      finally {

        setLoading(false);

      }

    };
    fetch();
  }, []);

  return (
    <div className="relative w-full max-w-xs">
      <Filter
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={15}
      />
      <select
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(e.target.value);
        }}
        disabled={loading}
        className="w-full appearance-none pl-9 pr-9 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="">All Panchayaths</option>
        {panchayaths.map((p) => (
          <option key={p.id} value={p.id}>
            {p.panchayath_name || p.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        size={14}
      />
    </div>
  );
};

export default PanchayathFilter;