// app/reading/page.tsx
"use client";

import { categoryThemeMap, readingAPI, ReadingService } from "@/utils/api/reading.api";
import Image from "next/image";
import React, { useState, useEffect } from "react";


type ThemeType = "purple" | "pink" | "blue" | "gold" | "green";

interface ThemeClasses {
  bg: string;
  border: string;
  text: string;
  accent: string;
}

// Loading Skeleton Component
const ServiceSkeleton = () => (
  <div className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 animate-pulse">
    <div className="lg:flex items-stretch">
      <div className="lg:w-2/4 p-2 flex items-center justify-center">
        <div className="w-full h-64 lg:h-110 bg-gray-300 rounded-2xl"></div>
      </div>
      <div className="lg:w-3/5 p-8 lg:p-12">
        <div className="w-16 h-1 bg-gray-300 mb-6 rounded-full"></div>
        <div className="h-10 bg-gray-300 rounded w-3/4 mb-8"></div>
        <div className="space-y-3 mb-8">
          <div className="h-4 bg-gray-300 rounded w-full"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-4/6"></div>
        </div>
        <div className="bg-white/50 rounded-2xl p-6 border border-gray-200">
          <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ReadingPage = () => {
  const [services, setServices] = useState<ReadingService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const activeServices = await readingAPI.getActiveServices();

        // Sort services by category or any preferred order
        const sortedServices = activeServices.sort((a, b) => {
          const order = [
            "Tarot Reading",
            "Love Reading",
            "Career Reading",
            "Life Reading",
          ];
          return order.indexOf(a.category) - order.indexOf(b.category);
        });

        setServices(sortedServices);
      } catch (err) {
        setError("Failed to load reading services");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const getThemeClasses = (category: string): ThemeClasses => {
    const theme = categoryThemeMap[category] || "purple";

    const themes: Record<ThemeType, ThemeClasses> = {
      purple: {
        bg: "bg-gradient-to-br from-purple-100 to-purple-50",
        border: "border-purple-200",
        text: "text-purple-900",
        accent: "bg-purple-500",
      },
      pink: {
        bg: "bg-gradient-to-br from-pink-100 to-pink-50",
        border: "border-pink-200",
        text: "text-pink-900",
        accent: "bg-pink-500",
      },
      blue: {
        bg: "bg-gradient-to-br from-blue-100 to-blue-50",
        border: "border-blue-200",
        text: "text-blue-900",
        accent: "bg-blue-500",
      },
      gold: {
        bg: "bg-gradient-to-br from-yellow-100 to-amber-50",
        border: "border-yellow-200",
        text: "text-yellow-900",
        accent: "bg-yellow-500",
      },
      green: {
        bg: "bg-gradient-to-br from-green-100 to-emerald-50",
        border: "border-green-200",
        text: "text-green-900",
        accent: "bg-green-500",
      },
    };

    return themes[theme as ThemeType] || themes.purple;
  };

  // Format pricing text from service data
  const formatPricing = (service: ReadingService): string => {
    const lines = [];

    // Base pricing
    lines.push(`Audio Energy Exchange: Rs. ${service.price}/-`);

    // Add variations based on category
    if (service.category.includes("Love") && service.price < 10000) {
      lines.push(`Video call Energy Exchange: Rs. ${service.price * 3}/-`);
    } else if (service.category.includes("Tarot")) {
      lines.push(`Video call Energy Exchange: Rs. ${service.price * 2}/-`);
    } else if (service.category.includes("Career")) {
      lines.push(`Video call Energy Exchange: Rs. ${service.price * 2}/-`);
    }

    return lines.join("\n");
  };

  // Split content into paragraphs
  const formatContent = (content: string): string[] => {
    // Agar content mein already paragraphs hain to use karo
    if (content.includes("\n\n")) {
      return content.split("\n\n");
    }

    // Warna sentences ko group karo
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
    const paragraphs = [];

    for (let i = 0; i < sentences.length; i += 3) {
      paragraphs.push(sentences.slice(i, i + 3).join(" "));
    }

    return paragraphs;
  };

  if (error) {
    return (
      <div
        className="min-h-screen pt-32 pb-20"
        style={{
          background:
            "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        }}
      >
        <div className="text-center">
          <p className="text-red-600 text-xl">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-32 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      {/* Hero Section */}
      <div className="text-center mb-16 px-4">
        <h1 className="text-6xl md:text-6xl font-bold text-purple-900 mb-6">
          Reading
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-8"></div>
      </div>

      {/* Reading Services */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {loading ? (
          // Show skeletons while loading
          <>
            <ServiceSkeleton />
            <ServiceSkeleton />
            <ServiceSkeleton />
          </>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white/50 rounded-3xl">
            <p className="text-gray-600 text-xl">
              No reading services available at the moment.
            </p>
          </div>
        ) : (
          services.map((service, index) => {
            const theme = getThemeClasses(service.category);
            const isEven = index % 2 === 0;
            const paragraphs = formatContent(service.description);
            const pricingText = formatPricing(service);

            return (
              <div
                key={service._id}
                className={`${theme.bg} rounded-3xl shadow-2xl overflow-hidden border-2 ${theme.border} hover:shadow-3xl transition-all duration-500`}
              >
                <div
                  className={`lg:flex items-stretch ${
                    isEven ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Image Section */}
                  <div className="lg:w-2/4 p-2 flex items-center justify-center">
                    <div className="relative w-full h-64 lg:h-110">
                      <div className="rounded-2xl overflow-hidden">
                        <Image
                          alt={service.name}
                          src={service.image || "/images/aboutglobe.png"}
                          width={600}
                          height={600}
                          className="w-full h-64 lg:h-120 object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="lg:w-3/5 p-8 lg:p-12">
                    <div
                      className={`w-16 h-1 ${theme.accent} mb-6 rounded-full`}
                    ></div>
                    <h2
                      className={`text-3xl md:text-4xl font-bold ${theme.text} mb-8`}
                    >
                      {service.name}
                    </h2>

                    {/* Content Paragraphs */}
                    <div className="space-y-6 mb-8">
                      {paragraphs.map((paragraph, idx) => (
                        <p
                          key={idx}
                          className="text-gray-700 text-lg leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {/* Pricing Section */}
                    <div className="bg-white/80 rounded-2xl p-6 border border-gray-200">
                      <h4 className={`text-xl font-bold ${theme.text} mb-4`}>
                        Energy Exchange
                      </h4>
                      <div className="space-y-3">
                        {pricingText.split("\n").map((price, idx) => (
                          <p
                            key={idx}
                            className="text-lg font-semibold text-gray-800"
                          >
                            {price}
                          </p>
                        ))}
                        <p className="text-sm text-gray-600 mt-2">
                          Duration: {service.duration}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default ReadingPage;
