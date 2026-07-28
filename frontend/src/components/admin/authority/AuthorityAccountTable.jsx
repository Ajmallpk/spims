// import { useEffect, useMemo, useState } from "react";
// import { adminapi } from "@/service/adminurls";
// import ResetPasswordModal from "./ResetPasswordModal";
// import ReplaceOfficerModal from "./ReplaceOfficerModal";
// import EditOfficeDetailsModal from "./EditOfficeDetailsModal";

// const StatusBadge = ({ status }) => {

//     const colors = {
//         ACTIVE: "bg-green-100 text-green-700",
//         PENDING: "bg-yellow-100 text-yellow-700",
//         SUSPENDED: "bg-red-100 text-red-700",
//         REJECTED: "bg-gray-100 text-gray-700",
//     };

//     return (
//         <span
//             className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-700"
//                 }`}
//         >
//             {status}
//         </span>
//     );
// };

// const AuthorityAccountTable = ({ refreshKey }) => {

//     const [accounts, setAccounts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [search, setSearch] = useState("");

//     const [selectedAccount, setSelectedAccount] = useState(null);

//     const [resetModalOpen, setResetModalOpen] = useState(false);

//     const [replaceOfficerModalOpen, setReplaceOfficerModalOpen] = useState(false);

//     const [officeDetailsModalOpen, setOfficeDetailsModalOpen] = useState(false);

//     const fetchAccounts = async () => {

//         try {

//             setLoading(true);

//             const response =
//                 await adminapi.getAuthorityPanchayaths();


//             console.log("API RESPONSE:", response);

//             setAccounts(response.data || []);

//         } catch (error) {

//             console.error(error);

//         } finally {

//             setLoading(false);

//         }

//     };

//     useEffect(() => {

//         fetchAccounts();

//     }, [refreshKey]);

//     const filteredAccounts = useMemo(() => {

//         return accounts.filter((account) => {

//             const keyword = search.toLowerCase();

//             return (
//                 (account.district ?? "").toLowerCase().includes(keyword) ||
//                 (account.panchayath ?? "").toLowerCase().includes(keyword) ||
//                 (account.official_email ?? "").toLowerCase().includes(keyword)
//             );

//         });

//     }, [accounts, search]);

//     if (loading) {

//         return (
//             <div className="bg-white rounded-xl border shadow-sm p-6">
//                 Loading...
//             </div>
//         );

//     }

//     return (

//         <div className="bg-white rounded-xl shadow-sm border p-6">

//             <div className="flex justify-between items-center mb-5">

//                 <h2 className="text-2xl font-semibold">
//                     Existing Panchayath Accounts
//                 </h2>

//                 <input
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     placeholder="Search..."
//                     className="border rounded-lg px-4 py-2 w-72"
//                 />

//             </div>

//             <div className="overflow-x-auto">

//                 <table className="min-w-full">

//                     <thead>

//                         <tr className="border-b bg-gray-50">

//                             <th className="text-left p-3">
//                                 District
//                             </th>

//                             <th className="text-left p-3">
//                                 Panchayath
//                             </th>

//                             <th className="text-left p-3">
//                                 Official Email
//                             </th>

//                             <th className="text-left p-3">
//                                 Official Phone
//                             </th>

//                             <th className="text-left p-3">
//                                 Officer Email
//                             </th>

//                             <th className="text-left p-3">
//                                 Status
//                             </th>

