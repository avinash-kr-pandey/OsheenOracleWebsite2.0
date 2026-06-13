"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { postData } from "../../utils/api/api";
import Image from "next/image";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa6";

interface AuthResponse {
  success: boolean;
  message?: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message: string;
    };
  };
  message?: string;
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid or missing reset token. Please request a new link.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    // Password strength verification (min 8 chars, 1 special character)
    const passwordRegex = /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must be at least 8 characters and contain 1 special character");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const response = await postData<AuthResponse>(
        `/auth/reset-password/${token}`,
        { password: newPassword }
      );

      if (response.success || response.message?.toLowerCase().includes("success")) {
        toast.success("Password reset successful! Redirecting to login...", {
          id: toastId,
          duration: 3000,
        });

        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast.error(response.message || "Failed to reset password. Please try again.", {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      console.error("Password reset error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to reset password. The link may have expired.";

      toast.error(errorMessage, {
        id: toastId,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#FBB5E7] to-[#C4F9FF] relative overflow-hidden">
      {/* Toast Notifications */}
      <Toaster position="top-right" />

      {/* Logo */}
      <div
        className="absolute top-4 left-4 md:top-6 md:left-6 z-20 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="/logo.png"
          alt="logo"
          width={80}
          height={80}
          className="md:w-[130px] md:h-[120px] hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Circular Background Image */}
      <Image
        src="/images/roundimage.png"
        alt="background illustration"
        width={650}
        height={650}
        className="absolute opacity-80 md:opacity-70 rounded-full animate-spin-slow pointer-events-none select-none hidden md:block"
        style={{ animationDuration: "30s" }}
      />

      {/* Main Content Card */}
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 md:p-10 bg-white/40 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl">
        {!token ? (
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-red-600">Invalid Token</h1>
            <p className="text-gray-700">
              The reset token is missing or invalid. Please check your email for the correct link or request a new password reset.
            </p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 inline-flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all duration-300 font-semibold"
            >
              <FaArrowLeft />
              <span>Back to Login</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 text-sm md:text-base"
              >
                <FaArrowLeft />
                <span className="hidden sm:inline">Back</span>
              </button>
              <h1 className="text-xl md:text-3xl font-semibold text-center text-gray-700 flex-1">
                New Password
              </h1>
              <div className="w-6 md:w-8"></div>
            </div>

            <div className="text-center mb-4 md:mb-6">
              <p className="text-gray-600 text-sm md:text-base">
                Create a strong new password for your account.
              </p>
            </div>

            <div className="relative">
              <input
                placeholder="New Password (min. 8 chars, 1 special)"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-sm md:text-base"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-sm md:text-base"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FBB5E7] to-[#C4F9FF]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
