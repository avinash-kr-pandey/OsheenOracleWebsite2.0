import { deleteData, fetchData, postData, putData } from "./api";


export interface Zodiac {
  _id: string;
  name: string;
  nameHindi: string;
  symbol: string;
  icon: string;
  dates: string;
  datesHindi: string;
  element: string;
  elementHindi: string;
  createdAt?: string;
  updatedAt?: string;
}

export const zodiacAPI = {
  // Get all zodiac signs
  getAll: (): Promise<Zodiac[]> => {
    return fetchData<Zodiac[]>("/zodiacs");
  },

  // Get single zodiac by ID
  getById: (id: string): Promise<Zodiac> => {
    return fetchData<Zodiac>(`/zodiacs/${id}`);
  },

  // Create new zodiac (admin)
  create: (
    data: Omit<Zodiac, "_id" | "createdAt" | "updatedAt">,
  ): Promise<{ message: string; zodiac: Zodiac }> => {
    return postData("/zodiacs", data);
  },

  // Update zodiac (admin)
  update: (
    id: string,
    data: Partial<Zodiac>,
  ): Promise<{ message: string; zodiac: Zodiac }> => {
    return putData(`/zodiacs/${id}`, data);
  },

  // Delete zodiac (admin)
  delete: (id: string): Promise<{ message: string }> => {
    return deleteData(`/zodiacs/${id}`);
  },
};
