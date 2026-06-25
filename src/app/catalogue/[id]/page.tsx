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
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import CommonPageHeader from "@/components/CommonPages/CommonPageHeader";
import homeAPI, { CatalogueItem, ExpertGuide } from "@/utils/api/home.api";
import { zodiacData } from "@/utils/AstroData";

// Define the zodiac data type
interface ZodiacDataType {
  id: number;
  name: string;
  price: string;
  rating: number;
  date: string;
  image: string;
  description: string;
  traits: string[];
  element: string;
  planet: string;
  symbol: string;
  luckyColor: string;
  luckyNumber: number;
  compatibility: string[];
  benefits: string[];
  readingIncludes: string[];
  strengths: string[];
  challenges: string[];
}

// Map zodiacData to CatalogueItem format
const mapZodiacToCatalogue = (data: ZodiacDataType[]): CatalogueItem[] => {
  return data.map(
    (item): CatalogueItem => ({
      _id: item.id.toString(),
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      rating: item.rating,
      image: item.image,
      traits: item.traits || [],
      date: item.date || "",
      order: item.id,
      isActive: true,
      element: item.element,
      planet: item.planet,
      symbol: item.symbol,
      luckyColor: item.luckyColor,
      luckyNumber: item.luckyNumber,
      compatibility: item.compatibility,
      benefits: item.benefits,
      readingIncludes: item.readingIncludes,
      strengths: item.strengths,
      challenges: item.challenges,
    }),
  );
};

const staticCatalogueItems: CatalogueItem[] = mapZodiacToCatalogue(
  zodiacData as ZodiacDataType[],
);

