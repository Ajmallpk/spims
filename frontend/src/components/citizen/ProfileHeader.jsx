/**
 * ProfileHeader.jsx
 * Top card with avatar uploader, name, verification badge, edit button.
 *
 * Props:
 *   profile      : object
 *   loading      : boolean
 *   onAvatarUpload : (newUrl) => void
 *   onEditClick  : () => void
 *   token        : string
 */

import ProfileAvatarUploader from "@/components/citizen/Profileavataruploader";

const ProfileHeader = ({ profile, loading, onAvatarUpload, onEditClick, token }) => {
  const isVerified = profile?.verificationStatus === "APPROVED";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Teal gradient cover */}
      <div className="h-28 bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-400 relative">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 60%, white 1px, transparent 1px), radial-gradient(circle at 75% 25%, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="px-6 pb-5">
        {/* Avatar + actions row */}
        <div className="flex items-end justify-between -mt-12 mb-3">
          {/* Left: avatar */}
          {loading ? (
            <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-md animate-pulse flex-shrink-0" />
          ) : (
            <ProfileAvatarUploader
              avatarUrl={profile?.profile_image}
              fullName={profile?.fullName}
              onUpload={onAvatarUpload}
              token={token}
            />
          )}

          {/* Right: edit button */}
          {!loading && (
            <button
              onClick={onEditClick}
              className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition-all hover:shadow-md mb-1"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-3.5 h-3.5"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit Profile
            </button>
          )}
        </div>

        {/* Name + badges */}
        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-44 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 leading-tight">
                {profile?.fullName || "Citizen"}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {/* Ward */}
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-3.5 h-3.5 text-teal-400"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {profile?.wardName || "Ward Unassigned"}
                </span>

                {/* Verification badge */}
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 rounded-full px-3 py-1 text-xs font-semibold">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-3 h-3 text-teal-500"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verified Citizen
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-xs font-medium">
                    Not Verified
                  </span>
                )}
              </div>
            </div>

            {/* Member since */}
            {profile?.joinedDate && (
              <div className="text-right">
                <p className="text-xs text-gray-400">Member since</p>
                <p className="text-sm font-semibold text-gray-700">
                  {new Date(profile.joinedDate).toLocaleDateString("en-IN", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;