// import { useState } from "react";

// import CreatePanchayathForm from "@/components/admin/authority/CreatePanchayathForm";
// import AuthorityAccountTable from "@/components/admin/authority/AuthorityAccountTable";

// const AuthorityManagement = () => {

//     const [refreshKey, setRefreshKey] = useState(0);

//     const refreshAccounts = () => {
//         setRefreshKey((prev) => prev + 1);
//     };

//     return (

//         <div className="space-y-6">

//             <CreatePanchayathForm
//                 onSuccess={refreshAccounts}
//             />

//             <AuthorityAccountTable
//                 refreshKey={refreshKey}
//             />

//         </div>

//     );
// };

// export default AuthorityManagement;





import { useState } from "react";
import { UserPlus, Users } from "lucide-react";

import CreatePanchayathForm from "@/components/admin/authority/CreatePanchayathForm";
import AuthorityAccountTable from "@/components/admin/authority/AuthorityAccountTable";

const AuthorityManagement = () => {

    const [refreshKey, setRefreshKey] = useState(0);
    const [activeTab, setActiveTab] = useState("create"); // "create" | "manage"

    const refreshAccounts = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const tabs = [
        { key: "create", label: "Create Account", icon: UserPlus },
        { key: "manage", label: "Manage Accounts", icon: Users },
    ];

    return (

        <div className="max-w-6xl mx-auto space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Panchayath Authority
                </h1>
                <p className="text-gray-500 mt-1">
                    Create and manage panchayath authority accounts
                </p>
            </div>

            {/* Segmented toggle */}
            <div className="inline-flex p-1 bg-gray-100 rounded-2xl">

                {tabs.map(({ key, label, icon: Icon }) => {

                    const isActive = activeTab === key;

                    return (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isActive
                                    ? "bg-white text-emerald-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <Icon size={16} />
                            {label}
                        </button>
                    );

                })}

            </div>

            {/* Panels */}
            <div className="relative">

                <div
                    className={
                        activeTab === "create"
                            ? "animate-[fadeIn_0.25s_ease]"
                            : "hidden"
                    }
                >
                    <CreatePanchayathForm
                        onSuccess={() => {
                            refreshAccounts();
                            setActiveTab("manage");
                        }}
                    />
                </div>

                <div
                    className={
                        activeTab === "manage"
                            ? "animate-[fadeIn_0.25s_ease]"
                            : "hidden"
                    }
                >
                    <AuthorityAccountTable
                        refreshKey={refreshKey}
                    />
                </div>

            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

        </div>

    );
};

export default AuthorityManagement;