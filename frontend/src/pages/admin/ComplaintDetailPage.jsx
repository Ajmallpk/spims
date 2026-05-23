// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { adminapi } from "@/service/adminurls";
// import { handleApiError } from "@/utils/handleApiError";
// import { ArrowLeft } from "lucide-react";

// const ComplaintDetailPage = () => {

//     const { id } = useParams();

//     const navigate = useNavigate();

//     const [data, setData] = useState(null);

//     const [loading, setLoading] = useState(true);

//     useEffect(() => {

//         fetchComplaint();

//     }, []);

//     const fetchComplaint = async () => {

//         try {

//             const res =
//                 await adminapi.complaintDetail(id);

//             setData(
//                 res.data.data
//             );

//         }

//         catch (err) {

//             handleApiError(
//                 err,
//                 "Failed loading complaint"
//             );

//         }

//         finally {

//             setLoading(false);

//         }

//     };

//     if (loading) {

//         return (
//             <p>
//                 Loading...
//             </p>
//         );

//     }

//     if (!data) {

//         return (
//             <p>
//                 Complaint not found
//             </p>
//         );

//     }

//     return (

//         <div className="space-y-6">

//             <button

//                 onClick={() => navigate(-1)}

//                 className="
// flex
// items-center
// gap-2
// text-indigo-600
// font-semibold
// "

//             >

//                 <ArrowLeft size={18} />

//                 Back

//             </button>


//             <div
//                 className="
// bg-white
// p-6
// rounded-xl
// shadow
// space-y-6
// "
//             >

//                 {/* TITLE */}

//                 <div>

//                     <h1
//                         className="
// text-2xl
// font-bold
// "
//                     >

//                         {data.title}

//                     </h1>

//                     <p
//                         className="
// text-gray-600
// mt-2
// "
//                     >

//                         {data.description}

//                     </p>

//                 </div>


//                 {/* IMAGE */}

//                 {

//                     data.image_proof && (

//                         <div>

//                             <h2
//                                 className="
// font-semibold
// mb-2
// "
//                             >

//                                 Complaint Image

//                             </h2>

//                             <img

//                                 src={data.image_proof}

//                                 alt="complaint"

//                                 className="
// rounded-lg
// border
// max-h-80
// cursor-pointer
// "

//                                 onClick={() =>
//                                     window.open(
//                                         data.image_proof
//                                     )
//                                 }

//                             />

//                         </div>

//                     )

//                 }


//                 {/* VIDEO */}

//                 {

//                     data.video_proof && (

//                         <div>

//                             <h2
//                                 className="
// font-semibold
// mb-2
// "
//                             >

//                                 Complaint Video

//                             </h2>

//                             <video

//                                 controls

//                                 className="
// rounded-lg
// border
// max-h-80
// "

//                             >

//                                 <source
//                                     src={data.video_proof}
//                                 />

//                             </video>

//                         </div>

//                     )

//                 }


//                 {/* EXTRA MEDIA */}

//                 {

//                     data.media?.length > 0 && (

//                         <div>

//                             <h2
//                                 className="
// font-semibold
// mb-3
// "
//                             >

//                                 Extra Media

//                             </h2>

//                             <div
//                                 className="
// grid
// grid-cols-2
// gap-4
// "
//                             >

//                                 {

//                                     data.media.map(

//                                         (media) => {

//                                             if (

//                                                 media.file_type ===
//                                                 "IMAGE"

//                                             ) {

//                                                 return (

//                                                     <img

//                                                         key={media.id}

//                                                         src={media.file}

//                                                         alt="media"

//                                                         className="
// rounded-lg
// border
// cursor-pointer
// "

//                                                         onClick={() =>
//                                                             window.open(
//                                                                 media.file
//                                                             )
//                                                         }

//                                                     />

//                                                 );

//                                             }

//                                             return (

//                                                 <video

//                                                     key={media.id}

//                                                     controls

//                                                     className="
// rounded-lg
// border
// "

//                                                 >

//                                                     <source

//                                                         src={
//                                                             media.file
//                                                         }

//                                                     />

//                                                 </video>

//                                             );

//                                         }

//                                     )

//                                 }

//                             </div>

//                         </div>

//                     )

//                 }


//                 {/* COMPLAINT INFO */}

//                 <div
//                     className="
// grid
// grid-cols-2
// gap-4
// border-t
// pt-5
// "
//                 >

//                     <p>

//                         <b>Status:</b>

//                         {" "}

//                         {data.status}

//                     </p>

//                     <p>

//                         <b>Category:</b>

//                         {" "}

//                         {data.category}

//                     </p>

//                     <p>

//                         <b>Location:</b>

//                         {" "}

