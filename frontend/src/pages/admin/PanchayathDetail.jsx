import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminapi } from "@/service/adminurls";

const PanchayathDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await adminapi.getPanchayathDetail(id);
      setData(res.data);
    };
    fetchDetail();
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-bold">Panchayath Detail</h1>

      <div className="bg-white p-6 rounded-xl shadow">
        <p><strong>Username:</strong> {data.username}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Status:</strong> {data.status}</p>
        <p><strong>Date Joined:</strong> {new Date(data.date_joined).toLocaleDateString()}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Verification Details</h2>

        <p><strong>Panchayath Name:</strong> {data.verification.panchayath_name}</p>
        <p><strong>District:</strong> {data.verification.district}</p>
        <p><strong>Phone:</strong> {data.verification.phone}</p>

        {data.verification.aadhaar_image && (
          <img
            src={data.verification.aadhaar_image}
            className="mt-4 max-h-64 rounded border"
          />
        )}

        {data.verification.selfie_image && (
          <img
            src={data.verification.selfie_image}
            className="mt-4 max-h-64 rounded border"
          />
        )}
      </div>

    </div>
  );
};

export default PanchayathDetail;