const ZodiacDetails = () => {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [selectedAstrologer, setSelectedAstrologer] = useState<string | null>(
    null,
  );
  const [catalogueItem, setCatalogueItem] = useState<CatalogueItem | null>(
    null,
  );
  const [expertGuides, setExpertGuides] = useState<ExpertGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [usingStaticData, setUsingStaticData] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("🔍 Looking for item with ID:", id);

      let item: CatalogueItem | null = null;

      // Try to get from API first
      try {
        item = await homeAPI.getCatalogueById(id);
        console.log("📡 API response:", item);
      } catch (apiErr) {
        console.error("❌ API call failed:", apiErr);
      }

      // If API returned valid data, use it
      if (item && item.id) {
        console.log("✅ Using API data for item");
        setCatalogueItem(item);
        setUsingStaticData(false);
      } else {
        // Find from static data (convert both to string for comparison)
        console.log("🔍 Searching in static catalogue...");
        const staticItem = staticCatalogueItems.find(
          (staticItem) =>
            String(staticItem.id) === String(id) || staticItem._id === id,
        );

        console.log("📦 Static item found:", staticItem?.name);

        if (staticItem) {
          setCatalogueItem(staticItem);
          setUsingStaticData(true);
        } else {
          console.error("❌ No item found for ID:", id);
          setError("Item not found");
          setCatalogueItem(null);
        }
      }

      // Fetch expert guides with fallback
      try {
        const guides = await homeAPI.getExpertGuides();
        if (guides && guides.length > 0) {
          setExpertGuides(guides);
        } else {
          setExpertGuides(homeAPI.DEFAULT_EXPERT_GUIDES);
        }
      } catch (guidesErr) {
        console.error("Error fetching expert guides:", guidesErr);
        setExpertGuides(homeAPI.DEFAULT_EXPERT_GUIDES);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppBooking = (guide: ExpertGuide) => {
    const message = `Hello ${guide.name}, I would like to book a ${catalogueItem?.name} reading session.`;
    const whatsappUrl = `https://wa.me/918146668328?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const getDisplayImage = () => {
    if (imageError || !catalogueItem?.image) {
      return "/images/default.jpg";
    }
    return catalogueItem.image;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !catalogueItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Reading Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The reading you&apos;re looking for doesn&apos;t exist.
            <br />
            <span className="text-sm text-gray-400">ID: {id}</span>
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-300 transition"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition"
            >
              Browse Catalogue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <CommonPageHeader title="Book Your Reading" subtitle="Home - Booking" />

      {/* {usingStaticData && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <p className="text-yellow-700 text-sm">
              ⚡ Showing sample reading • Connect to internet for live readings
            </p>
          </div>
        </div>
      )} */}

      {/* Zodiac Hero Section */}
      <section className="container w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="flex flex-col lg:flex-row items-stretch">
            {/* Image Section */}
            <div className="relative w-full lg:w-1/2 h-[380px] sm:h-[450px] lg:h-auto">
              <Image
                src={getDisplayImage()}
                alt={catalogueItem.name}
                fill
                className="object-contain lg:object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 rounded-t-3xl lg:rounded-l-3xl"
                priority
                onError={() => setImageError(true)}
                unoptimized={process.env.NODE_ENV === "production"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent lg:rounded-l-3xl" />
              <div className="absolute bottom-6 left-6 text-white">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl sm:text-5xl font-extrabold mb-1 drop-shadow-lg"
                >
                  {catalogueItem.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl font-medium text-purple-100"
                >
                  {catalogueItem.date || "Available Now"}
                </motion.p>
              </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12 lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
                  About {catalogueItem.name}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                  {catalogueItem.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-2xl border border-purple-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <div className="text-sm font-semibold text-purple-600">
                      Element
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {catalogueItem.element || "Spiritual"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-2xl border border-pink-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-5 h-5 text-pink-600" />
                    <div className="text-sm font-semibold text-pink-600">
                      Ruling Planet
                    </div>
                  </div>
                  <div className="text-xl font-bold text-gray-800">
                    {catalogueItem.planet || "Cosmic Energy"}
                  </div>
                </div>
              </motion.div>

              {catalogueItem.traits && catalogueItem.traits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="font-semibold text-gray-800 mb-4 text-xl">
                    Key Traits
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {catalogueItem.traits.map((trait, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {trait}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      {catalogueItem.benefits && catalogueItem.benefits.length > 0 && (
        <section className="container w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="text-center mb-12 relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl font-bold mb-6"
              >
                Discover Your {catalogueItem.name} Potential
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-purple-100 text-lg sm:text-xl max-w-3xl mx-auto"
              >
                Unlock personalized insights and transform your life with expert
                cosmic guidance
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 relative z-10">
              {catalogueItem.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg sm:text-xl">
                      Benefit {index + 1}
                    </h3>
                  </div>
                  <p className="text-purple-100 leading-relaxed text-sm sm:text-base">
                    {benefit}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Reading Includes Section */}
      {catalogueItem.readingIncludes &&
        catalogueItem.readingIncludes.length > 0 && (
          <section className="container w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-gray-100"
            >
              <div className="text-center mb-12">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
                >
                  Your Complete Reading Package
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto"
                >
                  Comprehensive analysis and personalized guidance tailored
                  specifically for {catalogueItem.name}
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {catalogueItem.readingIncludes.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-start gap-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg transition-all duration-300 border border-gray-100"
                  >
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-3 rounded-xl shadow-lg">
                      <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg sm:text-xl mb-3">
                        {item}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        In-depth analysis with practical, actionable
                        recommendations for your specific situation
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>
        )}

      {/* Astrologers Section */}
      <section className="container w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4"
            >
              Meet Your Expert Guides
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto"
            >
              Connect with our verified and experienced astrologers for
              personalized guidance
            </motion.p>
          </div>

          <div className={`grid gap-6 sm:gap-8 ${
            expertGuides.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
          }`}>
            {expertGuides.map((guide, index) => (
              <motion.div
                key={guide._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-3xl shadow-xl overflow-hidden border-2 transition-all duration-300 flex flex-col h-full ${
                  selectedAstrologer === guide._id
                    ? "border-purple-500 shadow-2xl"
                    : "border-white hover:border-purple-200"
                }`}
              >
                <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 p-6 sm:p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="flex items-center gap-4 sm:gap-6 relative z-10">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30 overflow-hidden">
                      {guide.image ? (
                        <Image
                          src={guide.image}
                          alt={guide.name}
                          width={80}
                          height={80}
                          className="object-cover"
                        />
                      ) : (
                        <Users className="w-8 h-8 sm:w-10 sm:h-10" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-1">
                        {guide.name}
                      </h3>
                      <p className="text-purple-100 text-sm sm:text-base">
                        {guide.expertiseAreas && guide.expertiseAreas.length > 0
                          ? guide.expertiseAreas.slice(0, 2).join(" & ")
                          : (guide.expertise?.split(",")[0] || "Expert Guide")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-bold text-gray-800 text-lg">
                            {guide.rating}
                          </span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          ({guide.reviews} reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <TrendingUp className="w-4 h-4" />
                        <span className="font-semibold text-sm">
                          95%
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed line-clamp-3">
                      {guide.expertise}
                    </p>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600">
                        <Clock className="w-5 h-5 text-purple-500" />
                        <span>
                          <strong>10+ Years</strong> Professional Experience
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600">
                        <Users className="w-5 h-5 text-pink-500" />
                        <span>
                          <strong>5000+</strong> Happy Lives
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600">
                        <Target className="w-5 h-5 text-orange-500" />
                        <span>
                          <strong>1000+</strong> Kundli Analysis Completed
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm sm:text-base text-gray-600">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <span>
                          <strong>Languages:</strong>{" "}
                          {guide.languages?.join(", ") || "English, Hindi"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-6 text-xs text-gray-500">
                      {guide.isVerified && (
                        <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span>Verified Expert</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Trusted Advisor</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleWhatsAppBooking(guide)}
                    className="w-full mt-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-2xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Book on WhatsApp</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA Section */}
      <section className="container w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
            >
              Begin Your Cosmic Journey Today
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto"
            >
              Connect with expert astrologers and unlock the secrets of your
              stars
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              {[
                { icon: Shield, text: "100% Secure & Confidential" },
                { icon: CheckCircle, text: "Verified Astrologers" },
                { icon: Clock, text: "Instant WhatsApp Connection" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-3 justify-center bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/20"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (expertGuides.length > 0) {
                  handleWhatsAppBooking(expertGuides[0]);
                }
              }}
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-2xl hover:shadow-2xl transition-all duration-300 inline-flex items-center gap-3 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              Start Your Reading Now
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default ZodiacDetails;
