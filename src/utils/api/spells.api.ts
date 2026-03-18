import { fetchData } from "./api";


// Spell Type definition based on your backend schema
export interface SpellType {
  _id: string;
  type: string;
  description: string;
  idealFor: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SpellTypeResponse {
  success: boolean;
  count?: number;
  data?: SpellType[];
  message?: string;
}

// Icon mapping for display
export const iconEmojiMap: Record<string, string> = {
  "fa-heart": "💖",
  "fa-star": "⭐",
  "fa-moon": "🌙",
  "fa-sun": "☀️",
  "fa-fire": "🔥",
  "fa-water": "💧",
  "fa-leaf": "🌿",
  "fa-crystal": "💎",
  "fa-feather": "🪶",
  "fa-candle": "🕯️",
  "fa-skull": "💀",
  "fa-dragon": "🐉",
  "fa-owl": "🦉",
  "fa-wolf": "🐺",
  "fa-tree": "🌳",
  default: "✨",
};

// Spell type categories for filtering/display
export const spellTypeCategories = [
  "Love Spells",
  "Money & Abundance Spells",
  "Protection Spells",
  "Healing Spells",
  "Manifestation Spells",
  "Banishing Spells",
  "Success & Career Spells",
];

export const spellsAPI = {
  /**
   * Get all spell types
   * GET /api/spell-types
   */
  getAllSpellTypes: async (): Promise<SpellType[]> => {
    try {
      const response = await fetchData<SpellTypeResponse>("/spell-types");

      if (response.success && response.data && Array.isArray(response.data)) {
        return response.data;
      }

      // Agar response directly array ho
      if (Array.isArray(response)) {
        return response;
      }

      return [];
    } catch (error) {
      console.error("Error fetching spell types:", error);
      return [];
    }
  },

  /**
   * Get spell type by ID
   * GET /api/spell-types/:id
   */
  getSpellTypeById: async (id: string): Promise<SpellType | null> => {
    try {
      const response = await fetchData<SpellTypeResponse>(`/spell-types/${id}`);

      if (response.success && response.data && !Array.isArray(response.data)) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching spell type ${id}:`, error);
      return null;
    }
  },

  /**
   * Get icon emoji from icon value
   */
  getIconEmoji: (iconValue: string): string => {
    return iconEmojiMap[iconValue] || iconEmojiMap.default;
  },
};
