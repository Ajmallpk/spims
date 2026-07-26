import { useState } from "react";

import CreateWardForm from "@/components/panjayath/authority/CreateWardForm";
import WardAccountTable from "@/components/panjayath/authority/WardAccountTable";

const WardManagement = () => {

    const [refreshKey, setRefreshKey] = useState(0);

    const refreshAccounts = () => {
        setRefreshKey((prev) => prev + 1);
    };

    return (

        <div className="space-y-6">

            <CreateWardForm
                onSuccess={refreshAccounts}
            />

            <WardAccountTable
                refreshKey={refreshKey}
            />

        </div>

    );

};

export default WardManagement;