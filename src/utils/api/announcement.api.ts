import { fetchData } from "./api";

export interface Announcement {
  _id?: string;
  content: string;
  isActive: boolean;
  link?: string;
  createdAt?: string;
}

export interface AnnouncementApiResponse {
  success: boolean;
  data: Announcement | null;
  message?: string;
}

export const getLatestAnnouncement = async (): Promise<Announcement | null> => {
  try {
    const response = await fetchData<AnnouncementApiResponse>("/announcements/latest");
    if (response.success && response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching latest announcement:", error);
    return null;
  }
};

const announcementAPI = {
  getLatestAnnouncement,
};

export default announcementAPI;
