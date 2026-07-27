// import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { setPassword } from "@/service/auth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import toast from "react-hot-toast";

// export default function SetPasswordPage() {
//     const { token } = useParams();

//     const navigate = useNavigate();

//     const [password, setPasswordValue] = useState("");
//     const [confirmPassword, setConfirmPassword] =
//         useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();


//         console.log("TOKEN =", token);
//         console.log("SUBMIT CLICKED");

//         try {


//             console.log("CALLING API...");
//             await setPassword(
//                 token,
//                 {
//                     password,
//                     confirm_password:
//                         confirmPassword,
//                 }
//             );

//             toast.success(
//                 "Password set successfully."
//             );

//             navigate(
//                 "/login"
//             );

//         } catch (error) {

//             toast.error(
//                 "Unable to set password."
//             );
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center">

//             <form
//                 onSubmit={handleSubmit}
//                 className="space-y-4 border p-6 rounded-xl w-96"
//             >
//                 <h1 className="text-xl font-bold">
//                     Set Password
//                 </h1>

//                 <Input
//                     type="password"
//                     placeholder="New Password"
//                     value={password}
//                     onChange={(e) =>
//                         setPasswordValue(
//                             e.target.value
//                         )
//                     }
//                 />

//                 <Input
//                     type="password"
//                     placeholder="Confirm Password"
//                     value={confirmPassword}
//                     onChange={(e) =>
//                         setConfirmPassword(
//                             e.target.value
//                         )
//                     }
//                 />

//                 <Button
//                     type="submit"
//                     className="w-full"
//                 >
//                     Set Password
//                 </Button>
//             </form>
//         </div>
//     );
// }



import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { setPassword } from "@/service/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { Eye, EyeOff, Check, X, ShieldCheck, Loader2 } from "lucide-react";

// Purely cosmetic strength scoring — does not gate submission.
function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (!password) return { score: 0, label: "", color: "bg-slate-200" };
    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-400" };
    if (score <= 3) return { score: 2, label: "Fair", color: "bg-amber-400" };
    if (score === 4) return { score: 3, label: "Good", color: "bg-teal-400" };
    return { score: 4, label: "Strong", color: "bg-emerald-500" };
}

export default function SetPasswordPage() {
    const { token } = useParams();

    const navigate = useNavigate();

    const [password, setPasswordValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const strength = useMemo(() => getPasswordStrength(password), [password]);
    const passwordsMatch =
        confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch =
        confirmPassword.length > 0 && password !== confirmPassword;

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("TOKEN =", token);
        console.log("SUBMIT CLICKED");

        setIsSubmitting(true);

        try {
            console.log("CALLING API...");
            await setPassword(token, {
                password,
                confirm_password: confirmPassword,
            });

            // toast.success("Password set successfully.");

            navigate("/login");
        } catch (error) {
            toast.error("Unable to set password.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/60 border border-slate-100">
                {/* Decorative panel */}
                <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-teal-500 to-emerald-600 p-10 text-white relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 -left-10 w-40 h-40 rounded-full bg-white/10" />

                    <div className="relative z-10">
                        <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center mb-6">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-bold leading-snug">
                            Secure your account
                        </h2>
                        <p className="text-teal-50/90 mt-3 text-sm leading-relaxed">
                            Choose a strong, unique password to keep your
                            complaints and reports safe.
                        </p>
                    </div>

                    <ul className="relative z-10 space-y-2 text-sm text-teal-50/90">
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 shrink-0" /> At least 8
                            characters
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 shrink-0" /> Mix of
                            letters, numbers &amp; symbols
                        </li>
                        <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 shrink-0" /> Avoid
                            reusing old passwords
                        </li>
                    </ul>
                </div>

                {/* Form panel */}
                <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
                    <h1 className="text-xl font-bold text-slate-900">
                        Set your password
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 mb-6">
                        Create a new password to finish setting up your
                        account.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                New password
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPasswordValue(e.target.value)
                                    }
                                    className="pr-10 focus-visible:ring-teal-500"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((v) => !v)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    tabIndex={-1}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {password && (
                                <div className="pt-1">
                                    <div className="flex gap-1">
                                        {[0, 1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                    i < strength.score
                                                        ? strength.color
                                                        : "bg-slate-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {strength.label}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-slate-700">
                                Confirm password
                            </label>
                            <div className="relative">
                                <Input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className={`pr-10 focus-visible:ring-teal-500 ${
                                        passwordsMismatch
                                            ? "border-red-300 focus-visible:ring-red-400"
                                            : ""
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword((v) => !v)
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    tabIndex={-1}
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>

                            {passwordsMatch && (
                                <p className="text-xs text-emerald-600 flex items-center gap-1 pt-0.5">
                                    <Check className="w-3.5 h-3.5" /> Passwords
                                    match
                                </p>
                            )}
                            {passwordsMismatch && (
                                <p className="text-xs text-red-500 flex items-center gap-1 pt-0.5">
                                    <X className="w-3.5 h-3.5" /> Passwords do
                                    not match
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-70"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Setting password...
                                </span>
                            ) : (
                                "Set Password"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}