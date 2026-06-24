// app/payment-success/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PaymentSuccessPage = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/services/ourpackages");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div
      className="min-h-screen pt-24 pb-20 flex items-center justify-center"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 animate-fade-in-up">
          {/* Success Animation */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 opacity-10"></div>
            <div className="pt-10 pb-6 text-center">
              {/* Animated Success Checkmark */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg mb-6 animate-bounce-in">
                <svg
                  className="w-12 h-12 text-white animate-checkmark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Confetti Effect */}
              <div className="absolute top-20 left-0 right-0 pointer-events-none">
                <div className="confetti"></div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                Payment Successful! 🎉
              </h1>
              <p className="text-gray-500 text-lg">
                Your booking has been confirmed successfully
              </p>
            </div>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-6">
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📧</span>
                </div>
                <p className="text-xs text-gray-500">Confirmation Email</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📱</span>
                </div>
                <p className="text-xs text-gray-500">SMS Sent</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">⚡</span>
                </div>
                <p className="text-xs text-gray-500">Instant Access</p>
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    Booking Confirmed!
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    We&apos;ve sent the details to your registered email. Our
                    team will contact you shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 text-center">
                What&apos;s Next?
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                    1
                  </div>
                  <span>Check your email for booking confirmation</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                    2
                  </div>
                  <span>Our team will contact you within 24 hours</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-xs font-bold text-purple-600">
                    3
                  </div>
                  <span>Track your request in dashboard</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/my-requests"
                className="flex-1 text-center py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105"
              >
                View My Requests
              </Link>
              <Link
                href="/services/spells"
                className="flex-1 text-center py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Book Another Service
              </Link>
            </div>

            {/* Countdown Redirect */}
            <p className="text-center text-sm text-gray-400 mt-6">
              Redirecting to dashboard in {countdown} seconds...
            </p>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes checkmark {
          from {
            stroke-dashoffset: 24;
          }
          to {
            stroke-dashoffset: 0;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-checkmark {
          stroke-dasharray: 24;
          animation: checkmark 0.4s ease-in-out 0.3s forwards;
        }

        /* Confetti Animation */
        .confetti {
          position: relative;
          display: inline-block;
        }

        .confetti::before,
        .confetti::after {
          content: "🎉";
          position: absolute;
          font-size: 24px;
          animation: confetti-pop 0.8s ease-out forwards;
        }

        .confetti::before {
          left: -40px;
          top: -20px;
          animation-delay: 0.1s;
        }

        .confetti::after {
          right: -40px;
          top: -20px;
          animation-delay: 0.3s;
        }

        @keyframes confetti-pop {
          0% {
            opacity: 0;
            transform: translateY(0) rotate(0deg);
          }
          20% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(-50px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccessPage;
