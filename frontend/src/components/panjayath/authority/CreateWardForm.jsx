// import { useEffect, useState } from "react";
// import { toast } from "react-hot-toast";

// import SearchableSelect from "@/components/common/SearchableSelect";
// import panchayathApi from "@/service/panchayathurls";
// import getErrorMessage from "@/utils/getErrorMessage";

// const CreateWardForm = ({ onSuccess }) => {

//     const [wards, setWards] = useState([]);

//     const [loadingWards, setLoadingWards] = useState(true);

//     const [submitting, setSubmitting] = useState(false);

//     const [formData, setFormData] = useState({
//         ward: null,
//         official_email: "",
//         official_phone: "",
//         officer_personal_email: "",
//     });

//     useEffect(() => {

//         loadWards();

//     }, []);

//     const loadWards = async () => {

//         try {

//             setLoadingWards(true);

//             const response =
//                 await panchayathApi.getAvailableWards();

//             const options =
//                 response.data.data.map((ward) => ({

//                     value: ward.id,

//                     label: `Ward ${ward.ward_number} - ${ward.ward_name}`,

//                 }));

//             setWards(options);

//         }

//         catch (error) {

//             console.error(error);

//             toast.error(
//                 "Failed to load wards."
//             );

//         }

//         finally {

//             setLoadingWards(false);

//         }

//     };





//     const validateForm = () => {

//         if (!formData.ward) {
//             toast.error("Please select a ward.");
//             return false;
//         }

//         const emailRegex =
//             /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//         if (!emailRegex.test(formData.official_email.trim())) {
//             toast.error("Enter a valid official email.");
//             return false;
//         }

//         const phone = formData.official_phone.trim();

//         if (!/^[6-9]\d{9}$/.test(phone)) {
//             toast.error("Enter a valid 10-digit phone number.");
//             return false;
//         }

//         if (!emailRegex.test(formData.officer_personal_email.trim())) {
//             toast.error("Enter a valid officer personal email.");
//             return false;
//         }

//         return true;

//     };



//     const handleSubmit = async (e) => {

//         e.preventDefault();

//         if (!validateForm()) {
//             return;
//         }

//         try {

//             setSubmitting(true);

//             await panchayathApi.createWardAccount({

//                 ward_id: formData.ward.value,

//                 official_email:
//                     formData.official_email
//                         .trim()
//                         .toLowerCase(),

//                 official_phone:
//                     formData.official_phone
//                         .trim(),

//                 officer_personal_email:
//                     formData.officer_personal_email
//                         .trim()
//                         .toLowerCase(),

//             });

//             toast.success(
//                 "Ward account created successfully."
//             );

//             await loadWards();

//             setFormData({
//                 ward: null,
//                 official_email: "",
//                 official_phone: "",
//                 officer_personal_email: "",
//             });

//             if (onSuccess) {
//                 onSuccess();
//             }

//         }

//         catch (error) {

//             console.error(error);

//             toast.error(
//                 getErrorMessage(error)
//             );

//         }

//         finally {

//             setSubmitting(false);

//         }

//     };

//     return (

//         <div className="bg-white rounded-xl shadow-sm border p-6">

//             <h2 className="text-2xl font-semibold mb-6">
//                 Create Ward Account
//             </h2>

//             <form
//                 onSubmit={handleSubmit}
//                 className="grid grid-cols-1 md:grid-cols-2 gap-5"
//             >

//                 <div>

//                     <label className="block mb-2 font-medium">
//                         Ward
//                     </label>

//                     <SearchableSelect
//                         options={wards}
//                         value={formData.ward}
//                         onChange={(value) =>
//                             setFormData((prev) => ({
//                                 ...prev,
//                                 ward: value,
//                             }))
//                         }
//                         placeholder={
//                             loadingWards
//                                 ? "Loading..."
//                                 : "Select Ward"
//                         }
//                     />

//                 </div>

//                 <div>

//                     <label className="block mb-2 font-medium">
//                         Official Email
//                     </label>

//                     <input
//                         type="email"
//                         value={formData.official_email}
//                         onChange={(e) =>
//                             setFormData((prev) => ({
//                                 ...prev,
//                                 official_email: e.target.value,
//                             }))
//                         }
//                         className="w-full border rounded-xl px-4 py-3"
//                     />

//                 </div>

//                 <div>

