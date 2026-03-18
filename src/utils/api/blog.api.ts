// services/blog.api.ts

import { fetchData } from "./api";


export interface Blog {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  category: string;
  tags?: string[];
  coverImage?: string;
  views: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogResponse {
  success: boolean;
  count?: number;
  data?: Blog | Blog[];
  message?: string;
  error?: string;
}

export const blogAPI = {
  // Get all blogs
  getAllBlogs: async () => {
    try {
      const response = await fetchData<BlogResponse>("/blogs");

      if (response.success && Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        data: [],
      };
    } catch (error) {
      console.error("Error fetching blogs:", error);
      return {
        success: false,
        data: [],
      };
    }
  },

  // Get single blog
  getBlogById: async (id: string) => {
    try {
      const response = await fetchData<BlogResponse>(`/blogs/${id}`);

      if (response.success && response.data && !Array.isArray(response.data)) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        data: null,
      };
    } catch (error) {
      console.error(`Error fetching blog ${id}:`, error);
      return {
        success: false,
        data: null,
      };
    }
  },
};
