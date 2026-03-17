import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminapi } from "@/service/adminurls";
import { handleApiError } from "@/utils/handleApiError";

export default function CitizenDetail() {

  const { id } = useParams();
  const [data, setData] = useState(null);

  const fetchDetail = async () => {
    try {
      const res = await adminapi.citizenDetail(id);
      setData(res.data);
    } catch (err) {
      handleApiError(err, "Failed to load citizen details");
    }
  };

  useEffect(() => {
    fetchDetail();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="space-y-6">

      <h1 className="text-xl font-bold">Citizen Details</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-3">

        <p><b>Name:</b> {data.full_name}</p>
        <p><b>Email:</b> {data.email}</p>
        <p><b>Phone:</b> {data.phone}</p>
        <p><b>House:</b> {data.house_number}</p>
        <p><b>Street:</b> {data.street_name}</p>

        <p><b>Ward:</b> {data.ward}</p>
        <p><b>Panchayath:</b> {data.panchayath}</p>

      </div>

      <div className="grid grid-cols-2 gap-4">

        <img
          src={data.aadhaar_image}
          alt="Aadhaar"
          className="rounded-lg cursor-pointer"
          onClick={() => window.open(data.aadhaar_image)}
        />

        <img
          src={data.selfie_image}
          alt="Selfie"
          className="rounded-lg cursor-pointer"
          onClick={() => window.open(data.selfie_image)}
        />

      </div>

    </div>
  );
}