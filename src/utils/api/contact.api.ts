import { postData } from "./api";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  desiredDate: string;
  desiredTime: string;
  additionalMessage?: string;
  preferredAstrologer?: string;
  astrologerSpecialization?: string;
  consultationType?: "chat" | "call" | "video" | "in_person";
  consultationDuration?: number;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    desiredDate: string;
    desiredTime: string;
    status: string;
  };
}

// Create new consultation booking
export const createConsultation = async (
  data: ContactFormData,
): Promise<ContactResponse> => {
  try {
    const response = await postData<ContactResponse, ContactFormData>(
      "/contact",
      data,
    );
    return response;
  } catch (error) {
    console.error("Error creating consultation:", error);
    throw error;
  }
};
