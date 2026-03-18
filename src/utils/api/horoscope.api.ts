import { fetchData } from "./api";


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
}

export const horoscopeAPI = {
  // Get all predictions for a sign
  getBySign: (sign: string): Promise<HoroscopePrediction[]> => {
    return fetchData<HoroscopePrediction[]>(`/horoscope/${sign}`);
  },

  // Get prediction for sign + time frame
  getBySignAndTime: (
    sign: string,
    time: string,
  ): Promise<HoroscopePrediction> => {
    return fetchData<HoroscopePrediction>(`/horoscope/${sign}/${time}`);
  },
};
