// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import citizenapi from "@/service/citizenurls";
// import illustration from "@/assets/illustrations/forgot-password.png.png";

// export default function ForgotPassword() {

//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");

//   const navigate = useNavigate();

//   const handleSendOtp = async () => {

//     if (!email) {
//       setError("Email is required");
//       return;
//     }

//     try {

//       await citizenapi.forgotPassword({ email });

//       navigate("/citizen/verify-reset-otp", {
//         state: { email }
//       });

//     } catch (err) {

//       setError(
//         err.response?.data?.error ||
//         "Failed to send OTP"
//       );

//     }

//   };

//   return (

//     <div className="min-h-screen flex">
        
//       {/* LEFT ILLUSTRATION PANEL */}

//       <div className="w-1/2 bg-green-900 flex items-center justify-center">

//         <img
//           src={illustration}
//           alt="Forgot password illustration"
//           className="w-3/4"
//         />
        
//       </div>


//       {/* RIGHT FORM PANEL */}

//       <div className="w-1/2 flex items-center justify-center bg-gray-100">

//         <div className="bg-white p-8 rounded-xl shadow-lg w-96">

//           <h2 className="text-2xl font-bold mb-4">
//             Forgot Password
//           </h2>

//           <p className="text-sm text-gray-500 mb-4">
//             Enter your email to receive a password reset OTP
//           </p>

//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border p-3 rounded mb-3"
//           />

//           {error && (
//             <p className="text-red-500 text-sm mb-2">
//               {error}
//             </p>
//           )}

//           <button
//             onClick={handleSendOtp}
//             className="w-full bg-black text-white py-3 rounded"
//           >
//             Send OTP
//           </button>

//         </div>

//       </div>

//     </div>

//   );
// }




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import citizenapi from "@/service/citizenurls";
import illustration from "@/assets/illustrations/forgot-password.png.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      await citizenapi.forgotPassword({ email });
      navigate("/citizen/verify-reset-otp", { state: { email } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT ILLUSTRATION PANEL */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 flex-col items-center justify-center relative overflow-hidden px-12">

        {/* Decorative background circles */}
        <div className="absolute top-[-60px] left-[-60px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-80px] right-[-40px] w-96 h-96 bg-white/5 rounded-full" />

        <img
          src={illustration}
          alt="Forgot password illustration"
          className="w-3/4 max-w-sm relative z-10 drop-shadow-2xl"
        />

        <div className="mt-10 text-center relative z-10">
          <h1 className="text-white text-3xl font-bold tracking-tight">
            Account Recovery
          </h1>
          <p className="text-teal-100 text-sm mt-2 max-w-xs leading-relaxed">
            We'll send a one-time password to your registered email to get you back in.
          </p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 px-6">

        <div className="w-full max-w-md">

          {/* Logo / brand mark */}
          <div className="mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700 tracking-wide">InfraCare Citizen Portal</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              Forgot password?
            </h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Enter the email linked to your account and we'll send you a reset OTP.
            </p>
          </div>

          {/* Form card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-150
                  focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50 hover:border-gray-300"}`}
              />
              {error && (
                <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={handleSendOtp}
              className="w-full bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold py-3 rounded-xl text-sm transition-colors duration-150 shadow-sm"
            >
              Send OTP
            </button>

          </div>

          {/* Back to login */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Remembered your password?{" "}
            <button
              onClick={() => navigate("/citizen/login")}
              className="text-teal-600 font-medium hover:underline"
            >
              Back to login
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}