import { useState } from "react";
import wardapi from "@/service/wardurls";
import toast from "react-hot-toast";

const WardChangeEmailForm = ({ currentEmail }) => {

  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await wardapi.changeEmail({
        new_email: newEmail,
        password: password
      });

      toast.success("Verification email sent");

      setNewEmail("");
      setPassword("");

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to request email change"
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div>
        <label className="text-sm text-gray-600">Current Email</label>
        <input
          value={currentEmail}
          disabled
          className="w-full border px-3 py-2 rounded-lg bg-gray-100"
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">New Email</label>
        <input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
          required
        />
      </div>

      <div>
        <label className="text-sm text-gray-600">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600"
      >
        Change Email
      </button>

    </form>
  );
};

export default WardChangeEmailForm;