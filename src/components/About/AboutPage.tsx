"use client";

import { aboutAPI, AboutDataType } from "@/utils/api/about.api";
import Image from "next/image";
import React, { useEffect } from "react";

export default function AboutPage() {
  const [aboutData, setAboutData] = React.useState<AboutDataType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);


        // ✅ Token automatically attach hoga agar user logged in hai
        // ❌ Agar logged out hai to bina token ke request jayegi
        const data = await aboutAPI.getAbout();

        console.log("📦 About data received ddffadfa:", data);
        setAboutData(data);
      } catch (error) {
        console.error("❌ Error fetching about data:", error);
        // Error silent handle - UI show hoga with API data agar available hai
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  return (
    <div
      className="min-h-screen "
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div
          className=""
          style={{
            background:
              "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
          }}
        >
          {/* Hero Section */}
          <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-16 md:py-24">
            <div className="absolute inset-0 bg-[url('/images/aboutround.png')] bg-no-repeat bg-right-top bg-contain opacity-30 pointer-events-none"></div>

            <div className="relative z-10 container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 px-4">
              {/* Left Image Section */}
              <div className="relative w-full md:w-1/2 flex justify-center md:py-24 py-12">
                <div className="relative overflow-hidden max-w-auto">
                  <Image
                    src="/images/aboutwithglobe.png"
                    alt="About Osheen Oracle"
                    width={500}
                    height={500}
                    className="object-cover w-full h-auto"
                  />
                </div>
              </div>

              {/* Right Text Section */}
              <div className="w-full md:w-1/2 space-y-6 animate-fade-in-up">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center md:text-left">
                  {aboutData?.heroTitle || "About Us"}
                </h2>
                <p className="text-gray-700 leading-relaxed text-justify text-[15px] md:text-base">
                  {aboutData?.heroDescription}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Osheen Ma'am's Story Section */}
        {aboutData?.sections?.map((section, index) => (
          <section
            key={section._id || index}
            className={`relative min-h-auto overflow-hidden flex items-center justify-center ${
              index === 0 ? "pt-16 md:pt-24" : "py-16"
            }`}
          >
            <div
              className={`relative z-10 container mx-auto flex flex-col ${
                index % 2 === 0
                  ? "md:flex-row" // Even index: image left, text right
                  : "md:flex-row-reverse" // Odd index: image right, text left
              } items-center justify-between gap-8 px-4`}
            >
              {/* Text Section */}
              <div className="w-full md:w-1/2 space-y-6 animate-fade-in-up md:pl-8">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 text-center md:text-left">
                  {section.title}
                </h2>
                {/* Handle content that might be plain text or need paragraph splitting */}
                {section.content.split("\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-gray-700 leading-relaxed text-justify text-[15px] md:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Image Section - Now Dynamic */}
              <div className="relative w-full md:w-1/2 flex justify-center md:py-24 py-12">
                <div className="relative overflow-hidden max-w-auto">
                  {section.image ? (
                    <Image
                      src={section.image}
                      alt={section.title}
                      width={index % 2 === 0 ? 700 : 500}
                      height={500}
                      className="object-contain w-full h-auto"
                      unoptimized={section.image.startsWith("data:image")}
                    />
                  ) : (
                    // Agar image nahi hai to default static image dikhao (pehle wala)
                    <Image
                      src={
                        index % 2 === 0
                          ? "/images/withcandle.png"
                          : "/images/resize3.jpg"
                      }
                      alt={section.title}
                      width={index % 2 === 0 ? 700 : 500}
                      height={500}
                      className="object-cover rounded-2xl w-full h-auto"
                    />
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
        {/* Stats Section */}

        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col md:flex-row bg-[#4F4742] rounded-2xl overflow-hidden text-[#F5CDB0] shadow-lg divide-y md:divide-y-0 md:divide-x divide-[#6B615A] w-full max-w-5xl mx-4">
            {aboutData?.stats?.map((stat, index) => (
              <div
                key={stat._id || index}
                className="flex items-center justify-center gap-3 sm:gap-4 px-8 sm:px-12 py-6 sm:py-10 flex-1"
              >
                <h2 className="text-3xl sm:text-4xl font-serif font-medium">
                  {stat.value}
                </h2>
                <p className="text-xs sm:text-sm text-gray-200 text-center sm:text-left">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final Message Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-8">
              Join Our Family
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify text-lg max-w-4xl mx-auto mb-8">
              Today Osheen Oracle has grown to become an LLP company and from
              all over the world we receive immense love and appreciation for
              all the hard work, magic and healings we have provided to millions
              of clients and their success stories continue to provide hope,
              encouragement and zeal to everyone who comes to us for help.
            </p>
            <p className="text-gray-700 leading-relaxed text-justify text-lg max-w-4xl mx-auto mb-8">
              Osheen Ma always had a vision and was very ethical when dealing
              with clients as her advice is always accurate and for her healing
              is her divine calling and her guidance is also full of wisdom and
              motivation which forms a deep personal bond between her and her
              clients. A successful entrepreneur, Osheen ma have formulated an
              ALL-WOMEN team which symbolize women empowerment and once you get
              connect with us we make sure you never feel alone and we do our
              best to heal you from within and make a more happier and healthier
              individual by providing a personal assistant and therapist for all
              your needs during the healing / spells process along with constant
              motivation from Osheen ma herself.
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
              <p className="text-2xl font-semibold text-purple-800 mb-4">
                May God bless you Beta
              </p>
              <p className="text-gray-600">- Osheen Ma</p>
            </div>
            <div className="mt-12">
              <p className="text-xl font-semibold text-gray-800 mb-4">
                For a direct consultation with Osheen Ma
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+918146668328"
                  className="bg-yellow-400 text-white px-8 py-3 rounded-full hover:bg-yellow-500 transition-colors"
                >
                  Call +91 8146668328
                </a>
                <a
                  href="tel:+918146977206"
                  className="bg-yellow-400 text-white px-8 py-3 rounded-full hover:bg-yellow-500 transition-colors"
                >
                  Call +91 8146977206
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
