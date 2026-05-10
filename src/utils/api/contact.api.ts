import { postData } from "./api";

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Create new contact inquiry
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
    console.error("Error creating contact inquiry:", error);
    throw error;
  }
};
