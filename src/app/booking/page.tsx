"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Users,
  CheckCircle,
  Sparkles,
  Shield,
  Heart,
  TrendingUp,
  MessageCircle,
  Zap,
  Target,
  Globe,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Award,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Sparkle,
  UserCheck,
  ThumbsUp,
  Crown,
  IndianRupee,
  Timer,
  Gift,
  ShieldCheck,
  CalendarDays,
  Bookmark,
  Flame,
  Eye,
  Brain,
  HandHeart
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { toast, Toaster } from "react-hot-toast";
import { servicePackageAPI } from "@/utils/api/service.package.api";
import { FiX } from "react-icons/fi";

import { servicesData, astrologers, serviceCategories, expertiseCategories } from "@/utils/AstroData";
import CommonPageHeader from "@/components/CommonPages/CommonPageHeader";

const getDbMapping = (serviceName: string, dbCategories: any[]) => {
  const name = serviceName.toLowerCase();

  // Try to find exact or partial match first
  for (const cat of dbCategories) {
    for (const sub of cat.subcategories) {
      if (sub.name.toLowerCase().includes(name) || name.includes(sub.name.toLowerCase())) {
        return { categoryId: cat._id, subcategoryId: sub._id, name: sub.name, price: sub.price, duration: sub.duration, description: sub.description };
      }
    }
  }

  // Fallback defaults mapping:
  if (name.includes("angel")) {
    const tarotCat = dbCategories.find((c: any) => c.name.toLowerCase().includes("tarot"));
    const angelSub = tarotCat?.subcategories.find((s: any) => s.name.toLowerCase().includes("angel"));
    if (angelSub) return { categoryId: tarotCat._id, subcategoryId: angelSub._id, name: angelSub.name, price: angelSub.price, duration: angelSub.duration, description: angelSub.description };
  }

  if (name.includes("tarot")) {
    const tarotCat = dbCategories.find((c: any) => c.name.toLowerCase().includes("tarot"));
    const audioSub = tarotCat?.subcategories.find((s: any) => s.name.toLowerCase().includes("audio call"));
    if (audioSub) return { categoryId: tarotCat._id, subcategoryId: audioSub._id, name: audioSub.name, price: audioSub.price, duration: audioSub.duration, description: audioSub.description };
  }

  if (name.includes("on call") || name.includes("consultation")) {
    const tarotCat = dbCategories.find((c: any) => c.name.toLowerCase().includes("tarot"));
    const audioSub = tarotCat?.subcategories.find((s: any) => s.name.toLowerCase().includes("audio call"));
    if (audioSub) return { categoryId: tarotCat._id, subcategoryId: audioSub._id, name: audioSub.name, price: audioSub.price, duration: audioSub.duration, description: audioSub.description };
  }

  if (name.includes("relationship")) {
    const energyCat = dbCategories.find((c: any) => c.name.toLowerCase().includes("energy"));
    const loveSub = energyCat?.subcategories.find((s: any) => s.name.toLowerCase().includes("love commitment"));
    if (loveSub) return { categoryId: energyCat._id, subcategoryId: loveSub._id, name: loveSub.name, price: loveSub.price, duration: loveSub.duration, description: loveSub.description };
  }

  if (name.includes("career")) {
    const energyCat = dbCategories.find((c: any) => c.name.toLowerCase().includes("energy"));
    const careerSub = energyCat?.subcategories.find((s: any) => s.name.toLowerCase().includes("career growth"));
    if (careerSub) return { categoryId: energyCat._id, subcategoryId: careerSub._id, name: careerSub.name, price: careerSub.price, duration: careerSub.duration, description: careerSub.description };
  }

  if (name.includes("success") || name.includes("jars")) {
    const energyCat = dbCategories.find((c: any) => c.name.toLowerCase().includes("energy"));
    const successSub = energyCat?.subcategories.find((s: any) => s.name.toLowerCase().includes("one wish"));
    if (successSub) return { categoryId: energyCat._id, subcategoryId: successSub._id, name: successSub.name, price: successSub.price, duration: successSub.duration, description: successSub.description };
  }

  if (name.includes("reiki")) {
    const reikiCat = dbCategories.find((c: any) => c.name.toLowerCase().includes("reiki"));
    const reikiSub = reikiCat?.subcategories[0];
    if (reikiSub) return { categoryId: reikiCat._id, subcategoryId: reikiSub._id, name: reikiSub.name, price: reikiSub.price, duration: reikiSub.duration, description: reikiSub.description };
  }

  if (dbCategories.length > 0 && dbCategories[0].subcategories.length > 0) {
    const firstCat = dbCategories[0];
    const firstSub = firstCat.subcategories[0];
    return { categoryId: firstCat._id, subcategoryId: firstSub._id, name: firstSub.name, price: firstSub.price, duration: firstSub.duration, description: firstSub.description };
  }

  return null;
};

