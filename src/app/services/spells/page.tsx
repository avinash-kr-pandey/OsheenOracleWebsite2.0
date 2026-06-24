// app/services/spells/page.tsx
"use client";

import { iconEmojiMap, spellsAPI, SpellType } from "@/utils/api/spells.api";
import React, { useState, useEffect } from "react";

// Loading Skeleton Component
const HealingSkeleton = () => (
  <div className="animate-pulse">
    {/* Hero Section Skeleton */}
    <div className="text-center mb-16">
      <div className="h-16 bg-purple-200 rounded w-64 mx-auto mb-6"></div>
      <div className="w-24 h-1 bg-purple-200 mx-auto"></div>
    </div>

    {/* What is energy healing? Section Skeleton */}
    <div className="bg-white/50 rounded-3xl p-8 md:p-12 mb-16">
      <div className="h-10 bg-purple-200 rounded w-96 mx-auto mb-6"></div>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  </div>
);

const EnergyHealingPage = () => {
  const [healingTypes, setHealingTypes] = useState<SpellType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealingTypes = async () => {
      try {
        setLoading(true);
        const data = await spellsAPI.getAllSpellTypes();
        setHealingTypes(data);
      } catch (err) {
        setError("Failed to load energy healing types");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealingTypes();
  }, []);

  // Group healing types by category based on their type field
  const getHealingByCategory = (category: string) => {
    return healingTypes.filter(
      (item) =>
        item.type
          .toLowerCase()
          .includes(category.toLowerCase().replace(" healing", "")) ||
        item.type.toLowerCase().includes(category.toLowerCase())
    );
  };

  // Get icon for healing
  const getHealingIcon = (icon: string): string => {
    return iconEmojiMap[icon] || iconEmojiMap.default;
  };

  if (error) {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pt-24 pb-20"
        style={{
          background:
            "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white/50 rounded-3xl">
            <p className="text-red-600 text-xl">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pt-24 pb-20"
      style={{
        background:
          "linear-gradient(to bottom, #FBB5E7 0%, #FBB5E7 20%, #C4F9FF 100%)",
      }}
    >
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-900 mb-6 uppercase tracking-wider">
            Energy Healing
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto mb-8"></div>
        </div>

        {loading ? (
          <HealingSkeleton />
        ) : (
          <>
            {/* What is Energy Healing Section */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16 border border-purple-100">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-6 text-center">
                What Is Energy Healing?
              </h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p className="text-xl font-semibold text-pink-600 text-center mb-8">
                  Energy Healing Is Pure, Divine, and Transformative
                </p>
                <p>
                  Energy healing is a holistic practice that clears blockages, balances energy centers, 
                  and aligns your aura with the flow of the universe. It is rooted in love, light, 
                  compassion, and divine intentions.
                </p>
                <p className="bg-purple-50 border-l-4 border-purple-500 pl-6 py-4 italic">
                  When performed with spiritual awareness and alignment, energy healing can revitalize 
                  your spirit and manifest profound shifts in your physical and emotional reality.
                </p>
                <p>
                  Our sessions are designed to redirect flow of positive energy towards specific areas 
                  of your life like relationships, health, or career. Using sacred tools like crystals, 
                  guided intent, affirmations, and distance reiki energy, we co-create a powerful 
                  shield and grid of high-vibration light for you.
                </p>
                <p>
                  At its core, energy healing shifts your personal vibration so you naturally attract 
                  what your soul is calling in — love, healing, success, clarity, or protection.
                </p>
              </div>
            </div>

            {/* What Makes Energy Healing Powerful? */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl shadow-2xl p-8 md:p-12 mb-16 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                What Makes Energy Healing Powerful?
              </h2>
              <p className="text-xl text-center mb-12 opacity-90">
                Healing becomes powerful when three key spiritual pillars align:
              </p>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Clarity of Intention",
                    description:
                      "Knowing exactly what areas of your life require alignment and openness",
                  },
                  {
                    title: "Emotional Receptivity",
                    description:
                      "Being open to receive divine light with faith, peace, and absolute presence",
                  },
                  {
                    title: "Spiritual Alignment",
                    description:
                      "Connecting with universal energy grids and guides to elevate your vibration",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="text-center bg-white/10 rounded-2xl p-6 backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="opacity-90">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Types of Energy Healing */}
            <div className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-12 text-center">
                Spiritual Energy Modalities
              </h2>

              {/* Distant blockages Card - Static */}
              <div className="bg-gray-800 text-white rounded-3xl shadow-2xl p-8 md:p-10 mb-8 border-2 border-red-500">
                <div className="flex items-center mb-6">
                  <div className="w-3 h-8 bg-red-500 rounded-full mr-4"></div>
                  <h3 className="text-2xl md:text-3xl font-bold text-red-400">
                    Lower Vibration Risks (Negative Intended Energies)
                  </h3>
                </div>
                <p className="text-lg mb-6 opacity-90">
                  Manipulative energetic work aimed at overriding another person&apos;s free will or 
                  casting harmful projections is ethically detrimental and causes long-term energetic blockages. 
                  True healing works purely in light and never uses control.
                </p>

                <div className="bg-gray-700/50 rounded-2xl p-6 mb-6">
                  <h4 className="text-xl font-bold text-red-300 mb-4">
                    Forms of energetic interference include:
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Forceful attachment cords",
                      "Negative energetic blocks or projections",
                      "Psychic manipulation or auric drains",
                      "Interfering with someone else&apos;s spiritual path",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-400 mr-3">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-900/30 border border-red-700 rounded-2xl p-6">
                  <p className="text-xl font-bold text-center">
                    ⚠️ At Osheen Oracle, we only practice pure, light-based energy healing. 
                    We do not engage in any controlling, harmful, or manipulative practices under any circumstances.
                  </p>
                </div>
              </div>

              {/* Divine Light Healing Card - Dynamic from API */}
              {healingTypes.length > 0 ? (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-blue-300">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-8 bg-blue-500 rounded-full mr-4"></div>
                    <h3 className="text-2xl md:text-3xl font-bold text-blue-600">
                      Light Modalities (Positive Healing Energies)
                    </h3>
                  </div>
                  <p className="text-lg mb-6 text-gray-700">
                    Positive energy healing focuses on aura expansion, chakra balancing, alignment with 
                    higher intelligence, protection, and manifesting light.
                  </p>

                  <div className="bg-white/50 rounded-2xl p-6">
                    <h4 className="text-xl font-bold text-blue-600 mb-4">
                      Energy healing brings harmony and supports your path by:
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {healingTypes.slice(0, 5).map((item, index) => (
                        <div
                          key={item._id}
                          className="flex items-center bg-white/70 rounded-xl p-4"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-blue-600 text-sm">
                              {getHealingIcon(item.icon)}
                            </span>
                          </div>
                          <span className="text-gray-700 font-medium">
                            {item.type.replace(/spells/gi, "healing")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <p className="text-center mt-6 text-blue-600 font-semibold text-lg">
                    Every healing process is sacred, gentle, and guided by universal love.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-3xl shadow-2xl p-8 md:p-10 border-2 border-blue-300">
                  <p className="text-center text-gray-600">
                    Loading energy healing modalities...
                  </p>
                </div>
              )}
            </div>

            {/* Healing we do at Osheen Oracle */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-16 border border-purple-100">
              <h2 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4 text-center">
                Energy Healing We Perform
              </h2>
              <p className="text-xl text-gray-600 text-center mb-12">
                Different Modalities and Sessions
              </p>

              <p className="text-lg text-gray-700 mb-12 text-center leading-relaxed">
                We design energy healing sessions tailored to balance your emotions and clear blockages. 
                Here is a summary of the powerful energy sessions we offer at Osheen Oracle:
              </p>

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                    <div
                      key={n}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 animate-pulse"
                    >
                      <div className="h-8 bg-purple-200 rounded w-3/4 mb-4"></div>
                      <div className="space-y-2 mb-4">
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                      <div className="bg-white/50 rounded-xl p-4">
                        <div className="h-4 bg-purple-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : healingTypes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {healingTypes.map((item, index) => (
                    <div
                      key={item._id}
                      className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center mb-4">
                        <div className="text-2xl mr-3">
                          {getHealingIcon(item.icon)}
                        </div>
                        <h3 className="text-xl font-bold text-purple-800">
                          {item.type.replace(/spells/gi, "Healing")}
                        </h3>
                      </div>
                      <p className="text-gray-700 mb-4 text-sm leading-relaxed whitespace-pre-wrap">
                        {item.description.replace(/spell/gi, "healing")}
                      </p>
                      <div className="bg-white/50 rounded-xl p-4">
                        <h4 className="font-semibold text-purple-700 text-sm mb-2">
                          Ideal for:
                        </h4>
                        <p className="text-gray-600 text-sm">
                          {item.idealFor}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No healing modalities available at the moment.
                </p>
              )}
            </div>

            {/* Final Note */}
            <div className="text-center mb-16">
              <p className="text-2xl md:text-3xl font-bold text-purple-900 mb-6 italic">
                Every Session Is Unique
              </p>
              <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
                At Osheen Oracle, every energy healing session is customized, 
                ethically guided, and rooted in pure light. Real healing is not 
                about control — it is about intention, alignment, and letting 
                positive universal flow run through your life.
              </p>
            </div>

            {/* Rules Section - Static */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 rounded-3xl shadow-2xl p-8 md:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Rules You Must Follow During the Healing Period
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  "Do not discuss your healing details with others",
                  "Strictly no non-veg foods or alcohol during the session period",
                  "Release negative thoughts and maintain a high vibration of faith",
                  "Actively behave and manifest as if the healing is already complete",
                ].map((rule, index) => (
                  <div
                    key={index}
                    className="bg-white/20 rounded-2xl p-6 backdrop-blur-sm border border-white/30"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mr-4">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <p className="font-semibold text-lg">{rule}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-red-500/20 border-2 border-red-400 rounded-2xl p-6 text-center">
                <p className="text-xl font-bold">
                  ⚠️ If any guidelines are broken, the healing energy alignment may be disrupted. 
                  Maintaining focus and purity is essential for the vibration to take hold.
                </p>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default EnergyHealingPage;
