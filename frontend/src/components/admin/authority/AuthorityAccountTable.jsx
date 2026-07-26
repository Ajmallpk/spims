import { useEffect, useMemo, useState } from "react";
import { adminapi } from "@/service/adminurls";
import ResetPasswordModal from "./ResetPasswordModal";
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

const AuthorityAccountTable = ({ refreshKey }) => {

    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [selectedAccount, setSelectedAccount] = useState(null);

    const [resetModalOpen, setResetModalOpen] = useState(false);

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

    if (loading) {

        return (
            <div className="bg-white rounded-xl border shadow-sm p-6">
                Loading...
            </div>
        );

    }

    return (

        <div className="bg-white rounded-xl shadow-sm border p-6">

            <div className="flex justify-between items-center mb-5">

                <h2 className="text-2xl font-semibold">
                    Existing Panchayath Accounts
                </h2>

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="border rounded-lg px-4 py-2 w-72"
                />

            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b bg-gray-50">

                            <th className="text-left p-3">
                                District
                            </th>

                            <th className="text-left p-3">
                                Panchayath
                            </th>

                            <th className="text-left p-3">
                                Official Email
                            </th>

                            <th className="text-left p-3">
                                Official Phone
                            </th>

                            <th className="text-left p-3">
                                Officer Email
                            </th>

                            <th className="text-left p-3">
                                Status
                            </th>

                            <th className="text-center p-3">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredAccounts.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    className="text-center py-10 text-gray-500"
                                >
                                    No Panchayath Accounts Found
                                </td>

                            </tr>

                        ) : (

                            filteredAccounts.map((account) => (

                                <tr
                                    key={account.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-3">
                                        {account.district}
                                    </td>

                                    <td className="p-3">
                                        {account.panchayath}
                                    </td>

                                    <td className="p-3">
                                        {account.official_email}
                                    </td>

                                    <td className="p-3">
                                        {account.official_phone}
                                    </td>

                                    <td className="p-3">
                                        {account.officer_personal_email}
                                    </td>

                                    <td className="p-3">
                                        <StatusBadge
                                            status={account.status}
                                        />
                                    </td>

                                    <td className="p-3">

                                        <div className="flex flex-wrap justify-center gap-2">

                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setResetModalOpen(true);
                                                }}
                                                className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm"
                                            >
                                                Reset Password
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setReplaceOfficerModalOpen(true);
                                                }}
                                                className="px-3 py-1 rounded-lg bg-amber-500 text-white text-sm"
                                            >
                                                Replace Officer
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setOfficeDetailsModalOpen(true);
                                                }}
                                                className="px-3 py-1 rounded-lg bg-teal-600 text-white text-sm"
                                            >
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

            <ResetPasswordModal
                open={resetModalOpen}
                userId={selectedAccount?.id}
                onClose={() => {
                    setResetModalOpen(false);
                    setSelectedAccount(null);
                    fetchAccounts();
                }}
            />

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