const UserDetailsModal = ({
  service,
  onClose,
  onProceedToPayment,
}: {
  service: any;
  onClose: () => void;
  onProceedToPayment: (userData: any) => void;
}) => {
  const isVideoCall = service.name.toLowerCase().includes("video") || service.description.toLowerCase().includes("video");
  const isEnergyHealing =
    service.categoryName?.toLowerCase().includes("energy healing") ||
    service.name?.toLowerCase().includes("energy healing");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    communicationMode: isVideoCall ? "video_call" : "voice_call",
    preferredTimeSlot: "",
  });
  const [consentChecked, setConsentChecked] = useState(false);
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

    if (isEnergyHealing && !consentChecked) {
      toast.error("You must tick the checkbox to proceed with Energy Healing.");
      return;
    }

    setSubmitting(true);
    onProceedToPayment(formData);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto text-left">
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
                <p className="text-sm text-gray-600 font-medium">Package Price</p>
                <p className="text-2xl font-bold text-purple-700">
                  ₹{service.price.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 font-medium">Duration</p>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className={`grid grid-cols-1 ${isEnergyHealing ? "" : "md:grid-cols-2"} gap-4`}>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-800"
                  placeholder="Enter your phone number"
                />
              </div>
              {!isEnergyHealing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Communication Mode *
                  </label>
                  <select
                    name="communicationMode"
                    required
                    value={formData.communicationMode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800"
                  >
                    {isVideoCall ? (
                      <option value="video_call">📹 Video Call Session</option>
                    ) : (
                      <option value="voice_call">📞 Voice Call</option>
                    )}
                  </select>
                </div>
              )}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800"
                placeholder="Please describe your requirements..."
              />
            </div>

            {!isEnergyHealing && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Time Slot (Optional)
                  </label>
                  <select
                    name="preferredTimeSlot"
                    value={formData.preferredTimeSlot}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-gray-800"
                  >
                    <option value="">Select time slot</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM - 06:00 PM">02:00 PM - 06:00 PM</option>
                  </select>
                </div>
              </div>
            )}

            {isEnergyHealing && (
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl border border-purple-100 select-none">
                <input
                  type="checkbox"
                  id="energy-healing-consent"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                />
                <label
                  htmlFor="energy-healing-consent"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer font-medium"
                >
                  I understand and agree that this Energy Healing session will be conducted remotely/spiritually as per the instructions provided, and I consent to the terms of the session. *
                </label>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting || (isEnergyHealing && !consentChecked)}
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

const BookingPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [bookingModalService, setBookingModalService] = useState<any | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await servicePackageAPI.getAllCategories();
        if (response && response.success && response.data) {
          setDbCategories(response.data);
        }
      } catch (err) {
        console.error("Error loading categories:", err);
      } finally {
        setLoadingDb(false);
      }
    };
    loadCategories();
  }, []);

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

      setBookingModalService(parsedService);
      setShowFormModal(true);
    }
  }, [isAuthenticated]);

  const displayedServices = showAllServices ? servicesData : servicesData.slice(0, 6);

  const handleWhatsAppBooking = (astrologer: (typeof astrologers)[0], serviceName?: string) => {
    const message = serviceName
      ? `Hello ${astrologer.name}, I would like to book a ${serviceName} session. Please provide available time slots and pricing details.`
      : `Hello ${astrologer.name}, I would like to book an astrology reading session. Please provide available time slots and pricing details.`;

    const whatsappUrl = `https://wa.me/${astrologer.whatsappNumber
      }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleProceedToPayment = (userData: any) => {
    if (!bookingModalService) return;

    const serviceData = {
      serviceId: bookingModalService._id,
      serviceName: bookingModalService.name,
      servicePrice: bookingModalService.price,
      serviceDuration: bookingModalService.duration,
      serviceDescription: bookingModalService.description,
      categoryId: bookingModalService.categoryId,
      categoryName: bookingModalService.categoryName,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      address: userData.address,
      description: userData.description,
      communicationMode: userData.communicationMode,
      preferredTimeSlot: userData.preferredTimeSlot,
    };

    sessionStorage.setItem("selectedService", JSON.stringify(serviceData));
    setShowFormModal(false);
    router.push("/header/payment-methods");
  };

  const handleServiceBooking = (service: typeof servicesData[0]) => {
    const match = getDbMapping(service.name, dbCategories);
    const serviceDataForLater = {
      _id: match?.subcategoryId || service.id.toString(),
      name: service.name,
      price: match?.price || parseFloat(service.price.replace(/[^\d.]/g, "")),
      duration: match?.duration || service.duration,
      description: match?.description || service.description,
      categoryId: match?.categoryId || "",
      categoryName: service.category,
    };

    if (!isAuthenticated) {
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

    setBookingModalService(serviceDataForLater);
    setShowFormModal(true);
  };

  const getServiceIcon = (serviceName: string) => {
    switch (serviceName.toLowerCase()) {
      case 'angel card reading':
        return <Eye className="w-6 h-6 text-white" />;
      case 'on call consultation':
        return <Phone className="w-6 h-6 text-white" />;
      case 'tarot reading & guidance':
        return <BookOpen className="w-6 h-6 text-white" />;
      case 'relationship healing spells':
      case 'relationship energy healing':
        return <Heart className="w-6 h-6 text-white" />;
      case 'career healing spells':
      case 'career energy healing':
        return <TrendingUp className="w-6 h-6 text-white" />;
      case 'spell jars for success':
      case 'energy healing jars for success':
        return <Flame className="w-6 h-6 text-white" />;
      case 'reiki healing sessions':
        return <HandHeart className="w-6 h-6 text-white" />;
      default:
        return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <CommonPageHeader
        title="Book Your Spiritual Services"
        subtitle="Home - Services - All Experts"
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >



          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {[
              {
                value: "7+",
                label: "Expert Services",
                icon: Sparkles,
                color: "bg-purple-50 text-purple-600"
              },
              {
                value: "10K+",
                label: "Satisfied Clients",
                icon: ThumbsUp,
                color: "bg-green-50 text-green-600"
              },
              {
                value: "96%",
                label: "Success Rate",
                icon: TrendingUp,
                color: "bg-blue-50 text-blue-600"
              },
              {
                value: "24/7",
                label: "Availability",
                icon: Clock,
                color: "bg-orange-50 text-orange-600"
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${stat.color} p-6 rounded-2xl shadow-sm border border-gray-200/50 backdrop-blur-sm`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <stat.icon className="w-8 h-8 opacity-80" />
                </div>
                <div className="text-gray-700 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </section>

      {/* Services Section */}
      <section id="services-section" className=" py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl  text-gray-900 mb-4">
                Our <span className="text-purple-600">Spiritual Services</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Choose from our carefully curated spiritual services for personalized guidance and healing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => setSelectedService(service.id)}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden border-2 transition-all duration-300 flex flex-col h-full group cursor-pointer ${selectedService === service.id
                    ? "border-purple-500 shadow-xl"
                    : "border-white hover:border-purple-100"
                    }`}
                >
                  {/* Service Header */}
                  <div className="relative p-6 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                          {getServiceIcon(service.name)}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                          <div className="flex items-center gap-2">
                            <Timer className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{service.duration}</span>
                          </div>
                        </div>
                      </div>
                      {service.popularity === "bestseller" && (
                        <div className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                          Bestseller
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-900">{service.rating}</span>
                          <span className="text-gray-500 text-sm">({service.sessionsCompleted} sessions)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="font-semibold text-sm">{service.satisfactionRate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="p-6 flex-grow">
                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <Sparkle className="w-4 h-4 text-purple-500" />
                          Key Features
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {service.features.slice(0, 4).map((feature, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          Benefits
                        </h4>
                        <ul className="space-y-2">
                          {service.benefits.slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Price and Booking */}
                    <div className="border-t border-gray-100 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                            {service.originalPrice && (
                              <div className="text-gray-500 text-sm line-through">{service.originalPrice}</div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">Per session</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Includes:</div>
                          <div className="text-sm font-medium text-purple-600">
                            {service.includes.length} key elements
                          </div>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleServiceBooking(service)}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3.5 px-6 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
                      >
                        <CalendarDays className="w-5 h-5" />
                        <span>Book This Service</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {servicesData.length > 6 && !showAllServices && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowAllServices(true)}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300"
                >
                  View All {servicesData.length} Services
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {selectedService && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-12 bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-200 shadow-lg"
              >
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                      {getServiceIcon(servicesData.find(s => s.id === selectedService)!.name)}
                    </div>
                  </div>

                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                      <h3 className="text-3xl font-bold text-gray-900">
                        {servicesData.find(s => s.id === selectedService)!.name}
                      </h3>
                      <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                        {servicesData.find(s => s.id === selectedService)!.duration}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {servicesData.find(s => s.id === selectedService)!.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">What's Included:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {servicesData.find(s => s.id === selectedService)!.includes.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-gray-600">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        {servicesData.find(s => s.id === selectedService)!.price}
                      </div>
                      {servicesData.find(s => s.id === selectedService)!.originalPrice && (
                        <div className="text-gray-500 text-sm line-through">
                          {servicesData.find(s => s.id === selectedService)!.originalPrice}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mt-1">Per session</div>
                    </div>
                    <button
                      onClick={() => {
                        const selectedServiceData = servicesData.find(s => s.id === selectedService);
                        if (selectedServiceData) {
                          handleServiceBooking(selectedServiceData);
                        }
                      }}
                      className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center gap-3 whitespace-nowrap"
                    >
                      <CalendarDays className="w-5 h-5" />
                      <span>Book This Service Now</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-gray-500 text-sm text-center mt-3">Instant WhatsApp booking available</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl  text-gray-900 mb-4">
                How It <span className="text-purple-600">Works</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Get personalized spiritual guidance in 3 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  icon: Search,
                  title: "Choose Your Service",
                  description: "Browse through our spiritual services and select the one that resonates with your current needs and goals."
                },
                {
                  step: "02",
                  icon: Calendar,
                  title: "Book Your Session",
                  description: "Connect instantly via WhatsApp with our experts to schedule a convenient time for your session."
                },
                {
                  step: "03",
                  icon: Sparkles,
                  title: "Receive Guidance",
                  description: "Get personalized insights, healing, and actionable advice tailored to your unique situation."
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-purple-300 transition-all duration-300 h-full">
                    <div className="relative">
                      <div className="text-6xl font-bold text-gray-200 absolute -top-6 -left-2">
                        {step.step}
                      </div>
                      <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
                          <step.icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>

                  {index < 2 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-0.5 bg-gray-300"></div>
                      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 border-t-2 border-r-2 border-gray-300 rotate-45"></div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl p-12 border border-gray-200 shadow-lg text-center">
              <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-8">
                  <Gift className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Limited Time Offer</span>
                </div>

                <h2 className="text-4xl text-gray-900 mb-6">
                  Ready for Your Spiritual Transformation?
                </h2>

                <p className="text-gray-600 text-xl mb-10 leading-relaxed">
                  Take the first step towards clarity, healing, and guidance. Our expert spiritual guides are here to help you navigate life's challenges and opportunities.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Instant WhatsApp Booking</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Connect directly with experts for immediate assistance</p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">100% Confidential & Secure</h4>
                    </div>
                    <p className="text-gray-600 text-sm">Your privacy and spiritual journey are sacred to us</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      const bestSellerService = servicesData.find(s => s.popularity === "bestseller") || servicesData[0];
                      handleServiceBooking(bestSellerService);
                    }}
                    className="group relative bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-10 rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Book Top Service Now</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => {
                      router.push("/services/ourpackages");
                    }}
                    className="bg-white text-purple-600 font-semibold py-4 px-10 rounded-xl border-2 border-purple-600 hover:bg-purple-50 transition-all duration-300"
                  >
                    Browse All Services
                  </button>
                </div>

                <p className="text-gray-500 text-sm mt-8 flex items-center justify-center gap-3">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    Secure Connection
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-blue-500" />
                    24/7 Availability
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Verified Experts
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {showFormModal && bookingModalService && (
        <UserDetailsModal
          service={bookingModalService}
          onClose={() => setShowFormModal(false)}
          onProceedToPayment={handleProceedToPayment}
        />
      )}

      {/* Mobile Fixed Bottom Sticky Bar for Selected Service */}
      {selectedService !== null && (
        (() => {
          const service = servicesData.find(s => s.id === selectedService);
          if (!service) return null;
          return (
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md p-4 border-t border-gray-100 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] md:hidden flex items-center justify-between animate-in slide-in-from-bottom duration-300">
              <div className="flex flex-col text-left max-w-[60%]">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Selected Service</p>
                <p className="text-sm font-bold text-gray-800 truncate">{service.name}</p>
                <p className="text-xs font-semibold text-purple-600 mt-0.5">{service.price}</p>
              </div>
              <button
                onClick={() => handleServiceBooking(service)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-2.5 px-4 rounded-xl hover:shadow-lg transition-all flex items-center gap-1.5 text-xs cursor-pointer whitespace-nowrap"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Book Now</span>
              </button>
            </div>
          );
        })()
      )}

      <Toaster />
    </div>
  );
};

export default BookingPage;