//                         {data.location}

//                     </p>

//                     <p>

//                         <b>Created:</b>

//                         {" "}

//                         {

//                             new Date(
//                                 data.created_at
//                             ).toLocaleString()

//                         }

//                     </p>

//                 </div>


//                 {/* CITIZEN */}

//                 <div
//                     className="
// border-t
// pt-5
// "
//                 >

//                     <h2
//                         className="
// font-bold
// text-lg
// mb-3
// "
//                     >

//                         Reported User Details

//                     </h2>

//                     <div
//                         className="
// grid
// grid-cols-2
// gap-4
// "
//                     >

//                         <p>

//                             <b>Name:</b>

//                             {" "}

//                             {data.citizen?.name}

//                         </p>

//                         <p>

//                             <b>Email:</b>

//                             {" "}

//                             {data.citizen?.email}

//                         </p>

//                         <p>

//                             <b>Phone:</b>

//                             {" "}

//                             {

//                                 data.citizen?.phone

//                                 ||

//                                 "—"

//                             }

//                         </p>

//                         <button

//                             onClick={() =>

//                                 navigate(

//                                     `/admin/citizens/${data.citizen?.id}`

//                                 )

//                             }

//                             className="
// text-indigo-600
// font-semibold
// text-left
// "

//                         >

//                             Open Citizen Profile →

//                         </button>

//                     </div>

//                 </div>


//                 {/* WARD */}

//                 <div
//                     className="
// border-t
// pt-5
// "
//                 >

//                     <h2
//                         className="
// font-bold
// text-lg
// mb-3
// "
//                     >

//                         Ward Details

//                     </h2>

//                     <p>

//                         <b>Ward:</b>

//                         {" "}

//                         {data.ward?.name}

//                     </p>

//                 </div>


//                 {/* PANCHAYATH */}

//                 <div
//                     className="
// border-t
// pt-5
// "
//                 >

//                     <h2
//                         className="
// font-bold
// text-lg
// mb-3
// "
//                     >

//                         Panchayath Details

//                     </h2>

//                     <p>

//                         <b>Name:</b>

//                         {" "}

//                         {

//                             data.panchayath?.name

//                             ||

//                             "—"

//                         }

//                     </p>

//                 </div>


//                 {/* TIMELINE */}

//                 {

//                     data.timeline?.length > 0 && (

//                         <div
//                             className="
// border-t
// pt-5
// "
//                         >

//                             <h2
//                                 className="
// font-bold
// text-lg
// mb-3
// "
//                             >

//                                 Timeline

//                             </h2>

//                             <div
//                                 className="
// space-y-3
// "
//                             >

//                                 {

//                                     data.timeline.map(

//                                         (item, index) => (

//                                             <div

//                                                 key={index}

//                                                 className="
// border
// rounded-lg
// p-3
// "

//                                             >

//                                                 <p>

//                                                     <b>

//                                                         {item.action}

//                                                     </b>

//                                                 </p>

//                                                 <p>

//                                                     {

//                                                         item.note

//                                                         ||

//                                                         "No note"

//                                                     }

//                                                 </p>

//                                                 <p
//                                                     className="
// text-sm
// text-gray-500
// "
//                                                 >

//                                                     {

//                                                         item.user

//                                                     }

//                                                 </p>

//                                             </div>

//                                         )

//                                     )

//                                 }

//                             </div>

//                         </div>

//                     )

//                 }

//             </div>

//         </div>

//     );

// };

// export default ComplaintDetailPage;




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminapi } from "@/service/adminurls";
import { handleApiError } from "@/utils/handleApiError";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Tag,
  CheckCircle2,
  User,
  Building2,
  ImageIcon,
  VideoIcon,
  Layers,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────── */

const STATUS_STYLES = {
  PENDING:     "bg-amber-50  text-amber-700  border-amber-200",
  IN_PROGRESS: "bg-blue-50   text-blue-700   border-blue-200",
  RESOLVED:    "bg-green-50  text-green-700  border-green-200",
  REJECTED:    "bg-red-50    text-red-700    border-red-200",
};

const statusStyle = (s = "") =>
  STATUS_STYLES[s.toUpperCase()] ?? "bg-gray-50 text-gray-600 border-gray-200";

const InfoPill = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
    <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
      <Icon size={15} className="text-indigo-500" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-800 truncate">{value || "—"}</p>
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

