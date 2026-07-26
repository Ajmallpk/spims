import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import SearchableSelect from "@/components/common/SearchableSelect";
import panchayathApi from "@/service/panchayathurls";

const CreateWardForm = ({ onSuccess }) => {

    const [wards, setWards] = useState([]);

    const [loadingWards, setLoadingWards] = useState(true);

    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        ward: null,
        official_email: "",
        official_phone: "",
        officer_personal_email: "",
    });

    useEffect(() => {

        loadWards();

    }, []);

    const loadWards = async () => {

        try {

            setLoadingWards(true);

            const response =
                await panchayathApi.getAvailableWards();

            const options =
                response.data.data.map((ward) => ({

                    value: ward.id,

                    label: `Ward ${ward.ward_number} - ${ward.ward_name}`,

                }));

            setWards(options);

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load wards."
            );

        }

        finally {

            setLoadingWards(false);

        }

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.ward) {
            toast.error("Please select a ward.");
            return;
        }

        if (!formData.official_email.trim()) {
            toast.error("Official email is required.");
            return;
        }

        if (!formData.official_phone.trim()) {
            toast.error("Official phone is required.");
            return;
        }

        if (!formData.officer_personal_email.trim()) {
            toast.error("Officer personal email is required.");
            return;
        }

        try {

            setSubmitting(true);

            await panchayathApi.createWardAccount({

                ward_id: formData.ward.value,

                official_email: formData.official_email,

                official_phone: formData.official_phone,

                officer_personal_email:
                    formData.officer_personal_email,

            });

            toast.success(
                "Ward account created successfully."
            );

            setFormData({
                ward: null,
                official_email: "",
                official_phone: "",
                officer_personal_email: "",
            });

            await loadWards();

            if (onSuccess) {
                onSuccess();
            }

        }

        catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to create ward account."
            );

        }

        finally {

            setSubmitting(false);

        }

    };

    return (

        <div className="bg-white rounded-xl shadow-sm border p-6">

            <h2 className="text-2xl font-semibold mb-6">
                Create Ward Account
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >

                <div>

                    <label className="block mb-2 font-medium">
                        Ward
                    </label>

                    <SearchableSelect
                        options={wards}
                        value={formData.ward}
                        onChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                ward: value,
                            }))
                        }
                        placeholder={
                            loadingWards
                                ? "Loading..."
                                : "Select Ward"
                        }
                    />

                </div>

                <div>

                    <label className="block mb-2 font-medium">
                        Official Email
                    </label>

                    <input
                        type="email"
                        value={formData.official_email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                official_email: e.target.value,
                            }))
                        }
                        className="w-full border rounded-xl px-4 py-3"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-medium">
                        Official Phone
                    </label>

                    <input
                        type="text"
                        value={formData.official_phone}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                official_phone: e.target.value,
                            }))
                        }
                        className="w-full border rounded-xl px-4 py-3"
                    />

                </div>

                <div>

                    <label className="block mb-2 font-medium">
                        Officer Personal Email
                    </label>

                    <input
                        type="email"
                        value={formData.officer_personal_email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                officer_personal_email: e.target.value,
                            }))
                        }
                        className="w-full border rounded-xl px-4 py-3"
                    />

                </div>

                <div className="md:col-span-2 flex justify-end">

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-teal-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
                    >
                        {submitting
                            ? "Creating..."
                            : "Create Ward Account"}
                    </button>

                </div>

            </form>

        </div>

    );

};

export default CreateWardForm;