// "use client";
// import Image from "next/image";
// import React from "react";
// import { motion } from "framer-motion";

// const mediaData = [
//   {
//     id: "01",
//     name: "ZEE NEWS",
//     logo: "/media/zeenews.png",
//     image: "/media/img-1.png",
//     link: "https://zeenews.india.com/india/top-5-best-tarot-card-readers-of-2024-2026-2808723.html",
//   },
//   {
//     id: "02",
//     name: "ABP न्यूज़",
//     logo: "/media/abp.png",
//     image: "/media/img-2.png",
//     link: "https://news.abplive.com/brand-wire/top-5-best-astrologers-in-india-2024-2025-1739419",
//   },
//   {
//     id: "03",
//     name: "FEMINA",
//     logo: "/media/femina.png",
//     image: "/media/img-3.jpg",
//     link: "https://www.femina.in/trending/achievers/eight-extraordinary-individuals-stories-of-success-and-impact-285335.html",
//   },
//   {
//     id: "04",
//     name: "TEDx",
//     logo: "/media/tde.png",
//     image: "/media/img-4.png",
//     link: "https://youtu.be/ef4QUwvJnEE?si=dDXvy2wLvz-t1Dti",
//   },
// ];

// const MediaSpotlight = () => {
//   return (
//     <div
//       className="py-12 flex flex-col items-center max-w-6xl mx-auto"
//       style={{
//         backgroundImage: "url('/images/roundimage.png')",
//         backgroundRepeat: "no-repeat",
//         backgroundPosition: "center",
//         backgroundSize: "contain",
//         fontFamily: "var(--font-montserrat)",
//       }}
//     >
//       <h2 className="text-4xl sm:text-4xl md:text-5xl text-[#3D2E4F] mb-2 font-bold text-center">
//         Media Spotlight
//       </h2>
//       <p className="mb-8 text-center text-sm text-[#3D2E4F] max-w-xl font-bold">
//         Featured by India’s leading media platforms for excellence and trust.
//       </p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
//         {mediaData.map((item, index) => (
//           <motion.a
//             key={item.id}
//             href={item.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center cursor-pointer transform perspective-1000 hover:shadow-xl transition-shadow"
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.2, duration: 0.6 }}
//             whileHover={{
//               rotateY: 10,
//               scale: 1.05,
//               transition: { duration: 0.3 },
//             }}
//           >
//             <div className="flex items-center mb-4">
//               <span className="text-5xl font-bold text-gray-400 mr-2">
//                 {item.id}
//               </span>
//               <Image
//                 src={item.logo}
//                 alt={item.name}
//                 className="h-12 object-contain"
//                 width={300}
//                 height={300}
//               />
//             </div>
//             <Image
//               src={item.image}
//               alt={item.name}
//               className="rounded-md object-cover w-full"
//               width={300}
//               height={300}
//             />
//           </motion.a>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MediaSpotlight;

"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import homeAPI, {
  MediaSpotlight as MediaSpotlightType,
} from "@/utils/api/home.api";

