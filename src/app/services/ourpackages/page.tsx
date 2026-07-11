// app/services/ourpackages/page.tsx (IMPROVED DESIGN)
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { servicePackageAPI, Category } from "@/utils/api/service.package.api";
import { FiArrowLeft, FiStar, FiShield, FiHeart } from "react-icons/fi";

const OurPackages = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await servicePackageAPI.getAllCategories({
        isActive: true,
      });
      if (response.success && response.data) {
        // Order mapping for categories:
        // 1. Energy healing 2. Tarot reading 3. Reiki Healing 4. Therapy 5. Affirmation
        const getOrder = (name: string): number => {
          const lower = name.toLowerCase().trim();
          if (lower.includes("energy")) return 1;
          if (lower.includes("tarot")) return 2;
          if (lower.includes("reiki")) return 3;
          if (lower.includes("therapy")) return 4;
          if (lower.includes("affirmation")) return 5;
          return 999;
        };
        const sorted = [...response.data].sort((a, b) => {
          const aOrder = getOrder(a.name);
          const bOrder = getOrder(b.name);
          if (aOrder !== bOrder) return aOrder - bOrder;
          return (a.order || 0) - (b.order || 0);
        });
        setCategories(sorted);
      } else {
        setError("Failed to load categories");
      }
    } catch (err) {
      setError("Failed to load packages");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    router.push(
      `/services/category/${categoryId}?name=${encodeURIComponent(categoryName)}`,
    );
  };

  if (error) {
    return (
      <div
        className="min-h-screen pt-28 pb-20"
        style={{
          background:
            "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white/80 rounded-3xl backdrop-blur-sm shadow-xl">
            <div className="text-7xl mb-4">🔮</div>
            <p className="text-red-600 text-xl mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-28 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="pt-10 group flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-6 transition-all hover:translate-x-[-4px]"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-2 mb-4">
            <span className="text-purple-600 font-semibold">
              ✨ Spiritual Services
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-heading bg-gradient-to-r from-purple-900 to-pink-700 bg-clip-text text-transparent mb-4">
            Our Services
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-purple-800 max-w-2xl mx-auto">
            Discover our spiritual services designed to bring peace, prosperity,
            and positivity to your life
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-600"></div>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white/60 rounded-3xl backdrop-blur-sm">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 text-lg">
              No services available at the moment.
            </p>
            <p className="text-gray-500 mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <div
                key={category._id}
                onClick={() => handleCategoryClick(category._id, category.name)}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer border border-purple-100 hover:border-purple-300 animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon Section */}
                <div className="relative h-52 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-500"></div>
                  <div className="relative z-10">
                    {category.icon ? (
                      <Image
                        src={category.icon}
                        alt={category.name}
                        width={90}
                        height={90}
                        className="object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg"
                      />
                    ) : (
                      <div className="text-8xl group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
                        🔮
                      </div>
                    )}
                  </div>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold font-subheading text-purple-900 group-hover:text-purple-600 transition-colors">
                      {category.name}
                    </h3>
                    <div className="bg-purple-100 rounded-full px-3 py-1">
                      <span className="text-xs font-semibold text-purple-600">
                        {category.subcategories?.filter(
                          (s) => s.isActive !== false,
                        ).length || 0}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>

                  {/* Features */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
                      ✨ Authentic
                    </span>
                    <span className="text-xs bg-pink-50 text-pink-600 px-2 py-1 rounded-full">
                      🕉️ Traditional
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      ⭐ Trusted
                    </span>
                  </div>

                  {/* Explore Button */}
                  <button className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all group-hover:scale-[1.02] flex items-center justify-center gap-2">
                    <span>Explore Services</span>
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trust Badges Section */}
        <div className="mt-20 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold font-subheading text-purple-900 mb-6">
              Why Choose Us?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiShield className="w-6 h-6 text-purple-600" />
                </div>
                <span className="font-semibold text-gray-800">
                  100% Ethical
                </span>
                <p className="text-sm text-gray-500">
                  Authentic spiritual practices
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <FiHeart className="w-6 h-6 text-pink-600" />
                </div>
                <span className="font-semibold text-gray-800">
                  Personalized
                </span>
                <p className="text-sm text-gray-500">Tailored just for you</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FiStar className="w-6 h-6 text-yellow-600" />
                </div>
                <span className="font-semibold text-gray-800">
                  5 Star Rated
                </span>
                <p className="text-sm text-gray-500">Trusted by thousands</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default OurPackages;
