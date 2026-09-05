import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRight,
  Mail,
  KeyRound,
  Users,
  User,
  ShieldCheck,
  CalendarCheck,
  BarChart2,
  FileText,
  Shield,
  Lock,
  Globe,
  Loader2,
} from "lucide-react";
import { useToast } from "../components/ToastProvider";
import { auth } from "../apis/axios";
import useAuth from "../context/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setUser } = useAuth();
  const [role, setRole] = useState("employee");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Please enter your email address.", "error");
      return;
    }
    setIsLoading(true);
    try {
      const response = await auth.post("/request-otp", { email, role });
      setIsLoading(false);
      if (!response) {
        showToast(
          response?.data?.message || "Failed to send OTP. Please try again.",
          "error",
        );
        return;
      }
      showToast(`OTP sent successfully to your email.`, "success");
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setIsLoading(false);
      showToast(
        error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
        "error",
      );
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!otp) {
      showToast("Please enter the OTP.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await auth.post("/verify-otp", {
        email,
        otp,
      });

      showToast(
        response.data.message || "OTP verified successfully.",
        "success",
      );
      console.log("User data after OTP verification:", response.data.user);
      setUser(response.data.user);
      if (response.data.user?.role === "employee") {
        navigate("/employee-dashboard");
      } else if (response.data.user?.role === "hr") {
        navigate("/hr-dashboard");
      } else if (response.data.user?.role === "admin") {
        navigate("/admin-dashboard");
      }
    } catch (error) {
      console.error("OTP verification failed:", error);

      showToast(
        error.response?.data?.message ||
          "Failed to verify OTP. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8] flex font-sans">
      {/* Left Side: Brand Visual Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0e1525] text-white overflow-hidden flex-col justify-between p-12">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
            alt="Office background"
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0e1525]/90 via-[#0e1525]/80 to-[#0e1525]/95" />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">HRM Portal</h1>
                <p className="text-[11px] text-gray-400 font-medium tracking-wider uppercase mt-0.5">
                  People • Progress • Together
                </p>
              </div>
            </div>
            <div className="text-gray-500 font-serif italic text-xl leading-snug text-right transform -rotate-3 mt-4 mr-4 hidden xl:block">
              Great
              <br />
              Teams
              <br />
              Build
              <br />
              Great Futures
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-auto mb-16 pt-20">
            <h2 className="text-5xl sm:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              Manage People.
              <br />
              Simplify HR.
              <br />
              <span className="text-indigo-400">Build Tomorrow.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md mb-12 leading-relaxed">
              A modern HRM system to manage your workforce, streamline
              processes, and create a better workplace for everyone.
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-4 gap-4 max-w-xl">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-indigo-900/30 flex items-center justify-center text-indigo-400 shadow-sm">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-400">
                  Employee
                  <br />
                  Management
                </span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-400 shadow-sm">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-400">
                  Attendance
                  <br />& Leave
                </span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-amber-900/30 flex items-center justify-center text-amber-400 shadow-sm">
                  <BarChart2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-400">
                  Performance
                  <br />
                  Tracking
                </span>
              </div>
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-violet-900/30 flex items-center justify-center text-violet-400 shadow-sm">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-gray-400">
                  Documents
                  <br />& Payroll
                </span>
              </div>
            </div>
          </div>

          {/* Stats & Quote */}
          <div className="mt-auto pb-4">
            <div className="grid grid-cols-3 gap-6 pb-10 border-b border-gray-800/60 mb-10">
              <div>
                <div className="text-3xl font-semibold text-gray-100 mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Happy Employees
                </div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-gray-100 mb-1">
                  50+
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  Companies Trust Us
                </div>
              </div>
              <div>
                <div className="text-3xl font-semibold text-gray-100 mb-1">
                  99.9%
                </div>
                <div className="text-sm text-gray-500 font-medium">Uptime</div>
              </div>
            </div>

            <div className="text-gray-400 text-lg leading-relaxed max-w-lg italic font-serif relative">
              <span className="text-4xl text-gray-600 absolute -top-4 -left-6">
                "
              </span>
              People are the greatest asset of any organization.
              <span className="text-4xl text-gray-600 absolute -bottom-4 right-8">
                "
              </span>
              <div className="text-sm text-gray-500 not-italic mt-3 font-sans">
                — HRM Portal
              </div>
            </div>

            {/* Dots */}
            <div className="flex gap-2 mt-12">
              <div className="w-8 h-1.5 rounded-full bg-indigo-600"></div>
              <div className="w-4 h-1.5 rounded-full bg-gray-700"></div>
              <div className="w-4 h-1.5 rounded-full bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Sign-in Form */}
      <div className="w-full lg:w-1/2 flex flex-col relative overflow-hidden bg-[#f5f6f8]">
        {/* Subtle Background Shapes */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/30 rounded-full blur-[120px] opacity-60 translate-y-1/3 -translate-x-1/4"></div>

        {/* Top Right Contact */}
        <div className="absolute top-8 right-8 md:right-12 text-sm text-gray-500 z-20">
          Don't have an account?{" "}
          <a href="#" className="text-indigo-600 font-semibold hover:underline">
            Contact HR
          </a>
        </div>

        <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-20 z-10 pt-20 lg:pt-0">
          <div className="bg-white/80 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-soft w-full max-w-[500px] mx-auto border border-gray-100/80">
            {/* Form header */}
            <div className="mb-8">
              <p className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mb-3">
                WELCOME BACK
              </p>
              <h2 className="text-3xl font-bold text-gray-800 mb-2 tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-gray-500 text-sm">
                Access your HRM portal and continue your journey.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={otpSent ? handleVerifyOTP : handleRequestOTP}
              className="space-y-6"
            >
              {/* Role Switcher */}
              <div className="flex p-1.5 bg-gray-50 border border-gray-100 rounded-2xl">
                {[
                  { key: "employee", label: "Employee", icon: User },
                  { key: "hr", label: "HR", icon: Users },
                  { key: "admin", label: "Admin", icon: ShieldCheck },
                ].map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      disabled={otpSent}
                      onClick={() => {
                        console.log(r.key);
                        setRole(r.key);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        role === r.key
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                      } ${otpSent ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <Icon className="w-4 h-4" /> {r.label}
                    </button>
                  );
                })}
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={otpSent}
                    placeholder="Enter your email address"
                    className={`w-full pl-12 pr-4 py-2.5 rounded-xl border ${
                      otpSent
                        ? "bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-gray-50/50 border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10"
                    } transition-all text-gray-800 outline-none`}
                  />
                </div>
                {!otpSent && (
                  <p className="text-gray-500 text-xs font-medium">
                    We'll send a One-Time Password (OTP) to your email
                  </p>
                )}
              </div>

              {/* OTP Input */}
              {otpSent && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-gray-700">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 transition-all text-gray-800 outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {otpSent ? "Verifying..." : "Sending OTP..."}
                  </>
                ) : (
                  <>
                    {otpSent ? "Verify & Access Dashboard" : "Continue"}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {otpSent && (
                <div className="text-center mt-2 text-sm">
                  <span className="text-gray-500">Didn't receive code? </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                    }}
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>
              )}

              {!otpSent && (
                <>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-[10px] font-bold tracking-wider uppercase">
                      OR
                    </span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}
            </form>

            {/* Trust Badges */}
            <div className="mt-10 flex justify-between items-start border-t border-gray-100 pt-8 px-2">
              <div className="flex flex-col items-center text-center gap-3">
                <Shield className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-gray-400 leading-tight">
                  Secure
                  <br />
                  and Encrypted
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Lock className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-gray-400 leading-tight">
                  OTP Based
                  <br />
                  Authentication
                </span>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <Globe className="w-6 h-6 text-gray-500" strokeWidth={1.5} />
                <span className="text-[11px] font-medium text-gray-400 leading-tight">
                  Access
                  <br />
                  Anywhere
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto px-8 pb-8 pt-4 flex flex-col sm:flex-row justify-between items-center text-xs font-medium text-gray-400 z-20 gap-4">
          <span>© 2025 HRM Portal. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </a>
            <span className="text-gray-300">|</span>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
