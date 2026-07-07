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
  ArrowUp,
} from "lucide-react";
import complaintapi from "@/service/complaintsurls";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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
  "HOLD",
  "RESOLVED",
  "ESCALATED",
  "REJECTED",
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
z-20
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
    district: null,
    ward: null,
    panchayath: null,
    category: null,
    status: null,
  });

  const [allIssues, setAllIssues] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [panchayaths, setPanchayaths] = useState([]);
  const [wards, setWards] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [nextPage, setNextPage] = useState(null);
  const [authority, setAuthority] = useState({});
  const [showTopButton, setShowTopButton] = useState(false);

  const sentinelRef = useRef(null);
  const filterBarRef = useRef(null);


  useEffect(() => {

    const fetchIssues = async () => {

      try {

        setInitialLoading(true);

        const selectedDistrict = districts.find(
          d => d.name === selections.district
        );

        const selectedPanchayath = panchayaths.find(
          p => p.name === selections.panchayath
        );

        const selectedWard = wards.find(
          w =>
            (w.ward_name || `Ward ${w.ward_number}`) ===
            selections.ward
        );

        const res = await complaintapi.getExploreIssues({

          search: searchQuery || undefined,

          district: selectedDistrict?.id,

          panchayath: selectedPanchayath?.id,

          ward: selectedWard?.id,

          category: selections.category,

          status: selections.status,

        });

        console.log(res.data);

        setAllIssues(res.data.results || []);
        setNextPage(res.data.next);
        setAuthority(res.data.authority || {});

        const filterRes =
          await complaintapi.getExploreFilterData();

        setDistricts(filterRes.data.districts);
        setPanchayaths(filterRes.data.panchayaths);
        setWards(filterRes.data.wards);

      }
      catch (err) {

        console.log(err);

      }
      finally {

        setInitialLoading(false);

      }

    };

    fetchIssues();

  }, [
    searchQuery,
    selections,
  ]);



  useEffect(() => {

    const handleScroll = () => {

      if (window.scrollY > 400) {

        setShowTopButton(true);

      } else {

        setShowTopButton(false);

      }

    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {

      window.removeEventListener(
        "scroll",
        handleScroll
      );

    };

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
      setSelections({ district: null, ward: null, panchayath: null, category: null, status: null });
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


  // const districtOptions = [
  //   ...new Set(
  //     allIssues
  //       .map(issue => issue.district_name)
  //       .filter(Boolean)
  //   )
  // ];


  // const wardOptions = [
  //   ...new Set(
  //     allIssues
  //       .map(issue => issue.ward_name)
  //       .filter(Boolean)
  //   )
  // ];

  // const panchayathOptions = [
  //   ...new Set(
  //     allIssues
  //       .map(issue => issue.panchayath_name)
  //       .filter(Boolean)
  //   )
  // ];



  const districtOptions =
    districts.map(d => d.name);

  const selectedDistrict =
    districts.find(
      d => d.name === selections.district
    );

  const panchayathOptions =
    panchayaths
      .filter(p =>

        !selectedDistrict ||

        p.district_id === selectedDistrict.id

      )
      .map(p => p.name);

  const selectedPanchayath =
    panchayaths.find(
      p => p.name === selections.panchayath
    );

  const wardOptions =
    wards
      .filter(w =>

        !selectedPanchayath ||

        w.panchayath_id === selectedPanchayath.id

      )
      .map(w =>

        w.ward_name ||

        `Ward ${w.ward_number}`

      );

  const FILTERS = [
    {
      key: "all",
      label: "All",
      icon: LayoutGrid,
      options: null,
    },


    // {
    //   key: "district",
    //   label: "District",
    //   icon: MapPin,
    //   options: districtOptions,
    // },

    // {
    //   key: "ward",
    //   label: "Ward",
    //   icon: Building2,
    //   options: wardOptions,
    // },

    // {
    //   key: "panchayath",
    //   label: "Panchayath",
    //   icon: MapPin,
    //   options: panchayathOptions,
    // },

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
  const filteredIssues = allIssues;

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



  const scrollToTop = () => {

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };

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
          className="flex items-center gap-2 mb-7  relative z-10"
        >

          <div className="w-64">

            <Select

              placeholder="Select District"

              isClearable

              options={districts.map(d => ({
                value: d.id,
                label: d.name,
              }))}

              value={
                districts
                  .filter(d => d.name === selections.district)
                  .map(d => ({
                    value: d.id,
                    label: d.name,
                  }))[0] || null
              }

              onChange={(selected) => {

                setSelections(prev => ({
                  ...prev,

                  district: selected?.label || null,

                  panchayath: null,

                  ward: null,
                }));

              }}

            />

          </div>


          <div className="w-64">

            <Select

              placeholder="Select Panchayath"

              isClearable

              isDisabled={!selections.district}

              options={
                panchayaths
                  .filter(p =>

                    !selectedDistrict ||

                    p.district_id === selectedDistrict.id

                  )
                  .map(p => ({
                    value: p.id,
                    label: p.name,
                  }))
              }

              value={
                panchayaths
                  .filter(
                    p => p.name === selections.panchayath
                  )
                  .map(p => ({
                    value: p.id,
                    label: p.name,
                  }))[0] || null
              }

              onChange={(selected) => {

                setSelections(prev => ({

                  ...prev,

                  panchayath: selected?.label || null,

                  ward: null,

                }));

              }}

            />

          </div>


          <div className="w-64">

            <Select

              placeholder="Select Ward"

              isClearable

              isDisabled={!selections.panchayath}

              options={
                wards
                  .filter(w =>

                    !selectedPanchayath ||

                    w.panchayath_id === selectedPanchayath.id

                  )
                  .map(w => ({
                    value: w.id,
                    label: w.ward_name || `Ward ${w.ward_number}`,
                  }))
              }

              value={
                wards
                  .filter(
                    w =>
                      (w.ward_name || `Ward ${w.ward_number}`)
                      === selections.ward
                  )
                  .map(w => ({
                    value: w.id,
                    label: w.ward_name || `Ward ${w.ward_number}`,
                  }))[0] || null
              }

              onChange={(selected) => {

                setSelections(prev => ({

                  ...prev,

                  ward: selected?.label || null,

                }));

              }}

            />

          </div>
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
              onClick={() => setSelections({ district: null, ward: null, panchayath: null, category: null, status: null })}
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
          <div className="bg-white rounded-2xl shadow-md p-10 text-center">

            <h2 className="text-lg font-semibold text-gray-700">
              No complaints found
            </h2>

            <p className="text-gray-500 mt-2">
              No complaints are available for the selected filters.
            </p>

            <div className="mt-6 space-y-3">

              {selections.district && !authority.district_has_ward && (

                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">

                  <p className="font-medium text-yellow-700">
                    No verified Ward Officer available in this district.
                  </p>

                </div>

              )}

              {selections.district && !authority.district_has_panchayath && (

                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-3">

                  <p className="font-medium text-yellow-700">
                    No verified Panchayath Officer available in this district.
                  </p>

                </div>

              )}

              {selections.ward && !authority.ward_available && (

                <div className="rounded-lg bg-red-50 border border-red-200 p-3">

                  <p className="font-medium text-red-700">
                    This ward currently has no verified Ward Officer.
                  </p>

                </div>

              )}

              {selections.panchayath && !authority.panchayath_available && (

                <div className="rounded-lg bg-red-50 border border-red-200 p-3">

                  <p className="font-medium text-red-700">
                    This panchayath currently has no verified Panchayath Officer.
                  </p>

                </div>

              )}

            </div>

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

      {
        showTopButton && (

          <button
            onClick={scrollToTop}
            className="
      fixed
      bottom-8
      right-8
      bg-teal-500
      text-white
      p-3
      rounded-full
      shadow-lg
      hover:bg-teal-600
      transition
      z-50
      "
          >

            <ArrowUp className="w-5 h-5" />

          </button>

        )
      }
    </div>
  );
};

export default ExploreIssuesPage;