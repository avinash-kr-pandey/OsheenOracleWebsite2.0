// app/services/category/[id]/page.tsx (UPDATED - With Better UX for Many Cards)
"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  servicePackageAPI,
  Category,
  Subcategory,
} from "@/utils/api/service.package.api";
import {
  FiClock,
  FiArrowLeft,
  FiStar,
  FiShield,
  FiHeart,
  FiX,
  FiSearch,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaRupeeSign, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

// Loading Skeleton Component
const CategorySkeleton = () => (
  <div
    style={{
      background:
        "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
    }}
    className="min-h-screen bg-gradient-to-b pt-28 pb-20"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[30%] lg:sticky lg:top-28 h-fit animate-pulse">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-center">
              <div className="w-24 h-24 bg-white/20 rounded-3xl mx-auto mb-4"></div>
              <div className="h-8 bg-white/20 rounded w-3/4 mx-auto mb-2"></div>
              <div className="w-16 h-0.5 bg-white/40 mx-auto"></div>
            </div>
            <div className="p-6 space-y-4">
              <div className="h-20 bg-gray-100 rounded-xl"></div>
              <div className="h-16 bg-gray-100 rounded-xl"></div>
              <div className="h-24 bg-gray-100 rounded-xl"></div>
            </div>
          </div>
        </div>
        <div className="lg:w-[70%]">
          <div className="grid sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl p-6 shadow-lg animate-pulse"
              >
                <div className="w-14 h-14 bg-purple-200 rounded-xl mb-4"></div>
                <div className="h-6 bg-purple-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-purple-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// User Details Form Modal
const UserDetailsModal = ({
  service,
  categoryId,
  categoryName,
  onClose,
  onProceedToPayment,
}: {
  service: Subcategory;
  categoryId: string;
  categoryName: string;
  onClose: () => void;
  onProceedToPayment: (userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    communicationMode: string;
    preferredTimeSlot?: string;
  }) => void;
}) => {
  const isVideoCall = service.name.toLowerCase().includes("video") || service.description.toLowerCase().includes("video");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    communicationMode: isVideoCall ? "video_call" : "voice_call",
    preferredTimeSlot: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: cleaned,
      }));
      return;
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.description
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setSubmitting(true);
    onProceedToPayment(formData);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Complete Your Details</h2>
              <p className="text-purple-100 mt-1">{service.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-3xl leading-none"
            >
              <FiX />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-purple-50 rounded-xl">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Package Price</p>
                <p className="text-2xl font-bold text-purple-700">
                  ₹{service.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-semibold text-gray-700">
                  {service.duration}
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
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  onChange={handleChange}
                  maxLength={10}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {isVideoCall ? (
                    <option value="video_call">📹 Video Call Session</option>
                  ) : (
                    <option value="voice_call">📞 Voice Call</option>
                  )}
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
                onChange={handleChange}
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
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Please describe your requirements..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time Slot (Optional)
                </label>
                <select
                  name="preferredTimeSlot"
                  value={formData.preferredTimeSlot}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select time slot</option>
                  <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 06:00 PM">02:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Continue to Payment →"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({
  service,
  categoryId,
  categoryName,
  onBookNow,
}: {
  service: Subcategory;
  categoryId: string;
  categoryName: string;
  onBookNow: (service: Subcategory) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
      className="group bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer border border-purple-100 hover:border-purple-300"
    >
      <div className="relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        <div className="relative w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-white text-2xl shadow-md group-hover:scale-110 transition-transform duration-500">
          {service.icon ? (
            <Image
              src={service.icon}
              alt={service.name}
              width={28}
              height={28}
              className="w-7 h-7"
            />
          ) : (
            <span>🔮</span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors duration-300 line-clamp-1">
        {service.name}
      </h3>

      <div className="mb-4">
        <p className={`text-gray-500 text-sm leading-relaxed whitespace-pre-wrap ${!isExpanded && "line-clamp-3"}`}>
          {service.description}
        </p>
        {service.description.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-purple-600 hover:text-purple-800 font-medium mt-1 focus:outline-none"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1 text-purple-700 font-semibold">
          <FaRupeeSign className="text-sm" />
          <span>{service.price.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <FiClock className="text-sm" />
          <span>{service.duration}</span>
        </div>
      </div>

      <button
        onClick={() => onBookNow(service)}
        style={{
          background:
            "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 100%, #C4F9FF 100%)",
        }}
        className="w-full bg-gradient-to-r font-semibold py-2.5 px-4 rounded-xl hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all duration-300"
      >
        Book Now
      </button>
    </div>
  );
};

const CategoryPage = () => {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const { isAuthenticated } = useAuth();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Subcategory | null>(
    null,
  );
  const [showForm, setShowForm] = useState(false);
  
  // Pagination and Filtering State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "name_asc" | "name_desc">("name_asc");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await servicePackageAPI.getCategoryById(categoryId);

        if (response.success && response.data) {
          setCategory(response.data);
        } else {
          setError("Category not found");
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("Failed to load category details");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const activeSubcategories =
    category?.subcategories?.filter((sub) => sub.isActive !== false) || [];

  // Filter and Sort Services
  const filteredServices = activeSubcategories.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "name_asc":
        return a.name.localeCompare(b.name);
      case "name_desc":
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  // Pagination Logic
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = sortedServices.slice(startIndex, startIndex + itemsPerPage);

  // Reset page when search or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const handleBookNow = (service: Subcategory) => {
    if (!isAuthenticated) {
      const serviceDataForLater = {
        serviceId: service._id,
        serviceName: service.name,
        servicePrice: service.price,
        serviceDuration: service.duration,
        serviceDescription: service.description,
        categoryId: category?._id,
        categoryName: category?.name,
      };
      sessionStorage.setItem("pendingService", JSON.stringify(serviceDataForLater));
      toast.error("Please login to continue with booking", {
        duration: 3000,
        position: "top-center",
        icon: "🔐",
      });
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }

    setSelectedService(service);
    setShowForm(true);
  };

  const handleProceedToPayment = (userData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    communicationMode: string;
    preferredTimeSlot?: string;
  }) => {
    if (!selectedService || !category) return;

    const serviceData = {
      serviceId: selectedService._id,
      serviceName: selectedService.name,
      servicePrice: selectedService.price,
      serviceDuration: selectedService.duration,
      serviceDescription: selectedService.description,
      categoryId: category._id,
      categoryName: category.name,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      description: userData.description,
      communicationMode: userData.communicationMode,
      preferredTimeSlot: userData.preferredTimeSlot,
    };

    sessionStorage.setItem("selectedService", JSON.stringify(serviceData));
    setShowForm(false);
    router.push("/header/payment-methods");
  };

  useEffect(() => {
    const pendingService = sessionStorage.getItem("pendingService");
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");

    if (
      isAuthenticated &&
      pendingService &&
      redirectPath === window.location.pathname
    ) {
      const parsedService = JSON.parse(pendingService);
      sessionStorage.removeItem("pendingService");
      sessionStorage.removeItem("redirectAfterLogin");

      toast.success("Login successful! You can now book the service.", {
        duration: 3000,
        position: "top-center",
      });

      const serviceToBook = activeSubcategories.find(
        (s) => s._id === parsedService.serviceId,
      );
      if (serviceToBook) {
        setSelectedService(serviceToBook);
        setShowForm(true);
      }
    }
  }, [isAuthenticated, activeSubcategories]);

  if (loading) {
    return <CategorySkeleton />;
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white/50 rounded-3xl backdrop-blur-sm">
            <div className="text-7xl mb-4">🔮</div>
            <p className="text-red-600 text-xl mb-4">
              {error || "Category not found"}
            </p>
            <button
              onClick={() => router.push("/services/ourpackages")}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all"
            >
              Browse All Services
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div
        style={{
          background:
            "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        }}
        className="min-h-screen bg-gradient-to-b pt-28 pb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => router.push("/services/ourpackages")}
            className="group flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-2 pt-4 transition-all hover:translate-x-[-4px]"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to All Services
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Side - Category Details */}
            <div className="lg:w-[30%] lg:sticky lg:top-28 h-fit">
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-purple-100">
                <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-center">
                  <div className="inline-flex w-20 h-20 bg-white/20 rounded-2xl items-center justify-center text-4xl backdrop-blur-sm mb-3">
                    {category.icon?.startsWith("http") ? (
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="w-10 h-10"
                      />
                    ) : (
                      <span>{category.icon || "🔮"}</span>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-1">
                    {category.name}
                  </h1>
                  <div className="w-12 h-0.5 bg-white/40 mx-auto"></div>
                </div>

                <div className="p-5">
                  <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
                    {category.description}
                  </p>

                  <div className="mt-5 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-600">
                        Available Services
                      </span>
                      <span className="text-2xl font-bold text-purple-600">
                        {filteredServices.length}
                      </span>
                    </div>
                    <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((filteredServices.length / activeSubcategories.length) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                      <FiStar className="text-purple-500" />
                      Why Choose Us?
                    </h3>
                    <div className="space-y-2">
                      {[
                        { icon: FiShield, text: "100% Ethical Practices" },
                        { icon: FiHeart, text: "Personalized Approach" },
                        { icon: FiStar, text: "Confidential & Safe" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <item.icon className="text-purple-400 text-xs" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 text-center">
                      Need help? Contact our support team
                    </p>
                    <p className="text-sm text-purple-600 text-center font-medium mt-1">
                      <a href="mailto:oracleosheen1@gmail.com" className="hover:underline">
                        oracleosheen1@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Services Grid with Search and Pagination */}
            <div className="lg:w-[70%]">
              {/* Search and Filter Bar */}
              <div className="mb-6 space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search services by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                    />
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2"
                  >
                    <FiFilter />
                    <span className="hidden sm:inline">Sort</span>
                  </button>
                </div>

                {/* Sort Options */}
                {showFilters && (
                  <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setSortBy("name_asc")}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          sortBy === "name_asc"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Name A-Z
                      </button>
                      <button
                        onClick={() => setSortBy("name_desc")}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          sortBy === "name_desc"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Name Z-A
                      </button>
                      <button
                        onClick={() => setSortBy("price_asc")}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                          sortBy === "price_asc"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Price: Low to High <FaSortAmountDown />
                      </button>
                      <button
                        onClick={() => setSortBy("price_desc")}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all flex items-center gap-1 ${
                          sortBy === "price_desc"
                            ? "bg-purple-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Price: High to Low <FaSortAmountUp />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {filteredServices.length > 0 ? (
                <>
                  {/* Results Count */}
                  <div className="mb-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">
                      Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredServices.length)} of {filteredServices.length} services
                    </p>
                  </div>

                  {/* Services Grid */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    {paginatedServices.map((subcategory) => (
                      <ServiceCard
                        key={subcategory._id}
                        service={subcategory}
                        categoryId={category._id}
                        categoryName={category.name}
                        onBookNow={handleBookNow}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex justify-center items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
                      >
                        <FiChevronLeft />
                      </button>
                      
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          // Show only current page, first, last, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg transition-all ${
                                  currentPage === page
                                    ? "bg-purple-600 text-white"
                                    : "bg-white border border-gray-200 hover:bg-purple-50"
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 py-2">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 transition-colors"
                      >
                        <FiChevronRight />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16 bg-white/50 rounded-3xl backdrop-blur-sm">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-600 text-lg">
                    No services match your search
                  </p>
                  <p className="text-gray-500 mt-2">Try adjusting your search term</p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Details Form Modal */}
      {showForm && selectedService && category && (
        <UserDetailsModal
          service={selectedService}
          categoryId={category._id}
          categoryName={category.name}
          onClose={() => setShowForm(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}
    </>
  );
};

export default CategoryPage;