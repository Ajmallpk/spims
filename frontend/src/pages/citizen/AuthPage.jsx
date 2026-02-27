
import citizenapi from "@/service/citizenurls";
import { useState, useEffect } from "react";
// ── SVG Icons ──────────────────────────────────────────────────────
const Shield = ({ size = 20, color = "currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const MailIcon = ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const LockIcon = ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>;
const EyeIcon = ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
const EyeOff = ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>;
const UserIcon = ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
const TrendIcon = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
const UsersIcon = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const CheckCir = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const GlobeIcon = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
const MapIcon = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" /></svg>;
const FileIcon = ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
const CheckIcon = ({ size = 12, color = "#94a3b8" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>;

// ── Shared Input Field ─────────────────────────────────────────────
// function InputField({ label, type = "text", placeholder, LeftIcon, rightSlot }) {
//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
//       <div className="relative flex items-center">
//         {LeftIcon && (
//           <span className="absolute left-3 text-slate-400 flex items-center pointer-events-none">
//             <LeftIcon />
//           </span>
//         )}
//         <input
//           type={type}
//           placeholder={placeholder}
//           className="w-full py-3 pr-10 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none transition-all placeholder-slate-400 focus:border-blue-500 focus:bg-white"
//           style={{ paddingLeft: LeftIcon ? "2.25rem" : "0.875rem" }}
//         />
//         {rightSlot && (
//           <span className="absolute right-3 flex items-center">{rightSlot}</span>
//         )}
//       </div>
//     </div>
//   );
// }



function InputField({
  label,
  type = "text",
  placeholder,
  LeftIcon,
  rightSlot,
  value,
  onChange
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative flex items-center">
        {LeftIcon && (
          <span className="absolute left-3 text-slate-400 flex items-center pointer-events-none">
            <LeftIcon />
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full py-3 pr-10 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none transition-all placeholder-slate-400 focus:border-blue-500 focus:bg-white"
          style={{ paddingLeft: LeftIcon ? "2.25rem" : "0.875rem" }}
        />
        {rightSlot && (
          <span className="absolute right-3 flex items-center">
            {rightSlot}
          </span>
        )}
      </div>
    </div>
  );
}


function EyeToggle({ show, onToggle }) {
  return (
    <button type="button" onClick={onToggle} className="text-slate-400 hover:text-blue-600 flex items-center border-none bg-transparent cursor-pointer transition-colors">
      {show ? <EyeOff /> : <EyeIcon />}
    </button>
  );
}

// function RoleSelect() {
//   return (
//     <div className="mb-4">
//       <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
//       <div className="relative">
//         <select
//           className="w-full py-3 px-3.5 border-2 border-slate-200 rounded-xl text-sm text-slate-900 bg-slate-50 outline-none cursor-pointer appearance-none focus:border-blue-500 focus:bg-white transition-all"
//           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center" }}
//         >
//           <option>Citizen</option>
//           <option>Ward Officer</option>
//           <option>Panchayat Admin</option>
//           <option>Inspector</option>
//         </select>
//       </div>
//     </div>
//   );
// }

// ── Login Form ─────────────────────────────────────────────────────
// function LoginForm() {
//   const [show, setShow] = useState(false);
//   return (
//     <div>
//       <InputField label="Email Address" type="email" placeholder="you@example.com" LeftIcon={MailIcon} />
//       <InputField label="Password" type={show ? "text" : "password"} placeholder="Enter your password" LeftIcon={LockIcon}
//         rightSlot={<EyeToggle show={show} onToggle={() => setShow(p => !p)} />} />
//       <div className="flex justify-between items-center -mt-2 mb-4">
//         <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
//           <input type="checkbox" className="w-3.5 h-3.5 accent-blue-600" /> Remember me
//         </label>
//         <a href="#" className="text-sm font-semibold text-blue-600 hover:underline">Forgot password?</a>
//       </div>
//       {/* <RoleSelect /> */}
//       <button className="w-full mt-1 py-3.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5"
//         style={{ background: "#111827", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
//         Sign In
//       </button>
//     </div>
//   );
// }


function LoginForm() {
  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const response = await citizenapi.login({
        email,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      window.location.href = "/citizen/dashboard";

    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <InputField
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        LeftIcon={MailIcon}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        label="Password"
        type={show ? "text" : "password"}
        placeholder="Enter your password"
        LeftIcon={LockIcon}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        rightSlot={<EyeToggle show={show} onToggle={() => setShow(p => !p)} />}
      />

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full mt-1 py-3.5 rounded-xl text-sm font-bold text-white"
        style={{ background: "#111827" }}
      >
        {loading ? "Signing In..." : "Sign In"}
      </button>
    </div>
  );
}

// ── Sign Up Form ───────────────────────────────────────────────────
// function SignUpForm() {
//   const [showP, setShowP] = useState(false);
//   const [showC, setShowC] = useState(false);
//   return (
//     <div>
//       <InputField label="Full Name" placeholder="Enter your full name" LeftIcon={UserIcon} />
//       <InputField label="Email Address" type="email" placeholder="you@example.com" LeftIcon={MailIcon} />
//       <InputField label="Password" type={showP ? "text" : "password"} placeholder="Min. 8 characters" LeftIcon={LockIcon}
//         rightSlot={<EyeToggle show={showP} onToggle={() => setShowP(p => !p)} />} />
//       <InputField label="Confirm Password" type={showC ? "text" : "password"} placeholder="Re-enter your password" LeftIcon={LockIcon}
//         rightSlot={<EyeToggle show={showC} onToggle={() => setShowC(p => !p)} />} />
//       {/* <RoleSelect /> */}
//       <div className="flex items-start gap-2 mb-4 text-sm text-slate-600">
//         <input type="checkbox" className="w-3.5 h-3.5 accent-blue-600 mt-0.5 flex-shrink-0" />
//         <span>I agree to the <a href="#" className="text-blue-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-semibold hover:underline">Privacy Policy</a></span>
//       </div>
//       <button className="w-full py-3.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:-translate-y-0.5"
//         style={{ background: "#111827", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
//         Register
//       </button>
//     </div>
//   );
// }


// function CitizenSignUpForm() {
//   const [showP, setShowP] = useState(false);
//   const [showC, setShowC] = useState(false);

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");

//   const handleRegister = async () => {
//     setError("");
//     setMessage("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       await citizenapi.register({
//         username,
//         email,
//         password,
//         confirm_password: confirmPassword,
//       });

//       setMessage("OTP sent to your email");

//     } catch (err) {
//       setError(
//         err.response?.data?.error ||
//         "Registration failed"
//       );
//     }
//   };

//   try {
//     const response = await axios.post(
//       "http://127.0.0.1:8000/signup/citizen/",
//       {
//         username,
//         email,
//         password,
//         confirm_password: confirmPassword,
//       }
//     );

//     setMessage("OTP sent to your email");
//   } catch (err) {
//     setError(
//       err.response?.data?.error ||
//       "Registration failed"
//     );
//   }
// };

// return (
//   <div>
//     <InputField
//       label="Full Name"
//       placeholder="Enter your full name"
//       LeftIcon={UserIcon}
//       value={username}
//       onChange={(e) => setUsername(e.target.value)}
//     />

//     <InputField
//       label="Email Address"
//       type="email"
//       placeholder="you@example.com"
//       LeftIcon={MailIcon}
//       value={email}
//       onChange={(e) => setEmail(e.target.value)}
//     />

//     <InputField
//       label="Password"
//       type={showP ? "text" : "password"}
//       placeholder="Min. 8 characters"
//       LeftIcon={LockIcon}
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//       rightSlot={<EyeToggle show={showP} onToggle={() => setShowP(p => !p)} />}
//     />

//     <InputField
//       label="Confirm Password"
//       type={showC ? "text" : "password"}
//       placeholder="Re-enter your password"
//       LeftIcon={LockIcon}
//       value={confirmPassword}
//       onChange={(e) => setConfirmPassword(e.target.value)}
//       rightSlot={<EyeToggle show={showC} onToggle={() => setShowC(p => !p)} />}
//     />

//     {error && (
//       <p className="text-red-500 text-sm mb-2">{error}</p>
//     )}

//     {message && (
//       <p className="text-green-600 text-sm mb-2">{message}</p>
//     )}

//     <button
//       onClick={handleRegister}
//       className="w-full py-3.5 rounded-xl text-sm font-bold text-white"
//       style={{ background: "#111827" }}
//     >
//       Register as Citizen
//     </button>
//   </div>
// );
// }


function CitizenSignUpForm({ onSuccess }) {
  const [showP, setShowP] = useState(false);
  const [showC, setShowC] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [remainingResends, setRemainingResends] = useState(3);


  useEffect(() => {
    let interval;

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [otpSent, timer]);

  const handleRegister = async () => {
    setError("");
    setMessage("");
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await citizenapi.register({
        username,
        email,
        password,
        confirm_password: confirmPassword,
      });

      setOtpSent(true);

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Registration failed"
      );
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Enter valid 6 digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      await citizenapi.verifyOTP({
        email,
        otp,
      });

      setOtpVerified(true);

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Invalid OTP"
      );
    } finally {
      setIsVerifying(false);
    }
  };


  const handleResendOtp = async () => {
    try {
      const response = await citizenapi.resendOTP({
        email,
      });

      setRemainingResends(response.data.remaining);
      setTimer(60);
      setCanResend(false);
      setError("");

    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Failed to resend OTP"
      );
    }
  };

  // ✅ RETURN MUST BE INSIDE THE COMPONENT
  return (
    <div>
      {!otpSent && (
        <>
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            LeftIcon={UserIcon}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <InputField
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            LeftIcon={MailIcon}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Password"
            type={showP ? "text" : "password"}
            placeholder="Min. 8 characters"
            LeftIcon={LockIcon}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rightSlot={<EyeToggle show={showP} onToggle={() => setShowP(p => !p)} />}
          />

          <InputField
            label="Confirm Password"
            type={showC ? "text" : "password"}
            placeholder="Re-enter your password"
            LeftIcon={LockIcon}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            rightSlot={<EyeToggle show={showC} onToggle={() => setShowC(p => !p)} />}
          />
        </>
      )}

      {otpSent && !otpVerified && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <p className="text-sm font-semibold text-blue-800 mb-2">
            Verify Your Email
          </p>
          <p className="text-xs text-blue-600 mb-3">
            OTP sent to {email}
          </p>

          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            className="w-full py-3 text-center tracking-widest border rounded-lg mb-3"
          />

          <button
            onClick={handleVerifyOtp}
            disabled={isVerifying}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </button>
          <div className="text-center mt-3 text-sm">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                className="text-blue-600 font-semibold underline"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-500">
                Resend OTP in {timer}s
              </span>
            )}
            {remainingResends > 0 && (
              <p className="text-xs text-gray-500 mt-1 text-center">
                Resend attempts left: {remainingResends}
              </p>
            )}
          </div>
        </div>
      )}

      {otpVerified && (
        <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-center">
          <p className="text-green-700 font-semibold">
            Registration Successful 🎉
          </p>
          <button
            onClick={onSuccess}
            className="mt-3 text-sm text-blue-600 underline"
          >
            Go to Login
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      {message && (
        <p className="text-green-600 text-sm mb-2">{message}</p>
      )}

      {!otpSent && (
        <button
          onClick={handleRegister}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white"
          style={{ background: "#111827" }}
        >
          Register as Citizen
        </button>
      )}
    </div>
  );
}



// ── Left Panel – Login ─────────────────────────────────────────────
function LeftLogin() {
  return (
    <div className="flex flex-col h-full" style={{ animation: "fadeUp 0.38s ease both" }}>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.22)" }}>
          <Shield size={20} color="white" />
        </div>
        <div>
          <div className="text-white font-bold text-base leading-tight">Fixit</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>Verified Community Platform</div>
        </div>
      </div>

      <h1 className="text-white font-extrabold text-3xl leading-tight mb-3">Welcome Back</h1>
      <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.72)" }}>
        Empowering Communities Through Transparent Governance
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 mb-7">
        {[
          { Icon: TrendIcon, val: "95%", lbl: "Resolution Rate" },
          { Icon: UsersIcon, val: "50K+", lbl: "Active Citizens" },
          { Icon: CheckCir, val: "15K+", lbl: "Issues Resolved" },
          { Icon: GlobeIcon, val: "200+", lbl: "Local Bodies" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-3.5" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="mb-1"><s.Icon /></div>
            <div className="text-white font-extrabold text-2xl leading-none">{s.val}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.60)" }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Community card */}
      <div className="flex-1 rounded-2xl p-5 flex flex-col items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)" }}>
        {/* City illustration */}
        <div className="relative flex items-end justify-center gap-1.5 w-full mb-4" style={{ height: 80 }}>
          <div className="absolute w-7 h-7 rounded-full border-2 border-white flex items-center justify-center" style={{ top: 0, left: "50%", transform: "translateX(-50%)", background: "rgba(255,255,255,0.88)" }}>
            <UserIcon size={13} />
          </div>
          {[{ w: 26, h: 44 }, { w: 34, h: 60 }, { w: 20, h: 36 }, { w: 28, h: 50 }].map((b, i) => (
            <div key={i} className="rounded-t-sm relative" style={{ width: b.w, height: b.h, background: i % 2 === 1 ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.18)" }}>
              <div className="absolute grid grid-cols-2 gap-0.5" style={{ top: 6, left: 4, right: 4 }}>
                {[0, 1, 2, 3].map(j => <span key={j} className="block h-1 rounded-sm" style={{ background: "rgba(255,255,255,0.4)" }} />)}
              </div>
            </div>
          ))}
        </div>
        <div className="text-white font-bold text-sm text-center mb-1.5">Building Better Communities</div>
        <div className="text-xs text-center leading-relaxed mb-1.5" style={{ color: "rgba(255,255,255,0.68)" }}>
          Join thousands of citizens making their voices heard and creating real change in their local governance.
        </div>
        <div className="text-xs text-center" style={{ color: "rgba(255,255,255,0.45)" }}>Trusted by 200+ local government bodies</div>
      </div>

      <div className="text-xs mt-auto" style={{ color: "rgba(255,255,255,0.38)" }}>
        © 2026 CivicVoice. Transparent. Accountable. Community-driven.
      </div>
    </div>
  );
}

// ── Left Panel – Sign Up ───────────────────────────────────────────
function LeftSignUp() {
  const features = [
    { Icon: FileIcon, t: "Easy Complaint Filing", d: "Report issues with photos, location, and track real-time status" },
    { Icon: UsersIcon, t: "Community Driven", d: "Upvote issues, comment, and collaborate with neighbors" },
    { Icon: Shield, t: "Verified Authenticity", d: "Only verified users can submit complaints to prevent fake reports" },
    { Icon: MapIcon, t: "Direct to Authorities", d: "Complaints routed to the right local government officials" },
  ];
  return (
    <div className="flex flex-col h-full" style={{ animation: "fadeUp 0.38s ease both" }}>
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.22)" }}>
          <Shield size={20} color="white" />
        </div>
        <div>
          <div className="text-white font-bold text-base leading-tight">Fixit</div>
          <div className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>Your Community, Your Voice</div>
        </div>
      </div>

      <h1 className="text-white font-extrabold text-3xl leading-tight mb-3">Join Your Verified Community</h1>
      <p className="text-sm leading-relaxed mb-7" style={{ color: "rgba(255,255,255,0.72)" }}>
        Report civic issues, track resolutions, and make your community better with authentic, verified complaints.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2.5 mb-7">
        {[
          { val: "50K+", lbl: "Verified Citizens" },
          { val: "15K+", lbl: "Issues Resolved" },
          { val: "200+", lbl: "Local Bodies" },
          { val: "95%", lbl: "Response Rate" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-3.5" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="mb-1"><CheckCir /></div>
            <div className="text-white font-extrabold text-2xl leading-none">{s.val}</div>
            <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.60)" }}>{s.lbl}</div>
          </div>
        ))}
      </div>

      {/* Feature list */}
      <div className="flex flex-col gap-3 flex-1">
        {features.map((f, i) => (
          <div key={i} className="flex gap-3 items-start">
            <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <f.Icon size={14} />
            </div>
            <div>
              <div className="text-white font-semibold text-sm mb-0.5">{f.t}</div>
              <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.62)" }}>{f.d}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.38)" }}>
        © 2026 CivicVoice. Building transparent and accountable communities.
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────────
export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const isLogin = mode === "login";

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .form-anim { animation: fadeUp 0.28s ease both; }
      `}</style>

      <div className="flex min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "#f1f5f9" }}>

        {/* ── LEFT BLUE PANEL ───────────────────────────────── */}
        <div
          key={mode + "-panel"}
          className="flex flex-col relative overflow-hidden"
          style={{
            width: "42%",
            minHeight: "100vh",
            background: "linear-gradient(155deg, #2563eb 0%, #1d4ed8 45%, #1e3a8a 100%)",
            padding: "2.25rem 2.5rem",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute rounded-full pointer-events-none" style={{ width: 380, height: 380, top: -110, right: -110, background: "rgba(255,255,255,0.05)" }} />
          <div className="absolute rounded-full pointer-events-none" style={{ width: 260, height: 260, bottom: -70, left: -70, background: "rgba(255,255,255,0.04)" }} />

          <div className="relative flex flex-col h-full" style={{ zIndex: 1 }}>
            {isLogin ? <LeftLogin key="ll" /> : <LeftSignUp key="ls" />}
          </div>
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────── */}
        <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto" style={{ padding: "2rem 1.5rem", background: "#f1f5f9" }}>

          {/* Card */}
          <div className="w-full bg-white rounded-3xl" style={{ maxWidth: 460, padding: "2.5rem 2.25rem 2rem", boxShadow: "0 8px 40px rgba(37,99,235,0.09), 0 1px 4px rgba(0,0,0,0.04)" }}>

            {/* Top icon */}
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl mx-auto mb-5" style={{ background: "#111827" }}>
              <Shield size={26} color="white" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-extrabold text-center mb-1" style={{ color: "#0f172a" }}>
              {isLogin ? "Citizen Login" : "Citizen Registration"}
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: "#64748b" }}>
              {isLogin
                ? "Sign in to access your citizen dashboard"
                : "Register as a citizen to submit complaints"}
            </p>

            {/* ── TAB SWITCHER ── */}
            <div className="grid grid-cols-2 rounded-xl p-1 mb-6" style={{ background: "#f1f5f9" }}>
              {["login", "signup"].map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="py-2.5 text-sm rounded-lg font-medium cursor-pointer border-none transition-all"
                  style={{
                    background: mode === m ? "white" : "transparent",
                    color: mode === m ? "#0f172a" : "#64748b",
                    fontWeight: mode === m ? 700 : 500,
                    boxShadow: mode === m ? "0 1px 6px rgba(0,0,0,0.10)" : "none",
                  }}
                >
                  {m === "login" ? "Login" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form */}
            <div className="form-anim" key={mode + "-form"}>
              {isLogin ? (
                <LoginForm />
              ) : (
                <CitizenSignUpForm onSuccess={() => setMode("login")} />
              )}
            </div>

            {/* Bottom switch */}
            <p className="text-center text-sm mt-4" style={{ color: "#64748b" }}>
              {isLogin ? (
                <>Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="font-bold cursor-pointer border-none bg-transparent text-sm" style={{ color: "#0f172a" }}>Sign Up</button>
                </>
              ) : (
                <>Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="font-bold cursor-pointer border-none bg-transparent text-sm" style={{ color: "#0f172a" }}>Login</button>
                </>
              )}
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-5 mt-5 text-xs" style={{ color: "#94a3b8" }}>
            <span className="flex items-center gap-1.5"><CheckIcon /> Secure &amp; Encrypted</span>
            <span style={{ color: "#cbd5e1" }}>|</span>
            <span className="flex items-center gap-1.5"><Shield size={12} color="#94a3b8" /> Government Certified</span>
          </div>
          <p className="text-xs text-center mt-2 px-4" style={{ color: "#94a3b8" }}>
            By signing in, you agree to the Terms of Service and Privacy Policy of SPIMS.
          </p>
        </div>
      </div>
    </>
  );
}