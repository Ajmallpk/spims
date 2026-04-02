import { useState, useEffect } from "react";
// import CitizenLayout from "@/layouts/citizen/Citizenlayout";
import IssueCard from "@/components/citizen/Issuecard";
import PostIssueButton from "@/components/citizen/Postissuebutton";
import CreateIssueModal from "@/components/citizen/Createissuemodal";
import VerificationRequiredModal from "@/components/citizen/Verificationrequiredmodal";
import complaintapi from "@/service/complaintsurls";
import citizenapi from "@/service/citizenurls";

// Verification status constants
const VERIFICATION_STATUS = {
  NOT_VERIFIED: "NOT_VERIFIED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
};

// Mock issue data
const MOCK_ISSUES = [
  {
    id: 1,
    citizenName: "Priya Sharma",
    ward: "Ward 12, Civil Lines",
    location: "Kunnamkulam Junction",
    timeAgo: "2 hours ago",
    description:
      "The streetlight pole near the main community park has been broken since the last storm. It's completely dark at night and posing a safety risk to pedestrians and vehicles passing by.",
    category: "Broken Streetlight",
    image: null,
    upvotes: 42,
    commentCount: 8,
    authorityResponse: null,
    comments: [
      { id: 1, authorName: "Rajesh Nair", text: "This is dangerous, please fix it soon!", timeAgo: "1 hour ago" },
      { id: 2, authorName: "Sunita Menon", text: "Same issue near my house too.", timeAgo: "45 min ago" },
    ],
  },
  {
    id: 2,
    citizenName: "Anil Kumar",
    ward: "Ward 04, Market Road",
    location: "Near Primary School",
    timeAgo: "Yesterday",
    description:
      "Massive potholes have developed right in front of the primary school. It's causing massive traffic jams during morning hours and children are tripping over.",
    category: "Road Damage",
    image: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=80",
    upvotes: 156,
    commentCount: 1,
    authorityResponse: {
      authorityName: "Panchayath Secretary (Ward 04)",
      timeAgo: "5 hours ago",
      message:
        "Thank you for reporting. The public works department has been dispatched and the road patching work was completed this morning. Attached is the proof of completion.",
      proofImage: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=80",
    },
    comments: [
      {
        id: 1,
        authorName: "Meera Patel",
        text: "Great work! It's much smoother to drive there now.",
        timeAgo: "3 hours ago",
      },
    ],
  },
  {
    id: 3,
    citizenName: "Deepa Krishnan",
    ward: "Ward 07, East Colony",
    location: "Main Canal Bridge",
    timeAgo: "3 days ago",
    description:
      "The drainage canal near the East Colony bridge is severely blocked with plastic waste and debris. During heavy rains the entire road floods up to 2 feet.",
    category: "Drainage Blockage",
    image: null,
    upvotes: 89,
    commentCount: 12,
    authorityResponse: null,
    comments: [
      { id: 1, authorName: "Vishnu Raj", text: "This has been a problem for 2 years!", timeAgo: "2 days ago" },
    ],
  },
];

const formatTimeAgo = (dateString) => {

  const now = new Date();
  const past = new Date(dateString);

  const seconds = Math.floor((now - past) / 1000);

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(seconds / 3600);
  const days = Math.floor(seconds / 86400);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return past.toLocaleDateString();
};

