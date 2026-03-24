// src/utils/api/becomeamember.api.ts

import { postData, fetchData } from "./api";

// Types
export interface MembershipFormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  plan: string;
  newsletter: boolean;
}

export interface MembershipPlan {
  _id?: string;
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  isActive?: boolean;
  order?: number;
}

export interface Benefit {
  _id?: string;
  icon: string;
  title: string;
  description: string;
  isActive?: boolean;
  order?: number;
}

export interface Stat {
  _id?: string;
  number: string;
  label: string;
  isActive?: boolean;
  order?: number;
}

export interface Testimonial {
  _id?: string;
  avatar: string;
  content: string;
  name: string;
  role: string;
  rating?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  order?: number;
}

export interface AddOn {
  _id?: string;
  service: string;
  price: string;
  description?: string;
  isActive?: boolean;
  order?: number;
}

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface ContentData {
  membershipPlans: MembershipPlan[];
  benefits: Benefit[];
  testimonials: Testimonial[];
  addOns: AddOn[];
  stats: Stat[];
}

// Country codes data
export const countryCodes: CountryCode[] = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "+65", name: "Singapore", flag: "🇸🇬" },
  { code: "+60", name: "Malaysia", flag: "🇲🇾" },
];

// API object
export const membershipApi = {
  submitApplication: async (
    formData: MembershipFormData,
  ): Promise<ApiResponse> => {
    try {
      const response = await postData<ApiResponse>(
        "/becomeamember/apply",
        formData as unknown as Record<string, unknown>,
      );
      return response;
    } catch (error: unknown) {
      console.error("Error submitting membership application:", error);
      throw error;
    }
  },

  getAllContent: async (): Promise<ApiResponse<ContentData>> => {
    try {
      const response = await fetchData<ApiResponse<ContentData>>(
        "/becomeamember/content",
      );
      return response;
    } catch (error: unknown) {
      console.error("Error fetching content:", error);
      throw error;
    }
  },
};
