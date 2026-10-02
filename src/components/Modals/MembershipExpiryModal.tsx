"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { membershipApi } from "@/utils/api/becomeamember.api";

export default function MembershipExpiryModal() {
  const router = useRouter();
  const [userMembership, setUserMembership] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const checkExpiry = async () => {
      if (typeof window !== "undefined" && localStorage.getItem("token")) {
        try {
          const res = await membershipApi.getMyMembership();
          if (res.success && res.data) {
            setUserMembership(res.data);
            
            // Check if expiring soon (<= 5 days) and modal hasn't been closed in session
            const sessionClosed = sessionStorage.getItem("expiry_modal_dismissed");
            if (res.data.isExpiringSoon && !sessionClosed) {
              setShowModal(true);
            }
          }
        } catch (e) {
          console.log("Expiry modal check error:", e);
        }
      }
    };

    checkExpiry();
  }, []);

  const handleDismiss = () => {
    setShowModal(false);
    sessionStorage.setItem("expiry_modal_dismissed", "true");
  };

  const handleRenew = () => {
    setShowModal(false);
    sessionStorage.setItem("expiry_modal_dismissed", "true");
    router.push("/#become-a-member");
  };

  if (!showModal || !userMembership) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-300 text-center transform animate-scale-up">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl cursor-pointer"
        >
          ✕
        </button>

        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
          ⚡
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 font-heading">
          Membership Expiring Soon!
        </h3>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Your <strong className="text-purple-700">{userMembership.planName || "Membership"}</strong> plan is expiring in{" "}
          <span className="text-amber-600 font-bold px-2.5 py-0.5 bg-amber-100 rounded-md">
            {userMembership.daysRemaining} {userMembership.daysRemaining === 1 ? "day" : "days"}
          </span>
          . Renew now to avoid losing your tarot guidance, daily horoscope, and sacred circle benefits!
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRenew}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm sm:text-base"
          >
            Renew Subscription Now
          </button>

          <button
            onClick={handleDismiss}
            className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl transition text-xs sm:text-sm cursor-pointer"
          >
            Remind Me Later
          </button>
        </div>
      </div>
    </div>
  );
}
