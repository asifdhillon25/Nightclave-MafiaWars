import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(prev => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background p-4">
      <div className="w-full max-w-md bg-light-surface dark:bg-dark-surface rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <h2 className="text-2xl font-bold text-light-textPrimary dark:text-dark-textPrimary text-center mb-6">
          Welcome Back
        </h2>
        <p className="text-center text-light-textSecondary dark:text-dark-textSecondary mb-8">
          Sign in to your account
        </p>

        {/* Form */}
        <form className="space-y-5">
          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col relative">
            <label className="mb-1 text-sm font-medium text-light-textSecondary dark:text-dark-textSecondary">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="px-4 py-3 rounded-lg border border-light-border dark:border-dark-border bg-light-surfaceMuted dark:bg-dark-surfaceMuted text-light-textPrimary dark:text-dark-textPrimary focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal transition pr-12"
              required
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-light-textSecondary dark:text-dark-textSecondary hover:text-light-textPrimary dark:hover:text-dark-textPrimary transition"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-brand-teal text-white font-semibold hover:bg-brand-teal/90 transition"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 text-light-textSecondary dark:text-dark-textSecondary text-sm">
            <span className="border-t border-light-border dark:border-dark-border flex-1"></span>
            <span>or continue with</span>
            <span className="border-t border-light-border dark:border-dark-border flex-1"></span>
          </div>

          {/* Social Login */}
          <div className="flex justify-center gap-4 mt-2">
            <button className="flex items-center justify-center p-2 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition">
              <FcGoogle size={24} />
            </button>
            <button className="flex items-center justify-center p-2 rounded-lg border border-light-border dark:border-dark-border hover:bg-light-surfaceMuted dark:hover:bg-dark-surfaceMuted transition">
              <FaGithub size={24} className="text-light-textPrimary dark:text-dark-textPrimary" />
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-light-textSecondary dark:text-dark-textSecondary mt-6">
          Don't have an account? <a href="#" className="text-brand-teal hover:text-brand-teal/90 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  );
}
