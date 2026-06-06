import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import LoginInput from "@/components/admin/Logininput";
import LoginButton from "@/components/admin/Loginbutton";
import { adminapi } from "@/service/adminurls";
import toast from "react-hot-toast";
import { handleApiError } from "@/utils/handleApiError";

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await adminapi.login(email, password);


      console.log("FULL RESPONSE", data)
      console.log("DATA", data.data)
      console.log("ACCESS", data.data?.access)
      console.log("REFRESH", data.data?.refresh)

      console.log(
        "LOGIN RESPONSE:",
        data
      )

      console.log(
        "ACCESS:",
        data.data.access
      )

      console.log(
        "REFRESH:",
        data.data.refresh
      )
      console.log("LOGIN RESPONSE:", data)

      // Validate that the returned role is ADMIN
      if (data.data.role !== "ADMIN") {
        setError("Access denied. This portal is restricted to Admin accounts.");
        return;
      }

      // Store tokens and session data

      localStorage.setItem("role", data.data.role);
      localStorage.setItem("status", data.data.status);

      sessionStorage.setItem(
        "role",
        "admin"
      );

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {

      const message =
        handleApiError(
          err,
          "Login failed"
        );

      setError(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle
            size={16}
            className="flex-shrink-0 mt-0.5 text-red-500"
          />
          <span className="font-medium leading-snug">{error}</span>
        </div>
      )}

      {/* Email */}
      <LoginInput
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (error) setError("");
        }}
        placeholder="admin@example.com"
        disabled={loading}
        icon={Mail}
        autoComplete="email"
      />

      {/* Password */}
      <LoginInput
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (error) setError("");
        }}
        placeholder="Enter your password"
        disabled={loading}
        icon={Lock}
        autoComplete="current-password"
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-150 disabled:cursor-not-allowed"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        }
      />

      {/* Submit */}
      <div className="pt-1">
        <LoginButton
          label="Sign In to Dashboard"
          loadingLabel="Authenticating…"
          isLoading={loading}
        />
      </div>
    </form>
  );
};

export default LoginForm;