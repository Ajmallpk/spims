import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import citizenapi from "@/service/citizenurls";

const CitizenComplaintDetailPage = () => {
    const { complaintId } = useParams();

    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);


    useEffect(() => {
        loadComplaint();

    }, []);

    const loadComplaint = async () => {
        try {
            const res =
                await citizenapi.getComplaintDetail(
                    complaintId
                );

            setComplaint(
                res.data.data
            );

        } catch (error) {
            console.log(error);
        }
    };



    if (!complaint) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-6">

            <button
                onClick={() => navigate(-1)}
                className="mb-4"
            >
                Back
            </button>

            <h1 className="text-2xl font-bold">
                {complaint.title}
            </h1>

            <p>{complaint.description}</p>

            <br />

            <p>
                Category :
                {complaint.category}
            </p>

            <p>
                Location :
                {complaint.location}
            </p>

            <p>
                Status :
                {complaint.status}
            </p>

            <p>
                Created :
                {new Date(
                    complaint.created_at
                ).toLocaleString()}
            </p>

            <p>
                Citizen :
                {complaint.citizen_name}
            </p>

            <p>
                Ward :
                {complaint.ward_name}
            </p>

            <hr className="my-5" />

            <h2 className="font-bold">
                Media
            </h2>

            {
                complaint.media?.map(
                    (item) => (

                        <div key={item.id}>

                            {
                                item.file_type === "IMAGE"
                                    ? (
                                        <img
                                            src={item.file}
                                            alt=""
                                            className="w-64"
                                        />
                                    )
                                    : (
                                        <video
                                            controls
                                            className="w-64"
                                        >
                                            <source
                                                src={item.file}
                                            />
                                        </video>
                                    )
                            }

                        </div>

                    )
                )
            }

            {
                complaint.resolution && (

                    <>
                        <hr className="my-5" />

                        <h2>
                            Resolution
                        </h2>

                        <p>
                            {
                                complaint.resolution
                                    .message
                            }
                        </p>

                    </>
                )
            }
        </div>
    );
};

export default CitizenComplaintDetailPage;