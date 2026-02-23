// services/about.api.ts

import { fetchData } from "@/utils/api/api";

/* =======================
   TYPES
======================= */

export interface Stat {
  _id?: string; // Optional _id for stats
  label: string;
  value: string;
}

export interface Section {
  _id?: string; // Optional _id for sections
  title: string;
  content: string;
  image?: string; // ✅ Added image field (base64 or URL)
}

export interface AboutData {
  _id?: string;
  heroTitle: string;
  heroDescription: string;
  mission: string;
  vision: string;
  stats: Stat[];
  sections: Section[]; // Now includes image field
  createdAt?: string;
  updatedAt?: string;
  __v?: number; // MongoDB version key
}

interface AboutResponse {
  success: boolean;
  data: AboutData;
}

/* =======================
   API - UPDATED VERSION
======================= */

export const aboutAPI = {
  getAbout: async (): Promise<AboutData | null> => {
    try {
      // ✅ noCache: false pass karo ya parameter hi hata do
      const response = await fetchData<AboutResponse>(
        "/about",
        undefined,
        false,
      );
      console.log("About API Response:", response);
      return response?.data ?? null;
    } catch (error) {
      console.error("About API Error:", error);
      return null;
    }
  },
};

export type { AboutData as AboutDataType };
