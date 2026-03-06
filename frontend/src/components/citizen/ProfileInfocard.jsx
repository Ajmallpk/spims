// citizen/components/ProfileInfoCard.jsx
import { Mail, Phone, Building2, MapPin, Calendar, User } from "lucide-react";
import ProfileImageUploader from "@/components/citizen/ProfileImageUploader";

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-indigo-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5 break-words">
          {value || <span className="text-gray-300 font-normal italic">Not provided</span>}
        </p>
      </div>
    </div>
  );
}

function formatDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Skeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse space-y-4">
      <div className="flex items-center gap-4 pb-4 border-b border-gray-50">
        <div className="w-20 h-20 bg-gray-200 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
      </div>
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-3 py-2">
          <div className="w-8 h-8 bg-gray-100 rounded-lg" />
          <div className="space-y-1.5 flex-1">
            <div className="h-2.5 bg-gray-100 rounded w-16" />
            <div className="h-3.5 bg-gray-200 rounded w-36" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProfileInfoCard({ profile, loading, onImageUpdate }) {
  if (loading) return <Skeleton />;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-1">
      {/* Image uploader section */}
      <div className="pb-5 border-b border-gray-100 mb-1">
        <ProfileImageUploader
          currentImage={profile?.profile_image || profile?.avatar}
          onSuccess={onImageUpdate}
        />
      </div>

      {/* Info rows */}
      <InfoRow
        icon={User}
        label="Full Name"
        value={profile?.full_name || profile?.name}
      />
      <InfoRow icon={Mail} label="Email" value={profile?.email} />
      <InfoRow icon={Phone} label="Phone" value={profile?.phone} />
      <InfoRow
        icon={Building2}
        label="Ward"
        value={profile?.ward_name || profile?.ward}
      />
      <InfoRow
        icon={MapPin}
        label="Address"
        value={profile?.full_address || profile?.address}
      />
      <InfoRow
        icon={Calendar}
        label="Member Since"
        value={formatDate(profile?.date_joined || profile?.created_at)}
      />
    </div>
  );
}