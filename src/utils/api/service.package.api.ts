// services/service.package.api.ts
import {
  fetchData,
  postData,
  putData,
  patchData,
  deleteData,
} from "@/utils/api/api";

// ==================== TYPES ====================

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  isActive: boolean;
  icon: string;
  category: string;
  image: string;
  order: number;
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
  service: Service | string;
  serviceName: string;
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
  serviceDistribution: Array<{
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

export interface SubmitServiceRequestData {
  name: string;
  email: string;
  phone: string;
  address: string;
  serviceId: string;
  communicationMode: "voice_call" | "video_call" | "voice_note";
  description: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  [key: string]: string | undefined;
}

// ==================== SERVICE API FOR WEBSITE ====================

export const servicePackageAPI = {
  // Get all active services for website
  getAllServices: (params?: { category?: string }) => {
    return fetchData<ApiResponse<Service[]>>("/services", {
      ...params,
      isActive: true,
    });
  },

  // Get single service by ID
  getServiceById: (id: string) => {
    return fetchData<ApiResponse<Service>>(`/services/${id}`);
  },

  // Submit service request (website form)
  submitServiceRequest: (data: SubmitServiceRequestData) => {
    return postData<ApiResponse<ServiceRequest>>("/services/requests", data);
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
  // Get all services (admin)
  getAllServicesAdmin: (params?: { isActive?: boolean; category?: string }) => {
    return fetchData<ApiResponse<Service[]>>("/services", params);
  },

  // Create service
  createService: (data: Partial<Service>) => {
    return postData<ApiResponse<Service>>("/services", data);
  },

  // Update service
  updateService: (id: string, data: Partial<Service>) => {
    return putData<ApiResponse<Service>>(`/services/${id}`, data);
  },

  // Delete service
  deleteService: (id: string) => {
    return deleteData<ApiResponse<null>>(`/services/${id}`);
  },

  // Toggle service status
  toggleServiceStatus: (id: string) => {
    return patchData<ApiResponse<Service>>(`/services/${id}/toggle`, {});
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
