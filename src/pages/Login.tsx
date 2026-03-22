import { useState } from "react";
import { Copy, CheckCircle, Smartphone, Mail, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [useEmail, setUseEmail] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#070e13] flex flex-col items-center pt-24 px-4 font-sans text-white hidden-scrollbar overflow-x-hidden relative">
      {/* Background glow resembling the reference image */}
      <div className="absolute top-[10%] right-[30%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] -z-10" />
      <div className="absolute bottom-[0] left-[10%] w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />

      {/* Header section matching Sphere Ecosystem reference */}
      <div className="text-center mb-10 w-full max-w-2xl">
        <div className="relative inline-block w-full">
          {/* Faded Background Text */}
          <h1 className="absolute -top-6 md:-top-10 left-1/2 -translate-x-1/2 text-[80px] md:text-[120px] font-black text-white/[0.03] select-none uppercase tracking-tighter whitespace-nowrap z-0">
            CREATORX
          </h1>
          <h2 className="relative z-10 text-3xl md:text-5xl font-extrabold tracking-tight mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">LET'S CONNECT</span>
            <br />
            <span className="text-gray-100">WITH CREATORX ECOSYSTEM</span>
          </h2>
        </div>
        <p className="text-gray-400 text-sm md:text-base mt-4 font-light max-w-lg mx-auto">
          Seamlessly Enhance The Future Through Our AI Technology
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#11161d]/80 backdrop-blur-md rounded-[20px] border border-white/5 p-6 md:p-8 shadow-2xl z-10 relative">
        {/* Toggle */}
        <div className="flex bg-[#0b0f15] rounded-full p-1 mb-6 border border-white/5">
          <button
            onClick={() => setUseEmail(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
              useEmail ? "bg-[#161f26] text-emerald-400 border border-emerald-500/30" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Email account
          </button>
          <button
            onClick={() => setUseEmail(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all ${
              !useEmail ? "bg-[#161f26] text-emerald-400 border border-emerald-500/30" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            Phone number
          </button>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {useEmail ? (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email here"
                  className="w-full bg-[#0b0f15] border border-white/10 rounded-full px-10 py-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300 ml-1">Phone</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  placeholder="Enter your phone here"
                  className="w-full bg-[#0b0f15] border border-white/10 rounded-full px-10 py-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5 relative">
            <label className="text-xs font-semibold text-gray-300 ml-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-gray-500" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-[#0b0f15] border border-white/10 rounded-full pl-10 pr-12 py-3 text-sm text-gray-200 focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-gray-600 tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <a href="#" className="text-xs text-emerald-500 hover:text-emerald-400 transition-colors">
              Forgot Password?
            </a>
          </div>

          <div className="pt-2">
            <Link to="/dashboard" className="block w-full">
              <button className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-semibold py-3.5 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Sign In Now
              </button>
            </Link>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-gray-400">
              Don't have access yet? <a href="#" className="text-emerald-500 hover:underline">Sign Up</a>
            </p>
          </div>
        </form>
      </div>

      <div className="mt-12 text-xs text-gray-500 font-light mb-8">
        Copyright © 2025 CreatorX. All Rights Reserved.
      </div>
    </div>
  );
};

export default Login;
