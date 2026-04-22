import { fetchData, postData, putData, deleteData } from "./api";

export interface HoroscopePrediction {
  _id: string;
  zodiacSign: string;
  zodiacSignHindi?: string;
  rishiName?: string;
  rishiNameHindi?: string;
  date: string;
  prediction: string;
  predictionHindi?: string;
  timeFrame: "daily" | "weekly" | "monthly" | "yearly";
  createdAt?: string;
  updatedAt?: string;
}

export interface HoroscopeCreateResponse {
  message: string;
  item: HoroscopePrediction;
}

export interface HoroscopeUpdateResponse {
  message: string;
  item: HoroscopePrediction;
}

export interface DeleteResponse {
  message: string;
}

export const horoscopeAPI = {
  // ✅ GET /api/horoscope - Get all horoscopes (NEW - after backend fix)
  getAll: (): Promise<HoroscopePrediction[]> => {
    return fetchData<HoroscopePrediction[]>("/horoscope");
  },

  // ✅ GET /api/horoscope/{sign} - Get horoscopes by zodiac sign
  getBySign: (sign: string): Promise<HoroscopePrediction[]> => {
    return fetchData<HoroscopePrediction[]>(`/horoscope/${sign}`);
  },

  // ✅ GET /api/horoscope/{sign}/{time} - Get horoscope by sign + time frame
  getBySignAndTime: (
    sign: string,
    time: string,
  ): Promise<HoroscopePrediction> => {
    return fetchData<HoroscopePrediction>(`/horoscope/${sign}/${time}`);
  },

  // ✅ POST /api/horoscope - Create new horoscope
  create: (
    data: Omit<HoroscopePrediction, "_id" | "createdAt" | "updatedAt">,
  ): Promise<HoroscopeCreateResponse> => {
    return postData<HoroscopeCreateResponse>("/horoscope", data);
  },

  // ✅ PUT /api/horoscope/{id} - Update horoscope (NEW)
  update: (
    id: string,
    data: Partial<HoroscopePrediction>,
  ): Promise<HoroscopeUpdateResponse> => {
    return putData<HoroscopeUpdateResponse>(`/horoscope/${id}`, data);
  },

  // ✅ DELETE /api/horoscope/{id} - Delete horoscope (NEW)
  delete: (id: string): Promise<DeleteResponse> => {
    return deleteData<DeleteResponse>(`/horoscope/${id}`);
  },
};
