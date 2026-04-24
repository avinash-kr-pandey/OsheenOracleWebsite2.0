// app/payment-methods/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { servicePackageAPI } from "@/utils/api/service.package.api";
import PaymentMethods from "@/components/HeaderPages/PaymentMethods/PaymentMethods";

interface PendingServiceRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceId: string;
  communicationMode: "voice_call" | "video_call" | "voice_note";
  description: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  packageName: string;
  packagePrice: number;
  packageDuration: string;
}

const PaymentMethodsPage = () => {
  const router = useRouter();
  const [pendingRequest, setPendingRequest] =
    useState<PendingServiceRequest | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("pendingServiceRequest");
    if (!storedData) {
      router.push("/spells");
      return;
    }
    setPendingRequest(JSON.parse(storedData));
  }, [router]);

  const handlePaymentSuccess = async () => {
    if (!pendingRequest) return;

    setProcessing(true);
    try {
      const response = await servicePackageAPI.submitServiceRequest({
        name: pendingRequest.name,
        email: pendingRequest.email,
        phone: pendingRequest.phone,
        address: pendingRequest.address,
        serviceId: pendingRequest.serviceId,
        communicationMode: pendingRequest.communicationMode,
        description: pendingRequest.description,
        preferredDate: pendingRequest.preferredDate,
        preferredTimeSlot: pendingRequest.preferredTimeSlot,
      });

      if (response.success) {
        sessionStorage.removeItem("pendingServiceRequest");
        alert("✅ Booking confirmed successfully!");
        router.push("/my-requests");
      } else {
        alert("Failed to confirm booking. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!pendingRequest) {
    return (
      <div
        className="min-h-screen flex items-center justify-center pt-24 pb-20"
        style={{
          background:
            "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        }}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-24 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Packages
        </button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-28">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <span>📋</span> Order Summary
                </h2>
              </div>

              <div className="p-6">
                {/* Package Info */}
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        {pendingRequest.packageName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {pendingRequest.packageDuration}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-purple-700">
                        ₹{pendingRequest.packagePrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="py-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                    <span>👤</span> Customer Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-400 w-24">Name</span>
                      <span className="text-gray-700">
                        : {pendingRequest.name}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-24">Email</span>
                      <span className="text-gray-700 break-all">
                        : {pendingRequest.email}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-24">Phone</span>
                      <span className="text-gray-700">
                        : {pendingRequest.phone}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-400 w-24">Address</span>
                      <span className="text-gray-700 flex-1">
                        : {pendingRequest.address}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="py-4 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2">
                    <span>🎯</span> Service Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-400 w-28">Communication</span>
                      <span className="text-gray-700 capitalize">
                        : {pendingRequest.communicationMode.replace("_", " ")}
                      </span>
                    </div>
                    {pendingRequest.preferredDate && (
                      <div className="flex">
                        <span className="text-gray-400 w-28">
                          Preferred Date
                        </span>
                        <span className="text-gray-700">
                          :{" "}
                          {new Date(
                            pendingRequest.preferredDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {pendingRequest.preferredTimeSlot && (
                      <div className="flex">
                        <span className="text-gray-400 w-28">Time Slot</span>
                        <span className="text-gray-700 capitalize">
                          : {pendingRequest.preferredTimeSlot}
                        </span>
                      </div>
                    )}
                    <div className="flex">
                      <span className="text-gray-400 w-28">Requirements</span>
                      <span className="text-gray-700 flex-1">
                        : {pendingRequest.description}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-lg">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-purple-700">
                      ₹{pendingRequest.packagePrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Methods with Secure Payment at Bottom */}
          <div className="flex flex-col">
            {/* Payment Methods Component */}
            <div className="flex-1">
              <PaymentMethods onPaymentSuccess={handlePaymentSuccess} />
            </div>

            {/* Trust Badges - Moved to Right Side Bottom */}
            <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-around items-center">
                <div className="text-center">
                  <div className="text-2xl">🔒</div>
                  <p className="text-xs text-gray-600 mt-1">Secure Payment</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl">🛡️</div>
                  <p className="text-xs text-gray-600 mt-1">100% Protected</p>
                </div>
                <div className="w-px h-8 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl">⚡</div>
                  <p className="text-xs text-gray-600 mt-1">
                    Instant Confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Overlay */}
      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold text-lg">
              Processing Payment...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please wait while we confirm your booking
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsPage;
