"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import homeAPI from "@/utils/api/home.api";
import { getFullImageUrl } from "@/utils/api/api";

const DEFAULT_MEDIA_SPOTLIGHT = [
  {
    id: "01",
    name: "ZEE NEWS",
    logo: "/media/zeenews.png",
    image: "/media/img-1.png",
    link: "https://zeenews.india.com/india/top-5-best-tarot-card-readers-of-2024-2026-2808723.html",
  },
  {
    id: "02",
    name: "ABP न्यूज़",
    logo: "/media/abp.png",
    image: "/media/img-2.png",
    link: "https://news.abplive.com/brand-wire/top-5-best-astrologers-in-india-2024-2025-1739419",
  },
  {
    id: "03",
    name: "FEMINA",
    logo: "/media/femina.png",
    image: "/media/img-3.jpg",
    link: "https://www.femina.in/trending/achievers/eight-extraordinary-individuals-stories-of-success-and-impact-285335.html",
  },
  {
    id: "04",
    name: "TEDx",
    logo: "/media/tde.png",
    image: "/media/img-4.png",
    link: "https://youtu.be/ef4QUwvJnEE?si=dDXvy2wLvz-t1Dti",
  },
];

const MediaSpotlight = () => {
  const [spotlights, setSpotlights] = useState<any[]>([]);

  useEffect(() => {
    const fetchSpotlights = async () => {
      try {
        const response = await homeAPI.getMediaSpotlight();
        if (response && Array.isArray(response) && response.length > 0) {
          setSpotlights(response);
        } else {
          setSpotlights(DEFAULT_MEDIA_SPOTLIGHT);
        }
      } catch (err) {
        console.error("Failed to load spotlights:", err);
        setSpotlights(DEFAULT_MEDIA_SPOTLIGHT);
      }
    };
    fetchSpotlights();
  }, []);

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
        Featured by India’s leading media platforms for excellence and trust.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {spotlights.map((item, index) => {
          const serialNumber = (index + 1).toString().padStart(2, "0");
          return (
            <motion.a
              key={item._id || item.id || index}
              href={item.link || "#"}
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
                  {serialNumber}
                </span>
                <Image
                  src={getFullImageUrl(item.logo)}
                  alt={item.name || "Media"}
                  className="h-12 object-contain"
                  width={300}
                  height={300}
                />
              </div>
              <Image
                src={getFullImageUrl(item.image)}
                alt={item.name || "Media Highlight"}
                className="rounded-md object-cover w-full"
                width={300}
                height={300}
              />
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};

export default MediaSpotlight;