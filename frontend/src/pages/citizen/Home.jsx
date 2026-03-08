import { useState, useEffect } from "react";
import CitizenLayout from "@/layouts/citizen/Citizenlayout";
import IssueCard from "@/components/citizen/Issuecard";
import PostIssueButton from "@/components/citizen/Postissuebutton";
import CreateIssueModal from "@/components/citizen/Createissuemodal";
import VerificationRequiredModal from "@/components/citizen/Verificationrequiredmodal";
import complaintApi from "@/service/complaintsurls";

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

const Home = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateIssueOpen, setIsCreateIssueOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(false);
  const [citizenVerificationStatus, setCitizenVerificationStatus] = useState(
    VERIFICATION_STATUS.APPROVED
  );

  // Simulate fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIssues(MOCK_ISSUES);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
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

  const handleIssueSubmit = (formData) => {
    const newIssue = {
      id: Date.now(),
      citizenName: "You",
      ward: formData.ward,
      location: formData.location || "Your location",
      timeAgo: "Just now",
      description: formData.description,
      category: formData.title,
      image: formData.image ? URL.createObjectURL(formData.image) : null,
      upvotes: 0,
      commentCount: 0,
      authorityResponse: null,
      comments: [],
    };
    setIssues((prev) => [newIssue, ...prev]);
  };

  const handleVerifyRedirect = () => {
    // In real app: navigate("/citizen/verification")
    window.location.href = "/citizen/verification";
  };

  return (
    <CitizenLayout>
      {/* Pending verification toast */}
      {pendingMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-5 py-3 text-sm shadow-lg font-medium">
          ⏳ Your verification is under review. Please wait for approval.
        </div>
      )}

      {/* Post Issue Button */}
      <PostIssueButton onClick={handlePostIssueClick} />

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
    </CitizenLayout>
  );
};

export default Home;