const Home = () => {

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    window.location.href = "/citizen/registration";
  };


  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(false);
  const [citizenVerificationStatus, setCitizenVerificationStatus] =
    useState(VERIFICATION_STATUS.NOT_VERIFIED);




  const loadFeed = async () => {
    try {
      const res = await complaintapi.getComplaintFeed();

      const formattedIssues = (res.data.results || []).map((issue) => ({
        id: issue.id,
        citizenName: issue.citizen_name,
        ward: issue.ward_name,
        location: issue.location,
        timeAgo: formatTimeAgo(issue.created_at),
        description: issue.description,
        category: issue.category,
        media: issue.media || [],
        upvotes: issue.upvotes_count,
        commentCount: issue.comments_count,

        authorityResponse: issue.resolution ? {
          authorityName: issue.resolution.authority_name,
          message: issue.resolution.message,
          proofImage: issue.resolution.proof_image,
          timeAgo: formatTimeAgo(issue.resolution.created_at),
        }
          : null,

        comments: []
      }));

      setIssues(formattedIssues);

    } catch (err) {
      console.error("Failed to load complaints", err);
    } finally {
      setLoading(false);
    }
  };

  // Simulate fetch
  useEffect(() => {

    const fetchVerificationStatus = async () => {
      try {
        const res = await citizenapi.getVerificationStatus();

        if (!res.data.submitted) {
          setCitizenVerificationStatus(VERIFICATION_STATUS.NOT_VERIFIED);
        }
        else if (res.data.status === "PENDING") {
          setCitizenVerificationStatus(VERIFICATION_STATUS.PENDING);
        }
        else if (res.data.status === "APPROVED") {
          setCitizenVerificationStatus(VERIFICATION_STATUS.APPROVED);
        }

      } catch (error) {
        console.error("Failed to fetch verification status", error);
      }
    };

    fetchVerificationStatus();
    loadFeed();

  }, []);

  const handlePostIssueClick = () => {
    if (citizenVerificationStatus === VERIFICATION_STATUS.NOT_VERIFIED) {
      setIsVerificationModalOpen(true);
    } else if (citizenVerificationStatus === VERIFICATION_STATUS.PENDING) {
      setPendingMessage(true);
      setTimeout(() => setPendingMessage(false), 3000);
    } else {
      setIsCreateIssueOpen(true);
    }
  };

  // const handleIssueSubmit = (formData) => {
  //   const newIssue = {
  //     id: Date.now(),
  //     citizenName: "You",
  //     ward: formData.ward,
  //     location: formData.location || "Your location",
  //     timeAgo: "Just now",
  //     description: formData.description,
  //     category: formData.title,
  //     image: formData.image ? URL.createObjectURL(formData.image) : null,
  //     upvotes: 0,
  //     commentCount: 0,
  //     authorityResponse: null,
  //     comments: [],
  //   };
  //   setIssues((prev) => [newIssue, ...prev]);
  // };

  const handleIssueSubmit = async (formData) => {
    try {

      const data = new FormData();

      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("ward", formData.ward);
      data.append("location", formData.location);
      data.append("category", formData.category);

      if (formData.media?.length) {
        formData.media.forEach((file) => {
          data.append("media_files", file);
        });
      }

      await complaintapi.createComplaint(data);

      setIsCreateIssueOpen(false);

      await loadFeed();   // refresh feed automatically

    } catch (error) {
      console.error(error);
    }
  };



  const handleVerifyRedirect = () => {
    // In real app: navigate("/citizen/verification")
    window.location.href = "/citizen/verification";
  };

  return (
    <>
      {/* Pending verification toast */}
      {pendingMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-5 py-3 text-sm shadow-lg font-medium">
          ⏳ Your verification is under review. Please wait for approval.
        </div>
      )}

      {/* Post Issue Button */}
      <PostIssueButton onClick={handlePostIssueClick} />
      <button
        onClick={handleLogout}
        className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold z-50"
      >
        Logout
      </button>

      {/* Feed */}
      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gray-200 rounded-full" />
                <div className="space-y-1.5">
                  <div className="h-3 w-32 bg-gray-200 rounded" />
                  <div className="h-2.5 w-48 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
                <div className="h-3 bg-gray-100 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      ) : issues.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
          <p className="text-sm font-medium">
            No issues reported in your ward yet.
          </p>
          <p className="text-xs mt-1">
            Be the first citizen to report a problem.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateIssueModal
        isOpen={isCreateIssueOpen}
        onClose={() => setIsCreateIssueOpen(false)}
        onSubmit={handleIssueSubmit}
      />
      <VerificationRequiredModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerify={handleVerifyRedirect}
      />
    </>
  );
};

export default Home;