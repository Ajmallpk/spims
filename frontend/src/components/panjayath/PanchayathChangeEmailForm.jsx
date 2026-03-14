import { useState } from "react";
import panchayathApi from "@/service/panchayathurls";
import toast from "react-hot-toast";

const PanchayathChangeEmailForm = ({ currentEmail }) => {

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    try {

      await panchayathApi.requestEmailChange({
        email: email,
        password: password
      });

      toast.success("Verification email sent. Please check your inbox.");

      setEmail("");
      setPassword("");

    } catch (error) {

      toast.error(
        error?.response?.data?.message || "Email change request failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="text-sm text-gray-700">Current Email</label>

        <input
          type="text"
          value={currentEmail}
          disabled
          className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-100"
        />
      </div>

      <div>
        <label className="text-sm text-gray-700">New Email</label>

        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-700">Password</label>

        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full mt-1 px-3 py-2 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
      >
        {loading ? "Processing..." : "Change Email"}
      </button>

    </form>
  );
};

export default PanchayathChangeEmailForm;