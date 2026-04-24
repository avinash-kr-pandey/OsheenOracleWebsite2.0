
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Service, servicePackageAPI, SubmitServiceRequestData } from "@/utils/api/service.package.api";


const OurPackages = () => {
  const router = useRouter();
  const [packages, setPackages] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<SubmitServiceRequestData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceId: "",
    communicationMode: "voice_call",
    description: "",
    preferredDate: "",
    preferredTimeSlot: "",
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await servicePackageAPI.getAllServices();
      setPackages(response.data || []);
    } catch (err) {
      setError("Failed to load packages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (pkg: Service) => {
    setSelectedPackage(pkg);
    setFormData({
      ...formData,
      serviceId: pkg._id,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      serviceId: "",
      communicationMode: "voice_call",
      description: "",
      preferredDate: "",
      preferredTimeSlot: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!selectedPackage) {
      alert("Please select a package");
      setSubmitting(false);
      return;
    }

    try {
      // Store complete data including package details
      const serviceRequestData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        serviceId: selectedPackage._id,
        communicationMode: formData.communicationMode,
        description: formData.description,
        preferredDate: formData.preferredDate,
        preferredTimeSlot: formData.preferredTimeSlot,
        packageName: selectedPackage.name,
        packagePrice: selectedPackage.price,
        packageDuration: selectedPackage.duration,
      };

      sessionStorage.setItem(
        "pendingServiceRequest",
        JSON.stringify(serviceRequestData),
      );

      // Redirect to payment methods page
      router.push("/header/payment-methods");
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div
        className="min-h-screen pt-24 pb-20"
        style={{
          background:
            "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white/50 rounded-3xl">
            <p className="text-red-600 text-xl">{error}</p>
          </div>
        </div>
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
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-purple-900 mb-6">
            Our Packages
          </h1>
          <p className="text-xl text-purple-700 max-w-2xl mx-auto">
            Discover our spiritual packages designed to bring peace, prosperity,
            and positivity to your life
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mt-8"></div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-20 bg-white/30 rounded-3xl">
            <p className="text-purple-800 text-xl">
              No packages available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-56 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                  {pkg.icon ? (
                    <Image
                      src={pkg.icon}
                      alt={pkg.name}
                      width={100}
                      height={100}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-6xl">✨</div>
                  )}
                  {!pkg.isActive && (
                    <div className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-sm">
                      Coming Soon
                    </div>
                  )}
                </div>

                <div className="p-6 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-purple-900">
                      {pkg.name}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {pkg.category}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {pkg.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-purple-700">
                      ₹{pkg.price}
                    </span>
                    <span className="text-gray-500">/ {pkg.duration}</span>
                  </div>

                  <button
                    onClick={() => handleBookNow(pkg)}
                    disabled={!pkg.isActive}
                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                      pkg.isActive
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {pkg.isActive ? "Book Now →" : "Coming Soon"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {isModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Complete Your Booking</h2>
                  <p className="text-purple-100 mt-1">{selectedPackage.name}</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:text-gray-200 text-3xl leading-none"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-purple-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Package Price</p>
                    <p className="text-2xl font-bold text-purple-700">
                      ₹{selectedPackage.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {selectedPackage.duration}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Communication Mode *
                    </label>
                    <select
                      name="communicationMode"
                      required
                      value={formData.communicationMode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="voice_call">📞 Voice Call</option>
                      <option value="video_call">📹 Video Call</option>
                      <option value="voice_note">🎤 Voice Note</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    required
                    rows={2}
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description / Requirements *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Please describe your requirements..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      name="preferredTimeSlot"
                      value={formData.preferredTimeSlot}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select time slot</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">
                        Afternoon (12 PM - 4 PM)
                      </option>
                      <option value="evening">Evening (4 PM - 8 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {submitting ? "Processing..." : `Proceed to Payment →`}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;

export default OurPackages;
