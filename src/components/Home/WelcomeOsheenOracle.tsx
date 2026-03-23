// "use client";
// import Image from "next/image";
// import React, { useState } from "react";

// const WelcomeOsheenOracle = () => {
//   const [activeTab, setActiveTab] = useState("oracle");

//   return (
//     <div className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-24 ">
//       {/* Background Zodiac Style */}
//       <div className="absolute inset-0 opacity-40 bg-[url('/assets/Group.png')] bg-no-repeat bg-left-top bg-contain pointer-events-none"></div>

//       <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
//         {/* Left Section */}
//         <div className="text-center md:text-left">
//           <p
//             className="text-base sm:text-lg md:text-xl mb-6 text-gray-700"
//             style={{ fontFamily: "var(--font-montserrat)" }}
//           >
//             Discover More About The Path That Shapes Your Future
//           </p>

//           {/* Tabs */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start">
//             <button
//               className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
//                 activeTab === "oracle"
//                   ? "bg-[#3D2E4F] text-white"
//                   : "border border-[#00000085] text-[#3D2E4F] hover:bg-purple-100"
//               }`}
//               style={{ fontFamily: "var(--font-montserrat)" }}
//               onClick={() => setActiveTab("oracle")}
//             >
//               Osheen Oracle
//             </button>
//             <button
//               className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
//                 activeTab === "maa"
//                   ? "bg-[#3D2E4F] text-white"
//                   : "border border-[#00000085] text-[#3D2E4F] hover:bg-purple-100"
//               }`}
//               style={{ fontFamily: "var(--font-montserrat)" }}
//               onClick={() => setActiveTab("maa")}
//             >
//               Osheen MAA
//             </button>
//           </div>

//           {/* Content */}
//           {activeTab === "oracle" ? (
//             <>
//               <h2
//                 className="text-2xl sm:text-3xl md:text-[32px] text-[#3C3C3C] mb-3"
//                 style={{ fontFamily: "var(--font-cormorant)" }}
//               >
//                 About
//               </h2>
//               <h2
//                 className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#3C3C3C] mb-3"
//                 style={{ fontFamily: "var(--font-cormorant)" }}
//               >
//                 Osheen Oracle
//               </h2>
//               <p
//                 className="text-base sm:text-lg md:text-xl text-[#3C3C3C] leading-relaxed text-justify"
//                 style={{ fontFamily: "var(--font-montserrat)" }}
//               >
//                 We are highly delighted to see you here at Osheen Oracle, which
//                 is 4 time consecutively awarded as No.1 tarot reading platform
//                 in India. Osheen Oracle is one stop solution for a comprehensive
//                 healing journey where you will find guidance to heal your life
//                 in all aspects of love, relationship, mental well-being, career
//                 success, business success and for every issue you must be facing
//                 today alone as we are here to help.
//               </p>
//             </>
//           ) : (
//             <>
//               <h2
//                 className="text-2xl sm:text-3xl md:text-[32px] text-[#3C3C3C] mb-3"
//                 style={{ fontFamily: "var(--font-cormorant)" }}
//               >
//                 About
//               </h2>
//               <h2
//                 className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#3C3C3C] mb-3"
//                 style={{ fontFamily: "var(--font-cormorant)" }}
//               >
//                 Osheen MAA
//               </h2>
//               <p
//                 className="text-base sm:text-lg md:text-xl text-[#3C3C3C] leading-relaxed text-justify"
//                 style={{ fontFamily: "var(--font-montserrat)" }}
//               >
//                 Amarpreet Osheen Kaur, fondly called Osheen ma is a Spiritual
//                 Mentor, Healer, Tarot reader, aura reader, relationship
//                 counselor, motivation speaker, astrologer, Reiki master and
//                 white healing spells caster with an experience of more than 10
//                 years in the study of field of Divination, spirituality,
//                 alternative healing modalities and creating magic. She was been
//                 given the title of No.1 tarot reader in India.
//               </p>
//             </>
//           )}
//         </div>

//         {/* Right Section - Image */}
//         <div className="flex justify-center relative pt-12 md:pt-32">
//           <div className="group relative w-60 h-80 sm:w-72 sm:h-96 md:w-[350px] md:h-[520px] lg:w-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-700 ease-out">
//             <Image
//               src="/assets/youaremagic.jpg"
//               alt="Osheen Oracle"
//               fill
//               className="object-cover scale-100 group-hover:scale-110 brightness-75 group-hover:brightness-100 transition-all duration-700 ease-in-out"
//               priority
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-all duration-700"></div>
//           </div>

//           <div className="absolute bottom-[-30px] right-[20px] sm:bottom-[-35px] sm:right-[35px] md:bottom-[-40px] md:right-[45px] w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 z-20">
//             <Image
//               src="/logo.png"
//               alt="Overlay Logo"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WelcomeOsheenOracle;
"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import homeAPI, { DiscoverSection } from "@/utils/api/home.api";

// Define proper type for current data
interface CurrentData {
  title: string;
  description: string;
  link: string;
  image: string;
}

