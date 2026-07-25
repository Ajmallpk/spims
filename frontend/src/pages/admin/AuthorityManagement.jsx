import { useState } from "react";

import CreatePanchayathForm from "@/components/admin/authority/CreatePanchayathForm";
import AuthorityAccountTable from "@/components/admin/authority/AuthorityAccountTable";

const AuthorityManagement = () => {

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshAccounts = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (

        <div className="space-y-6">

            <CreatePanchayathForm
                onSuccess={refreshAccounts}
            />

            <AuthorityAccountTable
                refreshKey={refreshKey}
            />

        </div>

    );
};

export default AuthorityManagement;