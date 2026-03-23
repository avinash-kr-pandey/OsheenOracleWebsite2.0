// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { zodiacData } from "@/utils/AstroData";

// const SliderRow = ({ rowData }: { rowData: typeof zodiacData }) => {
//   const [index, setIndex] = useState(0);
//   const [cardWidth, setCardWidth] = useState(0);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();
//   const fullData = [...rowData, ...rowData, ...rowData];

//   useEffect(() => {
//     const update = () => {
//       if (containerRef.current) {
//         const firstCard = containerRef.current.querySelector(".card");
//         if (firstCard) {
//           const gap = 16; // responsive gap
//           setCardWidth((firstCard as HTMLElement).offsetWidth + gap);
//         }
//       }
//     };
//     update();
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);

//   const handleNext = () => setIndex((prev) => prev + 1);
//   const handlePrev = () => setIndex((prev) => prev - 1);

//   useEffect(() => {
//     const total = rowData.length;
//     if (index < 0) {
//       setTimeout(() => setIndex(total - 1), 0);
//     } else if (index >= total * 2) {
//       setTimeout(() => setIndex(total), 0);
//     }
//   }, [index, rowData.length]);

//   return (
//     <div className="relative select-none w-full">
//       {/* Controls Container - Updated layout */}
//       <div className="absolute -top-14 right-3 sm:-top-16 z-30 w-full">
//         <div className="flex justify-between items-center">
//           {/* Navigation buttons on the left */}
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handlePrev}
//               className="p-2 rounded-full shadow bg-[#62aec5] hover:bg-[#5A4370] transition-all cursor-pointer"
//             >
//               <ChevronLeft className="w-4 h-4 text-white" />
//             </button>

//             <button
//               onClick={handleNext}
//               className="p-2 rounded-full shadow bg-[#62aec5] hover:bg-[#5A4370] transition-all cursor-pointer"
//             >
//               <ChevronRight className="w-4 h-4 text-white" />
//             </button>
//           </div>

//           {/* View All button on the right */}
//           <button
//             onClick={() => router.push("/cataloguedetails")}
//             className="px-6 py-2 border border-[#62aec5] text-[#3D2E4F] rounded-full
//                        font-medium text-base hover:bg-[#62aec5] hover:text-white
//                        transition-all duration-300 cursor-pointer cursor-pointer"
//           >
//             View All
//           </button>
//         </div>
//       </div>

//       {/* Slider */}
//       <div ref={containerRef} className="overflow-hidden w-full mt-8 sm:mt-10">
//         <motion.div
//           className="flex gap-4 sm:gap-6 py-2 cursor-grab active:cursor-grabbing"
//           animate={{ x: -index * cardWidth }}
//           transition={{ type: "spring", stiffness: 90, damping: 20 }}
//           style={{ width: "max-content" }}
//           drag="x"
//           dragConstraints={{ left: -200, right: 200 }}
//           dragElastic={0.25}
//           onDragEnd={(e, info) => {
//             const threshold = 60;
//             if (info.offset.x < -threshold) handleNext();
//             else if (info.offset.x > threshold) handlePrev();
//           }}
//         >
//           {fullData.map((zodiac, i) => (
//             <div
//               key={i}
//               className="card flex-shrink-0 rounded-2xl transition-all bg-white overflow-hidden
//                          shadow-md hover:shadow-xl duration-300
//                          w-[260px] sm:w-[280px] lg:w-[300px] h-[480px] flex flex-col"
//             >
//               {/* Image - Fixed height */}
//               <div className="relative w-full h-[200px] overflow-hidden flex-shrink-0">
//                 <Image
//                   src={zodiac?.image}
//                   alt={zodiac.name}
//                   fill
//                   className="object-cover transform transition-transform duration-500 hover:scale-105"
//                 />
//               </div>

//               {/* Text content with flex grow to fill space */}
//               <div className="flex flex-col flex-grow p-4">
//                 <h3
//                   className="text-lg sm:text-xl font-semibold text-[#3D2E4F] mb-3"
//                   style={{ fontFamily: "var(--font-montserrat)" }}
//                 >
//                   {zodiac.name}
//                 </h3>

//                 <div className="flex-grow">
//                   <p className="text-sm text-gray-600 line-clamp-4">
//                     {zodiac.description}
//                   </p>
//                 </div>

//                 {/* Button always at bottom */}
//                 <div className="mt-auto pt-4">
//                   <button
//                     onClick={() => router.push(`/booking/${zodiac.id}`)}
//                     className="w-full bg-[#62aec5] text-white text-sm font-medium py-2 px-6
//                                rounded-full hover:bg-[#5A4370] transition-all cursor-pointer"
//                     style={{ fontFamily: "var(--font-montserrat)" }}
//                   >
//                     View Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// const Catalogue = () => {
//   const half = Math.ceil(zodiacData.length / 2);
//   const firstRow = zodiacData.slice(0, half);
//   const router = useRouter();

