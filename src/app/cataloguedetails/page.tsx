"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Sparkles,
  Zap,
  Globe,
  Compass,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import CommonPageHeader from "@/components/CommonPages/CommonPageHeader";
import homeAPI, { CatalogueItem } from "@/utils/api/home.api";
import { zodiacData } from "@/utils/AstroData";

import { getFullImageUrl } from "@/utils/api/api";

// Map zodiacData to CatalogueItem format
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
      order: 0,
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

const defaultCatalogueItems: CatalogueItem[] = mapZodiacToCatalogue(
  zodiacData as ZodiacDataType[],
);

const CatalogueDetails = () => {
  const router = useRouter();
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [usingStaticData, setUsingStaticData] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching celestial catalogue...");

      // Fetch from API
      let data: CatalogueItem[] = [];
      try {
        data = await homeAPI.getCatalogue();
      } catch (apiErr) {
        console.error("API call failed, will use static data:", apiErr);
      }

      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ Loaded packages from API:", data.length);
        setCatalogueItems(data);
        setUsingStaticData(false);
      } else {
        console.log("⚠️ API returned empty/no data, falling back to static zodiac data");
        setCatalogueItems(defaultCatalogueItems);
        setUsingStaticData(true);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching catalogue data:", err);
      setError("Failed to load celestial catalogue");
      setCatalogueItems(defaultCatalogueItems);
      setUsingStaticData(true);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4.5);
    const hasHalfStar = (rating || 4.5) % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="w-4 h-4 text-gray-300" />
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 absolute top-0 left-0 clip-half" />
        </div>,
      );
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    return stars;
  };

  const getDisplayImage = (item: CatalogueItem, index: number) => {
    const idKey = item._id || index.toString();
    if (imageErrors[idKey] || !item.image) {
      return "";
    }
    return getFullImageUrl(item.image);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBB5E7]/30 via-white to-[#C4F9FF]/30 pb-20">
      <CommonPageHeader title="Our Celestial Catalogue" subtitle="Home - Catalogue" />

      {usingStaticData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-yellow-700 text-sm font-medium">
              ✨ Showing sample reading packages. Connect to internet for live readings.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-sm font-semibold mb-4"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Discover Your Cosmic Blueprint</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6"
          >
            Astrology Guidance & Readings
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg leading-relaxed"
          >
            Explore our curated catalog of personalized spiritual packages. Let our expert astrologers decrypt the stars to reveal your path of alignment, prosperity, and purpose.
          </motion.p>
        </div>

        {/* Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {catalogueItems.map((item, index) => (
            <motion.div
              key={item._id || index}
              whileHover={{ y: -8 }}
              className="relative p-[1px] rounded-3xl bg-gradient-to-br from-purple-200/50 via-pink-200/30 to-blue-200/50 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 transition-all duration-500 group shadow-lg hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col h-full overflow-hidden"
            >
              <div className="bg-white/90 backdrop-blur-md rounded-[23px] overflow-hidden flex flex-col h-full w-full">
                {/* Image Section */}
                <div className="relative h-60 w-full bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden flex-shrink-0 border-b border-gray-100">
                  {(!item.image || imageErrors[item._id || index.toString()]) ? (
                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-purple-400" />
                    </div>
                  ) : (
                    <Image
                      src={getDisplayImage(item, index)}
                      alt={item.name}
                      fill
                      className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                      onError={() => {
                        const idKey = item._id || index.toString();
                        setImageErrors((prev) => ({ ...prev, [idKey]: true }));
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                  
                  {/* Element Badge */}
                  {item.element && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-purple-100">
                      <Zap className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                      <span 
                        className="text-[10px] font-bold text-gray-800 uppercase tracking-wider"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {item.element}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow">
                  {/* Category / Date */}
                  <div className="text-[10px] font-bold text-purple-600 mb-2 flex items-center justify-between uppercase tracking-wider">
                    <span>ZODIAC READING</span>
                    <span className="text-gray-400 font-semibold">{item.date || "Available"}</span>
                  </div>

                  {/* Name */}
                  <h3 
                    className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors tracking-wide min-h-[56px] flex items-center"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {item.name}
                  </h3>

                  {/* Rating & Price Inset Box */}
                  <div className="flex items-center justify-between mb-4 bg-purple-50/40 p-3 rounded-2xl border border-purple-100/50">
                    <div className="flex items-center gap-1">
                      {renderStars(item.rating || 4.5)}
                      <span className="text-[11px] font-bold text-gray-500 ml-1">
                        ({item.rating || 4.5})
                      </span>
                    </div>
                    <div 
                      className="text-xl font-extrabold text-purple-700"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      ₹{item.price || 699}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-650 text-sm leading-relaxed mb-6 line-clamp-3">
                    {item.description || "Unlock deep cosmic understandings and custom actions suited to clear blockages and fulfill your spiritual destiny."}
                  </p>

                  {/* Planet / Symbol Info */}
                  <div className="grid grid-cols-2 gap-3 mb-6 bg-gray-50/50 p-3 rounded-2xl border border-gray-100 text-xs text-gray-650">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="truncate">Planet: <strong>{item.planet || "Sun"}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-4 h-4 text-pink-500" />
                      <span className="truncate">Symbol: <strong>{item.symbol || "Star"}</strong></span>
                    </div>
                  </div>

                  {/* Key Traits Badges */}
                  {item.traits && item.traits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {item.traits.slice(0, 3).map((trait, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-white border border-purple-100 text-purple-700 text-[10px] font-bold rounded-lg uppercase tracking-wider shadow-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push(`/catalogue/${item._id || item.id}`)}
                    className="w-full mt-auto bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 text-white font-bold py-3.5 px-6 rounded-2xl hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer text-sm tracking-wider"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    <span>Get Your Reading</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {catalogueItems.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/50 backdrop-blur border border-gray-100 rounded-3xl shadow-xl mt-12">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No celestial packages found</h3>
            <p className="text-gray-500 mb-6">Please check back later or refresh the page.</p>
            <button
              onClick={fetchData}
              className="px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition"
            >
              Refresh Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogueDetails;
