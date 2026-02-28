"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupUser, verifyOtp, resendOtp, loginUser } from "@/service/auth"
import { replace, useNavigate } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Shield,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from "lucide-react"




const roles = [
  { value: "WARD", label: "Ward Member" },
  { value: "PANCHAYATH", label: "Panchayath Authority" },
]

export function AuthForm() {
  const navigate = useNavigate()

  const [mode, setMode] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [remainingResends, setRemainingResends] = useState(3)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)



  // Login state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "WARD",
  })

  // Signup state
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "WARD",
  })

  // OTP state
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    let interval

    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
    }

    if (timer === 0) {
      setCanResend(true)
    }

    return () => clearInterval(interval)
  }, [otpSent, timer])

  const validateLogin = useCallback(() => {
    const newErrors = {}
    if (!loginData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!loginData.password) {
      newErrors.password = "Password is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [loginData])

  const validateSignup = useCallback(() => {
    const newErrors = {}
    if (!signupData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    if (!signupData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!signupData.password) {
      newErrors.password = "Password is required"
    } else if (signupData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }
    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [signupData])


  //////////////////////////login///////////////////////

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return

    setIsSubmitting(true)

    try {
      const response = await loginUser({
        email: loginData.email,
        password: loginData.password,
        role: loginData.role
      })

      // Save tokens
      localStorage.setItem("access", response.data.access)
      localStorage.setItem("refresh", response.data.refresh)
      localStorage.setItem("role", response.data.role)
      localStorage.setItem("status", response.data.status)
      localStorage.setItem("is_verified", response.data.is_verified)

      // Check if ACTIVE
      const role = response.data.role
      const isVerified = String(response.data.is_verified);

      // if (role==="CITIZEN"){
      //   navigate("/citizen",{ replace: true })
      // }else if(role==="WARD"){
      //   navigate("/ward",{replace:true})
      // }else if(role==="PANCHAYATH"){
      //   navigate("/panchayath",{replace:true})
      // }else if(role=="BLOCK"){
      //   navigate("/block",{replace:true})
      // }

      if (response.data.status === "SUSPENDED") {
        alert("Your account is suspended.")
        return
      }

      if (role === "PANCHAYATH") {
        if (isVerified === "true") {
          navigate("/panchayath")
        } else {
          navigate("/panchayath/profile")
        }
      } else {
        alert("this modules not built yet")
      }


    } catch (error) {
      console.log(error)
      alert(error.response?.data?.detail || "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  /////////////////////////////////////////////////

  //////////////////////////sigup///////////////////////

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateSignup()) return

    setIsSubmitting(true)

    try {

      const response = await signupUser({
        username: signupData.fullName,
        email: signupData.email,
        password: signupData.password,
        confirm_password: signupData.confirmPassword,
        role: signupData.role,
      })

      setOtpSent(true)

    } catch (error) {
      alert(error.response?.data.error || "signup failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  ////////////////////////////////

  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    if (isSubmitting) return   // PREVENT DOUBLE CALL

    if (otp.length !== 6) {
      setErrors({ otp: "Enter a valid 6-digit OTP" })
      return
    }

    setIsSubmitting(true)

    try {
      await verifyOtp({
        email: signupData.email,
        otp: otp,
      })

      setOtpVerified(true)
    } catch (error) {
      alert(error.response?.data?.error || "Invalid OTP")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendOtp = async () => {
    if (!canResend || isResending) return

    setIsResending(true)

    try {
      const response = await resendOtp({
        email: signupData.email,
      })

      setRemainingResends(response.data.remaining)
      setTimer(60)
      setCanResend(false)

    } catch (error) {
      alert(error.response?.data?.error || "Resend Failed")
    } finally {
      setIsResending(false)
    }
  }

  const switchMode = (newMode) => {
    setMode(newMode)
    setErrors({})
    setOtpSent(false)
    setOtpVerified(false)
    setOtp("")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  // Success state after OTP verification
  if (otpVerified) {
    return (
      <Card className="w-full max-w-md border-border shadow-md">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />

          <h3 className="mt-6 text-xl font-bold">
            Registration Submitted
          </h3>

          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            Your {signupData.role === "WARD" ? "Ward" : "Panchayath"} account
            has been created successfully.
            <br />
            It is currently <strong>pending admin approval</strong>.
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            You will be able to login once approved by the system administrator.
          </p>

          <Button
            className="mt-8 w-full max-w-xs"
            onClick={() => {
              switchMode("login")
              setOtpVerified(false)
            }}
          >
            Go to Login
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md border-border shadow-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
          <Shield className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {mode === "login"
            ? "Sign in to access your SPIMS portal"
            : "Register to start using the SPIMS platform"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Mode Toggle */}
        <div className="mb-6 flex rounded-lg border border-border bg-muted p-1">
          <button
            type="button"
            onClick={() => switchMode("login")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${mode === "login"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => switchMode("signup")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${mode === "signup"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Sign Up
          </button>
        </div>

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({ ...loginData, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10"
                  value={loginData.password}
                  onChange={(e) => {
                    setLoginData({ ...loginData, password: e.target.value })
                    if (errors.password)
                      setErrors({ ...errors, password: undefined })
                  }}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Role Selector */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-role">Role</Label>
              <select
                id="login-role"
                value={loginData.role}
                onChange={(e) =>
                  setLoginData({ ...loginData, role: e.target.value })
                }
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="submit"
              className="mt-2 w-full gap-2 text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {"Don't have an account? "}
              <button
                type="button"
                onClick={() => switchMode("signup")}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {mode === "signup" && (
          <form
            onSubmit={otpSent ? handleVerifyOtp : handleSignup}
            className="flex flex-col gap-4"
          >
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10"
                  value={signupData.fullName}
                  onChange={(e) => {
                    setSignupData({ ...signupData, fullName: e.target.value })
                    if (errors.fullName)
                      setErrors({ ...errors, fullName: undefined })
                  }}
                  disabled={otpSent}
                  aria-invalid={!!errors.fullName}
                />
              </div>
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={signupData.email}
                  onChange={(e) => {
                    setSignupData({ ...signupData, email: e.target.value })
                    if (errors.email)
                      setErrors({ ...errors, email: undefined })
                  }}
                  disabled={otpSent}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            {/* <div className="flex flex-col gap-2">
              <Label htmlFor="signup-phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="10-digit phone number"
                  className="pl-10"
                  value={signupData.phone}
                  onChange={(e) => {
                    setSignupData({ ...signupData, phone: e.target.value })
                    if (errors.phone)
                      setErrors({ ...errors, phone: undefined })
                  }}
                  disabled={otpSent}
                  aria-invalid={!!errors.phone}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div> */}

            {/* Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="pl-10 pr-10"
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData({ ...signupData, password: e.target.value })
                    if (errors.password)
                      setErrors({ ...errors, password: undefined })
                  }}
                  disabled={otpSent}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="pl-10 pr-10"
                  value={signupData.confirmPassword}
                  onChange={(e) => {
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    })
                    if (errors.confirmPassword)
                      setErrors({ ...errors, confirmPassword: undefined })
                  }}
                  disabled={otpSent}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="signup-role">Role</Label>
              <select
                id="signup-role"
                value={signupData.role}
                onChange={(e) =>
                  setSignupData({ ...signupData, role: e.target.value })
                }
                disabled={otpSent}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            {/* OTP Section - animated entry */}
            {otpSent && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-2 flex flex-col gap-4 rounded-lg border border-accent/20 bg-accent/5 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <Mail className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Verify Your Email
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {"A 6-digit code has been sent to "}
                      <span className="font-medium text-foreground">
                        {signupData.email}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="otp-input">OTP Code</Label>
                  <Input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="text-center text-lg tracking-[0.5em] font-semibold"
                    value={otp}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6)
                      setOtp(val)
                      if (errors.otp) setErrors({ ...errors, otp: undefined })
                    }}
                    aria-invalid={!!errors.otp}
                    autoFocus
                  />
                  {errors.otp && (
                    <p className="text-xs text-destructive">{errors.otp}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1 text-xs">

                    {remainingResends > 0 ? (
                      canResend ? (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isResending}
                          className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
                        >
                          {isResending ? "Resending..." : "Resend OTP"}
                        </button>
                      ) : (
                        <span className="text-muted-foreground">
                          Resend OTP in {timer}s
                        </span>
                      )
                    ) : (
                      <span className="text-destructive">
                        Resend limit reached
                      </span>
                    )}

                    {remainingResends > 0 && (
                      <span className="text-muted-foreground">
                        Attempts left: {remainingResends}
                      </span>
                    )}

                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false)
                      setOtp("")
                    }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Edit details
                  </button>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="mt-2 w-full gap-2 text-sm font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {otpSent ? "Verifying..." : "Sending OTP..."}
                </>
              ) : otpSent ? (
                "Verify OTP"
              ) : (
                "Register"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              {"Already have an account? "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
