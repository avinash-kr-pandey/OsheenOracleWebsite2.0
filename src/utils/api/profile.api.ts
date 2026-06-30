// src/utils/api/profile.api.ts

import { fetchData, putData, deleteData, postData } from "./api";

// ==================== INTERFACE DEFINITIONS ====================

// Address Interface - EXACTLY matching backend (addresses are stored in User model)
export interface Address {
  _id: string; // Backend returns _id as string
  type: string; // "Home", "Work", "Other"
  name: string; // Recipient name
  address: string; // Complete address as single string
  phone: string; // Contact phone number
  isDefault: boolean; // Whether this is default address
}

// Payment Method Interface
export interface PaymentMethod {
  id: number;
  type: "Visa" | "MasterCard" | "PayPal" | "Card";
  name: string;
  details: string;
  isDefault: boolean;
  expiryDate?: string;
  cardHolderName?: string;
}

// Order Interface
export interface Order {
  id: number;
  productName: string;
  price: string;
  date: string;
  status: "Delivered" | "Shipped" | "Processing" | "Cancelled";
  image: string;
  orderId?: string;
  quantity?: number;
  totalAmount?: string;
}

// Wishlist Item Interface
export interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: string;
  originalPrice: string;
  image: string;
  discount: string;
}

// Profile Update Data
export interface UpdateProfileData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

// Change Password Data
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Generic API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  user?: T;
}

// Address API Response (Backend returns { addresses: [...] })
export interface AddressListResponse {
  message?: string;
  addresses: Address[];
}

// Profile Image Upload Response
export interface ProfileImageResponse {
  avatar?: string;
  profileImage?: string;
  id?: string;
  name?: string;
  email?: string;
}

// User Stats Interface
export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  wishlistCount: number;
  addressesCount: number;
  reviewsCount: number;
  loyaltyPoints: number;
}

// ==================== USER PROFILE APIs ====================

/**
 * Get user profile
 * GET /api/auth/profile
 */
