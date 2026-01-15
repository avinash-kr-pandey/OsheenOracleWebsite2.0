"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductsProps {
  products: Product[];
  sortOption: string;
  onSortChange: (option: string) => void;
  totalProducts: number;
  allProductsCount: number;
}

const Products: React.FC<ProductsProps> = ({
  products,
  sortOption,
  onSortChange,
  totalProducts,
  allProductsCount,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // ✅ Initialize with safe products
  useEffect(() => {
    const validProducts = Array.isArray(products)
      ? products.filter(
          (product) =>
            product &&
            typeof product === "object" &&
            (product.id !== undefined || product._id !== undefined)
        )
      : [];

    setFilteredProducts(validProducts);
  }, [products]);

  // All unique product names
  const allProductNames = Array.from(
    new Set(filteredProducts.map((item) => item.name).filter(Boolean))
  );

  // Suggestions (max 10)
  const filteredSuggestions = allProductNames
    .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, 10);

  // Click outside → close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestionIndex(-1);

    const results = filteredProducts.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(results);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);

    const results = filteredProducts.filter(
      (item) => item.name.toLowerCase() === suggestion.toLowerCase()
    );
    setFilteredProducts(results);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0) {
        handleSuggestionClick(filteredSuggestions[selectedSuggestionIndex]);
      } else {
        const results = filteredProducts.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(results);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Reset search
  const handleResetSearch = () => {
    setSearchTerm("");
    setFilteredProducts(Array.isArray(products) ? products : []);
  };

  const renderStars = (rating: number) => {
    const safeRating = rating ?? 0;
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-lg ${
              i < fullStars
                ? "text-yellow-500"
                : i === fullStars && hasHalfStar
                ? "text-yellow-300"
                : "text-gray-300"
            }`}
          >
            {i < fullStars ? "★" : i === fullStars && hasHalfStar ? "★" : "☆"}
          </span>
        ))}
        <span className="ml-1 text-sm font-medium text-gray-600">
          {safeRating.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full p-4 md:p-6  min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
            <p className="text-gray-700 text-sm">
              Showing{" "}
              <span className="font-bold text-blue-600">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-gray-900">
                {allProductsCount}
              </span>{" "}
              products
            </p>
          </div>

          {searchTerm && (
            <button
              onClick={handleResetSearch}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white text-blue-600 hover:text-blue-800 rounded-lg border border-blue-100 hover:border-blue-200 transition-all duration-300 shadow-sm hover:shadow"
            >
              <span>✕</span>
              Clear search
            </button>
          )}
        </div>

        {/* Search + Sort Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search Field */}
          <div ref={searchRef} className="relative w-full sm:w-72">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Search products by name..."
                value={searchTerm}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full px-5 py-3.5 text-sm border-2 border-gray-200 rounded-2xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-white hover:border-gray-300"
              />
              {searchTerm && (
                <button
                  onClick={handleResetSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-200 rounded-2xl shadow-xl mt-2 z-20 max-h-72 overflow-y-auto backdrop-blur-sm bg-white/95">
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    type="button"
                    className={`w-full text-left px-5 py-3.5 hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 border-b border-gray-100 last:border-b-0 ${
                      index === selectedSuggestionIndex
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    } ${index === 0 ? "rounded-t-2xl" : ""} ${
                      index === filteredSuggestions.length - 1
                        ? "rounded-b-2xl"
                        : ""
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg">
                      <span className="text-blue-600 text-sm">🔍</span>
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 bg-white shadow-sm border-2 border-gray-100 px-4 py-2.5 rounded-2xl hover:shadow-md transition-all duration-300 w-full sm:w-auto hover:border-blue-100">
            <label
              htmlFor="sort-select"
              className="text-gray-700 text-sm font-semibold whitespace-nowrap flex items-center gap-2"
            >
              <span className="text-blue-600">↕️</span>
              Sort by:
            </label>

            <div className="relative w-full sm:w-56">
              <select
                id="sort-select"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none w-full px-4 py-2.5 pr-10 text-sm bg-transparent cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 font-medium text-gray-800"
              >
                <option value="newest" className="py-2">
                  🆕 New Arrivals
                </option>
                <option value="price-low" className="py-2">
                  ⬇️ Price: Low to High
                </option>
                <option value="price-high" className="py-2">
                  ⬆️ Price: High to Low
                </option>
                <option value="rating" className="py-2">
                  ⭐ Highest Rated
                </option>
              </select>

              <svg
                className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {!Array.isArray(filteredProducts) || filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-4xl">😔</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            {searchTerm
              ? "No products found for your search"
              : "No products available"}
          </h3>
          <p className="text-gray-500 text-base mb-6 max-w-md mx-auto">
            {searchTerm
              ? "Try a different search term or clear your search to see all products."
              : "Check back later for new arrivals!"}
          </p>
          {searchTerm && (
            <button
              onClick={handleResetSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Clear Search & Show All Products
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 ">
          {filteredProducts.map((item, index) => {
            const originalPrice = item.originalPrice || 0;
            const sellingPrice = item.price || 0;

            const discountPercent =
              originalPrice > sellingPrice && originalPrice > 0
                ? Math.round(
                    ((originalPrice - sellingPrice) / originalPrice) * 100
                  )
                : 0;

            if (!item) return null;

            const productId = item._id
              ? String(item._id)
              : item.id
              ? String(item.id)
              : `temp-${index}`;

            return (
              <Link
                key={productId}
                href={`/products/${productId}`}
                className="group"
              >
                <div className="rounded-3xl bg-white overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-100 transform hover:-translate-y-2 h-full flex flex-col">
                  {/* Image Container with Overlay Effects */}
                  <div className="relative w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name || "Product"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      priority={index < 4}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {item.isNew && (
                        <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
                          ✨ NEW ARRIVAL
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                          🔥 {discountPercent}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Brand & Name */}
                    <div className="mb-3">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                        {item.brand || "PREMIUM BRAND"}
                      </p>
                      <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-2">
                        {item.name || "Product Name"}
                      </h3>
                    </div>

                    {/* Rating */}
                    <div className="mb-4 text-gray-700">
                      <div className="text-sm font-medium mr-2 flex items-center">
                        <span className="mr-2">{renderStars(item.rating || 0)}</span>
                        <span>/5</span>
                      </div>
                      <p className="text-xs text-gray-700 mt-1">
                        Based on customer reviews
                      </p>
                    </div>

                    {/* Colors */}
                    {Array.isArray(item.colors) && item.colors.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-2 font-medium">
                          Available Colors:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {item.colors.map((color) => (
                            <span
                              key={color}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-gray-200 transition-colors"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Section */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              Rs. {(item.price || 0).toLocaleString("en-IN")}
                            </span>
                            {originalPrice > sellingPrice && (
                              <span className="text-sm text-gray-400 line-through">
                                Rs.{" "}
                                {(originalPrice || 0).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          {discountPercent > 0 && (
                            <p className="text-sm text-green-600 font-semibold mt-1">
                              You save Rs.{" "}
                              {(originalPrice - sellingPrice).toLocaleString(
                                "en-IN"
                              )}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Gender Tags */}
                      {Array.isArray(item.gender) && item.gender.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {item.gender.map((g) => (
                            <span
                              key={g}
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                g.toLowerCase() === "men"
                                  ? "bg-blue-100 text-blue-700"
                                  : g.toLowerCase() === "women"
                                  ? "bg-pink-100 text-pink-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {g} 👕
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
