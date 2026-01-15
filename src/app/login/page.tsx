"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaApple, FaArrowLeft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast, Toaster } from "react-hot-toast";
import { fetchData, postData, putData } from "../../utils/api/api";
import { useRouter } from "next/navigation";
import {
  AuthResponse,
  GoogleUserData,
  useAuth,
  UserData,
} from "@/contexts/AuthContext";
import PolicyModal from "@/components/Modals/PolicyModal";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { googleLogin } from "@/services/auth/googleAuth";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

interface ErrorResponse {
  response?: {
    data?: {
      message: string;
      requiresOtp?: boolean;
      otpId?: string;
    };
  };
  message?: string;
}

// Google Login Component
const GoogleLoginButton = () => {
  const { login } = useAuth();
  const router = useRouter();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const toastId = toast.loading("Signing in with Google...");

        try {
          if (!credentialResponse.credential) {
            throw new Error("No credential received");
          }

          // Decode JWT token to get user info
          const decoded: any = jwtDecode(credentialResponse.credential);

          // ✅ SEND TOKEN TO BACKEND
          const googleData = {
            token: credentialResponse.credential, // Add token field
            email: decoded.email || "",
            name: decoded.name || "",
            picture: decoded.picture || "",
            googleId: decoded.sub || "",
          };

          console.log("Google user data with token:", googleData);

          // Call your backend API
          const userData = await googleLogin(googleData);

          if (userData) {
            const token = localStorage.getItem("token");
            if (token && login) {
              // Create complete user object
              const authUserData: UserData = {
                id: userData._id || userData.id || "",
                name: userData.name || decoded.name || "",
                email: userData.email || decoded.email || "",
                type: userData.type || "user",
                avatar:
                  userData.avatar ||
                  userData.picture ||
                  decoded.picture ||
                  undefined,
                _id: userData._id,
                picture: userData.picture,
                phone: userData.phone,
                createdAt: userData.createdAt,
                updatedAt: userData.updatedAt,
              };

              // Update auth context
              login(token, authUserData);
              toast.success("Google login successful!", { id: toastId });

              // Redirect to home
              setTimeout(() => {
                router.push("/");
              }, 1000);
            }
          }
        } catch (error: unknown) {
          console.error("Google login error:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Google login failed";
          toast.error(errorMessage, {
            id: toastId,
            duration: 4000,
          });
        }
      }}
      onError={() => {
        toast.error("Google login failed. Please try again.");
      }}
      text="signin_with"
      shape="rectangular"
      size="large"
      width="100%"
      useOneTap={false}
    />
  );
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [authStep, setAuthStep] = useState<
    "login" | "otp" | "forgot" | "reset" | "newPassword"
  >("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [otpId, setOtpId] = useState("");
  const [openModal, setOpenModal] = useState<"privacy" | "terms" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user, isAuthenticated, login, logout } = useAuth();
  const router = useRouter();

  // Handle Apple Login (placeholder)
  const handleAppleLogin = () => {
    toast.loading("Apple login coming soon...");
  };

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("User already authenticated, redirecting...");
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  // Handle OTP input
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (authStep === "otp") {
      setAuthStep("login");
      setOtp(["", "", "", "", "", ""]);
    } else if (authStep === "forgot") {
      setAuthStep("login");
    } else if (authStep === "reset") {
      setAuthStep("forgot");
      setOtp(["", "", "", "", "", ""]);
    } else if (authStep === "newPassword") {
      setAuthStep("reset");
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const response = await postData<AuthResponse>("/auth/login", {
        email,
        password,
      });

      console.log("Login API Response:", response);

      if (response.token && response.user) {
        // Prepare user data for AuthContext
        const userDataForContext = {
          ...response.user,
          id: response.user._id || response.user.id || "",
        };

        // Call AuthContext login function
        login(response.token, userDataForContext);

        toast.success("Login successful!", { id: toastId });

        // Redirect immediately
        setTimeout(() => {
          router.push("/");
        }, 500);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      console.error("Login error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Creating account...");

    try {
      const response = await postData<AuthResponse>("/auth/register", {
        name,
        email,
        password,
        type: "user",
      });

      console.log("Register API Response:", response);

      // Check different response formats
      if (response.token && response.user) {
        // Case 1: Direct token and user in response (auto-login)
        const userDataForContext = {
          ...response.user,
          id: response.user._id || response.user.id || "",
        };

        login(response.token, userDataForContext);
        toast.success("Registration successful! You are now logged in.", {
          id: toastId,
          duration: 3000,
        });

        // Redirect to home
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else if (response.data?.token && response.data?.user) {
        // Case 2: Token and user in data object
        const userDataForContext = {
          ...response.data.user,
          id: response.data.user._id || response.data.user.id || "",
        };

        login(response.data.token, userDataForContext);
        toast.success("Registration successful! You are now logged in.", {
          id: toastId,
          duration: 3000,
        });

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else if (response.success) {
        // Case 3: Registration successful but no auto-login
        toast.success(
          "Registration successful! Please login with your credentials.",
          {
            id: toastId,
            duration: 3000,
          }
        );

        // Clear form and switch to login
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsLogin(true);
      } else if (response.message) {
        // Case 4: Success message but different format
        toast.success(response.message, {
          id: toastId,
          duration: 3000,
        });

        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsLogin(true);
      } else {
        throw new Error("Registration failed - Invalid response format");
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      console.error("Registration error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      toast.error(errorMessage, {
        id: toastId,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Sending reset email...");

    try {
      const response = await postData<AuthResponse>("/auth/forgot-password", {
        email,
      });

      console.log("Forgot password response:", response);

      if (
        response.success ||
        response.message?.includes("sent") ||
        response.message?.includes("check your email")
      ) {
        // Store OTP ID if provided
        if (response.otpId) {
          setOtpId(response.otpId);
        }

        // Store reset token if provided
        if (response.resetToken) {
          setResetToken(response.resetToken);
        }

        toast.success("Reset email sent! Please check your inbox.", {
          id: toastId,
          duration: 4000,
        });

        // Move to OTP verification step
        setAuthStep("reset");
      } else if (response.message) {
        // Some APIs return message instead of success flag
        toast.success(response.message, {
          id: toastId,
          duration: 4000,
        });
        setAuthStep("reset");
      } else {
        toast.error("Failed to send reset email. Please try again.", {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      console.error("Forgot password error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to send reset email. Please check if email is registered.";

      toast.error(errorMessage, {
        id: toastId,
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Verifying OTP...");

    try {
      let response: AuthResponse;

      if (authStep === "reset") {
        // For password reset OTP verification
        response = await postData<AuthResponse>("/auth/verify-reset-otp", {
          email,
          otp: enteredOtp,
          otpId: otpId || undefined,
        });
      } else {
        // For login OTP verification
        response = await postData<AuthResponse>("/auth/verify-otp", {
          email,
          otp: enteredOtp,
          otpId: otpId || undefined,
        });
      }

      console.log("OTP verification response:", response);

      if (response.verified || response.success) {
        toast.success("OTP verified successfully!", {
          id: toastId,
          duration: 3000,
        });

        // Proceed based on context
        if (authStep === "reset") {
          // Store reset token if provided
          if (response.resetToken) {
            setResetToken(response.resetToken);
          }
          setAuthStep("newPassword");
        } else if (authStep === "otp") {
          // If OTP is for login, try to login again
          try {
            const loginResponse = await postData<AuthResponse>("/auth/login", {
              email,
              password,
            });

            if (loginResponse.token && loginResponse.user) {
              const userDataForContext = {
                ...loginResponse.user,
                id: loginResponse.user._id || loginResponse.user.id || "",
              };

              login(loginResponse.token, userDataForContext);
              toast.success("Login successful!");

              setTimeout(() => {
                router.push("/");
              }, 500);
            }
          } catch (loginError) {
            console.error("Auto-login after OTP failed:", loginError);
            toast.error("Please try logging in again");
            setAuthStep("login");
          }
        }
      } else {
        toast.error("Invalid OTP. Please try again.", {
          id: toastId,
          duration: 3000,
        });
        setOtp(["", "", "", "", "", ""]);
        // Focus first OTP input
        const firstOtpInput = document.querySelector(
          'input[type="text"]'
        ) as HTMLInputElement;
        if (firstOtpInput) firstOtpInput.focus();
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      console.error("OTP verification error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Invalid OTP. Please try again.";

      toast.error(errorMessage, {
        id: toastId,
        duration: 3000,
      });
      setOtp(["", "", "", "", "", ""]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      // Prepare request data
      const requestData: Record<string, unknown> = {
        password: newPassword,
        email: email,
      };

      // Add OTP if we have one
      const enteredOtp = otp.join("");
      if (enteredOtp.length === 6) {
        requestData.otp = enteredOtp;
      }

      // Add OTP ID if we have one
      if (otpId) {
        requestData.otpId = otpId;
      }

      let response: AuthResponse;

      if (resetToken) {
        // Use reset token endpoint
        response = await postData<AuthResponse>(
          `/auth/reset-password/${resetToken}`,
          requestData
        );
      } else {
        // Use email-based reset endpoint
        response = await postData<AuthResponse>(
          "/auth/reset-password",
          requestData
        );
      }

      console.log("Password reset response:", response);

      if (
        response.success ||
        response.message?.includes("success") ||
        response.message?.includes("reset")
      ) {
        toast.success("Password reset successful! You can now login.", {
          id: toastId,
          duration: 4000,
        });

        // Reset all states
        setAuthStep("login");
        setNewPassword("");
        setConfirmPassword("");
        setOtp(["", "", "", "", "", ""]);
        setResetToken("");
        setOtpId("");

        // Clear password fields
        setTimeout(() => {
          setPassword("");
        }, 500);
      } else if (response.message) {
        toast.success(response.message, {
          id: toastId,
          duration: 4000,
        });
        setAuthStep("login");
        setNewPassword("");
        setConfirmPassword("");
        setOtp(["", "", "", "", "", ""]);
      } else {
        toast.error("Failed to reset password. Please try again.", {
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

  // Resend OTP
  const handleResendOtp = async () => {
    const toastId = toast.loading("Resending OTP...");
    try {
      if (authStep === "reset" || authStep === "newPassword") {
        // For password reset
        const response = await postData<AuthResponse>(
          "/auth/resend-reset-otp",
          { email }
        );
        if (response.success) {
          toast.success("OTP resent to your email!", { id: toastId });
        } else {
          toast.error("Failed to resend OTP", { id: toastId });
        }
      } else if (authStep === "otp") {
        // For login OTP
        const response = await postData<AuthResponse>("/auth/resend-otp", {
          email,
        });
        if (response.success) {
          toast.success("OTP resent to your email!", { id: toastId });
        } else {
          toast.error("Failed to resend OTP", { id: toastId });
        }
      }
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      toast.error(
        err.response?.data?.message || err.message || "Failed to resend OTP",
        { id: toastId }
      );
    }
  };

  // Get User Profile (if needed)
  const getUserProfile = async () => {
    try {
      const response = await fetchData<UserData>("/auth/profile");
      console.log("User Profile:", response);
      return response;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      return null;
    }
  };

  // Update User Profile (if needed)
  const updateUserProfile = async (data: Partial<UserData>) => {
    try {
      const response = await putData<UserData>("/auth/profile", data);
      toast.success("Profile updated successfully!");
      return response;
    } catch (error) {
      toast.error("Failed to update profile");
      throw error;
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await postData("/auth/logout", {});
      logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  // Render OTP form based on context
  const renderOtpForm = (context: "login" | "reset") => (
    <form onSubmit={handleOtpSubmit} className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 text-sm md:text-base"
        >
          <FaArrowLeft size={14} className="md:size-[16px]" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="text-xl md:text-3xl font-semibold text-center text-gray-700 flex-1">
          Enter OTP
        </h1>
        <div className="w-6 md:w-8"></div>
      </div>

      <div className="text-center mb-4 md:mb-6">
        <p className="text-gray-600 text-sm md:text-base">
          We sent a verification code to
        </p>
        <p className="font-semibold text-gray-800 text-sm md:text-base">
          {email}
        </p>
      </div>

      <div className="flex justify-center gap-2 md:gap-3 mb-4 md:mb-6">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={data}
            onChange={(e) =>
              handleOtpChange(e.target as HTMLInputElement, index)
            }
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !data && index > 0) {
                // Move focus to previous input on backspace
                const prevInput = document.getElementById(
                  `otp-${index - 1}`
                ) as HTMLInputElement;
                if (prevInput) prevInput.focus();
              }
            }}
            onFocus={(e) => e.target.select()}
            id={`otp-${index}`}
            className="w-10 h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading || otp.some((digit) => digit === "")}
        className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600 text-xs md:text-sm">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResendOtp}
            className="text-gray-800 font-semibold hover:underline cursor-pointer transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            Resend
          </button>
        </p>
        <p className="text-gray-500 text-xs mt-2">
          OTP will expire in 10 minutes
        </p>
      </div>
    </form>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold pb-2 text-center text-gray-700">
        Sign in
      </h1>

      <div className="flex flex-col gap-4 md:gap-6">
        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-sm md:text-base"
          required
        />
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setAuthStep("forgot");
              // Clear password field when going to forgot password
              setPassword("");
            }}
            className="text-sm text-gray-600 hover:underline transition-all duration-300 text-left hover:text-gray-800"
          >
            Forgot password?
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto min-w-[120px]"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        <div className="text-center mt-2 md:mt-4">
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                // Clear fields when switching to signup
                setPassword("");
              }}
              className="text-gray-800 font-semibold hover:underline focus:outline-none cursor-pointer transition-all duration-300 hover:text-gray-900"
            >
              Sign up
            </button>
          </p>
        </div>

        <div className="relative my-2 md:my-4 text-center">
          <span className="absolute left-0 top-1/2 w-full h-px bg-gray-300"></span>
          <span className="relative bg-white/40 px-3 text-gray-600 text-sm">
            or continue with
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          {/* Google Login Button */}
          <div className="w-full">
            <GoogleLoginButton />
          </div>

          <button
            type="button"
            onClick={handleAppleLogin}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm md:text-base font-medium cursor-pointer"
          >
            <FaApple size={18} className="text-black" />
            <span>Apple</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4 md:mt-6 leading-5">
          Protected by reCAPTCHA and subject to the{" "}
          <button
            onClick={() => setOpenModal("privacy")}
            className="underline text-black hover:text-gray-700 transition-colors font-medium"
          >
            Privacy Policy
          </button>{" "}
          and{" "}
          <button
            onClick={() => setOpenModal("terms")}
            className="underline text-black hover:text-gray-700 transition-colors font-medium"
          >
            Terms of Service
          </button>
          .
        </p>
      </div>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword} className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 text-sm md:text-base"
        >
          <FaArrowLeft size={14} className="md:size-[16px]" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="text-xl md:text-3xl font-semibold text-center text-gray-700 flex-1">
          Reset Password
        </h1>
        <div className="w-6 md:w-8"></div>
      </div>

      <div className="text-center mb-4 md:mb-6">
        <p className="text-gray-600 text-sm md:text-base">
          Enter your email address and we&apos;ll send you a reset link.
        </p>
      </div>

      <input
        placeholder="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-sm md:text-base"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gray-800 text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending Reset Link...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setAuthStep("login")}
          className="text-gray-600 hover:text-gray-800 text-sm transition-all duration-300"
        >
          Remember your password? <span className="font-semibold">Sign in</span>
        </button>
      </div>
    </form>
  );

  const renderNewPasswordForm = () => (
    <form onSubmit={handlePasswordReset} className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-all duration-300 text-sm md:text-base"
        >
          <FaArrowLeft size={14} className="md:size-[16px]" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="text-xl md:text-3xl font-semibold text-center text-gray-700 flex-1">
          New Password
        </h1>
        <div className="w-6 md:w-8"></div>
      </div>

      <div className="text-center mb-4 md:mb-6">
        <p className="text-gray-600 text-sm md:text-base">
          Create your new password
        </p>
      </div>

      {/* Show the email that was entered */}
      <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
        <p className="text-xs md:text-sm text-gray-600">Email</p>
        <p className="font-semibold text-gray-800 text-sm md:text-base truncate">
          {email}
        </p>
      </div>

      <div className="relative">
        <input
          placeholder="New Password (min. 6 characters)"
          type={showNewPassword ? "text" : "password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full p-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-sm md:text-base"
          required
          minLength={6}
        />

        <button
          type="button"
          onClick={() => setShowNewPassword(!showNewPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label={showNewPassword ? "Hide password" : "Show password"}
        >
          {showNewPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
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
          minLength={6}
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
  );

  const renderSignupForm = () => (
    <form onSubmit={handleRegister} className="space-y-4 md:space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold pb-2 md:pb-4 text-center text-gray-700">
        Create account
      </h1>

      <div className="flex flex-col gap-4 md:gap-5">
        <input
          placeholder="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-sm md:text-base"
          required
        />
        <input
          placeholder="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 text-sm md:text-base"
          required
        />
        <div className="relative">
          <input
            placeholder="Password (min. 6 characters)"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
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
            className="w-full p-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <FaEyeSlash size={20} />
            ) : (
              <FaEye size={20} />
            )}
          </button>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-300 mt-1"
            required
          />
          <label
            htmlFor="terms"
            className="text-xs md:text-sm text-gray-600 leading-relaxed"
          >
            I agree to the{" "}
            <button
              type="button"
              onClick={() => setOpenModal("terms")}
              className="underline text-black hover:text-gray-700 transition-colors font-medium"
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button
              type="button"
              onClick={() => setOpenModal("privacy")}
              className="underline text-black hover:text-gray-700 transition-colors font-medium"
            >
              Privacy Policy
            </button>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base w-full"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <div className="text-center mt-1 md:mt-2">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                // Clear password fields when switching to login
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-gray-800 font-semibold hover:underline focus:outline-none cursor-pointer transition-all duration-300 hover:text-gray-900"
            >
              Sign in
            </button>
          </p>
        </div>

        <div className="relative my-2 md:my-4 text-center">
          <span className="absolute left-0 top-1/2 w-full h-px bg-gray-300"></span>
          <span className="relative bg-white/40 px-3 text-gray-600 text-sm">
            or continue with
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-3">
          {/* Google Login Button */}
          <div className="w-full">
            <GoogleLoginButton />
          </div>

          <button
            type="button"
            onClick={handleAppleLogin}
            className="flex items-center justify-center gap-2 w-full border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 text-sm md:text-base font-medium cursor-pointer"
          >
            <FaApple size={18} className="text-[#0078D4]" />
            <span>Apple</span>
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4 md:mt-6 leading-5">
          Protected by reCAPTCHA and subject to the{" "}
          <button
            onClick={() => setOpenModal("privacy")}
            className="underline text-black hover:text-gray-700 transition-colors font-medium"
          >
            Privacy Policy
          </button>{" "}
          and{" "}
          <button
            onClick={() => setOpenModal("terms")}
            className="underline text-black hover:text-gray-700 transition-colors font-medium"
          >
            Terms of Service
          </button>
          .
        </p>
      </div>
    </form>
  );

  // If user is already authenticated, show loading or redirect
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FBB5E7] to-[#C4F9FF]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">
            Already logged in! Redirecting to homepage...
          </p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Click here if not redirected
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#FBB5E7] to-[#C4F9FF] relative overflow-hidden">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
            borderRadius: "10px",
            padding: "16px",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10B981",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10B981",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#EF4444",
            },
          },
          loading: {
            duration: 30000,
          },
        }}
      />

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

      {/* Main Section */}
      <div className="w-full flex flex-col lg:flex-row justify-between items-center px-4 sm:px-8 md:px-16 py-6 md:py-10 gap-8 md:gap-0 md:pt-0 pt-30">
        {/* Background circular image */}
        <Image
          src="/images/fullrounded.png"
          alt="background illustration"
          width={650}
          height={650}
          className="absolute opacity-80 md:opacity-70 md:pt-10 pt-0 rounded-full animate-spin-slow pointer-events-none select-none hidden md:block"
          style={{ animationDuration: "30s" }}
        />

        {/* Text content */}
        <div className="relative z-10 px-4 lg:px-6 text-center md:text-left w-full lg:w-auto md:h-auto h-[60vh] flex flex-col justify-center">
          <div className="lg:block pt-10 md:pt-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#636363] mb-3 lg:mb-4">
              One Tool For Four
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#636363] mb-4 lg:mb-6">
              Whole Team Needs
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 mb-4 lg:mb-6 text-justify">
              We are lorem ipsum team dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua.
            </p>

            {/* Avatars + text */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mt-4">
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  <Image
                    src="https://thumbs.dreamstime.com/b/young-handsome-man-black-suit-young-handsome-man-black-suit-official-studio-portrait-368118847.jpg"
                    alt="user1"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white transition-all duration-300 hover:scale-110 w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="user2"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white transition-all duration-300 hover:scale-110 w-10 h-10 sm:w-12 sm:h-12"
                  />
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                    alt="user3"
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-white transition-all duration-300 hover:scale-110 w-10 h-10 sm:w-12 sm:h-12"
                  />
                </div>
                <div className="ml-8 flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center -ml-4 hover:scale-105 transition-transform duration-300">
                    <span className="text-gray-700 font-bold text-sm sm:text-base">
                      +3K
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-gray-700 text-sm sm:text-base font-medium whitespace-nowrap">
                people joined us, now it&apos;s your turn
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full max-w-md lg:max-w-none lg:w-auto">
          <div className="bg-white/40 backdrop-blur-md p-6 sm:p-8 md:p-10 md:px-14 rounded-2xl md:rounded-3xl shadow-2xl w-full lg:w-[550px] h-auto max-h-[90vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {isLogin ? (
              <>
                {authStep === "login" && renderLoginForm()}
                {authStep === "otp" && renderOtpForm("login")}
                {authStep === "forgot" && renderForgotPasswordForm()}
                {authStep === "reset" && renderOtpForm("reset")}
                {authStep === "newPassword" && renderNewPasswordForm()}
              </>
            ) : (
              renderSignupForm()
            )}
          </div>
        </div>
      </div>

      <PolicyModal
        isOpen={openModal === "privacy"}
        onClose={() => setOpenModal(null)}
        defaultTab="privacy"
      />

      <PolicyModal
        isOpen={openModal === "terms"}
        onClose={() => setOpenModal(null)}
        defaultTab="terms"
      />
    </div>
  );
};

// Wrap with GoogleOAuthProvider
const LoginWithGoogleProvider = () => {
  const googleClientId =
    "300648228526-lndqaf2qrktbg30anu93cfocds0vlr0h.apps.googleusercontent.com";

  if (!googleClientId) {
    console.error("Google Client ID is not set in environment variables");
    return <Login />;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Login />
    </GoogleOAuthProvider>
  );
};

export default LoginWithGoogleProvider;
