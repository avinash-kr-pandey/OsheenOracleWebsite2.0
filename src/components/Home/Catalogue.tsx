"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import homeAPI, { CatalogueItem } from "@/utils/api/home.api";
import { zodiacData } from "@/utils/AstroData";

import { getFullImageUrl } from "@/utils/api/api";

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

// Static catalogue data from zodiacData
const staticCatalogueItems: CatalogueItem[] = mapZodiacToCatalogue(
  zodiacData as ZodiacDataType[],
);

// Define type for slider row
const SliderRow = ({ rowData }: { rowData: CatalogueItem[] }) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleNext = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.querySelector(".card")?.clientWidth || 300;
      const gap = 24; // approx 1.5rem
      containerRef.current.scrollBy({ left: cardWidth + gap, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (containerRef.current) {
      const cardWidth = containerRef.current.querySelector(".card")?.clientWidth || 300;
      const gap = 24;
      containerRef.current.scrollBy({ left: -(cardWidth + gap), behavior: "smooth" });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

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

  const getImageSrc = (item: CatalogueItem, index: number) => {
    return item.image && item.image !== ""
      ? getFullImageUrl(item.image)
      : "";
  };

  if (!rowData || rowData.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No items to display</p>
      </div>
    );
  }

  return (
    <div className="relative select-none w-full">
      <div className="absolute -top-14 right-3 sm:-top-16 z-30 w-full">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full shadow bg-[#62aec5] hover:bg-[#5A4370] transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full shadow bg-[#62aec5] hover:bg-[#5A4370] transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 text-white" />
            </button>
          </div>

          <button
            onClick={() => router.push("/cataloguedetails")}
            className="px-6 py-2 border border-[#62aec5] text-[#3D2E4F] rounded-full 
                       font-medium text-base hover:bg-[#62aec5] hover:text-white 
                       transition-all duration-300 cursor-pointer"
          >
            View All
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex gap-4 sm:gap-6 py-4 overflow-x-auto snap-x snap-mandatory mt-8 sm:mt-10 scrollbar-hide w-full"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {rowData.map((item, i) => (
          <div
            key={item._id || i}
            className="card flex-shrink-0 snap-start rounded-2xl transition-all bg-white overflow-hidden
                         shadow-md hover:shadow-xl duration-300
                         w-[260px] sm:w-[280px] lg:w-[300px] h-[520px] flex flex-col"
          >
            <div className="relative w-full h-[200px] overflow-hidden flex-shrink-0 bg-gray-100">
              {(!item.image || imageErrors[item._id || i.toString()]) ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-purple-400" />
                </div>
              ) : (
                <Image
                  src={getImageSrc(item, i)}
                  alt={item.name || "Product image"}
                  fill
                  className="object-cover transform transition-transform duration-500 hover:scale-105"
                  onError={() => {
                    setImageErrors((prev) => ({
                      ...prev,
                      [item._id || i.toString()]: true,
                    }));
                  }}
                />
              )}
            </div>

            <div className="flex flex-col flex-grow p-4">
              <h3
                className="text-lg sm:text-xl font-semibold text-[#3D2E4F] mb-1 line-clamp-1"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                {item.name}
              </h3>

              <div className="flex items-center gap-1 mb-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(item.rating || 4.5)}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({item.rating || 4.5})
                </span>
              </div>

              <div className="mb-2">
                <span className="text-xl font-bold text-[#62aec5]">
                  ₹{item.price || 699}
                </span>
              </div>

              <div className="flex-grow">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.description || "No description available"}
                </p>
              </div>

              {item.traits && item.traits.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.traits.slice(0, 3).map((trait, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto pt-3">
                <button
                  onClick={() => router.push(`/catalogue/${item.id}`)}
                  className="w-full bg-[#62aec5] text-white text-sm font-medium py-2 px-6 
                               rounded-full hover:bg-[#5A4370] transition-all cursor-pointer"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Catalogue = () => {
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingStaticData, setUsingStaticData] = useState(false);

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const fetchCatalogue = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching catalogue from API...");

      const data = await homeAPI.getCatalogue();
      console.log("📦 API Response:", data);

      // Check if API returned valid data with items
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("✅ Using API data -", data.length, "items found");
        setCatalogueItems(data);
        setError(null);
        setUsingStaticData(false);
      } else {
        // API returned empty array or null - use static data
        console.log(
          "⚠️ API returned no data, using static catalogue from zodiacData",
        );
        setCatalogueItems(staticCatalogueItems);
        setError(null);
        setUsingStaticData(true);
      }
    } catch (err) {
      console.error("❌ Error fetching catalogue:", err);
      // API call failed - use static data
      console.log("📦 Using static catalogue as fallback");
      setCatalogueItems(staticCatalogueItems);
      setError(null);
      setUsingStaticData(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="py-10 sm:py-16 px-3 sm:px-6 lg:px-10"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl pb-4 text-[#3D2E4F]">
            Catalogue
          </h2>
          <p className="text-[#3D2E4F] text-base sm:text-lg leading-relaxed">
            Astrology merely guides us toward reality.
          </p>
          <p className="text-[#3D2E4F] text-base sm:text-lg leading-relaxed">
            Explore a range of personalized solutions crafted to inspire, guide,
            and help you achieve your goals.
          </p>
        </div>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#62aec5]"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-10 sm:py-16 px-3 sm:px-6 lg:px-10"
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl pb-4 text-[#3D2E4F]">
          Catalogue
        </h2>
        <p className="text-[#3D2E4F] text-base sm:text-lg leading-relaxed">
          Astrology merely guides us toward reality.
        </p>
        <p className="text-[#3D2E4F] text-base sm:text-lg leading-relaxed">
          Explore a range of personalized solutions crafted to inspire, guide,
          and help you achieve your goals.
        </p>

        {/* {usingStaticData && (
          <div className="mt-4 inline-block bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
            <p className="text-yellow-700 text-sm">
              ⚡ Showing sample catalogue • Connect to internet for live
              readings
            </p>
          </div>
        )} */}
      </div>

      {catalogueItems.length > 0 && <SliderRow rowData={catalogueItems} />}

      {error && catalogueItems.length === 0 && (
        <div className="mt-8 text-center">
          <p className="text-red-500 text-sm mb-2">{error}</p>
          <button
            onClick={fetchCatalogue}
            className="px-3 py-1 text-sm bg-[#62aec5] text-white rounded-lg hover:bg-[#5A4370] transition"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default Catalogue;
