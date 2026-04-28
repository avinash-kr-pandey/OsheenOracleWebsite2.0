// app/header/payment-methods/page.tsx (COMPLETE UPDATED)
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { servicePackageAPI } from "@/utils/api/service.package.api";
import PaymentMethods from "@/components/HeaderPages/PaymentMethods/PaymentMethods";
import { FiArrowLeft } from "react-icons/fi";

interface SelectedService {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: string;
  serviceDescription: string;
  categoryId: string;
  categoryName: string;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const PaymentMethodsPage = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showUserForm, setShowUserForm] = useState(true);

  useEffect(() => {
    // Get selected service from sessionStorage
    const serviceData = sessionStorage.getItem("selectedService");

    console.log("🔍 Payment page - serviceData:", serviceData);

    if (!serviceData) {
      console.log("❌ No service data found, redirecting...");
      router.push("/services/ourpackages");
      return;
    }

    try {
      const parsedService = JSON.parse(serviceData);
      console.log("✅ Parsed service:", parsedService);
      setSelectedService(parsedService);

      // Check if user is logged in
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        console.log("👤 Logged in user:", user);
        setUserDetails({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
        setShowUserForm(false);
      }
    } catch (error) {
      console.error("❌ Error parsing service data:", error);
      router.push("/services/ourpackages");
    }
  }, [router]);

  const handleUserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const details: UserDetails = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      address: formData.get("address") as string,
    };

    if (!details.name || !details.email || !details.phone || !details.address) {
      alert("Please fill all fields");
      return;
    }

    console.log("📝 User details submitted:", details);
    setUserDetails(details);
    setShowUserForm(false);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedService || !userDetails) {
      console.error("❌ Missing data:", { selectedService, userDetails });
      return;
    }

    console.log("💰 Processing payment for:", selectedService.serviceName);
    setProcessing(true);

    try {
      const response = await servicePackageAPI.submitServiceRequest({
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        address: userDetails.address,
        serviceId: selectedService.serviceId,
        communicationMode: "voice_call",
        description: selectedService.serviceDescription,
      });

      console.log("📦 Service request response:", response);

      if (response.success) {
        sessionStorage.removeItem("selectedService");
        alert("✅ Booking confirmed successfully!");
        router.push("/my-requests");
      } else {
        alert("Failed to confirm booking. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (!selectedService) {
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
      <div className="max-w-6xl mx-auto px-4 pt-12">
        <button
                  onClick={() => router.push("/services/ourpackages")}
                  className="group flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-all hover:translate-x-[-4px] pt-8"
                >
                  <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-28">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                <h2 className="text-white text-xl font-bold flex items-center gap-2">
                  <span>📋</span> Order Summary
                </h2>
              </div>

              <div className="p-6">
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    {selectedService.serviceName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Category: {selectedService.categoryName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Duration: {selectedService.serviceDuration}
                  </p>
                  <p className="text-2xl font-bold text-purple-700 mt-2">
                    ₹{selectedService.servicePrice.toLocaleString()}
                  </p>
                </div>

                {userDetails && (
                  <div className="py-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-700 text-sm mb-3">
                      Customer Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex">
                        <span className="text-gray-400 w-24">Name</span>
                        <span className="text-gray-700">
                          : {userDetails.name}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-400 w-24">Email</span>
                        <span className="text-gray-700 break-all">
                          : {userDetails.email}
                        </span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-400 w-24">Phone</span>
                        <span className="text-gray-700">
                          : {userDetails.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-lg">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-purple-700">
                      ₹{selectedService.servicePrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - User Form + Payment */}
          <div>
            {showUserForm ? (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Enter Your Details
                </h2>
                <form onSubmit={handleUserSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <textarea
                    name="address"
                    placeholder="Your Address"
                    rows={3}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Proceed to Payment
                  </button>
                </form>
              </div>
            ) : (
              <PaymentMethods
                onPaymentSuccess={handlePaymentSuccess}
                amount={selectedService.servicePrice}
                customerDetails={userDetails || undefined}
              />
            )}
          </div>
        </div>
      </div>

      {processing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-800 font-semibold text-lg">
              Processing Booking...
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
