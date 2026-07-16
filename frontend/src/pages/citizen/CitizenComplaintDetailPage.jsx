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
import IssueCard from "@/components/citizen/Issuecard";
import { useSearchParams } from "react-router-dom";

// const StatusBadge = ({ status }) => {
//     const styles = {
//         PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
//         OPEN: "bg-blue-100 text-blue-700 border border-blue-200",
//         IN_PROGRESS: "bg-purple-100 text-purple-700 border border-purple-200",
//         RESOLVED: "bg-green-100 text-green-700 border border-green-200",
//         CLOSED: "bg-gray-100 text-gray-600 border border-gray-200",
//     };
//     const labels = {
//         PENDING: "Pending",
//         OPEN: "Open",
//         IN_PROGRESS: "In Progress",
//         RESOLVED: "Resolved",
//         CLOSED: "Closed",
//     };
//     const cls = styles[status] ?? "bg-gray-100 text-gray-600 border border-gray-200";
//     return (
//         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${cls}`}>
//             {labels[status] ?? status}
//         </span>
//     );
// };



const StatusBadge = ({ status }) => {

    const styles = {
        PENDING: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        OPEN: "bg-blue-100 text-blue-700 border border-blue-200",
        IN_PROGRESS: "bg-purple-100 text-purple-700 border border-purple-200",
        HOLD: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        RESOLVED: "bg-green-100 text-green-700 border border-green-200",
        CLOSED: "bg-gray-100 text-gray-600 border border-gray-200",
    };

    const labels = {
        PENDING: "Pending",
        OPEN: "Open",
        IN_PROGRESS: "In Progress",
        HOLD: "On Hold",
        RESOLVED: "Resolved",
        CLOSED: "Closed",
    };

    const cls =
        styles[status] ??
        "bg-gray-100 text-gray-600 border border-gray-200";

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
    const [issue, setIssue] =
        useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);

    const [searchParams] = useSearchParams();

    const targetCommentId =
        searchParams.get("comment");


    console.log(
        "TARGET COMMENT ID:",
        targetCommentId
    );

    useEffect(() => {
        loadComplaint();
    }, []);

    const loadComplaint = async () => {
        try {
            const res = await citizenapi.getComplaintDetail(complaintId);
            const complaint = res.data.data;

            setIssue({
                id: complaint.id,
                title: complaint.title,
                citizenName:
                    complaint.citizen_name,

                ward: complaint.ward,

                wardName:
                    complaint.ward_name,

                location:
                    complaint.location,

                timeAgo:
                    new Date(
                        complaint.created_at
                    ).toLocaleString(),

                description:
                    complaint.description,

                category:
                    complaint.category,

                media:
                    complaint.media || [],

                status:
                    complaint.status,

                hold_reason:
                    complaint.hold_reason,

                hold_by_name:
                    complaint.hold_by_name,

                upvotes:
                    complaint.upvotes_count,

                commentCount:
                    complaint.comments_count,

                authorityResponse:
                    complaint.resolution
                        ? {
                            authorityName:
                                complaint
                                    .resolution
                                    .authority_name,

                            message:
                                complaint
                                    .resolution
                                    .message,

                            timeAgo:
                                complaint
                                    .resolution
                                    .created_at,

                            media:
                                complaint
                                    .resolution
                                    .media || [],
                        }
                        : null,
            });
        } catch (error) {
            console.log(error);
            toast.error("Failed to load complaint details");
        }
    };

    if (!issue)
        return <SkeletonLoader />;

    return (
        <div className="max-w-3xl mx-auto py-6">
            <IssueCard
                issue={issue}
                targetComplaintId={
                    complaintId
                }
                targetCommentId={
                    targetCommentId
                }
            />
        </div>
    );
};

export default CitizenComplaintDetailPage;