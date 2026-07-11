"use client";

import { horoscopeAPI, HoroscopePrediction } from "@/utils/api/horoscope.api";
import { Rishi, rishiAPI } from "@/utils/api/rishi.api";
import { Zodiac, zodiacAPI } from "@/utils/api/zodiac.api";
import React, { useState, useEffect, useCallback } from "react";

type TimeFrame = "weekly" | "monthly" | "yearly";
type Language = "english" | "hindi";
type ViewMode = "zodiacs" | "predictions";

const Horoscope = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] =
    useState<TimeFrame>("weekly");
  const [language, setLanguage] = useState<Language>("english");
  const [selectedZodiac, setSelectedZodiac] = useState<Zodiac | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("zodiacs");

  // Data states
  const [zodiacs, setZodiacs] = useState<Zodiac[]>([]);
  const [predictions, setPredictions] = useState<HoroscopePrediction[]>([]);
  const [rishis, setRishis] = useState<Rishi[]>([]);
  const [loading, setLoading] = useState({
    zodiacs: true,
    predictions: false,
    rishis: true,
  });

  // ✅ Function to render icon (image or emoji)
  const renderIcon = (
    icon: string,
    className: string = "w-12 h-12 object-contain mx-auto",
  ) => {
    if (!icon) return <span className="text-5xl">♈</span>;

    // Check if it's a base64 image or URL
    if (icon.startsWith("data:image") || icon.startsWith("http")) {
      return <img src={icon} alt="zodiac icon" className={className} />;
    }

    // It's an emoji or text symbol
    return <span className="text-5xl">{icon}</span>;
  };

  // Fetch zodiacs on mount
  useEffect(() => {
    setIsVisible(true);
    fetchZodiacs();
    fetchRishis();
  }, []);

  const fetchZodiacs = async () => {
    setLoading((prev) => ({ ...prev, zodiacs: true }));
    try {
      const zodiacData = await zodiacAPI.getAll();
      console.log("Zodiacs fetched:", zodiacData);
      setZodiacs(Array.isArray(zodiacData) ? zodiacData : []);
    } catch (err) {
      console.error("Error fetching zodiacs:", err);
    } finally {
      setLoading((prev) => ({ ...prev, zodiacs: false }));
    }
  };

  const fetchRishis = async () => {
    setLoading((prev) => ({ ...prev, rishis: true }));
    try {
      const rishiData = await rishiAPI.getAll();
      console.log("Rishis fetched:", rishiData);
      setRishis(Array.isArray(rishiData) ? rishiData : []);
    } catch (err) {
      console.error("Error fetching rishis:", err);
    } finally {
      setLoading((prev) => ({ ...prev, rishis: false }));
    }
  };

  // Fetch predictions when zodiac or timeframe changes
  const fetchPredictions = useCallback(async () => {
    if (!selectedZodiac) return;

    setLoading((prev) => ({ ...prev, predictions: true }));
    try {
      // ✅ Using getBySignAndTime for specific timeframe
      const prediction = await horoscopeAPI.getBySignAndTime(
        selectedZodiac.name,
        selectedTimeFrame,
      );

      // If prediction exists, show it, otherwise show message
      if (prediction && !Array.isArray(prediction)) {
        setPredictions([prediction]);
      } else {
        // Try to get all predictions for this sign
        const allPredictions = await horoscopeAPI.getBySign(
          selectedZodiac.name,
        );
        const predictionsArray = Array.isArray(allPredictions)
          ? allPredictions
          : [];
        const filtered = predictionsArray.filter(
          (p) => p.timeFrame === selectedTimeFrame,
        );
        setPredictions(filtered);
      }
    } catch (err) {
      console.error("Error fetching predictions:", err);
      setPredictions([]);
    } finally {
      setLoading((prev) => ({ ...prev, predictions: false }));
    }
  }, [selectedZodiac, selectedTimeFrame]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  const timeFrames = [
    { key: "weekly" as TimeFrame, en: "Weekly", hi: "साप्ताहिक" },
    { key: "monthly" as TimeFrame, en: "Monthly", hi: "मासिक" },
    { key: "yearly" as TimeFrame, en: "Yearly", hi: "वार्षिक" },
  ];

  // Match predictions with rishis
  const predictionsWithRishis = predictions.map((pred) => ({
    ...pred,
    rishiDetails: rishis.find(
      (r) => r.name?.toLowerCase() === pred.rishiName?.toLowerCase(),
    ),
  }));

  // Get element badge color
  const getElementBadgeColor = (element: string): string => {
    switch (element?.toLowerCase()) {
      case "fire":
        return "bg-red-100 text-red-700";
      case "earth":
        return "bg-green-100 text-green-700";
      case "air":
        return "bg-blue-100 text-blue-700";
      case "water":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get icon color
  const getIconColor = (element: string): string => {
    switch (element?.toLowerCase()) {
      case "fire":
        return "text-red-500";
      case "earth":
        return "text-green-500";
      case "air":
        return "text-blue-500";
      case "water":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  // Handle zodiac selection
  const handleZodiacSelect = (zodiac: Zodiac) => {
    setSelectedZodiac(zodiac);
    setViewMode("predictions");
  };

  // Handle back button
  const handleBack = () => {
    setViewMode("zodiacs");
    setSelectedZodiac(null);
    setPredictions([]);
  };

  return (
    <div
      className="min-h-screen pt-32 pb-16 px-4"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className={`text-4xl md:text-6xl font-bold font-heading text-purple-800 mb-4 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {language === "english" ? "Rashi Fal" : "राशि फल"}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {language === "english"
              ? "Discover your destiny with ancient wisdom"
              : "प्राचीन ज्ञान के साथ अपनी नियति की खोज करें"}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setLanguage("english")}
              className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                language === "english"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("hindi")}
              className={`px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
                language === "hindi"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {viewMode === "zodiacs" ? (
          /* Zodiac Signs Grid */
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-heading text-purple-700 mb-4">
                {language === "english"
                  ? "Choose Your Zodiac Sign"
                  : "अपनी राशि चुनें"}
              </h2>
              <p className="text-lg font-subheading text-gray-600 max-w-3xl mx-auto">
                {language === "english"
                  ? "Select your zodiac sign to discover personalized predictions"
                  : "व्यक्तिगत भविष्यवाणियों की खोज करने के लिए अपनी राशि चुनें"}
              </p>
            </div>

            {loading.zodiacs ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
              </div>
            ) : zodiacs.length === 0 ? (
              <div className="text-center py-12 bg-white/80 rounded-2xl">
                <p className="text-gray-600 text-lg">
                  No zodiac signs available
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {zodiacs.map((zodiac, index) => (
                  <div
                    key={zodiac._id}
                    onClick={() => handleZodiacSelect(zodiac)}
                    className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-purple-300">
                      {/* Zodiac Icon */}
                      <div className="h-16 flex items-center justify-center mb-3">
                        {renderIcon(zodiac.icon, "w-12 h-12 object-contain")}
                      </div>

                      {/* Zodiac Name */}
                      <h3 className="text-lg font-bold font-subheading text-center text-gray-800 mb-2">
                        {language === "english"
                          ? zodiac.name
                          : zodiac.nameHindi}
                      </h3>

                      {/* Dates */}
                      <p className="text-xs text-center text-gray-600 mb-2">
                        {language === "english"
                          ? zodiac.dates
                          : zodiac.datesHindi}
                      </p>

                      {/* Element */}
                      <div className="text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getElementBadgeColor(zodiac.element)}`}
                        >
                          {language === "english"
                            ? zodiac.element
                            : zodiac.elementHindi}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          /* Predictions View */
          <>
            {/* Back Button */}
            <div className="mb-8">
              <button
                onClick={handleBack}
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors duration-300 font-semibold cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                {language === "english"
                  ? "Back to Zodiac Signs"
                  : "राशियों पर वापस जाएं"}
              </button>
            </div>

            {/* Selected Zodiac Header */}
            {selectedZodiac && (
              <div className="text-center mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
                  <div className="flex items-center justify-center mb-4">
                    <div className="mr-4">
                      {renderIcon(
                        selectedZodiac.icon,
                        "w-16 h-16 object-contain",
                      )}
                    </div>
                    <div>
                      <h2 className="text-4xl font-bold font-heading text-purple-800">
                        {language === "english"
                          ? selectedZodiac.name
                          : selectedZodiac.nameHindi}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {language === "english"
                          ? selectedZodiac.dates
                          : selectedZodiac.datesHindi}
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getElementBadgeColor(selectedZodiac.element)}`}
                      >
                        {language === "english"
                          ? selectedZodiac.element
                          : selectedZodiac.elementHindi}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Time Frame Selector */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {timeFrames.map((timeFrame) => (
                <button
                  key={timeFrame.key}
                  onClick={() => setSelectedTimeFrame(timeFrame.key)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-500 transform cursor-pointer ${
                    selectedTimeFrame === timeFrame.key
                      ? "bg-purple-600 text-white shadow-lg scale-105"
                      : "bg-white text-purple-600 shadow-md hover:shadow-lg"
                  }`}
                >
                  {language === "english" ? timeFrame.en : timeFrame.hi}
                </button>
              ))}
            </div>

            {/* Loading State */}
            {loading.predictions && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
              </div>
            )}

            {/* No Data State */}
            {!loading.predictions &&
              predictions.length === 0 &&
              selectedZodiac && (
                <div className="text-center py-12 bg-white/80 rounded-2xl">
                  <div className="text-6xl mb-4">🔮</div>
                  <p className="text-gray-600 text-lg">
                    {language === "english"
                      ? `No ${selectedTimeFrame} predictions available for ${selectedZodiac.name} yet.`
                      : `${selectedZodiac.nameHindi} के लिए ${timeFrames.find((t) => t.key === selectedTimeFrame)?.hi} भविष्यवाणी उपलब्ध नहीं है।`}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    {language === "english"
                      ? "Please check back later for updates."
                      : "कृपया बाद में जांच करें।"}
                  </p>
                </div>
              )}

            {/* Predictions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {predictionsWithRishis.map((prediction, index) => (
                <div
                  key={prediction._id || index}
                  className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-2xl transition-all duration-700 transform hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {index + 1}
                    </div>
                    <h3 className="text-2xl font-bold font-heading text-purple-800">
                      {language === "english"
                        ? prediction.rishiName || "Ancient Sage"
                        : prediction.rishiNameHindi || "प्राचीन ऋषि"}
                    </h3>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-l-4 border-purple-400">
                    <p className="text-lg leading-relaxed font-subheading text-gray-700 whitespace-pre-line text-left">
                      {language === "english"
                        ? prediction.prediction
                        : prediction.predictionHindi || prediction.prediction}
                    </p>
                  </div>

                  {/* Date and TimeFrame */}
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                    <div className="flex gap-2">
                      {prediction.date && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {new Date(prediction.date).toLocaleDateString()}
                        </span>
                      )}
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full capitalize">
                        {language === "english"
                          ? prediction.timeFrame || selectedTimeFrame
                          : timeFrames.find(
                              (t) =>
                                t.key ===
                                (prediction.timeFrame || selectedTimeFrame),
                            )?.hi}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Decorative Elements */}
      <div className="fixed top-20 left-10 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-bounce"></div>
      <div className="fixed bottom-40 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-30 animate-pulse"></div>
      <div
        className="fixed top-1/3 right-1/4 w-12 h-12 bg-green-300 rounded-full opacity-25 animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>
  );
};

export default Horoscope;
