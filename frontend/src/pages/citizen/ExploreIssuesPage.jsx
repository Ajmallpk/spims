import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Search,
  MapPin,
  LayoutGrid,
  Tag,
  Building2,
  CircleDot,
  Lightbulb,
  Construction,
  Droplets,
  Trash2,
  TreePine,
  AlertTriangle,
  ChevronDown,
  X,
} from "lucide-react";
import complaintapi from "@/service/complaintsurls";
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------
// Mock data
// ----------------------------------------------------------------

// const CATEGORIES = [
//   { name: "Broken Streetlight", color: "bg-amber-400", icon: Lightbulb },
//   { name: "Road Damage", color: "bg-orange-400", icon: Construction },
//   { name: "Drainage Blockage", color: "bg-sky-400", icon: Droplets },
//   { name: "Garbage Collection", color: "bg-lime-500", icon: Trash2 },
//   { name: "Tree Hazard", color: "bg-emerald-500", icon: TreePine },
//   { name: "Public Safety", color: "bg-rose-400", icon: AlertTriangle },
// ];

const STATUSES = [
  "PENDING",
  "IN_PROGRESS",
  "RESOLVED"
];

// const WARDS = [
//   "Ward 04, Market Road",
//   "Ward 07, East Colony",
//   "Ward 12, Civil Lines",
//   "Ward 02, Lake View",
//   "Ward 09, Hilltop",
// ];

// const PANCHAYATHS = [
//   "Kunnamkulam Panchayath",
//   "Vadakkumbad Panchayath",
//   "Erumapetty Panchayath",
//   "Thrithala Panchayath",
// ];

// const NAMES = [
//   "Priya Sharma",
//   "Anil Kumar",
//   "Deepa Krishnan",
//   "Rajesh Nair",
//   "Sunita Menon",
//   "Meera Patel",
//   "Vishnu Raj",
//   "Arjun Das",
//   "Kavya Pillai",
//   "Suresh Babu",
// ];

// const SAMPLE_IMAGES = [
//   "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&q=80",
//   "https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=600&q=80",
//   "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&q=80",
//   "https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?w=600&q=80",
//   null,
//   null,
// ];

// const generateMockIssues = (count, startId = 1) => {
//   return Array.from({ length: count }, (_, i) => {
//     const id = startId + i;
//     const category = CATEGORIES[id % CATEGORIES.length];
//     const status = STATUSES[id % STATUSES.length];
//     const image = SAMPLE_IMAGES[id % SAMPLE_IMAGES.length];
//     const ward = WARDS[id % WARDS.length];
//     const panchayath = PANCHAYATHS[id % PANCHAYATHS.length];
//     return {
//       id,
//       citizenName: NAMES[id % NAMES.length],
//       ward,
//       panchayath,
//       location: category.name.split(" ")[0] + " Junction",
//       category: category.name,
//       categoryColor: category.color,
//       CategoryIcon: category.icon,
//       status,
//       image,
//     };
//   });
// };

const STATUS_STYLES = {
  PENDING:
    "bg-yellow-50 text-yellow-700 border border-yellow-200",

  IN_PROGRESS:
    "bg-blue-50 text-blue-700 border border-blue-200",

  RESOLVED:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",
};





// const TOTAL_MOCK_ISSUES = 60;


const CATEGORY_ICONS = {
  ROAD: Construction,
  WATER: Droplets,
  ELECTRICITY: Lightbulb,
  WASTE: Trash2,
  OTHER: AlertTriangle,
};

const CATEGORY_COLORS = {
  ROAD: "bg-orange-400",
  WATER: "bg-sky-400",
  ELECTRICITY: "bg-yellow-400",
  WASTE: "bg-green-500",
  OTHER: "bg-rose-500",
};

// ----------------------------------------------------------------
// Issue Card
// ----------------------------------------------------------------

