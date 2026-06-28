// "use client";
// import Image from "next/image";
// import React from "react";

// const Discover = () => {
//   const services = [
//     {
//       id: "01",
//       title: "Natal Chart Readings",
//       description:
//         "We generate your natal chart and interpret the positions of the planets, signs, and houses to give you insights into your personality, strengths, weaknesses, and life path.",
//       image: "/assets/image-1.jpg",
//       reverse: false,
//     },
//     {
//       id: "02",
//       title: "Compatibility Readings",
//       description:
//         "We can analyze the compatibility between two individuals by comparing their natal charts. This can help people understand their relationships with partners, friends, or family members better.",
//       image: "/assets/image-2.jpg",
//       reverse: true,
//     },
//     {
//       id: "03",
//       title: "Progression Readings",
//       description:
//         "We provide insights into upcoming planetary transits and progressions that may influence your life events and experiences. It can be useful for timing significant decisions or life changes.",
//       image: "/assets/image-3.jpg",
//       reverse: false,
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-16">
//       {/* Heading */}
//       <h2
//         style={{ fontFamily: "var(--font-montserrat)" }}
//         className="text-3xl md:text-5xl text-start mb-16"
//       >
//         Discover <span>Your Path</span> in the Stars with Us
//       </h2>

//       {/* Services */}
//       <div className="flex flex-col gap-16">
//         {services?.map((service, index) => {
//           const isReversed =
//             index === 0
//               ? true // first item: text left, image right
//               : index % 2 !== 1; // alternate for others

//           return (
//             <div
//               key={service.id}
//               className={`flex flex-col md:flex-row items-center gap-8 ${
//                 isReversed ? "md:flex-row-reverse" : ""
//               }`}
//             >
//               {/* Image */}
//               <div className="w-full md:w-1/2">
//                 <Image
//                   src={service.image}
//                   alt={service.title}
//                   className="w-full h-[40vh] rounded-lg object-cover"
//                   width={500}
//                   height={500}
//                 />
//               </div>

//               {/* Text */}
//               <div
//                 className="w-full md:w-1/2"
//                 style={{ fontFamily: "var(--font-montserrat)" }}
//               >
//                 <div className="flex items-center gap-3 p-3">
//                   <span className="text-yellow-400 text-2xl md:text-3xl font-medium font-cormorant">
//                     {service.id}
//                   </span>
//                   <h2
//                     className="text-2xl md:text-3xl font-cormorant"
//                     style={{ fontFamily: "var(--font-montserrat)" }}
//                   >
//                     {service.title}
//                   </h2>
//                 </div>

//                 <p className="text-gray-700 leading-relaxed p-3">
//                   {service.description}
//                 </p>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Discover;

"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import homeAPI, { DiscoverPath } from "@/utils/api/home.api";

const Discover = () => {
  const [discoverPaths, setDiscoverPaths] = useState<DiscoverPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default images for fallback
  const defaultImages = [
    "/assets/image-1.jpg",
    "/assets/image-2.jpg",
    "/assets/image-3.jpg",
  ];

  useEffect(() => {
    fetchDiscoverPaths();
  }, []);

  const fetchDiscoverPaths = async () => {
    try {
      setLoading(true);
      const data = await homeAPI.getDiscoverYourPath();
      setDiscoverPaths(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching discover paths:", err);
      setError("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  // Format ID to show as 01, 02, 03 etc.
  const formatId = (index: number): string => {
    return (index + 1).toString().padStart(2, "0");
  };

  // Determine if layout should be reversed (alternating pattern)
  const isReversed = (index: number): boolean => {
    // First item: text left, image right (reverse: false)
    // Second item: text right, image left (reverse: true)
    // Third item: text left, image right (reverse: false)
    // and so on...
    return index % 2 === 1;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2
          style={{ fontFamily: "var(--font-montserrat)" }}
          className="text-3xl md:text-5xl text-start mb-16"
        >
          Discover <span>Your Path</span> in the Stars with Us
        </h2>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2
          style={{ fontFamily: "var(--font-montserrat)" }}
          className="text-3xl md:text-5xl text-start mb-16"
        >
          Discover <span>Your Path</span> in the Stars with Us
        </h2>
        <div className="text-center py-20">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDiscoverPaths}
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If no data from backend, show nothing or you can show default
  if (discoverPaths.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      {/* Heading */}
      <h2
        style={{ fontFamily: "var(--font-montserrat)" }}
        className="text-3xl md:text-5xl text-start mb-16"
      >
        Discover <span>Your Path</span> in the Stars with Us
      </h2>

      {/* Services */}
      <div className="flex flex-col gap-16">
        {discoverPaths.map((service, index) => {
          const reversed = isReversed(index);
          // Use backend image if available, otherwise use default image from array
          const imageUrl =
            service.image || defaultImages[index % defaultImages.length];

          return (
            <div
              key={service._id || index}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                reversed ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Image */}
              <div className="w-full md:w-1/2">
                <Image
                  src={imageUrl}
                  alt={service.title}
                  className="w-full h-[40vh] rounded-lg object-cover"
                  width={500}
                  height={500}
                  priority={index === 0}
                />
              </div>

              {/* Text */}
              <div
                className="w-full md:w-1/2"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                <div className="flex items-center gap-3 p-3">
                  <span className="text-yellow-400 text-2xl md:text-3xl font-medium font-cormorant">
                    {formatId(index)}
                  </span>
                  <h2
                    className="text-2xl md:text-3xl font-cormorant"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    {service.title}
                  </h2>
                </div>

                <p className="text-gray-700 leading-relaxed p-3 text-left">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Discover;