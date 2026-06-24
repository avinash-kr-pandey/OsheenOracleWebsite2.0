// src/utils/api/home.api.ts

import { fetchData } from "./api";

// ==================== TYPES ====================

export interface DiscoverItem {
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface DiscoverSection {
  osheenMaa: DiscoverItem;
  osheenOracle: DiscoverItem;
}

export interface DiscoverPath {
  _id?: string;
  title: string;
  description: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface AchievementImage {
  _id?: string;
  url: string;
  caption: string;
  order: number;
}

export interface AchievementsStats {
  yearsOfExperience: number;
  satisfiedClients: number;
  reviews: number;
  satisfactionRate: number;
}

export interface AchievementsSection {
  title: string;
  description: string;
  images: AchievementImage[];
  stats: AchievementsStats;
}

export interface MediaSpotlight {
  _id?: string;
  title: string;
  image: string;
  logo: string;
  link: string;
  order: number;
  isActive: boolean;
}

// ==================== CATALOGUE TYPES (Updated to match backend) ====================

export interface CatalogueItem {
  _id?: string;
  id: number;
  name: string;
  price: string;
  rating: number;
  date: string;
  image: string;
  description: string;
  traits: string[];
  element: string;
  planet: string;
  symbol: string;
  luckyColor: string;
  luckyNumber: number;
  compatibility: string[];
  benefits: string[];
  readingIncludes: string[];
  strengths: string[];
  challenges: string[];
  order: number;
  isActive: boolean;
}

export type Catalogue = CatalogueItem[];

// ==================== EXPERT GUIDE TYPES ====================

export interface ExpertGuide {
  _id?: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  satisfactionRate: number;
  expertise: string;
  experience: string;
  languages: string[];
  expertiseAreas: string[];
  isVerified: boolean;
  stats: {
    professionalExperience: string;
    satisfiedClients: string;
  };
  order: number;
  isActive: boolean;
}

// ==================== HOME DATA TYPES ====================

export interface HomeData {
  discoverSection: DiscoverSection;
  discoverYourPath: DiscoverPath[];
  achievements: AchievementsSection;
  mediaSpotlight: MediaSpotlight[];
  catalogue: Catalogue;
  expertGuides: ExpertGuide[];
}

export interface HomeApiResponse {
  success: boolean;
  message?: string;
  data: HomeData;
  error?: string;
}

// ==================== DEFAULT DATA ====================

export const DEFAULT_DISCOVER_SECTION: DiscoverSection = {
  osheenMaa: {
    title: "Osheen MAA",
    description:
      "Amarpreet Osheen Kaur, fondly called Osheen ma is a Spiritual Mentor, Healer, Tarot reader, aura reader, relationship counselor, motivation speaker, astrologer, Reiki master and white energy healer with an experience of more than 10 years in the study of field of Divination, spirituality, alternative healing modalities and creating magic. She was been given the title of No.1 tarot reader in India.",
    image: "/assets/youaremagic.jpg",
    link: "/osheen-maa",
  },
  osheenOracle: {
    title: "Osheen Oracle",
    description:
      "We are highly delighted to see you here at Osheen Oracle, which is 4 time consecutively awarded as No.1 tarot reading platform in India. Osheen Oracle is one stop solution for a comprehensive healing journey where you will find guidance to heal your life in all aspects of love, relationship, mental well-being, career success, business success and for every issue you must be facing today alone as we are here to help.",
    image: "/assets/youaremagic.jpg",
    link: "/osheen-oracle",
  },
};

export const DEFAULT_DISCOVER_PATHS: DiscoverPath[] = [
  {
    _id: "1",
    title: "Natal Chart Readings",
    description:
      "We generate your natal chart and interpret the positions of the planets, signs, and houses to give you insights into your personality, strengths, weaknesses, and life path.",
    image: "/assets/image-1.jpg",
    order: 1,
    isActive: true,
  },
  {
    _id: "2",
    title: "Compatibility Readings",
    description:
      "We can analyze the compatibility between two individuals by comparing their natal charts. This can help people understand their relationships with partners, friends, or family members better.",
    image: "/assets/image-2.jpg",
    order: 2,
    isActive: true,
  },
  {
    _id: "3",
    title: "Progression Readings",
    description:
      "We provide insights into upcoming planetary transits and progressions that may influence your life events and experiences. It can be useful for timing significant decisions or life changes.",
    image: "/assets/image-3.jpg",
    order: 3,
    isActive: true,
  },
];

export const DEFAULT_ACHIEVEMENTS: AchievementsSection = {
  title: "Achievements",
  description:
    "Over the years, our students and faculty have achieved remarkable milestones. From national-level competitions to innovative projects, we take pride in nurturing talent and fostering excellence. Our platform has consistently enabled learners to showcase their skills, earn awards, and grow into leaders in their fields.",
  images: [
    { url: "/assets/Achievements.jpg", caption: "Achievement 1", order: 0 },
    { url: "/assets/Achievements-1.jpeg", caption: "Achievement 2", order: 1 },
    { url: "/assets/Achievements-2.jpeg", caption: "Achievement 3", order: 2 },
  ],
  stats: {
    yearsOfExperience: 15,
    satisfiedClients: 4200,
    reviews: 892,
    satisfactionRate: 92,
  },
};

export const DEFAULT_MEDIA_SPOTLIGHT: MediaSpotlight[] = [
  {
    _id: "1",
    title: "ZEE NEWS",
    logo: "/media/zeenews.png",
    image: "/media/img-1.png",
    link: "https://zeenews.india.com/india/top-5-best-tarot-card-readers-of-2024-2026-2808723.html",
    order: 1,
    isActive: true,
  },
  {
    _id: "2",
    title: "ABP न्यूज़",
    logo: "/media/abp.png",
    image: "/media/img-2.png",
    link: "https://news.abplive.com/brand-wire/top-5-best-astrologers-in-india-2024-2025-1739419",
    order: 2,
    isActive: true,
  },
  {
    _id: "3",
    title: "FEMINA",
    logo: "/media/femina.png",
    image: "/media/img-3.jpg",
    link: "https://www.femina.in/trending/achievers/eight-extraordinary-individuals-stories-of-success-and-impact-285335.html",
    order: 3,
    isActive: true,
  },
  {
    _id: "4",
    title: "TEDx",
    logo: "/media/tde.png",
    image: "/media/img-4.png",
    link: "https://youtu.be/ef4QUwvJnEE?si=dDXvy2wLvz-t1Dti",
    order: 4,
    isActive: true,
  },
];

// Updated DEFAULT_CATALOGUE to match the new CatalogueItem structure
export const DEFAULT_CATALOGUE: Catalogue = [
  {
    _id: "1",
    id: 1,
    name: "Angel Card Reading",
    price: "599",
    rating: 4.5,
    date: "",
    image: "/images/resize3.jpg",
    description:
      "Receive gentle divine guidance filled with love, clarity, and healing messages from the angelic realm.",
    traits: ["Guidance", "Healing", "Clarity", "Hope", "Light"],
    element: "",
    planet: "",
    symbol: "",
    luckyColor: "",
    luckyNumber: 0,
    compatibility: [],
    benefits: [
      "Connect with your guardian angels",
      "Receive messages of hope and direction",
      "Gain emotional clarity and reassurance",
    ],
    readingIncludes: [
      "Personalized card reading",
      "Spiritual guidance",
      "Healing and clarity messages",
    ],
    strengths: ["Compassion", "Intuition", "Sensitivity"],
    challenges: ["Overthinking", "Self-doubt"],
    order: 1,
    isActive: true,
  },
  {
    _id: "2",
    id: 2,
    name: "On Call Consultation",
    price: "799",
    rating: 4.7,
    date: "",
    image: "/images/withcandle.png",
    description:
      "One-on-one spiritual consultation to bring clarity, healing, and solutions from the comfort of your home.",
    traits: ["Clarity", "Support", "Healing", "Guidance"],
    element: "",
    planet: "",
    symbol: "",
    luckyColor: "",
    luckyNumber: 0,
    compatibility: [],
    benefits: [
      "Instant guidance on personal issues",
      "Emotional support and clarity",
      "Practical spiritual solutions",
    ],
    readingIncludes: [
      "Personal consultation",
      "Healing techniques",
      "Guidance for challenges",
    ],
    strengths: ["Empathy", "Problem-solving", "Insight"],
    challenges: ["Overthinking", "Dependence"],
    order: 2,
    isActive: true,
  },
  {
    _id: "3",
    id: 3,
    name: "Tarot Reading & Guidance",
    price: "699",
    rating: 4.6,
    date: "",
    image: "/images/aboutglobe.png",
    description:
      "Soulful tarot sessions offering insight, balance, and direction for love, career, and life decisions.",
    traits: ["Insight", "Balance", "Intuition", "Clarity"],
    element: "",
    planet: "",
    symbol: "",
    luckyColor: "",
    luckyNumber: 0,
    compatibility: [],
    benefits: [
      "Understand hidden opportunities",
      "Gain clarity on decisions",
      "Receive balanced guidance for life paths",
    ],
    readingIncludes: [
      "Tarot card reading",
      "Life guidance",
      "Career & relationship insight",
    ],
    strengths: ["Intuition", "Clarity", "Decision-making"],
    challenges: ["Confusion", "Overanalyzing"],
    order: 3,
    isActive: true,
  },
  {
    _id: "4",
    id: 4,
    name: "Relationship Energy Healing",
    price: "899",
    rating: 4.8,
    date: "",
    image: "/images/card-hh.jpg",
    description:
      "Healing rituals to restore love, harmony, trust, and emotional balance in relationships.",
    traits: ["Healing", "Love", "Harmony", "Trust"],
    element: "",
    planet: "",
    symbol: "",
    luckyColor: "",
    luckyNumber: 0,
    compatibility: [],
    benefits: [
      "Restore emotional balance",
      "Strengthen connections",
      "Attract love and understanding",
    ],
    readingIncludes: [
      "Relationship healing",
      "Trust rebuilding",
      "Emotional healing",
    ],
    strengths: ["Compassion", "Patience", "Love"],
    challenges: ["Past baggage", "Misunderstandings"],
    order: 4,
    isActive: true,
  },
  {
    _id: "5",
    id: 5,
    name: "Career Energy Healing",
    price: "799",
    rating: 4.4,
    date: "",
    image: "/images/resize-gallery2.jpg",
    description:
      "Energy work to remove obstacles, boost confidence, and attract growth and success in career.",
    traits: ["Confidence", "Focus", "Abundance", "Motivation"],
    element: "",
    planet: "",
    symbol: "",
    luckyColor: "",
    luckyNumber: 0,
    compatibility: [],
    benefits: [
      "Overcome professional blockages",
      "Enhance focus and motivation",
      "Attract career opportunities and growth",
    ],
    readingIncludes: ["Career healing", "Motivation boost", "Growth alignment"],
    strengths: ["Ambition", "Focus", "Energy"],
    challenges: ["Stress", "Doubt"],
    order: 5,
    isActive: true,
  },
  {
    _id: "6",
    id: 6,
    name: "Energy Healing Jars for Success",
    price: "699",
    rating: 4.3,
    date: "",
    image: "/images/spellJars/img-8.jpg",
    description:
      "Handcrafted healing jars infused with crystals and intentions to attract abundance and opportunities.",
    traits: ["Manifestation", "Abundance", "Success", "Energy"],
    element: "",
    planet: "",
    symbol: "",
    luckyColor: "",
    luckyNumber: 0,
    compatibility: [],
    benefits: [
      "Attract success and opportunities",
      "Boost confidence",
      "Align energy with goals",
    ],
    readingIncludes: [
      "Healing jar creation",
      "Intention setting",
      "Energy alignment",
    ],
    strengths: ["Manifestation", "Positivity", "Focus"],
    challenges: ["Negativity", "Distractions"],
    order: 6,
    isActive: true,
  },
  {
    _id: "7",
    id: 7,
    name: "Reiki Healing Sessions",
    price: "999",
    rating: 4.9,
    date: "",
    image: "/images/resize-gallery2.jpg",
    description:
      "Energy healing sessions to release blockages and restore peace to mind, body, and soul.",
    traits: ["Healing", "Energy", "Peace", "Balance"],
    element: "",
    planet: "",
    symbol: "",
    luckyColor: "",
    luckyNumber: 0,
    compatibility: [],
    benefits: [
      "Release emotional blockages",
      "Restore harmony",
      "Enhance spiritual well-being",
    ],
    readingIncludes: [
      "Hands-on or distance Reiki",
      "Energy balancing",
      "Spiritual alignment",
    ],
    strengths: ["Calmness", "Healing", "Focus"],
    challenges: ["Emotional fatigue", "Resistance"],
    order: 7,
    isActive: true,
  },
];

export const DEFAULT_EXPERT_GUIDES: ExpertGuide[] = [
  {
    _id: "1",
    name: "Dr. Amarpreet Osheen Kaur",
    image: "/assets/expert-1.jpg",
    rating: 4.8,
    reviews: 892,
    satisfactionRate: 92,
    expertise:
      "Expert in numerology and KP astrology system with 15+ years of experience. Specializing in accurate predictions and practical solutions for life challenges.",
    experience: "15+ years",
    languages: ["Hindi", "Tamil", "English", "Telugu"],
    expertiseAreas: [
      "Marriage Compatibility",
      "Business Growth",
      "Health Issues",
      "Legal Matters",
      "Name Correction",
      "Lucky Number Guidance",
    ],
    isVerified: true,
    stats: {
      professionalExperience: "15+ years",
      satisfiedClients: "4200+",
    },
    order: 1,
    isActive: true,
  },
];

// ==================== PUBLIC API FUNCTIONS ====================

/**
 * Get complete home page data for website
 * Returns default data if API fails
 */
export const getHomeData = async (): Promise<HomeData> => {
  try {
    console.log("🏠 Fetching home page data...");
    const response = await fetchData<HomeApiResponse>("/home");

    if (response.success && response.data) {
      console.log("✅ Home data fetched successfully");
      return response.data;
    }

    console.warn("⚠️ Invalid home data response, using default data");
    return getDefaultHomeData();
  } catch (error) {
    console.error("❌ Error fetching home data, using default data:", error);
    return getDefaultHomeData();
  }
};

/**
 * Get default home data (fallback)
 */
export const getDefaultHomeData = (): HomeData => {
  return {
    discoverSection: DEFAULT_DISCOVER_SECTION,
    discoverYourPath: DEFAULT_DISCOVER_PATHS,
    achievements: DEFAULT_ACHIEVEMENTS,
    mediaSpotlight: DEFAULT_MEDIA_SPOTLIGHT,
    catalogue: DEFAULT_CATALOGUE,
    expertGuides: DEFAULT_EXPERT_GUIDES,
  };
};

/**
 * Get discover section only
 */
export const getDiscoverSection = async (): Promise<DiscoverSection> => {
  try {
    const data = await getHomeData();
    return data.discoverSection;
  } catch (error) {
    console.error("Error fetching discover section, using default:", error);
    return DEFAULT_DISCOVER_SECTION;
  }
};

/**
 * Get discover your path items only
 */
export const getDiscoverYourPath = async (): Promise<DiscoverPath[]> => {
  try {
    const data = await getHomeData();
    return data.discoverYourPath.filter((item) => item.isActive);
  } catch (error) {
    console.error("Error fetching discover your path, using default:", error);
    return DEFAULT_DISCOVER_PATHS;
  }
};

/**
 * Get achievements section only
 */
export const getAchievements = async (): Promise<AchievementsSection> => {
  try {
    const data = await getHomeData();
    return data.achievements;
  } catch (error) {
    console.error("Error fetching achievements, using default:", error);
    return DEFAULT_ACHIEVEMENTS;
  }
};

/**
 * Get media spotlight items only
 */
export const getMediaSpotlight = async (): Promise<MediaSpotlight[]> => {
  try {
    const data = await getHomeData();
    return data.mediaSpotlight.filter((item) => item.isActive);
  } catch (error) {
    console.error("Error fetching media spotlight, using default:", error);
    return DEFAULT_MEDIA_SPOTLIGHT;
  }
};

/**
 * Get catalogue items only
 */
export const getCatalogue = async (): Promise<Catalogue> => {
  try {
    const data = await getHomeData();
    return data.catalogue.filter((item) => item.isActive);
  } catch (error) {
    console.error("Error fetching catalogue, using default:", error);
    return DEFAULT_CATALOGUE;
  }
};

/**
 * Get single catalogue item by ID
 */
export const getCatalogueById = async (
  id: string,
): Promise<CatalogueItem | null> => {
  try {
    const catalogue = await getCatalogue();
    const item = catalogue.find(
      (item) => item._id === id || String(item.id) === id,
    );
    return item || null;
  } catch (error) {
    console.error(`Error fetching catalogue item ${id}:`, error);
    const defaultItem = DEFAULT_CATALOGUE.find(
      (item) => item._id === id || String(item.id) === id,
    );
    return defaultItem || null;
  }
};

/**
 * Get expert guides only
 */
export const getExpertGuides = async (): Promise<ExpertGuide[]> => {
  try {
    const data = await getHomeData();
    return data.expertGuides.filter((guide) => guide.isActive);
  } catch (error) {
    console.error("Error fetching expert guides, using default:", error);
    return DEFAULT_EXPERT_GUIDES;
  }
};

/**
 * Get single expert guide by ID
 */
export const getExpertGuideById = async (
  id: string,
): Promise<ExpertGuide | null> => {
  try {
    const guides = await getExpertGuides();
    const guide = guides.find((item) => item._id === id);
    return guide || null;
  } catch (error) {
    console.error(`Error fetching expert guide ${id}:`, error);
    const defaultGuide = DEFAULT_EXPERT_GUIDES.find((item) => item._id === id);
    return defaultGuide || null;
  }
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Format price for display
 */
export const formatPrice = (price: string | number): string => {
  const numericPrice = typeof price === "string" ? parseInt(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericPrice);
};

/**
 * Format rating stars display
 */
export const formatRatingStars = (rating: number): string => {
  return "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
};

/**
 * Get star rating object for display
 */
export const getStarRating = (
  rating: number,
): { filled: number; half: boolean; empty: number } => {
  const filled = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - filled - (half ? 1 : 0);
  return { filled, half, empty };
};

/**
 * Get random items from array (for recommendations)
 */
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

// ==================== EXPORT ALL ====================

const homeAPI = {
  // Main functions
  getHomeData,
  getDefaultHomeData,
  getDiscoverSection,
  getDiscoverYourPath,
  getAchievements,
  getMediaSpotlight,
  getCatalogue,
  getCatalogueById,
  getExpertGuides,
  getExpertGuideById,

  // Helper functions
  formatPrice,
  formatRatingStars,
  getStarRating,
  getRandomItems,

  // Default data exports (for fallback)
  DEFAULT_DISCOVER_SECTION,
  DEFAULT_DISCOVER_PATHS,
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_MEDIA_SPOTLIGHT,
  DEFAULT_CATALOGUE,
  DEFAULT_EXPERT_GUIDES,
};

export default homeAPI;
