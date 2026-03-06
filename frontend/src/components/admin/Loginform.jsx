import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import LoginInput from "@/components/admin/Logininput";
import LoginButton from "@/components/admin/Loginbutton";
import { adminapi } from "@/service/adminurls";
import toast from "react-hot-toast";

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

      // Validate that the returned role is ADMIN
      if (data.role !== "ADMIN") {
        setError("Access denied. This portal is restricted to Admin accounts.");
        return;
      }

      // Store tokens and session data
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
      localStorage.setItem("role", data.role);
      localStorage.setItem("status", data.status);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      toast.error("Login error:", err);

      const status = err.response?.status;
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.response?.data?.non_field_errors?.[0];

      if (status === 401 || status === 400) {
        setError(detail || "Invalid email or password. Please try again.");
      } else if (status === 403) {
        setError("Your account does not have permission to access this portal.");
      } else if (status === 423) {
        setError("Your account has been suspended. Please contact support.");
      } else {
        setError(
          detail || "Something went wrong. Please check your connection and try again."
        );
      }
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