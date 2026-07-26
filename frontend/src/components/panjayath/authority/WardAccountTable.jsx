import { useEffect } from "react";
import panchayathApi from "@/service/panchayathurls";

const WardAccountTable = () => {

    useEffect(() => {

        const loadAccounts = async () => {

            try {

                const response =
                    await panchayathApi.listWardAccounts();

                console.log(response.data);

            }

            catch (error) {

                console.error(error);

            }

        };

        loadAccounts();

    }, []);

    return (

        <div className="bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-2xl font-semibold">
                Existing Ward Accounts
            </h2>

        </div>

    );

};

export default WardAccountTable;