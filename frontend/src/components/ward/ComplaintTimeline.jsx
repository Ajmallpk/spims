import { useEffect, useState } from "react";
import complaintapi from "@/service/complaintsurls";

export default function ComplaintTimeline({ complaintId }) {
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    fetchTimeline();
  }, [complaintId]);

  const fetchTimeline = async () => {
    try {
      const res = await complaintapi.getTimeline(complaintId);
      setTimeline(res.data);
    } catch (err) {
      console.error("Failed to load timeline");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 space-y-4">
      <h3 className="text-sm font-bold text-gray-800">Activity Timeline</h3>

      {timeline.length === 0 ? (
        <p className="text-xs text-gray-400">No activity yet</p>
      ) : (
        <div className="space-y-3">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
              <div>
                <p className="text-sm text-gray-700 font-medium">
                  {item.note}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(item.time).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}