//   return (
//     <div
//       className="py-10 sm:py-16 px-3 sm:px-6 lg:px-10 "
//       style={{ fontFamily: "var(--font-montserrat)" }}
//     >
//       <div className="text-center mb-10 max-w-3xl mx-auto">
//         <h2 className="text-3xl sm:text-4xl md:text-5xl pb-4 text-[#3D2E4F]">
//           Catalogue
//         </h2>
//         <p className="text-[#3D2E4F] text-base sm:text-lg leading-relaxed">
//           Astrology merely guides us toward reality.
//         </p>
//         <p className="text-[#3D2E4F] text-base sm:text-lg leading-relaxed">
//           Explore a range of personalized solutions crafted to inspire, guide,
//           and help you achieve your goals.
//         </p>
//       </div>

//       <div className="space-y-16">
//         <SliderRow rowData={firstRow} />
//       </div>
//     </div>
//   );
// };

// export default Catalogue;
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import homeAPI, { CatalogueItem } from "@/utils/api/home.api";

// Define type for slider row
const SliderRow = ({ rowData }: { rowData: CatalogueItem[] }) => {
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const fullData = [...rowData, ...rowData, ...rowData];

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const firstCard = containerRef.current.querySelector(".card");
        if (firstCard) {
          const gap = 16;
          setCardWidth((firstCard as HTMLElement).offsetWidth + gap);
        }
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleNext = () => setIndex((prev) => prev + 1);
  const handlePrev = () => setIndex((prev) => prev - 1);

  useEffect(() => {
    const total = rowData.length;
    if (index < 0) {
      setTimeout(() => setIndex(total - 1), 0);
    } else if (index >= total * 2) {
      setTimeout(() => setIndex(total), 0);
    }
  }, [index, rowData.length]);

  // Render stars based on rating
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

  return (
    <div className="relative select-none w-full">
      {/* Controls Container */}
      <div className="absolute -top-14 right-3 sm:-top-16 z-30 w-full">
        <div className="flex justify-between items-center">
          {/* Navigation buttons on the left */}
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

          {/* View All button on the right */}
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

      {/* Slider */}
      <div ref={containerRef} className="overflow-hidden w-full mt-8 sm:mt-10">
        <motion.div
          className="flex gap-4 sm:gap-6 py-2 cursor-grab active:cursor-grabbing"
          animate={{ x: -index * cardWidth }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
          style={{ width: "max-content" }}
          drag="x"
          dragConstraints={{ left: -200, right: 200 }}
          dragElastic={0.25}
          onDragEnd={(e, info) => {
            const threshold = 60;
            if (info.offset.x < -threshold) handleNext();
            else if (info.offset.x > threshold) handlePrev();
          }}
        >
          {fullData.map((item, i) => (
            <div
              key={item._id || i}
              className="card flex-shrink-0 rounded-2xl transition-all bg-white overflow-hidden
                         shadow-md hover:shadow-xl duration-300
                         w-[260px] sm:w-[280px] lg:w-[300px] h-[520px] flex flex-col"
            >
              {/* Image - Fixed height */}
              <div className="relative w-full h-[200px] overflow-hidden flex-shrink-0">
                <Image
                  src={item.image || "/images/default.jpg"}
                  alt={item.name}
                  fill
                  className="object-cover transform transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Text content */}
              <div className="flex flex-col flex-grow p-4">
                {/* Title */}
                <h3
                  className="text-lg sm:text-xl font-semibold text-[#3D2E4F] mb-1 line-clamp-1"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center gap-0.5">
                    {renderStars(item.rating)}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({item.rating})
                  </span>
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-xl font-bold text-[#62aec5]">
                    ₹{item.price}
                  </span>
                </div>

                {/* Description */}
                <div className="flex-grow">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                {/* Traits Tags */}
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

                {/* Button always at bottom */}
                <div className="mt-auto pt-3">
                  <button
                    onClick={() =>
                      router.push(`/catalogue/${item.id || item._id}`)
                    }
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
        </motion.div>
      </div>
    </div>
  );
};

const Catalogue = () => {
  const [catalogueItems, setCatalogueItems] = useState<CatalogueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalogue();
  }, []);

  const fetchCatalogue = async () => {
    try {
      setLoading(true);
      const data = await homeAPI.getCatalogue();
      setCatalogueItems(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching catalogue:", err);
      setError("Failed to load catalogue");
    } finally {
      setLoading(false);
    }
  };

  // Take first 10 items for the slider, rest will be shown on View All page
  const displayItems = catalogueItems.slice(0, 10);

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
      </div>

      {/* Single Row - Only first 10 items */}
      {displayItems.length > 0 && <SliderRow rowData={displayItems} />}

      {/* Show error message if any */}
      {error && (
        <div className="mt-8 text-center">
          <p className="text-yellow-600 text-sm mb-2">
            {error} - Showing default data
          </p>
          <button
            onClick={fetchCatalogue}
            className="px-3 py-1 text-sm bg-[#62aec5] text-white rounded-lg hover:bg-[#5A4370] transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Optional: Show count of remaining items */}
      {catalogueItems.length > 10 && (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            +{catalogueItems.length - 10} more readings available.
            <button
              onClick={() => (window.location.href = "/cataloguedetails")}
              className="text-[#62aec5] hover:underline ml-1 font-medium"
            >
              View all →
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default Catalogue;