/* ─── component ───────────────────────────────────────────── */

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchComplaint(); }, []);

  const fetchComplaint = async () => {
    try {
      const res = await adminapi.complaintDetail(id);
      setData(res.data.data);
    } catch (err) {
      handleApiError(err, "Failed loading complaint");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading complaint…</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center space-y-2">
          <div className="text-4xl">🗂️</div>
          <p className="text-gray-500 font-medium">Complaint not found</p>
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
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{data.title}</h1>
            <p className="mt-2 text-gray-500 text-sm leading-relaxed">{data.description}</p>
          </div>
          <span
            className={`flex-shrink-0 inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border ${statusStyle(data.status)}`}
          >
            {data.status}
          </span>
        </div>

        {/* meta pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-gray-50">
          <InfoPill icon={Tag}     label="Category" value={data.category} />
          <InfoPill icon={MapPin}  label="Location" value={data.location} />
          <InfoPill icon={Clock}   label="Created"  value={new Date(data.created_at).toLocaleString()} />
          <InfoPill icon={CheckCircle2} label="Status" value={data.status} />
        </div>
      </div>

      {/* ── image proof ── */}
      {data.image_proof && (
        <SectionCard title="Complaint Image" icon={ImageIcon}>
          <div className="relative group w-fit">
            <img
              src={data.image_proof}
              alt="complaint"
              className="rounded-xl border border-gray-100 max-h-80 object-cover cursor-pointer transition-opacity group-hover:opacity-90"
              onClick={() => window.open(data.image_proof)}
            />
            <div
              className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition cursor-pointer"
              onClick={() => window.open(data.image_proof)}
            >
              <div className="opacity-0 group-hover:opacity-100 transition bg-white/90 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 shadow">
                <ExternalLink size={12} /> Open full image
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ── video proof ── */}
      {data.video_proof && (
        <SectionCard title="Complaint Video" icon={VideoIcon}>
          <video controls className="rounded-xl border border-gray-100 max-h-80 w-full">
            <source src={data.video_proof} />
          </video>
        </SectionCard>
      )}

      {/* ── extra media ── */}
      {data.media?.length > 0 && (
        <SectionCard title="Extra Media" icon={Layers}>
          <div className="grid grid-cols-2 gap-4">
            {data.media.map((media) =>
              media.file_type === "IMAGE" ? (
                <div key={media.id} className="relative group">
                  <img
                    src={media.file}
                    alt="media"
                    className="rounded-xl border border-gray-100 w-full object-cover cursor-pointer transition-opacity group-hover:opacity-90"
                    onClick={() => window.open(media.file)}
                  />
                  <div
                    className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition cursor-pointer"
                    onClick={() => window.open(media.file)}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition bg-white/90 rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700 shadow">
                      <ExternalLink size={12} /> Open
                    </div>
                  </div>
                </div>
              ) : (
                <video key={media.id} controls className="rounded-xl border border-gray-100 w-full">
                  <source src={media.file} />
                </video>
              )
            )}
          </div>
        </SectionCard>
      )}

      {/* ── citizen ── */}
      <SectionCard title="Reported User Details" icon={User}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoPill icon={User}   label="Name"  value={data.citizen?.name} />
          <InfoPill icon={Tag}    label="Email" value={data.citizen?.email} />
          <InfoPill icon={MapPin} label="Phone" value={data.citizen?.phone} />
          <button
            onClick={() => navigate(`/admin/citizens/${data.citizen?.id}`)}
            className="flex items-center gap-2 p-4 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-sm hover:bg-indigo-100 transition-colors group"
          >
            Open Citizen Profile
            <ChevronRight size={15} className="ml-auto group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </SectionCard>

      {/* ── ward ── */}
      <SectionCard title="Ward Details" icon={Building2}>
        <InfoPill icon={Building2} label="Ward" value={data.ward?.name} />
      </SectionCard>

      {/* ── panchayath ── */}
      <SectionCard title="Panchayath Details" icon={Building2}>
        <InfoPill icon={Building2} label="Panchayath Name" value={data.panchayath?.name} />
      </SectionCard>

      {/* ── timeline ── */}
      {data.timeline?.length > 0 && (
        <SectionCard title="Timeline" icon={Clock}>
          <ol className="relative space-y-0">
            {data.timeline.map((item, index) => (
              <li key={index} className="relative pl-8 pb-6 last:pb-0">
                {/* connector line */}
                {index < data.timeline.length - 1 && (
                  <span className="absolute left-[11px] top-5 bottom-0 w-px bg-gray-100" />
                )}
                {/* dot */}
                <span className="absolute left-0 top-1.5 flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 border-2 border-indigo-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                </span>

                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1">
                  <p className="font-bold text-sm text-gray-800">{item.action}</p>
                  <p className="text-sm text-gray-500">{item.note || "No note"}</p>
                  <p className="text-xs text-gray-400 font-medium pt-0.5">{item.user}</p>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

    </div>
  );
};

export default ComplaintDetailPage;