"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { blogAPI, Blog } from "@/utils/api/blog.api"; // ✅ Import Blog type

// Transform API blog to component format
const transformBlogForCard = (blog: Blog) => {
  // ✅ Use Blog type
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return {
    id: blog._id,
    title: blog.title,
    description:
      blog.excerpt || blog.description?.substring(0, 100) + "..." || "",
    image: blog.image,
    date: blog.date || formatDate(blog.createdAt || new Date().toISOString()),
    category: blog.category,
    author: blog.author,
  };
};

const BlogSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]); // ✅ Use Blog type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await blogAPI.getAllBlogs();
      console.log("API Response:", response);
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log("Blogs data:", response.data);
        setBlogs(response.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: "next" | "prev") => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth * 0.8;
      sliderRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div
        className="px-8 py-12 relative"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        <p className="md:text-lg text-md mb-2 text-[#3D2E4F]">BLOG</p>
        <h2 className="md:text-5xl text-2xl mb-8 text-[#3D2E4F] py-3">
          Cosmic <span className="italic">Stories</span> from Celestial
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0 && !loading) {
    return (
      <div
        className="px-8 py-12 relative"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        <p className="md:text-lg text-md mb-2 text-[#3D2E4F]">BLOG</p>
        <h2 className="md:text-5xl text-2xl mb-8 text-[#3D2E4F] py-3">
          Cosmic <span className="italic">Stories</span> from Celestial
        </h2>
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">
            No blog posts found. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="px-8 py-12 relative"
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      <p className="md:text-lg text-md mb-2 text-[#3D2E4F]">BLOG</p>

      <h2 className="md:text-5xl text-2xl mb-8 text-[#3D2E4F] py-3">
        Cosmic <span className="italic">Stories</span> from Celestial
      </h2>

      <div className="relative">
        {/* Scroll Buttons - Only show if there are blogs */}
        {blogs.length > 0 && (
          <>
            <button
              onClick={() => scroll("prev")}
              className="absolute top-1/2 -left-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transform -translate-y-1/2"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => scroll("next")}
              className="absolute top-1/2 -right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transform -translate-y-1/2"
            >
              <ChevronRight />
            </button>
          </>
        )}

        {/* Blog Slider */}
        <motion.div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto hide-scrollbar"
        >
          {blogs.map((blog) => {
            const cardBlog = transformBlogForCard(blog);
            return (
              <motion.div
                key={cardBlog.id}
                className="flex-shrink-0 w-full md:w-80 bg-white rounded-xl shadow-lg p-4 cursor-pointer hover:shadow-2xl transition-shadow"
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Blog Image */}
                <div className="relative w-full h-48">
                  {cardBlog.image ? (
                    <Image
                      src={cardBlog.image}
                      alt={cardBlog.title}
                      fill
                      className="rounded-xl object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </div>

                {/* Blog Content */}
                <div className="py-4 sm:py-6">
                  <p className="text-xs sm:text-sm mb-1 sm:mb-2 text-gray-600">
                    {cardBlog.date} • {cardBlog.category}
                  </p>

                  <h3 className="text-lg sm:text-xl font-serif mb-2 sm:mb-3 line-clamp-2">
                    {cardBlog.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4">
                    {cardBlog.description}
                  </p>

                  <div className="flex items-center justify-between gap-2">
                    <Link href={`/blog/${cardBlog.id}`}>
                      <button className="bg-yellow-400 px-3 sm:px-4 py-2 rounded font-semibold text-sm sm:text-base hover:bg-yellow-500 transition-all whitespace-nowrap">
                        Read Article
                      </button>
                    </Link>

                    <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      ✍️ Osheen MAA
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BlogSlider;
