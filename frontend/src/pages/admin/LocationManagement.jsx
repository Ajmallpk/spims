import { useEffect, useState } from "react";
import {
    MapPinned,
    Building2,
    Map,
} from "lucide-react";
import { adminapi } from "@/service/adminurls";
import SearchableSelect from "@/components/common/SearchableSelect";
import toast from "react-hot-toast";

const tabs = [
    {
        id: "district",
        label: "District",
        icon: Map,
    },
    {
        id: "panchayath",
        label: "Panchayath",
        icon: Building2,
    },
    {
        id: "ward",
        label: "Ward",
        icon: MapPinned,
    },
];

const LocationManagement = () => {
    const [activeTab, setActiveTab] = useState("district");
    const [districtName, setDistrictName] = useState("");
    const [districtCode, setDistrictCode] = useState("");

    const [districts, setDistricts] = useState([]);
    const [existingDistricts, setExistingDistricts] = useState([]);
    const [existingPanchayaths, setExistingPanchayaths] = useState([]);
    const [existingWards, setExistingWards] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [panchayathName, setPanchayathName] = useState("");
    const [panchayathCode, setPanchayathCode] = useState("");
    const [selectedWardDistrict, setSelectedWardDistrict] = useState("");
    const [selectedWardPanchayath, setSelectedWardPanchayath] = useState("");
    const [wardNumber, setWardNumber] = useState("");
    const [wardName, setWardName] = useState("");
    const [wardCode, setWardCode] = useState("");
    const [wardPanchayaths, setWardPanchayaths] = useState([]);
    const [loading, setLoading] = useState(false);



    useEffect(() => {

        loadDistricts();

        loadExistingDistricts();

    }, []);


    useEffect(() => {

        if (!selectedWardDistrict) {
            setWardPanchayaths([]);
            return;
        }

        loadWardPanchayaths();

    }, [selectedWardDistrict]);



    useEffect(() => {

        loadExistingPanchayaths();

    }, [selectedDistrict]);

    useEffect(() => {

        loadExistingWards();

    }, [selectedWardPanchayath]);

    const loadDistricts = async () => {
        try {

            const res = await adminapi.getLocationDistricts();

            setDistricts(res.data.data);

        } catch (err) {
            console.log(err);
        }
    };


    const loadWardPanchayaths = async () => {

        try {

            const res = await adminapi.getLocationPanchayaths(
                selectedWardDistrict
            );

            setWardPanchayaths(
                res.data.data
            );

        } catch (err) {

            console.log(err);

        }

    };



    const loadExistingDistricts = async () => {

        const res = await adminapi.getExistingLocations({
            type: "DISTRICT",
        });

        setExistingDistricts(res.data.data);

    };

    const loadExistingPanchayaths = async () => {

        if (!selectedDistrict) return;

        const res = await adminapi.getExistingLocations({
            type: "PANCHAYATH",
            district: selectedDistrict,
        });

        setExistingPanchayaths(res.data.data);

    };

    const loadExistingWards = async () => {

        if (!selectedWardPanchayath) return;

        const res = await adminapi.getExistingLocations({
            type: "WARD",
            panchayath: selectedWardPanchayath,
        });

        setExistingWards(res.data.data);

    };




    const createDistrict = async () => {

        try {

            setLoading(true);

            await adminapi.createDistrict({

                name: districtName,
                code: districtCode,

            });


            // toast.success("District created successfully.");

            setDistrictName("");
            setDistrictCode("");

            loadDistricts();

        } catch (err) {

            console.log(err);
            handleApiError(err, "Failed to create district");

        } finally {

            setLoading(false);

        }

    };



    const createPanchayath = async () => {
        try {

            setLoading(true);

            await adminapi.createPanchayath({

                district: selectedDistrict,

                name: panchayathName,

                code: panchayathCode,

            });

            // toast.success("Panchayath created successfully.");

            setSelectedDistrict("");
            setPanchayathName("");
            setPanchayathCode("");

        } catch (err) {

            console.log(err);
            handleApiError(err, "Failed to create panchayath");
        } finally {

            setLoading(false);

        }
    };


    const createWard = async () => {

        try {

            setLoading(true);

            await adminapi.createWard({

                panchayath: selectedWardPanchayath,

                ward_number: wardNumber,

                ward_name: wardName,

                code: wardCode,

            });

            // toast.success("Ward created successfully.");

            setSelectedWardDistrict("");
            setSelectedWardPanchayath("");

            setWardNumber("");
            setWardName("");
            setWardCode("");

            setWardPanchayaths([]);

        } catch (err) {

            console.log(err);
            handleApiError(err, "Failed to create ward");
        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="p-6 space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Location Management
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage Kerala Districts, Panchayaths and Wards.
                </p>
            </div>

            {/* Tabs */}

            <div className="bg-white rounded-xl shadow border p-2 flex gap-2">

                {tabs.map((tab) => {
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-lg transition w-full justify-center

                ${activeTab === tab.id
                                    ? "bg-emerald-500 text-white"
                                    : "hover:bg-gray-100 text-gray-700"
                                }

              `}
                        >
                            <Icon size={18} />

                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Form Card */}

            <div className="bg-white rounded-xl shadow border p-6">

                {activeTab === "district" && (
                    <div className="space-y-5">

                        <h2 className="text-lg font-semibold">
                            Create District
                        </h2>

                        <div>
                            <label className="text-sm font-medium">
                                District Name
                            </label>

                            <input
                                value={districtName}
                                onChange={(e) => setDistrictName(e.target.value)}
                                className="mt-2 w-full border rounded-lg px-4 py-3"
                                placeholder="Enter district name"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                District Code
                            </label>

                            <input
                                value={districtCode}
                                onChange={(e) => setDistrictCode(e.target.value)}
                                className="mt-2 w-full border rounded-lg px-4 py-3"
                                placeholder="Optional"
                            />
                        </div>

                        <button
                            onClick={createDistrict}
                            disabled={loading}
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
                        >
                            {loading ? "Creating..." : "Create District"}
                        </button>



                        <hr />

                        <SearchableSelect
                            placeholder="Search Existing District"

                            options={existingDistricts.map(item => ({
                                value: item.id,
                                label: item.name,
                            }))}

                            isClearable
                        />

                    </div>
                )}

                {activeTab === "panchayath" && (
                    <div className="space-y-5">

                        <h2 className="text-lg font-semibold">
                            Create Panchayath
                        </h2>

                        <SearchableSelect
                            placeholder="Search District..."
                            options={districts.map((district) => ({
                                value: district.id,
                                label: district.name,
                            }))}
                            value={
                                districts
                                    .map((district) => ({
                                        value: district.id,
                                        label: district.name,
                                    }))
                                    .find(
                                        (item) =>
                                            String(item.value) === String(selectedDistrict)
                                    ) || null
                            }
                            onChange={(selected) =>
                                setSelectedDistrict(
                                    selected ? selected.value : ""
                                )
                            }
                        />


                        <SearchableSelect
                            placeholder="Search Existing Panchayath"

                            options={existingPanchayaths.map(item => ({
                                value: item.id,
                                label: item.name,
                            }))}

                            isClearable
                        />

                        <input
                            value={panchayathName}
                            onChange={(e) =>
                                setPanchayathName(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-3"
                            placeholder="Panchayath Name"
                        />

                        <input
                            value={panchayathCode}
                            onChange={(e) =>
                                setPanchayathCode(e.target.value)
                            }
                            className="w-full border rounded-lg px-4 py-3"
                            placeholder="Panchayath Code"
                        />

                        <button
                            onClick={createPanchayath}
                            disabled={loading}
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
                        >
                            {loading ? "Creating..." : "Create Panchayath"}
                        </button>

                    </div>
                )}

                {activeTab === "ward" && (
                    <div className="space-y-5">

                        <h2 className="text-lg font-semibold">
                            Create Ward
                        </h2>

                        <SearchableSelect
                            placeholder="Search District..."

                            options={districts.map((district) => ({
                                value: district.id,
                                label: district.name,
                            }))}

                            value={
                                districts
                                    .map((district) => ({
                                        value: district.id,
                                        label: district.name,
                                    }))
                                    .find(
                                        (item) =>
                                            String(item.value) ===
                                            String(selectedWardDistrict)
                                    ) || null
                            }

                            onChange={(selected) => {

                                setSelectedWardDistrict(
                                    selected ? selected.value : ""
                                );

                                setSelectedWardPanchayath("");

                            }}
                        />

                        <SearchableSelect
                            placeholder="Search Panchayath..."

                            isDisabled={!selectedWardDistrict}

                            options={wardPanchayaths.map((item) => ({
                                value: item.id,
                                label: item.name,
                            }))}

                            value={
                                wardPanchayaths
                                    .map((item) => ({
                                        value: item.id,
                                        label: item.name,
                                    }))
                                    .find(
                                        (item) =>
                                            String(item.value) ===
                                            String(selectedWardPanchayath)
                                    ) || null
                            }

                            onChange={(selected) =>
                                setSelectedWardPanchayath(
                                    selected ? selected.value : ""
                                )
                            }
                        />


                        <SearchableSelect
                            placeholder="Search Existing Ward"

                            options={existingWards.map(item => ({
                                value: item.id,
                                label: `Ward ${item.ward_number} - ${item.ward_name}`,
                            }))}

                            isClearable
                        />

                        <input
                            value={wardNumber}
                            onChange={(e) => setWardNumber(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3"
                            placeholder="Ward Number"
                        />

                        <input
                            value={wardName}
                            onChange={(e) => setWardName(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3"
                            placeholder="Ward Name"
                        />

                        <input
                            value={wardCode}
                            onChange={(e) => setWardCode(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3"
                            placeholder="Ward Code"
                        />

                        <button
                            onClick={createWard}
                            disabled={loading}
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
                        >
                            {loading ? "Creating..." : "Create Ward"}
                        </button>

                    </div>
                )}

            </div>

        </div>
    );
};

export default LocationManagement;