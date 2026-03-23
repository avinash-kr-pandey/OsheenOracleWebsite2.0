// "use client";
// import Image from "next/image";
// import React, { useState, useEffect, useRef } from "react";

// const Achievements = () => {
//   const gradientBg = "bg-gradient-to-b from-[#F1C1EB] to-[#D8FBFF]";
//   const titleColor = "text-[#3D2E4F]";

//   const images = [
//     "/assets/Achievements.jpg",
//     "/assets/Achievements-1.jpeg",
//     "/assets/Achievements-2.jpeg",
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     const nextSlide = () => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
//     };
//     timeoutRef.current = setTimeout(nextSlide, 4000);
//     return () => {
//       if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     };
//   }, [currentIndex, images.length]);

//   return (
//     <div
//       className={`max-w-7xl mx-auto px-4 py-10 rounded-xl shadow-2xl mb-10 ${gradientBg}`}
//       style={{ fontFamily: "var(--font-montserrat)" }}
//     >
//       <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
//         {/* Text Section */}
//         <div className="w-full lg:w-1/2 pl-4">
//           <h1 className={`text-4xl sm:text-4xl md:text-5xl ${titleColor} mb-6`}>
//             Achievements
//           </h1>
//           {/* <p
//             className="text-[#000000] text-base sm:text-lg"
//             style={{ lineHeight: "1.8" }}
//           > */}

//           <p
//             className="text-base sm:text-lg md:text-xl text-[#3C3C3C] leading-relaxed text-justify"
//             style={{ fontFamily: "var(--font-montserrat)" }}
//           >
//             Over the years, our students and faculty have achieved remarkable
//             milestones. From national-level competitions to innovative projects,
//             we take pride in nurturing talent and fostering excellence. Our
//             platform has consistently enabled learners to showcase their skills,
//             earn awards, and grow into leaders in their fields.
//           </p>
//         </div>

//         {/* Image Slider Section with unique animation */}
//         <div className="w-full lg:w-1/2 overflow-hidden relative h-[500px] rounded-lg">
//           {images.map((img, index) => (
//             <div
//               key={index}
//               className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out
//                 ${
//                   currentIndex === index
//                     ? "opacity-100 scale-100 z-20"
//                     : "opacity-0 scale-90 z-10"
//                 }
//               `}
//             >
//               <Image
//                 src={img}
//                 alt={`Achievement ${index + 1}`}
//                 fill
//                 className="object-contain rounded-lg"
//                 priority
//               />
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Achievements;

"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import homeAPI, {
  AchievementsSection,
  AchievementImage,
} from "@/utils/api/home.api";

const Achievements = () => {
  const gradientBg = "bg-gradient-to-b from-[#F1C1EB] to-[#D8FBFF]";
  const titleColor = "text-[#3D2E4F]";

  const [achievements, setAchievements] = useState<AchievementsSection | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Default images in case backend doesn't have any
  const defaultImages: AchievementImage[] = [
    { url: "/assets/Achievements.jpg", caption: "Achievement 1", order: 0 },
    { url: "/assets/Achievements-1.jpeg", caption: "Achievement 2", order: 1 },
    { url: "/assets/Achievements-2.jpeg", caption: "Achievement 3", order: 2 },
  ];

  // Default text
  const defaultText = {
    title: "Achievements",
    description:
      "Over the years, our students and faculty have achieved remarkable milestones. From national-level competitions to innovative projects, we take pride in nurturing talent and fostering excellence. Our platform has consistently enabled learners to showcase their skills, earn awards, and grow into leaders in their fields.",
  };

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await homeAPI.getAchievements();
      setAchievements(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching achievements:", err);
      setError("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  // Get images array from backend or use default
  const getImages = (): AchievementImage[] => {
    if (achievements?.images && achievements.images.length > 0) {
      return achievements.images;
    }
    return defaultImages;
  };

  // Get title from backend or use default
  const getTitle = (): string => {
    return achievements?.title || defaultText.title;
  };

  // Get description from backend or use default
  const getDescription = (): string => {
    return achievements?.description || defaultText.description;
  };

  const images = getImages();

  // Auto-slide effect
  useEffect(() => {
    if (images.length <= 1) return;

    const nextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };
    timeoutRef.current = setTimeout(nextSlide, 4000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, images.length]);

  if (loading) {
    return (
      <div
        className={`max-w-7xl mx-auto px-4 py-10 rounded-xl shadow-2xl mb-10 ${gradientBg}`}
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D2E4F]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`max-w-7xl mx-auto px-4 py-10 rounded-xl shadow-2xl mb-10 ${gradientBg}`}
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchAchievements}
            className="px-4 py-2 bg-[#3D2E4F] text-white rounded-lg hover:bg-[#2D1E3F] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`max-w-7xl mx-auto px-4 py-10 rounded-xl shadow-2xl mb-10 ${gradientBg}`}
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
        {/* Text Section */}
        <div className="w-full lg:w-1/2 pl-4">
          <h1 className={`text-4xl sm:text-4xl md:text-5xl ${titleColor} mb-6`}>
            {getTitle()}
          </h1>
          <p
            className="text-base sm:text-lg md:text-xl text-[#3C3C3C] leading-relaxed text-justify"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {getDescription()}
          </p>
        </div>

        {/* Image Slider Section with unique animation */}
        <div className="w-full lg:w-1/2 overflow-hidden relative h-[500px] rounded-lg">
          {images.map((img, index) => (
            <div
              key={img._id || index}
              className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out
                ${
                  currentIndex === index
                    ? "opacity-100 scale-100 z-20"
                    : "opacity-0 scale-90 z-10"
                }
              `}
            >
              <Image
                src={img.url}
                alt={img.caption || `Achievement ${index + 1}`}
                fill
                className="object-contain rounded-lg"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achievements;