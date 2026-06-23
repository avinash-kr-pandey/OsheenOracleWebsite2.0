"use client";
import React, { useState } from "react";
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

import { servicesData, astrologers, serviceCategories, expertiseCategories } from "@/utils/AstroData";
import CommonPageHeader from "@/components/CommonPages/CommonPageHeader";

const BookingPage = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [showAllServices, setShowAllServices] = useState(false);

  const displayedServices = showAllServices ? servicesData : servicesData.slice(0, 6);

  const handleWhatsAppBooking = (astrologer: (typeof astrologers)[0], serviceName?: string) => {
    const message = serviceName
      ? `Hello ${astrologer.name}, I would like to book a ${serviceName} session. Please provide available time slots and pricing details.`
      : `Hello ${astrologer.name}, I would like to book an astrology reading session. Please provide available time slots and pricing details.`;

    const whatsappUrl = `https://wa.me/${astrologer.whatsappNumber
      }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleServiceBooking = (service: typeof servicesData[0]) => {
    const bestAstrologer = astrologers.find(a => a.expertise.some(exp =>
      service.features.some(feature =>
        exp.toLowerCase().includes(feature.toLowerCase())
      )
    )) || astrologers[0];

    const message = `Hello ${bestAstrologer.name}, I would like to book a ${service.name} session for ₹${service.price}. Please provide available time slots and more details about the service.`;

    const whatsappUrl = `https://wa.me/${bestAstrologer.whatsappNumber
      }?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
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
        return <Heart className="w-6 h-6 text-white" />;
      case 'career healing spells':
        return <TrendingUp className="w-6 h-6 text-white" />;
      case 'spell jars for success':
        return <Flame className="w-6 h-6 text-white" />;
      case 'reiki healing sessions':
        return <HandHeart className="w-6 h-6 text-white" />;
      default:
        return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="min-h-screen">
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
    </div>
  );
};

export default BookingPage;