import DetailStatCard from "@/components/ward/DetailStatCard";

export default function CitizenStatsGrid({ stats, isLoading }) {
  const cards = [
    { label: "Total Complaints", value: stats?.total, color: "blue", icon: "📋" },
    { label: "Pending Complaints", value: stats?.pending, color: "amber", icon: "⏳" },
    { label: "Resolved Complaints", value: stats?.resolved, color: "green", icon: "✅" },
    { label: "Escalated Complaints", value: stats?.escalated, color: "purple", icon: "🔺" },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md p-5 animate-pulse h-32">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <DetailStatCard key={i} {...card} />
      ))}
    </div>
  );
}