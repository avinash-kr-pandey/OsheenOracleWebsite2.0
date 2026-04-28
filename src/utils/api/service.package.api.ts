// src/utils/api/service.package.api.ts (UPDATED)

import {
  fetchData,
  postData,
  putData,
  patchData,
  deleteData,
} from "@/utils/api/api";

// ==================== TYPES ====================

export interface Subcategory {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  icon: string;
  image: string;
  order: number;
  isActive: boolean;
  subcategories: Subcategory[];
  createdAt: string;
  updatedAt: string;
  id?: string;
}

export interface ServiceRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: Category | string;
  categoryName: string;
  subcategory: Subcategory;
  subcategoryName: string;
  price: number;
  communicationMode: "voice_call" | "video_call" | "voice_note";
  description: string;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  preferredDate?: string;
  preferredTimeSlot?: string;
  adminNotes?: string;
  isGuest: boolean;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  activeCategories: number;
  totalSubcategories: number;
  categoryDistribution: Array<{
    _id: string;
    count: number;
  }>;
  subcategoryDistribution: Array<{
    _id: string;
    count: number;
  }>;
  recentRequests: ServiceRequest[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  total?: number;
}

// ✅ UPDATED: Support both formats for flexibility
export interface SubmitServiceRequestData {
  name: string;
  email: string;
  phone: string;
  address: string;
  // Option 1: Using serviceId (from payment page)
  serviceId?: string;
  // Option 2: Using separate IDs (from booking form)
  categoryId?: string;
  subcategoryId?: string;
  communicationMode: "voice_call" | "video_call" | "voice_note";
  description: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
}

// ==================== SERVICE API FOR WEBSITE ====================

export const servicePackageAPI = {
  // Get all active categories with their subcategories for website
  getAllCategories: (params?: { isActive?: boolean }) => {
    return fetchData<ApiResponse<Category[]>>("/services/categories", {
      ...params,
      isActive: true,
    });
  },

  // Get single category by ID
  getCategoryById: (id: string) => {
    return fetchData<ApiResponse<Category>>(`/services/categories/${id}`);
  },

  // Get all active services (flattened list of subcategories)
  getAllServices: () => {
    return fetchData<ApiResponse<Category[]>>("/services/categories", {
      isActive: true,
    });
  },

  // Get subcategories by category ID
  getSubcategoriesByCategory: (categoryId: string) => {
    return fetchData<ApiResponse<Category>>(
      `/services/categories/${categoryId}`,
    );
  },

  // ✅ UPDATED: Submit service request with proper data transformation
  submitServiceRequest: async (data: SubmitServiceRequestData) => {
    // Transform data to match backend expected format
    const transformedData: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      communicationMode: data.communicationMode,
      description: data.description,
      preferredDate: data.preferredDate,
      preferredTimeSlot: data.preferredTimeSlot,
    };

    // Handle serviceId (from payment page)
    if (data.serviceId) {
      // If serviceId is provided, we need to get categoryId and subcategoryId
      // For now, pass serviceId as subcategoryId
      transformedData.subcategoryId = data.serviceId;
    }

    // Handle separate IDs (from booking form)
    if (data.categoryId) {
      transformedData.categoryId = data.categoryId;
    }
    if (data.subcategoryId) {
      transformedData.subcategoryId = data.subcategoryId;
    }

    return postData<ApiResponse<ServiceRequest>>(
      "/services/requests",
      transformedData,
    );
  },
};

// ==================== SERVICE REQUEST API FOR USER DASHBOARD ====================

export const userServiceRequestAPI = {
  // Get user's own requests (requires login)
  getMyRequests: () => {
    return fetchData<ApiResponse<ServiceRequest[]>>("/services/requests");
  },

  // Get single request by ID (requires login)
  getRequestById: (id: string) => {
    return fetchData<ApiResponse<ServiceRequest>>(`/services/requests/${id}`);
  },
};

// ==================== ADMIN API ====================