//                             <th className="text-center p-3">
//                                 Actions
//                             </th>

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {filteredAccounts.length === 0 ? (

//                             <tr>

//                                 <td
//                                     colSpan="7"
//                                     className="text-center py-10 text-gray-500"
//                                 >
//                                     No Panchayath Accounts Found
//                                 </td>

//                             </tr>

//                         ) : (

//                             filteredAccounts.map((account) => (

//                                 <tr
//                                     key={account.id}
//                                     className="border-b hover:bg-gray-50"
//                                 >

//                                     <td className="p-3">
//                                         {account.district}
//                                     </td>

//                                     <td className="p-3">
//                                         {account.panchayath}
//                                     </td>

//                                     <td className="p-3">
//                                         {account.official_email}
//                                     </td>

//                                     <td className="p-3">
//                                         {account.official_phone}
//                                     </td>

//                                     <td className="p-3">
//                                         {account.officer_personal_email}
//                                     </td>

//                                     <td className="p-3">
//                                         <StatusBadge
//                                             status={account.status}
//                                         />
//                                     </td>

//                                     <td className="p-3">

//                                         <div className="flex flex-wrap justify-center gap-2">

//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedAccount(account);
//                                                     setResetModalOpen(true);
//                                                 }}
//                                                 className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
//                                             >
//                                                 Reset Password
//                                             </button>

//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedAccount(account);
//                                                     setReplaceOfficerModalOpen(true);
//                                                 }}
//                                                 className="px-3 py-1 rounded-lg bg-amber-500 text-white text-sm"
//                                             >
//                                                 Replace Officer
//                                             </button>

//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedAccount(account);
//                                                     setOfficeDetailsModalOpen(true);
//                                                 }}
//                                                 className="px-3 py-1 rounded-lg bg-teal-600 text-white text-sm"
//                                             >
//                                                 Office Details
//                                             </button>

//                                         </div>

//                                     </td>

//                                 </tr>

//                             ))

//                         )}

//                     </tbody>

//                 </table>

//             </div>

//             <ResetPasswordModal
//                 open={resetModalOpen}
//                 userId={selectedAccount?.id}
//                 onClose={() => {
//                     setResetModalOpen(false);
//                     setSelectedAccount(null);
//                     fetchAccounts();
//                 }}
//             />

//             <ReplaceOfficerModal
//                 open={replaceOfficerModalOpen}
//                 userId={selectedAccount?.id}
//                 currentEmail={selectedAccount?.officer_personal_email}
//                 onClose={() => {
//                     setReplaceOfficerModalOpen(false);
//                     setSelectedAccount(null);
//                     fetchAccounts();
//                 }}
//             />

//             <EditOfficeDetailsModal
//                 open={officeDetailsModalOpen}
//                 account={selectedAccount}
//                 onClose={(refresh = false) => {

//                     setOfficeDetailsModalOpen(false);

//                     setSelectedAccount(null);

//                     if (refresh) {
//                         fetchAccounts();
//                     }

//                 }}
//             />

//         </div>

//     );

// };

// export default AuthorityAccountTable;





import { useEffect, useMemo, useState } from "react";
import { Search, KeyRound, UserCog, Settings2, Inbox } from "lucide-react";
import { adminapi } from "@/service/adminurls";
// import ResetPasswordModal from "./ResetPasswordModal";
import ReplaceOfficerModal from "./ReplaceOfficerModal";
import EditOfficeDetailsModal from "./EditOfficeDetailsModal";

const StatusBadge = ({ status }) => {

    const colors = {
        ACTIVE: "bg-green-100 text-green-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        SUSPENDED: "bg-red-100 text-red-700",
        REJECTED: "bg-gray-100 text-gray-700",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || "bg-gray-100 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
};

const SkeletonRow = () => (
    <tr className="border-b border-gray-100">
        {Array.from({ length: 7 }).map((_, i) => (
            <td key={i} className="p-3">
                <div className="h-4 bg-gray-100 rounded animate-pulse" />
            </td>
        ))}
    </tr>
);

const AuthorityAccountTable = ({ refreshKey }) => {

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [selectedAccount, setSelectedAccount] = useState(null);

    // const [resetModalOpen, setResetModalOpen] = useState(false);

    const [replaceOfficerModalOpen, setReplaceOfficerModalOpen] = useState(false);

    const [officeDetailsModalOpen, setOfficeDetailsModalOpen] = useState(false);

    const fetchAccounts = async () => {

        try {

            setLoading(true);

            const response =
                await adminapi.getAuthorityPanchayaths();


            console.log("API RESPONSE:", response);

            setAccounts(response.data || []);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchAccounts();

    }, [refreshKey]);

    const filteredAccounts = useMemo(() => {

        return accounts.filter((account) => {

            const keyword = search.toLowerCase();

            return (
                (account.district ?? "").toLowerCase().includes(keyword) ||
                (account.panchayath ?? "").toLowerCase().includes(keyword) ||
                (account.official_email ?? "").toLowerCase().includes(keyword)
            );

        });

    }, [accounts, search]);

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-6 py-5 border-b border-gray-100">

                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Existing Panchayath Accounts
                    </h2>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {accounts.length} account{accounts.length === 1 ? "" : "s"} registered
                    </p>
                </div>

                <div className="relative">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search district, panchayath, email..."
                        className="border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 w-full sm:w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                </div>

            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b border-gray-100 bg-gray-50">

                            <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                District
                            </th>

                            <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Panchayath
                            </th>

                            <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Official Email
                            </th>

                            <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Official Phone
                            </th>

                            <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Officer Email
                            </th>

                            <th className="text-left p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Status
                            </th>

                            <th className="text-center p-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)

                        ) : filteredAccounts.length === 0 ? (

                            <tr>

                                <td colSpan="7" className="text-center py-14">
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Inbox size={28} />
                                        <span className="text-sm font-medium text-gray-500">
                                            No Panchayath Accounts Found
                                        </span>
                                    </div>
                                </td>

                            </tr>

                        ) : (

                            filteredAccounts.map((account) => (

                                <tr
                                    key={account.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >

                                    <td className="p-3 font-medium text-gray-800">
                                        {account.district}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {account.panchayath}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {account.official_email}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {account.official_phone}
                                    </td>

                                    <td className="p-3 text-gray-600">
                                        {account.officer_personal_email}
                                    </td>

                                    <td className="p-3">
                                        <StatusBadge
                                            status={account.status}
                                        />
                                    </td>

                                    <td className="p-3">

                                        <div className="flex flex-wrap justify-center gap-2">

                                            {/* <button
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setResetModalOpen(true);
                                                }}
                                                title="Reset Password"
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
                                            >
                                                <KeyRound size={13} />
                                                Reset Password
                                            </button> */}

                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setReplaceOfficerModalOpen(true);
                                                }}
                                                title="Replace Officer"
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-semibold transition"
                                            >
                                                <UserCog size={13} />
                                                Replace Officer
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setOfficeDetailsModalOpen(true);
                                                }}
                                                title="Office Details"
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition"
                                            >
                                                <Settings2 size={13} />
                                                Office Details
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

            {/* <ResetPasswordModal
                open={resetModalOpen}
                userId={selectedAccount?.id}
                onClose={() => {
                    setResetModalOpen(false);
                    setSelectedAccount(null);
                    fetchAccounts();
                }}
            /> */}

            <ReplaceOfficerModal
                open={replaceOfficerModalOpen}
                userId={selectedAccount?.id}
                currentEmail={selectedAccount?.officer_personal_email}
                onClose={() => {
                    setReplaceOfficerModalOpen(false);
                    setSelectedAccount(null);
                    fetchAccounts();
                }}
            />

            <EditOfficeDetailsModal
                open={officeDetailsModalOpen}
                account={selectedAccount}
                onClose={(refresh = false) => {

                    setOfficeDetailsModalOpen(false);

                    setSelectedAccount(null);

                    if (refresh) {
                        fetchAccounts();
                    }

                }}
            />

        </div>

    );

};

export default AuthorityAccountTable;