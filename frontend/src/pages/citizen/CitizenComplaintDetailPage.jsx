// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import citizenapi from "@/service/citizenurls";

// const CitizenComplaintDetailPage = () => {
//     const { complaintId } = useParams();

//     const navigate = useNavigate();

//     const [complaint, setComplaint] = useState(null);


//     useEffect(() => {
//         loadComplaint();

//     }, []);

//     const loadComplaint = async () => {
//         try {
//             const res =
//                 await citizenapi.getComplaintDetail(
//                     complaintId
//                 );

//             setComplaint(
//                 res.data.data
//             );

//         } catch (error) {
//             console.log(error);
//         }
//     };



//     if (!complaint) {
//         return <p>Loading...</p>;
//     }

//     return (
//         <div className="p-6">

//             <button
//                 onClick={() => navigate(-1)}
//                 className="mb-4"
//             >
//                 Back
//             </button>

//             <h1 className="text-2xl font-bold">
//                 {complaint.title}
//             </h1>

//             <p>{complaint.description}</p>

//             <br />

//             <p>
//                 Category :
//                 {complaint.category}
//             </p>

//             <p>
//                 Location :
//                 {complaint.location}
//             </p>

//             <p>
//                 Status :
//                 {complaint.status}
//             </p>

//             <p>
//                 Created :
//                 {new Date(
//                     complaint.created_at
//                 ).toLocaleString()}
//             </p>

//             <p>
//                 Citizen :
//                 {complaint.citizen_name}
//             </p>

//             <p>
//                 Ward :
//                 {complaint.ward_name}
//             </p>

//             <hr className="my-5" />

//             <h2 className="font-bold">
//                 Media
//             </h2>

//             {
//                 complaint.media?.map(
//                     (item) => (

//                         <div key={item.id}>

//                             {
//                                 item.file_type === "IMAGE"
//                                     ? (
//                                         <img
//                                             src={item.file}
//                                             alt=""
//                                             className="w-64"
//                                         />
//                                     )
//                                     : (
//                                         <video
//                                             controls
//                                             className="w-64"
//                                         >
//                                             <source
//                                                 src={item.file}
//                                             />
//                                         </video>
//                                     )
//                             }

//                         </div>

//                     )
//                 )
//             }

//             {
//                 complaint.resolution && (

//                     <>
//                         <hr className="my-5" />

//                         <h2>
//                             Resolution
//                         </h2>

//                         <p>
//                             {
//                                 complaint.resolution
//                                     .message
//                             }
//                         </p>

//                     </>
//                 )
//             }
//         </div>
//     );
// };

// export default CitizenComplaintDetailPage;















import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import citizenapi from "@/service/citizenurls";

const StatusBadge = ({ status }) => {
    const styles = {
        PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        OPEN: "bg-blue-100 text-blue-700 border border-blue-200",
        IN_PROGRESS: "bg-purple-100 text-purple-700 border border-purple-200",
        RESOLVED: "bg-green-100 text-green-700 border border-green-200",
        CLOSED: "bg-gray-100 text-gray-600 border border-gray-200",
    };
    const labels = {
        PENDING: "Pending",
        OPEN: "Open",
        IN_PROGRESS: "In Progress",
        RESOLVED: "Resolved",
        CLOSED: "Closed",
    };
    const cls = styles[status] ?? "bg-gray-100 text-gray-600 border border-gray-200";
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${cls}`}>
            {labels[status] ?? status}
        </span>
    );
};

const InfoRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-3 border-b border-gray-100 last:border-0">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-28 flex-shrink-0">{label}</span>
        <span className="text-sm text-gray-700">{value}</span>
    </div>
);

const SkeletonLoader = () => (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 animate-pulse">
        <div className="max-w-3xl mx-auto space-y-5">
            <div className="h-8 w-32 bg-gray-200 rounded-lg" />
            <div className="bg-white rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="h-6 w-2/3 bg-gray-200 rounded" />
                <div className="h-4 w-1/3 bg-gray-100 rounded" />
                <div className="space-y-2 pt-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 bg-gray-100 rounded w-full" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CitizenComplaintDetailPage = () => {
    const { complaintId } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);

    useEffect(() => {
        loadComplaint();
    }, []);

    const loadComplaint = async () => {
        try {
            const res = await citizenapi.getComplaintDetail(complaintId);
            setComplaint(res.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (!complaint) return <SkeletonLoader />;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto space-y-5">

                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </button>

                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">
                                Complaint #{complaintId}
                            </p>
                            <h1 className="text-xl font-bold text-gray-800 leading-snug">
                                {complaint.title}
                            </h1>
                        </div>
                        <StatusBadge status={complaint.status} />
                    </div>

                    {complaint.description && (
                        <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                            {complaint.description}
                        </p>
                    )}
                </div>

                {/* Details Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Details</h2>
                    <InfoRow label="Category" value={complaint.category} />
                    <InfoRow label="Location" value={complaint.location} />
                    <InfoRow label="Citizen" value={complaint.citizen_name} />
                    <InfoRow label="Ward" value={complaint.ward_name} />
                    <InfoRow
                        label="Submitted"
                        value={new Date(complaint.created_at).toLocaleString()}
                    />
                </div>

                {/* Media Card */}
                {complaint.media?.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                            Attached Media
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {complaint.media.map((item) => (
                                <div key={item.id} className="rounded-xl overflow-hidden bg-gray-100 aspect-video">
                                    {item.file_type === "IMAGE" ? (
                                        <img
                                            src={item.file}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <video controls className="w-full h-full object-cover">
                                            <source src={item.file} />
                                        </video>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Resolution Card */}
                {complaint.resolution && (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-sm font-bold text-green-700 uppercase tracking-wider">Resolution</h2>
                        </div>
                        <p className="text-sm text-green-800 leading-relaxed">
                            {complaint.resolution.message}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default CitizenComplaintDetailPage;