export const adminServiceAPI = {
  // Get all categories (admin)
  getAllCategories: (params?: { isActive?: boolean }) => {
    return fetchData<ApiResponse<Category[]>>("/services/categories", params);
  },

  // Get single category
  getCategoryById: (id: string) => {
    return fetchData<ApiResponse<Category>>(`/services/categories/${id}`);
  },

  // Create category
  createCategory: (data: Partial<Category>) => {
    return postData<ApiResponse<Category>>("/services/categories", data);
  },

  // Update category
  updateCategory: (id: string, data: Partial<Category>) => {
    return putData<ApiResponse<Category>>(`/services/categories/${id}`, data);
  },

  // Delete category
  deleteCategory: (id: string) => {
    return deleteData<ApiResponse<null>>(`/services/categories/${id}`);
  },

  // Toggle category status
  toggleCategoryStatus: (id: string) => {
    return patchData<ApiResponse<Category>>(
      `/services/categories/${id}/toggle`,
      {},
    );
  },

  // Add subcategory
  addSubcategory: (categoryId: string, data: Partial<Subcategory>) => {
    return postData<ApiResponse<Category>>(
      `/services/categories/${categoryId}/subcategories`,
      data,
    );
  },

  // Update subcategory
  updateSubcategory: (
    categoryId: string,
    subcategoryId: string,
    data: Partial<Subcategory>,
  ) => {
    return putData<ApiResponse<Category>>(
      `/services/categories/${categoryId}/subcategories/${subcategoryId}`,
      data,
    );
  },

  // Delete subcategory
  deleteSubcategory: (categoryId: string, subcategoryId: string) => {
    return deleteData<ApiResponse<null>>(
      `/services/categories/${categoryId}/subcategories/${subcategoryId}`,
    );
  },

  // Toggle subcategory status
  toggleSubcategoryStatus: (categoryId: string, subcategoryId: string) => {
    return patchData<ApiResponse<Category>>(
      `/services/categories/${categoryId}/subcategories/${subcategoryId}/toggle`,
      {},
    );
  },

  // Get all service requests (admin)
  getAllRequests: (params?: { status?: string }) => {
    return fetchData<ApiResponse<ServiceRequest[]>>(
      "/services/requests",
      params,
    );
  },

  // Update request status (admin)
  updateRequestStatus: (id: string, status: string, adminNotes?: string) => {
    return patchData<ApiResponse<ServiceRequest>>(
      `/services/requests/${id}/status`,
      {
        status,
        adminNotes,
      },
    );
  },

  // Delete request (admin)
  deleteRequest: (id: string) => {
    return deleteData<ApiResponse<null>>(`/services/requests/${id}`);
  },

  // Get dashboard stats (admin)
  getDashboardStats: () => {
    return fetchData<ApiResponse<DashboardStats>>("/services/admin/stats");
  },
};

// ==================== HELPER FUNCTIONS FOR WEBSITE ====================

// Get flattened list of all services for easy display
export const getAllServicesFlattened = async () => {
  try {
    const response = await servicePackageAPI.getAllCategories({
      isActive: true,
    });
    if (response.success && response.data) {
      const services: Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        duration: string;
        icon: string;
        image: string;
        categoryId: string;
        categoryName: string;
        categoryIcon: string;
      }> = [];

      response.data.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.isActive) {
            services.push({
              id: subcategory._id || "",
              name: subcategory.name,
              description: subcategory.description,
              price: subcategory.price,
              duration: subcategory.duration,
              icon: subcategory.icon,
              image: subcategory.image,
              categoryId: category._id,
              categoryName: category.name,
              categoryIcon: category.icon,
            });
          }
        });
      });

      return services;
    }
    return [];
  } catch (error) {
    console.error("Error fetching flattened services:", error);
    return [];
  }
};

// Get services by category
export const getServicesByCategory = async (categoryId: string) => {
  try {
    const response = await servicePackageAPI.getCategoryById(categoryId);
    if (response.success && response.data) {
      return response.data.subcategories.filter((sub) => sub.isActive);
    }
    return [];
  } catch (error) {
    console.error("Error fetching services by category:", error);
    return [];
  }
};

// Get service details
export const getServiceDetails = async (
  categoryId: string,
  subcategoryId: string,
) => {
  try {
    const response = await servicePackageAPI.getCategoryById(categoryId);
    if (response.success && response.data) {
      const subcategory = response.data.subcategories.find(
        (sub) => sub._id === subcategoryId,
      );
      if (subcategory) {
        return {
          category: response.data,
          service: subcategory,
        };
      }
    }
    return null;
  } catch (error) {
    console.error("Error fetching service details:", error);
    return null;
  }
};