const WelcomeOsheenOracle = () => {
  const [activeTab, setActiveTab] = useState("oracle");
  const [discoverData, setDiscoverData] = useState<DiscoverSection | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default texts in case backend doesn't have data
  const defaultOracleText: CurrentData = {
    title: "Osheen Oracle",
    description:
      "We are highly delighted to see you here at Osheen Oracle, which is 4 time consecutively awarded as No.1 tarot reading platform in India. Osheen Oracle is one stop solution for a comprehensive healing journey where you will find guidance to heal your life in all aspects of love, relationship, mental well-being, career success, business success and for every issue you must be facing today alone as we are here to help.",
    link: "/osheen-oracle",
    image: "/assets/youaremagic.jpg",
  };

  const defaultMaaText: CurrentData = {
    title: "Osheen MAA",
    description:
      "Amarpreet Osheen Kaur, fondly called Osheen ma is a Spiritual Mentor, Healer, Tarot reader, aura reader, relationship counselor, motivation speaker, astrologer, Reiki master and white healing spells caster with an experience of more than 10 years in the study of field of Divination, spirituality, alternative healing modalities and creating magic. She was been given the title of No.1 tarot reader in India.",
    link: "/osheen-maa",
    image: "/assets/youaremagic.jpg",
  };

  // Default logo
  const defaultLogo = "/logo.png";

  useEffect(() => {
    fetchDiscoverData();
  }, []);

  const fetchDiscoverData = async () => {
    try {
      setLoading(true);
      const data = await homeAPI.getDiscoverSection();
      setDiscoverData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching discover section:", err);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  // Get current active tab data with proper return type
  const getCurrentData = (): CurrentData => {
    if (!discoverData) {
      return activeTab === "oracle" ? defaultOracleText : defaultMaaText;
    }

    if (activeTab === "oracle") {
      return {
        title: discoverData.osheenOracle?.title || defaultOracleText.title,
        description:
          discoverData.osheenOracle?.description ||
          defaultOracleText.description,
        link: discoverData.osheenOracle?.link || defaultOracleText.link,
        image: discoverData.osheenOracle?.image || defaultOracleText.image,
      };
    } else {
      return {
        title: discoverData.osheenMaa?.title || defaultMaaText.title,
        description:
          discoverData.osheenMaa?.description || defaultMaaText.description,
        link: discoverData.osheenMaa?.link || defaultMaaText.link,
        image: discoverData.osheenMaa?.image || defaultMaaText.image,
      };
    }
  };

  const currentData = getCurrentData();

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-24">
        <div className="absolute inset-0 opacity-40 bg-[url('/assets/Group.png')] bg-no-repeat bg-left-top bg-contain pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto w-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D2E4F]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-24">
        <div className="absolute inset-0 opacity-40 bg-[url('/assets/Group.png')] bg-no-repeat bg-left-top bg-contain pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto w-full text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDiscoverData}
            className="px-4 py-2 bg-[#3D2E4F] text-white rounded-lg hover:bg-[#2D1E3F] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center px-4 sm:px-6 lg:px-12 py-12 sm:py-16 md:py-24">
      {/* Background Zodiac Style */}
      <div className="absolute inset-0 opacity-40 bg-[url('/assets/Group.png')] bg-no-repeat bg-left-top bg-contain pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <p
            className="text-base sm:text-lg md:text-xl mb-6 text-gray-700"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Discover More About The Path That Shapes Your Future
          </p>

          {/* Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center md:justify-start">
            <button
              className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
                activeTab === "oracle"
                  ? "bg-[#3D2E4F] text-white"
                  : "border border-[#00000085] text-[#3D2E4F] hover:bg-purple-100"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
              onClick={() => setActiveTab("oracle")}
            >
              Osheen Oracle
            </button>
            <button
              className={`px-6 py-2 rounded-lg font-semibold shadow-md transition ${
                activeTab === "maa"
                  ? "bg-[#3D2E4F] text-white"
                  : "border border-[#00000085] text-[#3D2E4F] hover:bg-purple-100"
              }`}
              style={{ fontFamily: "var(--font-montserrat)" }}
              onClick={() => setActiveTab("maa")}
            >
              Osheen MAA
            </button>
          </div>

          {/* Content */}
          <h2
            className="text-2xl sm:text-3xl md:text-[32px] text-[#3C3C3C] mb-3"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            About
          </h2>
          <h2
            className="text-2xl sm:text-3xl md:text-3xl font-bold text-[#3C3C3C] mb-3"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {currentData.title}
          </h2>
          <p
            className="text-base sm:text-lg md:text-xl text-[#3C3C3C] leading-relaxed text-justify"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {currentData.description}
          </p>
        </div>

        {/* Right Section - Image */}
        <div className="flex justify-center relative pt-12 md:pt-32">
          <div className="group relative w-60 h-80 sm:w-72 sm:h-96 md:w-[350px] md:h-[520px] lg:w-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-all duration-700 ease-out">
            <Image
              src={currentData.image}
              alt={currentData.title}
              fill
              className="object-cover scale-100 group-hover:scale-110 brightness-75 group-hover:brightness-100 transition-all duration-700 ease-in-out"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-all duration-700"></div>
          </div>

          <div className="absolute bottom-[-30px] right-[20px] sm:bottom-[-35px] sm:right-[35px] md:bottom-[-40px] md:right-[45px] w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 z-20">
            <Image
              src={defaultLogo}
              alt="Overlay Logo"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeOsheenOracle;