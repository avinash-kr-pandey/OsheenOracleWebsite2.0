import { fetchData } from "./api";


export interface Rishi {
  _id: string;
  name: string;
  nameHindi?: string;
  biography: string;
  biographyHindi?: string;
  era: string;
  eraHindi?: string;
}

export const rishiAPI = {
  // Get all rishis
  getAll: (): Promise<Rishi[]> => {
    return fetchData<Rishi[]>("/rishis");
  },
};
