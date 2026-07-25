import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import SearchableSelect from "@/components/common/SearchableSelect";
import { adminapi } from "@/service/adminurls";

const CreatePanchayathForm = ({ onSuccess }) => {

  const [districts, setDistricts] = useState([]);
  const [panchayaths, setPanchayaths] = useState([]);

  const [loadingDistricts, setLoadingDistricts] = useState(true);
  const [loadingPanchayaths, setLoadingPanchayaths] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    district: null,
    panchayath: null,
    official_email: "",
    official_phone: "",
    officer_personal_email: "",
  });



  useEffect(() => {

    loadDistricts();

  }, []);


  const loadDistricts = async () => {

    try {

      setLoadingDistricts(true);

      const response =
        await adminapi.getLocationDistricts();

      const options = response.data.data.map((district) => ({
        value: district.id,
        label: district.name,
      }));

      setDistricts(options);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load districts.");

    } finally {

      setLoadingDistricts(false);

    }

  };



  const loadPanchayaths = async (districtId) => {

    try {

      setLoadingPanchayaths(true);

      const response =
        await adminapi.getLocationPanchayaths(
          districtId
        );

      const options = response.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setPanchayaths(options);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load panchayaths.");

    } finally {

      setLoadingPanchayaths(false);

    }

  };



  const handleDistrictChange = (selected) => {

    setFormData((prev) => ({
      ...prev,
      district: selected,
      panchayath: null,
    }));

    setPanchayaths([]);

    if (selected) {

      loadPanchayaths(selected.value);

    }

  };



  const handlePanchayathChange = (selected) => {

    setFormData((prev) => ({
      ...prev,
      panchayath: selected,
    }));

  };



  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };




  const validateForm = () => {

    if (!formData.district) {
      toast.error("Please select a district.");
      return false;
    }

    if (!formData.panchayath) {
      toast.error("Please select a panchayath.");
      return false;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.official_email.trim())) {
      toast.error("Enter a valid official email.");
      return false;
    }

    const phone = formData.official_phone.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number.");
      return false;
    }

    if (!formData.officer_personal_email.trim()) {
      toast.error("Officer personal email is required.");
      return false;
    }

    return true;
  };



  const resetForm = () => {

    setFormData({
      district: null,
      panchayath: null,
      official_email: "",
      official_phone: "",
      officer_personal_email: "",
    });

    setPanchayaths([]);

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {

      setSubmitting(true);

      await adminapi.createPanchayathAuthority({

        district_id: formData.district.value,

        panchayath_id: formData.panchayath.value,

        official_email: formData.official_email.trim(),

        official_phone: formData.official_phone.trim(),

        officer_personal_email:
          formData.officer_personal_email.trim(),

      });

      toast.success(
        "Panchayath authority created successfully."
      );

      resetForm();

      if (onSuccess) {
        onSuccess();
      }

    } catch (error) {

      console.error(error);

      const message =
        error?.response?.data?.message ||
        "Failed to create authority.";

      toast.error(message);

    } finally {

      setSubmitting(false);

    }

  };



  return (

    <div className="bg-white rounded-xl shadow-sm border p-6">

      <h2 className="text-2xl font-semibold mb-6">
        Create Panchayath Account
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        <div>

          <label className="block mb-2 font-medium">
            District
          </label>

          <SearchableSelect
            options={districts}
            value={formData.district}
            onChange={handleDistrictChange}
            placeholder={
              loadingDistricts
                ? "Loading..."
                : "Select District"
            }
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Panchayath
          </label>

          <SearchableSelect
            options={panchayaths}
            value={formData.panchayath}
            onChange={handlePanchayathChange}
            placeholder={
              loadingPanchayaths
                ? "Loading..."
                : "Select Panchayath"
            }
            isDisabled={!formData.district}
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Official Email
          </label>

          <input
            type="email"
            name="official_email"
            value={formData.official_email}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

        </div>

        <div>

          <label className="block mb-2 font-medium">
            Official Phone
          </label>

          <input
            type="text"
            name="official_phone"
            value={formData.official_phone}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

        </div>

        <div className="md:col-span-2">

          <label className="block mb-2 font-medium">
            Officer Personal Email
          </label>

          <input
            type="email"
            name="officer_personal_email"
            value={formData.officer_personal_email}
            onChange={handleInputChange}
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

        </div>

        <div className="md:col-span-2 flex justify-end">

          <button
            type="submit"
            disabled={
              submitting ||
              !formData.district ||
              !formData.panchayath
            }
            className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-medium transition"
          >

            {submitting
              ? "Creating..."
              : "Create Panchayath Account"}

          </button>

        </div>

      </form>

    </div>

  );

}

export default CreatePanchayathForm;