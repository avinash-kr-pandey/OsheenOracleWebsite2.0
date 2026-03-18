import { fetchData } from "./api";

// Reading Service Types based on backend
export interface ReadingService {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReadingServiceResponse {
  success: boolean;
  count?: number;
  data?: ReadingService[];
  message?: string;
}

// Category mapping for theme colors
export const categoryThemeMap: Record<string, string> = {
  "Tarot Reading": "purple",
  "Love Reading": "pink",
  "Career Reading": "blue",
  "Life Reading": "gold",
  "Horoscope Reading": "green",
  "Palm Reading": "purple",
  "Numerology Reading": "pink",
  "Astrology Reading": "blue",
  "Vastu Reading": "gold",
  Other: "green",
};

export const readingAPI = {
  /**
   * Get all reading services
   * GET /api/reading-services
   */
  getAllServices: async (): Promise<ReadingService[]> => {
    try {
      const response =
        await fetchData<ReadingServiceResponse>("/reading-services");

      if (response.success && response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // Agar response directly array ho
      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error("Error fetching reading services:", error);
      return [];
    }
  },

  /**
   * Get reading service by ID
   * GET /api/reading-services/:id
   */
  getServiceById: async (id: string): Promise<ReadingService | null> => {
    try {
      const response = await fetchData<ReadingServiceResponse>(
        `/reading-services/${id}`,
      );

      if (response.success && response.data && !Array.isArray(response.data)) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching service ${id}:`, error);
      return null;
    }
  },

  /**
   * Get services by category
   */
  getServicesByCategory: async (
    category: string,
  ): Promise<ReadingService[]> => {
    try {
      const allServices = await readingAPI.getAllServices();
      return allServices.filter(
        (service) =>
          service.category.toLowerCase() === category.toLowerCase() &&
          service.isActive,
      );
    } catch (error) {
      console.error(`Error fetching services by category ${category}:`, error);
      return [];
    }
  },

  /**
   * Get active services only
   */
  getActiveServices: async (): Promise<ReadingService[]> => {
    try {
      const allServices = await readingAPI.getAllServices();
      return allServices.filter((service) => service.isActive);
    } catch (error) {
      console.error("Error fetching active services:", error);
      return [];
    }
  },
};