const IssueCard = ({ issue }) => {

  const navigate = useNavigate();

  const CategoryIcon =
    CATEGORY_ICONS[issue.category] || AlertTriangle;

  const categoryColor =
    CATEGORY_COLORS[issue.category] || "bg-gray-400";

  const videoMedia = issue.media?.find(
    m => m.file_type === "VIDEO"
  );

  const imageMedia = issue.media?.find(
    m => m.file_type === "IMAGE"
  );

  const media = videoMedia || imageMedia;

  // const mediaUrl = media?.file;

  const mediaUrl =
    media?.file?.replace("http://", "https://");

  const isVideo = media?.file_type === "VIDEO";



  return (
    <div
      onClick={() => navigate(`/citizen/explore/${issue.id}`)}
      className="group relative z-0 rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.03] cursor-pointer"
    >
      {/* Status badge */}

      <span
        className={`absolute top-2 right-2 z-10 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm ${STATUS_STYLES[issue.status]}`}
      >
        {issue.status}
      </span>


      <span
        className="absolute top-2 left-2 z-20 bg-black/60 text-white px-2 py-1 rounded-full text-[10px] font-medium"
      >
        {issue.category}
      </span>

      {/* Image / placeholder */}
      <div className="aspect-square w-full relative overflow-hidden">
        {mediaUrl ? (
          isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
              onError={(e) => console.log("video error", mediaUrl)}
            />
          ) : (
            <img
              src={mediaUrl}
              alt={issue.category}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${categoryColor}`}
          >
            <CategoryIcon className="w-10 h-10 text-white/90" strokeWidth={1.5} />
          </div>
        )}

        {/* Bottom overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 pt-8 pb-2.5">
          <p className="text-white text-xs font-semibold truncate">
            {issue.citizen_name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-white/70 shrink-0" />
            <p className="text-white/70 text-[10px] truncate">{issue.ward_name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// Skeleton card (loading state)
// ----------------------------------------------------------------

const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden bg-white shadow-md animate-pulse">
    <div className="aspect-square w-full bg-gray-200" />
  </div>
);

// ----------------------------------------------------------------
// Filter Dropdown Button
// ----------------------------------------------------------------

const FilterButton = ({ filter, isOpen, selectedValue, onToggle, onSelect }) => {
  const Icon = filter.icon;
  const isActive = isOpen || !!selectedValue;

  if (filter.options === null) {
    // Plain "All" button - clears every filter
    return (
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-colors duration-150 shadow-sm ${isActive
          ? "bg-teal-500 text-white"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
          }`}
      >
        <Icon className="w-3.5 h-3.5" />
        {filter.label}
      </button>
    );
  }

  return (
    <div className="relative shrink-0 overflow-visible">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-150 shadow-sm whitespace-nowrap ${isActive
          ? "bg-teal-500 text-white"
          : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
          }`}
      >
        <Icon className="w-3.5 h-3.5" />
        {selectedValue ? selectedValue : filter.label}
        {selectedValue ? (
          <X
            className="w-3 h-3 ml-0.5 hover:opacity-70"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(null);
            }}
          />
        ) : (
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && (
        <div
          className="
absolute
left-0
top-full
mt-2
w-56
bg-white
rounded-xl
shadow-2xl
border
border-gray-100
py-1.5
max-h-64
overflow-y-auto
z-[99999]
"
        >
          {filter.options.map((option) => (
            <button
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${selectedValue === option
                ? "text-teal-600 bg-teal-50"
                : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// Main Page
// ----------------------------------------------------------------

const ExploreIssuesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFilter, setOpenFilter] = useState(null);


  const [selections, setSelections] = useState({
    ward: null,
    panchayath: null,
    category: null,
    status: null,
  });

  const [allIssues, setAllIssues] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);

  const sentinelRef = useRef(null);
  const filterBarRef = useRef(null);


  useEffect(() => {

    const fetchIssues = async () => {

      try {

        setInitialLoading(true);

        const res = await complaintapi.getExploreIssues();

        console.log(res.data);

        setAllIssues(res.data.results || []);
        setNextPage(res.data.next);

      }
      catch (err) {

        console.log(err);

      }
      finally {

        setInitialLoading(false);

      }

    };

    fetchIssues();

  }, []);


  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target)) {
        setOpenFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterToggle = (key) => {
    if (key === "all") {
      // Clear everything
      setSelections({ ward: null, panchayath: null, category: null, status: null });
      setOpenFilter(null);
      return;
    }
    setOpenFilter((prev) => (prev === key ? null : key));
  };

  const handleFilterSelect = (key, value) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
    setOpenFilter(null);
  };

  const activeFilterCount = Object.values(selections).filter(Boolean).length;


  const wardOptions = [
    ...new Set(
      allIssues
        .map(issue => issue.ward_name)
        .filter(Boolean)
    )
  ];

  const panchayathOptions = [
    ...new Set(
      allIssues
        .map(issue => issue.panchayath_name)
        .filter(Boolean)
    )
  ];

  const FILTERS = [
    {
      key: "all",
      label: "All",
      icon: LayoutGrid,
      options: null,
    },

    {
      key: "ward",
      label: "Ward",
      icon: Building2,
      options: wardOptions,
    },

    {
      key: "panchayath",
      label: "Panchayath",
      icon: MapPin,
      options: panchayathOptions,
    },

    {
      key: "category",
      label: "Category",
      icon: Tag,
      options: ["ROAD", "WATER", "ELECTRICITY", "WASTE", "OTHER"],
    },

    {
      key: "status",
      label: "Status",
      icon: CircleDot,
      options: STATUSES,
    },
  ];
  // Filter + search
  const filteredIssues = useMemo(() => {
    let result = allIssues;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((issue) =>
        (issue.citizen_name || "")
          .toLowerCase()
          .includes(q)
      );
    }

    if (selections.ward) {
      result = result.filter(
        issue => issue.ward_name === selections.ward
      );
    }

    if (selections.panchayath) {
      result = result.filter(
        issue => issue.panchayath_name === selections.panchayath
      );
    }
    if (selections.category) {
      result = result.filter((issue) => issue.category === selections.category);
    }
    if (selections.status) {
      result = result.filter((issue) => issue.status === selections.status);
    }

    return result;
  }, [allIssues, searchQuery, selections]);

  const visibleIssues = filteredIssues;
  const hasMore = nextPage !== null;



  // Infinite scroll loader
  const loadMore = useCallback(async () => {

    if (!nextPage || isFetchingMore) return;

    try {

      setIsFetchingMore(true);

      const pageNumber = new URL(nextPage)
        .searchParams
        .get("page");

      const res = await complaintapi.getExploreIssues({
        page: pageNumber
      });

      const data = res.data;

      setAllIssues(prev => {
        const merged = [...prev, ...(data.results || [])];

        return merged.filter(
          (item, index, self) =>
            index === self.findIndex(i => i.id === item.id)
        );
      });

      setNextPage(data.next);

    }
    catch (err) {

      console.log(err);

    }
    finally {

      setIsFetchingMore(false);

    }

  }, [nextPage, isFetchingMore]);

  // IntersectionObserver for scroll pagination
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-[#f3f4f6] pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-8 overflow-visible">
        {/* Top Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Explore Issues</h1>
          <p className="text-sm text-gray-500 mt-1">
            Discover public issues reported by citizens.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-5">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by citizen name..."
            className="w-full bg-white rounded-full pl-10 pr-4 py-2.5 text-sm shadow-md border border-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500/40 placeholder:text-gray-400"
          />
        </div>

        {/* Filter Buttons Row */}
        <div
          ref={filterBarRef}
          className="flex items-center gap-2 mb-7  relative z-50"
        >
          {FILTERS.map((filter) => (
            <FilterButton
              key={filter.key}
              filter={filter}
              isOpen={openFilter === filter.key}
              selectedValue={filter.options ? selections[filter.key] : null}
              onToggle={() => handleFilterToggle(filter.key)}
              onSelect={(value) => handleFilterSelect(filter.key, value)}
            />
          ))}

          {activeFilterCount > 0 && (
            <button
              onClick={() => setSelections({ ward: null, panchayath: null, category: null, status: null })}
              className="text-xs font-semibold text-gray-400 hover:text-gray-600 shrink-0 px-2"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Explore Grid */}
        {initialLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 relative z-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : visibleIssues.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-500">
            <p className="text-sm font-medium">No issues found.</p>
            <p className="text-xs mt-1">Try a different search term or filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 relative z-0">
              {visibleIssues.map((issue, index) => (
                <IssueCard key={`${issue.id}-${index}`} issue={issue} />
              ))}
            </div>

            {/* Loading more skeletons */}
            {isFetchingMore && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={`more-${i}`} />
                ))}
              </div>
            )}

            {/* Sentinel for IntersectionObserver */}
            <div ref={sentinelRef} className="h-4 w-full" />

            {/* End of list message */}
            {!hasMore && !isFetchingMore && (
              <p className="text-center text-xs text-gray-400 mt-8">
                You've reached the end of the list.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExploreIssuesPage;