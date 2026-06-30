// app/header/payment-methods/page.tsx (UPDATED - No tax calculation here, PaymentMethods will handle it)
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { servicePackageAPI } from "@/utils/api/service.package.api";
import PaymentMethods from "@/components/HeaderPages/PaymentMethods/PaymentMethods";
import { FiArrowLeft, FiUser, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";

interface SelectedService {
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  serviceDuration: string;
  serviceDescription: string;
  categoryId: string;
  categoryName: string;
  // User details from form
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  description?: string;
  communicationMode?: "voice_call" | "video_call" | "voice_note";
  preferredDate?: string;
  preferredTimeSlot?: string;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const PaymentMethodsPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] =
    useState<SelectedService | null>(null);
  const [formUserDetails, setFormUserDetails] = useState<UserDetails | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);

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

      // Extract user details from the service data (filled in the form)
      if (
        parsedService.name &&
        parsedService.email &&
        parsedService.phone &&
        parsedService.address
      ) {
        setFormUserDetails({
          name: parsedService.name,
          email: parsedService.email,
          phone: parsedService.phone,
          address: parsedService.address,
        });
        console.log("📝 Form user details extracted:", {
          name: parsedService.name,
          email: parsedService.email,
          phone: parsedService.phone,
        });
      }
    } catch (error) {
      console.error("❌ Error parsing service data:", error);
      router.push("/services/ourpackages");
    }
  }, [router]);

  const handlePaymentSuccess = async () => {
    // Use form user details (from the modal) for the booking
    const bookingUserDetails = formUserDetails;

    if (!selectedService || !bookingUserDetails) {
      console.error("❌ Missing data:", {
        selectedService,
        bookingUserDetails,
      });
      alert("Missing user details. Please try again.");
      return;
    }

    console.log("💰 Processing payment for:", selectedService.serviceName);
    setProcessing(true);

    try {
      const response = await servicePackageAPI.submitServiceRequest({
        name: bookingUserDetails.name,
        email: bookingUserDetails.email,
        phone: bookingUserDetails.phone,
        address: bookingUserDetails.address,
        serviceId: selectedService.serviceId,
        categoryId: selectedService.categoryId,
        communicationMode: selectedService.communicationMode || "voice_call",
        description:
          selectedService.description || selectedService.serviceDescription,
        preferredDate: selectedService.preferredDate,
        preferredTimeSlot: selectedService.preferredTimeSlot,
      });

      console.log("📦 Service request response:", response);

      if (response.success) {
        sessionStorage.removeItem("selectedService");
        alert("✅ Booking confirmed successfully!");
        router.push("/my-requests?success=true");
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

  // Handle back button - go back in browser history instead of redirect
  const handleBack = () => {
    // Check if there's history to go back to
    if (window.history.length > 1) {
      router.back(); // This goes to the previous page in browser history
    } else {
      // Fallback if no history exists
      router.push("/services/ourpackages");
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
          onClick={handleBack} // Changed from router.push to handleBack
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

                {/* ✅ Logged-in User Profile Section (if authenticated) */}
                {isAuthenticated && user && (
                  <div className="py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white">
                        <FaUserCircle className="text-xl" />
                      </div>
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Logged-in User Profile
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm bg-purple-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-purple-500 text-xs" />
                        <span className="text-gray-500 w-20">Name</span>
                        <span className="text-gray-700 font-medium">
                          : {user.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail className="text-purple-500 text-xs" />
                        <span className="text-gray-500 w-20">Email</span>
                        <span className="text-gray-700 break-all">
                          : {user.email || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-purple-500 text-xs" />
                        <span className="text-gray-500 w-20">Phone</span>
                        <span className="text-gray-700">
                          : {user.phone || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ✅ Form User Details Section (from Complete Your Details modal) */}
                {formUserDetails && (
                  <div className="py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white">
                        <FiUser className="text-lg" />
                      </div>
                      <h4 className="font-semibold text-gray-700 text-sm">
                        Booking Details (From Form)
                      </h4>
                    </div>
                    <div className="space-y-2 text-sm bg-green-50 p-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <FiUser className="text-green-500 text-xs" />
                        <span className="text-gray-500 w-20">Name</span>
                        <span className="text-gray-700 font-medium">
                          : {formUserDetails.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMail className="text-green-500 text-xs" />
                        <span className="text-gray-500 w-20">Email</span>
                        <span className="text-gray-700 break-all">
                          : {formUserDetails.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="text-green-500 text-xs" />
                        <span className="text-gray-500 w-20">Phone</span>
                        <span className="text-gray-700">
                          : {formUserDetails.phone}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <FiMapPin className="text-green-500 text-xs mt-1" />
                        <span className="text-gray-500 w-20">Address</span>
                        <span className="text-gray-700 flex-1">
                          : {formUserDetails.address}
                        </span>
                      </div>
                    </div>

                    {/* Show additional details if available */}
                    {selectedService.description && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">
                          Requirements / Description
                        </p>
                        <p className="text-sm text-gray-700">
                          {selectedService.description}
                        </p>
                      </div>
                    )}

                    {selectedService.communicationMode && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="text-gray-500">
                          Communication Mode:
                        </span>
                        <span className="text-purple-600 font-medium">
                          {selectedService.communicationMode === "voice_call" &&
                            "📞 Voice Call"}
                          {selectedService.communicationMode === "video_call" &&
                            "📹 Video Call"}
                          {selectedService.communicationMode === "voice_note" &&
                            "🎤 Voice Note"}
                        </span>
                      </div>
                    )}

                    {(selectedService.preferredDate ||
                      selectedService.preferredTimeSlot) && (
                      <div className="mt-2 flex flex-wrap gap-3 text-sm">
                        {selectedService.preferredDate && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">
                              Preferred Date:
                            </span>
                            <span className="text-purple-600">
                              {new Date(
                                selectedService.preferredDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {selectedService.preferredTimeSlot && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Time Slot:</span>
                            <span className="text-purple-600">
                              {selectedService.preferredTimeSlot === "morning" && "Morning (9 AM - 12 PM)"}
                              {selectedService.preferredTimeSlot === "afternoon" && "Afternoon (12 PM - 4 PM)"}
                              {selectedService.preferredTimeSlot === "evening" && "Evening (4 PM - 8 PM)"}
                              {!["morning", "afternoon", "evening"].includes(selectedService.preferredTimeSlot) && selectedService.preferredTimeSlot}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-lg">
                      Base Amount
                    </span>
                    <span className="text-2xl font-bold text-purple-700">
                      ₹{selectedService.servicePrice.toLocaleString()}
                    </span>
                  </div>
                  {/* Note: Tax will be added in payment component */}
                  <p className="text-xs text-gray-500 mt-2 text-right">
                    * 18% GST will be added at checkout
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Component */}
          <div>
            <PaymentMethods
              onPaymentSuccess={handlePaymentSuccess}
              amount={selectedService.servicePrice}
              customerDetails={formUserDetails || undefined}
            />
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
