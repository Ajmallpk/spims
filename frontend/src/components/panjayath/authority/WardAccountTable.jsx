import { useEffect, useMemo, useState } from "react";
import panchayathApi from "@/service/panchayathurls";
import ResetWardPasswordModal from "./ResetWardPasswordModal";
import ChangeWardOfficerEmailModal from "./ChangeWardOfficerEmailModal";

const StatusBadge = ({ status }) => {

    const colors = {
        ACTIVE: "bg-green-100 text-green-700",
        PENDING: "bg-yellow-100 text-yellow-700",
        SUSPENDED: "bg-red-100 text-red-700",
        REJECTED: "bg-gray-100 text-gray-700",
    };

    return (

        <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] ||
                "bg-gray-100 text-gray-700"
                }`}
        >
            {status}
        </span>

    );

};

const WardAccountTable = ({ refreshKey }) => {

    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");


    const [selectedAccount, setSelectedAccount] = useState(null);

    const [resetModalOpen, setResetModalOpen] = useState(false);

    const [emailModalOpen, setEmailModalOpen] = useState(false);

    const fetchAccounts = async () => {

        try {

            setLoading(true);

            const response =
                await panchayathApi.listWardAccounts();

            setAccounts(
                response.data.data
            );

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchAccounts();

    }, [refreshKey]);

    const filteredAccounts = useMemo(() => {

        const keyword =
            search.toLowerCase();

        return accounts.filter((account) => (

            (account.ward_name ?? "")
                .toLowerCase()
                .includes(keyword)

            ||

            String(
                account.ward_number
            ).includes(keyword)

            ||

            (account.official_email ?? "")
                .toLowerCase()
                .includes(keyword)

        ));

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

                    Existing Ward Accounts

                </h2>

                <input
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    placeholder="Search..."
                    className="border rounded-lg px-4 py-2 w-72"
                />

            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead>

                        <tr className="border-b bg-gray-50">

                            <th className="text-left p-3">
                                Ward No
                            </th>

                            <th className="text-left p-3">
                                Ward Name
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
                                    No Ward Accounts Found
                                </td>

                            </tr>

                        ) : (

                            filteredAccounts.map((account) => (

                                <tr
                                    key={account.id}
                                    className="border-b hover:bg-gray-50"
                                >

                                    <td className="p-3">
                                        {account.ward_number}
                                    </td>

                                    <td className="p-3">
                                        {account.ward_name}
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
                                            status={
                                                account.status
                                            }
                                        />

                                    </td>

                                    <td className="text-center p-3">

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

                                                setEmailModalOpen(true);

                                            }}
                                            className="ml-2 px-3 py-1 rounded-lg bg-amber-500 text-white text-sm"
                                        >
                                            Change Email
                                        </button>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>


            <ResetWardPasswordModal
                open={resetModalOpen}
                userId={selectedAccount?.id}
                onClose={() => {

                    setResetModalOpen(false);

                    setSelectedAccount(null);

                    fetchAccounts();

                }}
            />


            <ChangeWardOfficerEmailModal
                open={emailModalOpen}
                userId={selectedAccount?.id}
                currentEmail={selectedAccount?.officer_personal_email}
                onClose={() => {

                    setEmailModalOpen(false);

                    setSelectedAccount(null);

                    fetchAccounts();

                }}
            />

        </div>

    );

};

export default WardAccountTable;