export const getUserProfile = async (): Promise<ApiResponse> => {
  try {
    const response = await fetchData<ApiResponse>("/auth/profile");
    return response;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};



/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateUserProfile = async (
  profileData: UpdateProfileData,
): Promise<ApiResponse> => {
  try {
    const requestData: Record<string, unknown> = {
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      dateOfBirth: profileData.dateOfBirth,
    };
    const response = await putData<ApiResponse>("/auth/profile", requestData);
    return response;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

/**
 * Change user password
 * POST /api/auth/change-password
 */
export const changePassword = async (
  passwordData: ChangePasswordData,
): Promise<ApiResponse> => {
  try {
    const requestData: Record<string, unknown> = {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    };
    const response = await postData<ApiResponse>(
      "/auth/change-password",
      requestData,
    );
    return response;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};



/**
 * Upload profile image
 * POST /api/auth/update-profile-image/:id
 */
export const uploadProfileImage = async (
  file: File,
): Promise<ApiResponse<ProfileImageResponse>> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await postData<ApiResponse<ProfileImageResponse>>(
      "/auth/update-profile-image", // Remove :id from URL
      formData as unknown as Record<string, unknown>,
    );
    return response;
  } catch (error) {
    console.error("Error uploading profile image:", error);
    throw error;
  }
};
// ==================== ADDRESS APIs ====================

/**
 * Get all addresses for logged in user
 * GET /api/addresses
 * Backend returns: { addresses: [...] }
 */
export const getAddresses = async (): Promise<AddressListResponse> => {
  try {
    const response = await fetchData<AddressListResponse>("/addresses");
    return response;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    throw error;
  }
};

/**
 * Create new address
 * POST /api/addresses
 * Backend requires: type, name, address, phone, isDefault (optional)
 * Backend returns: { message: string, addresses: [...] }
 */
export const createAddress = async (
  addressData: Omit<Address, "_id">,
): Promise<AddressListResponse> => {
  try {
    const requestData: Record<string, unknown> = {
      type: addressData.type,
      name: addressData.name,
      address: addressData.address,
      phone: addressData.phone,
      isDefault: addressData.isDefault || false,
    };
    const response = await postData<AddressListResponse>(
      "/addresses",
      requestData,
    );
    return response;
  } catch (error) {
    console.error("Error creating address:", error);
    throw error;
  }
};

/**
 * Update address by ID
 * PUT /api/addresses/:addressId
 * Backend returns: { message: string, addresses: [...] }
 */
export const updateAddress = async (
  addressId: string,
  addressData: Partial<Omit<Address, "_id">>,
): Promise<AddressListResponse> => {
  try {
    const requestData: Record<string, unknown> = {};
    if (addressData.type !== undefined) requestData.type = addressData.type;
    if (addressData.name !== undefined) requestData.name = addressData.name;
    if (addressData.address !== undefined)
      requestData.address = addressData.address;
    if (addressData.phone !== undefined) requestData.phone = addressData.phone;
    if (addressData.isDefault !== undefined)
      requestData.isDefault = addressData.isDefault;

    const response = await putData<AddressListResponse>(
      `/addresses/${addressId}`,
      requestData,
    );
    return response;
  } catch (error) {
    console.error(`Error updating address ${addressId}:`, error);
    throw error;
  }
};

/**
 * Delete address by ID
 * DELETE /api/addresses/:addressId
 * Backend returns: { message: string, addresses: [...] }
 */
export const deleteAddress = async (
  addressId: string,
): Promise<AddressListResponse> => {
  try {
    const response = await deleteData<AddressListResponse>(
      `/addresses/${addressId}`,
    );
    return response;
  } catch (error) {
    console.error(`Error deleting address ${addressId}:`, error);
    throw error;
  }
};

// ==================== ORDER APIs ====================

/**
 * Get all orders for logged in user
 * GET /api/orders
 */
export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<ApiResponse<Order[]>> => {
  try {
    const response = await fetchData<ApiResponse<Order[]>>(
      "/orders",
      params as Record<string, unknown>,
    );
    return response;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

/**
 * Get single order by ID
 * GET /api/orders/:id
 */
export const getOrderById = async (id: number): Promise<ApiResponse<Order>> => {
  try {
    const response = await fetchData<ApiResponse<Order>>(`/orders/${id}`);
    return response;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

/**
 * Cancel order by ID
 * POST /api/orders/:id/cancel
 */
export const cancelOrder = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await postData<ApiResponse>(`/orders/${id}/cancel`, {});
    return response;
  } catch (error) {
    console.error(`Error cancelling order ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new order
 * POST /api/orders
 */
export const createOrder = async (orderData: {
  productId?: string;
  productName: string;
  price: number;
  quantity?: number;
  totalAmount?: number;
  status: string;
  image?: string;
  shippingAddress?: {
    name: string;
    phone: string;
    address: string;
  };
  phone?: string;
  paymentMethod?: string;
  paymentId?: string;
}): Promise<ApiResponse<Order>> => {
  try {
    const response = await postData<ApiResponse<Order>>("/orders", orderData);
    return response;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// ==================== WISHLIST APIs ====================

/**
 * Get user wishlist
 * GET /api/wishlist
 */
export const getWishlist = async (): Promise<ApiResponse<WishlistItem[]>> => {
  try {
    const response = await fetchData<ApiResponse<WishlistItem[]>>("/wishlist");
    return response;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    throw error;
  }
};

/**
 * Add product to wishlist
 * POST /api/wishlist
 */
export const addToWishlist = async (
  productId: number,
): Promise<ApiResponse> => {
  try {
    const response = await postData<ApiResponse>("/wishlist", { productId });
    return response;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};

/**
 * Remove item from wishlist
 * DELETE /api/wishlist/:id
 */
export const removeFromWishlist = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await deleteData<ApiResponse>(`/wishlist/${id}`);
    return response;
  } catch (error) {
    console.error(`Error removing from wishlist ${id}:`, error);
    throw error;
  }
};

/**
 * Get wishlist count
 */
export const getWishlistCount = async (): Promise<number> => {
  try {
    const response = await getWishlist();
    if (response && response.success) {
      const data = response.data;
      if (Array.isArray(data)) {
        return data.length;
      }
      if (data && typeof data === "object" && "count" in data) {
        return (data as { count: number }).count || 0;
      }
    }
    return 0;
  } catch (error) {
    console.error("Error fetching wishlist count:", error);
    return 0;
  }
};

// ==================== PAYMENT METHOD APIs ====================

/**
 * Get user payment methods
 * GET /api/payment-methods
 */
export const getPaymentMethods = async (): Promise<
  ApiResponse<PaymentMethod[]>
> => {
  try {
    const response =
      await fetchData<ApiResponse<PaymentMethod[]>>("/payment-methods");
    return response;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
};

/**
 * Create new payment method
 * POST /api/payment-methods
 */
export const createPaymentMethod = async (
  paymentData: Omit<PaymentMethod, "id">,
): Promise<ApiResponse<PaymentMethod>> => {
  try {
    const requestData: Record<string, unknown> = { ...paymentData };
    const response = await postData<ApiResponse<PaymentMethod>>(
      "/payment-methods",
      requestData,
    );
    return response;
  } catch (error) {
    console.error("Error creating payment method:", error);
    throw error;
  }
};

/**
 * Delete payment method
 * DELETE /api/payment-methods/:id
 */
export const deletePaymentMethod = async (id: number): Promise<ApiResponse> => {
  try {
    const response = await deleteData<ApiResponse>(`/payment-methods/${id}`);
    return response;
  } catch (error) {
    console.error(`Error deleting payment method ${id}:`, error);
    throw error;
  }
};

/**
 * Set default payment method
 * PUT /api/payment-methods/:id/default
 */
export const setDefaultPaymentMethod = async (
  id: number,
): Promise<ApiResponse> => {
  try {
    const response = await putData<ApiResponse>(
      `/payment-methods/${id}/default`,
      {},
    );
    return response;
  } catch (error) {
    console.error(`Error setting default payment method ${id}:`, error);
    throw error;
  }
};

// ==================== STATS APIs ====================

/**
 * Get user dashboard statistics
 * GET /api/user/stats
 */
export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  try {
    const response = await fetchData<ApiResponse<UserStats>>("/user/stats");
    return response;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

// ==================== EXPORT ALL ====================

const profileApi = {
  // Profile
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadProfileImage,

  // Addresses
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,

  // Orders
  getOrders,
  getOrderById,
  cancelOrder,
  createOrder,

  // Wishlist
  getWishlist,
  getWishlistCount,
  addToWishlist,
  removeFromWishlist,

  // Payment Methods
  getPaymentMethods,
  createPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,

  // Stats
  getUserStats,
};

export default profileApi;
