import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import complaintapi from "@/service/complaintsurls";

export default function ComplaintViewer() {

  const { id } = useParams();

  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {

    try {

      const res = await complaintapi.getComplaintDetail(id);

      setComplaint(res.data);

    } catch (err) {
      console.error(err);
    }

  };

  if (!complaint) return <p>Loading...</p>;

  return (

    <div className="p-6 space-y-4">

      <h1 className="text-xl font-bold">
        {complaint.title}
      </h1>

      <p>{complaint.description}</p>

      <div className="text-sm text-gray-500">
        Category: {complaint.category}
      </div>

      <div>
        Status: {complaint.status}
      </div>

      <div>
        Citizen: {complaint.citizen.name}
      </div>

      {complaint.media && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Attached Media</p>
          <img
            src={complaint.media}
            alt="Complaint media"
            className="max-w-md rounded-lg border"
          />
        </div>
      )}

      <div className="text-sm text-gray-500">
        Upvotes: {complaint.upvotes}
      </div>

      <div className="text-sm text-gray-500">
        Comments: {complaint.comments}
      </div>

    </div>

  );
}