const MediaSpotlight = () => {
  const [mediaItems, setMediaItems] = useState<MediaSpotlightType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default media data in case backend doesn't have any
  // Using 'title' instead of 'name' to match the type
  const defaultMediaData: MediaSpotlightType[] = [
    {
      _id: "1",
      title: "ZEE NEWS", // ← Changed from 'name' to 'title'
      logo: "/media/zeenews.png",
      image: "/media/img-1.png",
      link: "https://zeenews.india.com/india/top-5-best-tarot-card-readers-of-2024-2026-2808723.html",
      order: 1,
      isActive: true,
    },
    {
      _id: "2",
      title: "ABP न्यूज़", // ← Changed from 'name' to 'title'
      logo: "/media/abp.png",
      image: "/media/img-2.png",
      link: "https://news.abplive.com/brand-wire/top-5-best-astrologers-in-india-2024-2025-1739419",
      order: 2,
      isActive: true,
    },
    {
      _id: "3",
      title: "FEMINA", // ← Changed from 'name' to 'title'
      logo: "/media/femina.png",
      image: "/media/img-3.jpg",
      link: "https://www.femina.in/trending/achievers/eight-extraordinary-individuals-stories-of-success-and-impact-285335.html",
      order: 3,
      isActive: true,
    },
    {
      _id: "4",
      title: "TEDx", // ← Changed from 'name' to 'title'
      logo: "/media/tde.png",
      image: "/media/img-4.png",
      link: "https://youtu.be/ef4QUwvJnEE?si=dDXvy2wLvz-t1Dti",
      order: 4,
      isActive: true,
    },
  ];

  useEffect(() => {
    fetchMediaSpotlight();
  }, []);

  const fetchMediaSpotlight = async () => {
    try {
      setLoading(true);
      const data = await homeAPI.getMediaSpotlight();
      setMediaItems(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching media spotlight:", err);
      setError("Failed to load media spotlight");
      // Use default data on error
      setMediaItems(defaultMediaData);
    } finally {
      setLoading(false);
    }
  };

  // Get media items - use backend data if available, otherwise use default
  const getMediaItems = (): MediaSpotlightType[] => {
    if (mediaItems && mediaItems.length > 0) {
      return mediaItems;
    }
    return defaultMediaData;
  };

  const displayItems = getMediaItems();

  if (loading) {
    return (
      <div
        className="py-12 flex flex-col items-center max-w-6xl mx-auto"
        style={{
          backgroundImage: "url('/images/roundimage.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          fontFamily: "var(--font-montserrat)",
        }}
      >
        <h2 className="text-4xl sm:text-4xl md:text-5xl text-[#3D2E4F] mb-2 font-bold text-center">
          Media Spotlight
        </h2>
        <p className="mb-8 text-center text-sm text-[#3D2E4F] max-w-xl font-bold">
          Featured by India&lsquo;s leading media platforms for excellence and
          trust.
        </p>
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3D2E4F]"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="py-12 flex flex-col items-center max-w-6xl mx-auto"
      style={{
        backgroundImage: "url('/images/roundimage.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "contain",
        fontFamily: "var(--font-montserrat)",
      }}
    >
      <h2 className="text-4xl sm:text-4xl md:text-5xl text-[#3D2E4F] mb-2 font-bold text-center">
        Media Spotlight
      </h2>
      <p className="mb-8 text-center text-sm text-[#3D2E4F] max-w-xl font-bold">
        Featured by India&lsquo;s leading media platforms for excellence and
        trust.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {displayItems.map((item, index) => {
          // Format ID to show as 01, 02, 03, 04
          const formattedId = (index + 1).toString().padStart(2, "0");

          return (
            <motion.a
              key={item._id || index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center cursor-pointer transform perspective-1000 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{
                rotateY: 10,
                scale: 1.05,
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex items-center mb-4">
                <span className="text-5xl font-bold text-gray-400 mr-2">
                  {formattedId}
                </span>
                <Image
                  src={item.logo}
                  alt={item.title} // ← Changed from 'item.name' to 'item.title'
                  className="h-12 object-contain"
                  width={300}
                  height={300}
                />
              </div>
              <Image
                src={item.image}
                alt={item.title} // ← Changed from 'item.name' to 'item.title'
                className="rounded-md object-cover w-full"
                width={300}
                height={300}
              />
            </motion.a>
          );
        })}
      </div>

      {/* Show error message if any, but still display default data */}
      {error && (
        <div className="mt-4 text-center">
          <p className="text-yellow-600 text-sm mb-2">
            {error} - Showing default data
          </p>
          <button
            onClick={fetchMediaSpotlight}
            className="px-3 py-1 text-sm bg-[#3D2E4F] text-white rounded-lg hover:bg-[#2D1E3F] transition"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaSpotlight;