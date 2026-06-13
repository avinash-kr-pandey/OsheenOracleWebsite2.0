// services/blog.api.ts

import { fetchData, postData } from "./api";

export interface Blog {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  authorInitials: string;
  date: string;
  comments: number;
  views: number;
  tags?: string[];
  excerpt?: string;
  content?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogResponse {
  success: boolean;
  count?: number;
  data?: Blog | Blog[];
  message?: string;
  error?: string;
}

// ✅ Comment Interfaces
export interface Comment {
  _id: string;
  blogId: string;
  name: string;
  email: string;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentResponse {
  success: boolean;
  count?: number;
  data?: Comment | Comment[];
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

  // ✅ Get comments for a blog
  getBlogComments: async (
    blogId: string,
  ): Promise<{ success: boolean; data?: Comment[]; error?: string }> => {
    try {
      const response = await fetchData<CommentResponse>(
        `/blogs/${blogId}/comments`,
      );
      if (response.success && Array.isArray(response.data)) {
        return { success: true, data: response.data };
      }
      return { success: true, data: [] };
    } catch (error) {
      console.error("Error fetching comments:", error);
      return { success: false, error: "Failed to fetch comments" };
    }
  },

  // ✅ Add a comment to blog
  addBlogComment: async (
    blogId: string,
    commentData: { name: string; email: string; comment: string },
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const response = await postData<CommentResponse>(
        `/blogs/${blogId}/comments`,
        commentData,
      );
      if (response.success) {
        return {
          success: true,
          message: response.message || "Comment submitted successfully",
        };
      }
      return {
        success: false,
        error: response.error || "Failed to submit comment",
      };
    } catch (error: any) {
      console.error("Error adding comment:", error);
      return {
        success: false,
        error: error?.response?.data?.message || "Failed to submit comment",
      };
    }
  },
};
