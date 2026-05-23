// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { adminapi } from "@/service/adminurls";
// import { handleApiError } from "@/utils/handleApiError";

// export default function CitizenDetail() {

//   const { id } = useParams();
//   const [data, setData] = useState(null);

//   const fetchDetail = async () => {
//     try {
//       const res = await adminapi.citizenDetail(id);
//       setData(res.data.data);
//     } catch (err) {
//       handleApiError(err, "Failed to load citizen details");
//     }
//   };

//   useEffect(() => {
//     fetchDetail();
//   }, []);

//   if (!data) return <p>Loading...</p>;

//   return (
//     <div className="space-y-6">

//       <h1 className="text-xl font-bold">Citizen Details</h1>

//       <div className="bg-white p-6 rounded-xl shadow space-y-3">

//         <p><b>Name:</b> {data.full_name}</p>
//         <p><b>Email:</b> {data.email}</p>
//         <p><b>Phone:</b> {data.phone}</p>
//         <p><b>House:</b> {data.house_number}</p>
//         <p><b>Street:</b> {data.street_name}</p>

//         <p><b>Ward:</b> {data.ward}</p>
//         <p><b>Panchayath:</b> {data.panchayath}</p>

//       </div>

//       <div className="grid grid-cols-2 gap-4">

//         <img
//           src={data.aadhaar_image}
//           alt="Aadhaar"
//           className="rounded-lg cursor-pointer"
//           onClick={() => window.open(data.aadhaar_image)}
//         />

//         <img
//           src={data.selfie_image}
//           alt="Selfie"
//           className="rounded-lg cursor-pointer"
//           onClick={() => window.open(data.selfie_image)}
//         />

//       </div>

//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminapi } from "@/service/adminurls";
import { handleApiError } from "@/utils/handleApiError";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Home,
  MapPin,
  Building2,
  ExternalLink,
  BadgeCheck,
  Camera,
} from "lucide-react";

/* ─── reusable helpers ────────────────────────────────────── */

const InfoPill = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
      <Icon size={15} className="text-indigo-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 break-words">{value || "—"}</p>
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50 bg-gray-50/60">
      <Icon size={16} className="text-indigo-500" />
      <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest">{title}</h2>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const MediaCard = ({ src, alt, label, icon: Icon }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 mb-1">
      <Icon size={14} className="text-gray-400" />
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
    </div>
    <div
      className="relative group cursor-pointer rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
      onClick={() => window.open(src)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full object-cover max-h-64 transition-opacity group-hover:opacity-90"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition">
        <div className="opacity-0 group-hover:opacity-100 transition bg-white/90 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 shadow">
          <ExternalLink size={12} /> Open full image
        </div>
      </div>
    </div>
  </div>
);

/* ─── main component ──────────────────────────────────────── */

export default function CitizenDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const fetchDetail = async () => {
    try {
      const res = await adminapi.citizenDetail(id);
      setData(res.data.data);
    } catch (err) {
      handleApiError(err, "Failed to load citizen details");
    }
  };

  useEffect(() => { fetchDetail(); }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading citizen details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12">

      {/* ── back button ── */}
      <button
        onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
          <ArrowLeft size={14} />
        </span>
        Back
      </button>

      {/* ── hero card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-4">
          {/* avatar placeholder */}
          <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <User size={28} className="text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{data.full_name}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{data.email}</p>
          </div>
        </div>
      </div>

      {/* ── personal info ── */}
      <SectionCard title="Personal Information" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoPill icon={User} label="Full Name" value={data.full_name} />
          <InfoPill icon={Mail} label="Email" value={data.email} />
          <InfoPill icon={Phone} label="Phone" value={data.phone} />
          <InfoPill icon={Home} label="House No." value={data.house_number} />
          <InfoPill icon={MapPin} label="Street" value={data.street_name} />
        </div>
      </SectionCard>

      {/* ── location ── */}
      <SectionCard title="Location Details" icon={Building2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoPill icon={MapPin} label="Ward" value={data.ward} />
          <InfoPill icon={Building2} label="Panchayath" value={data.panchayath} />
        </div>
      </SectionCard>

      {/* ── documents ── */}
      <SectionCard title="Identity Documents" icon={BadgeCheck}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <MediaCard
            src={data.aadhaar_image}
            alt="Aadhaar"
            label="Aadhaar Card"
            icon={BadgeCheck}
          />
          <MediaCard
            src={data.selfie_image}
            alt="Selfie"
            label="Selfie Photo"
            icon={Camera}
          />
        </div>
      </SectionCard>

    </div>
  );
}