//                     <label className="block mb-2 font-medium">
//                         Official Phone
//                     </label>

//                     <input
//                         type="text"
//                         value={formData.official_phone}
//                         onChange={(e) =>
//                             setFormData((prev) => ({
//                                 ...prev,
//                                 official_phone: e.target.value,
//                             }))
//                         }
//                         className="w-full border rounded-xl px-4 py-3"
//                     />

//                 </div>

//                 <div>

//                     <label className="block mb-2 font-medium">
//                         Officer Personal Email
//                     </label>

//                     <input
//                         type="email"
//                         value={formData.officer_personal_email}
//                         onChange={(e) =>
//                             setFormData((prev) => ({
//                                 ...prev,
//                                 officer_personal_email: e.target.value,
//                             }))
//                         }
//                         className="w-full border rounded-xl px-4 py-3"
//                     />

//                 </div>

//                 <div className="md:col-span-2 flex justify-end">

//                     <button
//                         type="submit"
//                         disabled={submitting}
//                         className="bg-teal-600 text-white px-6 py-3 rounded-xl disabled:opacity-50"
//                     >
//                         {submitting
//                             ? "Creating..."
//                             : "Create Ward Account"}
//                     </button>

//                 </div>

//             </form>

//         </div>

//     );

// };

// export default CreateWardForm;




import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Mail, Phone, MapPin, UserCircle, Loader2 } from "lucide-react";

import SearchableSelect from "@/components/common/SearchableSelect";
import panchayathApi from "@/service/panchayathurls";
import getErrorMessage from "@/utils/getErrorMessage";

const FieldLabel = ({ icon: Icon, children }) => (
    <label className="flex items-center gap-1.5 mb-2 font-medium text-gray-700 text-sm">
        <Icon size={15} className="text-emerald-600" />
        {children}
    </label>
);

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





    const validateForm = () => {

        if (!formData.ward) {
            toast.error("Please select a ward.");
            return false;
        }

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(formData.official_email.trim())) {
            toast.error("Enter a valid official email.");
            return false;
        }

        const phone = formData.official_phone.trim();

        if (!/^[6-9]\d{9}$/.test(phone)) {
            toast.error("Enter a valid 10-digit phone number.");
            return false;
        }

        if (!emailRegex.test(formData.officer_personal_email.trim())) {
            toast.error("Enter a valid officer personal email.");
            return false;
        }

        return true;

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {

            setSubmitting(true);

            await panchayathApi.createWardAccount({

                ward_id: formData.ward.value,

                official_email:
                    formData.official_email
                        .trim()
                        .toLowerCase(),

                official_phone:
                    formData.official_phone
                        .trim(),

                officer_personal_email:
                    formData.officer_personal_email
                        .trim()
                        .toLowerCase(),

            });

            toast.success(
                "Ward account created successfully."
            );

            await loadWards();

            setFormData({
                ward: null,
                official_email: "",
                official_phone: "",
                officer_personal_email: "",
            });

            if (onSuccess) {
                onSuccess();
            }

        }

        catch (error) {

            console.error(error);

            toast.error(
                getErrorMessage(error)
            );

        }

        finally {

            setSubmitting(false);

        }

    };

    return (

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-5">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <MapPin size={20} />
                    Create Ward Account
                </h2>
                <p className="text-emerald-50 text-sm mt-1">
                    Register a new ward authority and its office details
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6"
            >

                <div className="md:col-span-2">

                    <FieldLabel icon={MapPin}>Ward</FieldLabel>

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

                    <FieldLabel icon={Mail}>Official Email</FieldLabel>

                    <input
                        type="email"
                        value={formData.official_email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                official_email: e.target.value,
                            }))
                        }
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />

                </div>

                <div>

                    <FieldLabel icon={Phone}>Official Phone</FieldLabel>

                    <input
                        type="text"
                        value={formData.official_phone}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                official_phone: e.target.value,
                            }))
                        }
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />

                </div>

                <div className="md:col-span-2">

                    <FieldLabel icon={UserCircle}>Officer Personal Email</FieldLabel>

                    <input
                        type="email"
                        value={formData.officer_personal_email}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                officer_personal_email: e.target.value,
                            }))
                        }
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                    />

                </div>

                <div className="md:col-span-2 flex justify-end pt-2">

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-medium transition shadow-sm"
                    >
                        {submitting && <Loader2 size={16} className="animate-spin" />}
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