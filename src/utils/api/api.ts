// src/utils/api/api.ts - COMPLETE UPDATED VERSION

import axios, { AxiosError, AxiosResponse } from "axios";
import { Product, Review, isProduct, normalizeProduct } from "@/types/product";
import {
  GoogleAuthResponse,
  GoogleTokenResponse,
  GoogleUserData,
} from "@/contexts/AuthContext";

// const API_BASE_URL = "https://osheenoraclebackend02.onrender.com/api";
// const API_BASE_URL = "https://api.osheenoracle.com/api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.osheenoracle.com/api"
    : "http://localhost:5000/api");

// Google Auth API object
export const googleAuthApi = {

  loginWithGoogle: async (
    googleUserData: GoogleUserData,
  ): Promise<GoogleAuthResponse> => {
    try {
      const response = await postData<GoogleAuthResponse>(
        "/auth/google",
        googleUserData,
      );
      return response;
    } catch (error) {
      console.error("Google login API error:", error);
      throw error;
    }
  },
  verifyGoogleToken: async (token: string): Promise<GoogleTokenResponse> => {
    try {
      const response = await postData<GoogleTokenResponse>(
        "/auth/verify-google-token",
        { token },
      );
      return response;
    } catch (error) {
      console.error("Google token verification error:", error);
      throw error;
    }
  },
};

// Generic API response type
interface ApiResponse<T = unknown> {
  data?: T;
  products?: T[];
  items?: T[];
  result?: T;
  product?: T;
  item?: T;
  [key: string]: unknown;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    if (config.method?.toLowerCase() === "get") {
      delete config.headers["Cache-Control"];
      delete config.headers["Pragma"];
      delete config.headers["Expires"];
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/login?redirect=${currentPath}`;
    }
    return Promise.reject(error);
  },
);

// Set token dynamically
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

/* =======================
   GET
======================= */
export const fetchData = async <T = unknown>(
  endpoint: string,
  params?: Record<string, unknown>,
  noCache: boolean = false,
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};

    if (noCache) {
      headers["Cache-Control"] = "no-cache";
    }

    const response: AxiosResponse<T> = await api.get(endpoint, {
      params,
      headers: Object.keys(headers).length ? headers : undefined,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      `GET Error (${endpoint}):`,
      err.response?.data || err.message,
    );
    throw err;
  }
};

/* =======================
   POST - UPDATED (accepts any object type)
======================= */
export const postData = async <T = unknown, D = Record<string, unknown>>(
  endpoint: string,
  data: D,
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};

    if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const response: AxiosResponse<T> = await api.post(endpoint, data, {
      headers,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      `POST Error (${endpoint}):`,
      err.response?.data || err.message,
    );
    throw err;
  }
};

/* =======================
   PUT - UPDATED (accepts any object type)
======================= */
export const putData = async <T = unknown, D = Record<string, unknown>>(
  endpoint: string,
  data: D,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      `PUT Error (${endpoint}):`,
      err.response?.data || err.message,
    );
    throw err;
  }
};

/* =======================
   PATCH - UPDATED (accepts any object type)
======================= */
export const patchData = async <T = unknown, D = Record<string, unknown>>(
  endpoint: string,
  data: D,
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.patch(endpoint, data);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      `PATCH Error (${endpoint}):`,
      err.response?.data || err.message,
    );
    throw err;
  }
};

/* =======================
   DELETE
======================= */
export const deleteData = async <T = unknown>(endpoint: string): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      `DELETE Error (${endpoint}):`,
      err.response?.data || err.message,
    );
    throw err;
  }
};

/* =======================
   Universal API Request
======================= */
export const apiRequest = async <T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  data?: Record<string, unknown> | FormData,
  params?: Record<string, unknown>,
  noCache: boolean = false,
): Promise<T> => {
  try {
    const headers: Record<string, string> = {};

    if (method === "GET") {
      if (data instanceof FormData) {
        headers["Content-Type"] = "multipart/form-data";
      }
    } else if (data instanceof FormData) {
      headers["Content-Type"] = "multipart/form-data";
    }

    const response: AxiosResponse<T> = await api({
      url: endpoint,
      method,
      data,
      params,
      headers,
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error(
      `${method} Error on ${endpoint}:`,
      err.response?.data || err.message,
    );
    throw err;
  }
};

/* =======================
   PRODUCT-SPECIFIC APIs
======================= */

// Fetch all products
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    console.log("🔍 Fetching products from API...");

    const response = await fetchData<unknown>("/products");
    console.log("🔍 API Response type:", typeof response);

    if (Array.isArray(response)) {
      console.log("✅ Products received as array");
      return response.map((item: unknown) => normalizeProduct(item));
    } else if (response && typeof response === "object") {
      const responseObj = response as ApiResponse<unknown>;

      let productsArray: unknown[] = [];

      if (Array.isArray(responseObj.data)) {
        console.log("✅ Products found in response.data");
        productsArray = responseObj.data;
      } else if (Array.isArray(responseObj.products)) {
        console.log("✅ Products found in response.products");
        productsArray = responseObj.products;
      } else if (Array.isArray(responseObj.items)) {
        console.log("✅ Products found in response.items");
        productsArray = responseObj.items;
      } else if (Array.isArray(responseObj.result)) {
        console.log("✅ Products found in response.result");
        productsArray = responseObj.result;
      } else {
        console.warn("⚠️ Unexpected response format:", response);
        return [];
      }

      return productsArray.map((item: unknown) => normalizeProduct(item));
    }

    console.error("❌ Invalid response format");
    return [];
  } catch (error: unknown) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

// Fetch product by ID
export const fetchProductById = async (
  id: number | string,
): Promise<Product> => {
  try {
    const _id = typeof id === "string" ? id : id.toString();
    console.log("🔄 Fetching product with ID:", _id);

    const response = await fetchData<ApiResponse>(`/products/${_id}`);
    console.log("🔍 Full API Response:", response);

    let productData: unknown;
    if (response && typeof response === "object") {
      const apiResponse = response as ApiResponse;

      if (apiResponse.data && typeof apiResponse.data === "object") {
        productData = apiResponse.data;
      } else if (
        apiResponse.product &&
        typeof apiResponse.product === "object"
      ) {
        productData = apiResponse.product;
      } else if (apiResponse.item && typeof apiResponse.item === "object") {
        productData = apiResponse.item;
      } else if (apiResponse.result && typeof apiResponse.result === "object") {
        productData = apiResponse.result;
      } else {
        productData = response;
      }
    } else {
      productData = response;
    }

    console.log("📦 Extracted product data:", productData);

    if (!productData) {
      console.error("❌ No product data in response");
      throw new Error("Product data not found in API response");
    }

    const product = normalizeProduct(productData);

    if (!isProduct(product)) {
      console.error("❌ Invalid product data structure:", product);
      throw new Error("Invalid product data structure received");
    }

    console.log("✅ Final product object:", {
      _id: product._id,
      id: product.id,
      name: product.name,
      price: product.price,
    });

    return product;
  } catch (error) {
    console.error(`❌ Error fetching product ${id}:`, error);
    throw error;
  }
};

// Search products by name or keyword
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetchData<ApiResponse>("/products/search", {
      q: query,
    });

    let productsArray: unknown[] = [];
    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const responseObj = response as ApiResponse;
      if (Array.isArray(responseObj.data)) {
        productsArray = responseObj.data;
      } else if (Array.isArray(responseObj.products)) {
        productsArray = responseObj.products;
      } else if (Array.isArray(responseObj.items)) {
        productsArray = responseObj.items;
      } else if (Array.isArray(responseObj.result)) {
        productsArray = responseObj.result;
      }
    }

    return productsArray.map((item: unknown) => normalizeProduct(item));
  } catch (error) {
    console.error(`Error searching products for "${query}":`, error);
    throw error;
  }
};

// Get products by category
export const fetchProductsByCategory = async (
  category: string,
): Promise<Product[]> => {
  try {
    const response = await fetchData<ApiResponse>("/products/category", {
      category,
    });

    let productsArray: unknown[] = [];
    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const responseObj = response as ApiResponse;
      if (Array.isArray(responseObj.data)) {
        productsArray = responseObj.data;
      } else if (Array.isArray(responseObj.products)) {
        productsArray = responseObj.products;
      } else if (Array.isArray(responseObj.items)) {
        productsArray = responseObj.items;
      }
    }

    return productsArray.map((item: unknown) => normalizeProduct(item));
  } catch (error) {
    console.error(`Error fetching products by category ${category}:`, error);
    throw error;
  }
};

// Get products by brand
export const fetchProductsByBrand = async (
  brand: string,
): Promise<Product[]> => {
  try {
    const response = await fetchData<ApiResponse>("/products/brand", { brand });

    let productsArray: unknown[] = [];
    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const responseObj = response as ApiResponse;
      if (Array.isArray(responseObj.data)) {
        productsArray = responseObj.data;
      } else if (Array.isArray(responseObj.products)) {
        productsArray = responseObj.products;
      }
    }

    return productsArray.map((item: unknown) => normalizeProduct(item));
  } catch (error) {
    console.error(`Error fetching products by brand ${brand}:`, error);
    throw error;
  }
};

// Get featured products
export const fetchFeaturedProducts = async (
  limit: number = 10,
): Promise<Product[]> => {
  try {
    const response = await fetchData<ApiResponse>("/products/featured", {
      limit,
    });

    let productsArray: unknown[] = [];
    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const responseObj = response as ApiResponse;
      if (Array.isArray(responseObj.data)) {
        productsArray = responseObj.data;
      } else if (Array.isArray(responseObj.products)) {
        productsArray = responseObj.products;
      }
    }

    return productsArray.map((item: unknown) => normalizeProduct(item));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

// Get new arrivals
export const fetchNewArrivals = async (
  limit: number = 10,
): Promise<Product[]> => {
  try {
    const response = await fetchData<ApiResponse>("/products/new", { limit });

    let productsArray: unknown[] = [];
    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const responseObj = response as ApiResponse;
      if (Array.isArray(responseObj.data)) {
        productsArray = responseObj.data;
      } else if (Array.isArray(responseObj.products)) {
        productsArray = responseObj.products;
      }
    }

    return productsArray.map((item: unknown) => normalizeProduct(item));
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    throw error;
  }
};

// Get products by price range
export const fetchProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
): Promise<Product[]> => {
  try {
    const response = await fetchData<ApiResponse>("/products/price-range", {
      min: minPrice,
      max: maxPrice,
    });

    let productsArray: unknown[] = [];
    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const responseObj = response as ApiResponse;
      if (Array.isArray(responseObj.data)) {
        productsArray = responseObj.data;
      }
    }

    return productsArray.map((item: unknown) => normalizeProduct(item));
  } catch (error) {
    console.error(
      `Error fetching products in price range ${minPrice}-${maxPrice}:`,
      error,
    );
    throw error;
  }
};

// Create new product (admin only)
export const createProduct = async (
  productData: Partial<Product>,
): Promise<Product> => {
  try {
    const response = await postData<ApiResponse>("/products", productData);

    let createdProduct: unknown;
    if (response && typeof response === "object") {
      const apiResponse = response as ApiResponse;
      if (apiResponse.data && typeof apiResponse.data === "object") {
        createdProduct = apiResponse.data;
      } else if (
        apiResponse.product &&
        typeof apiResponse.product === "object"
      ) {
        createdProduct = apiResponse.product;
      } else {
        createdProduct = response;
      }
    } else {
      createdProduct = response;
    }

    return normalizeProduct(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Update product (admin only)
export const updateProduct = async (
  id: number | string,
  productData: Partial<Product>,
): Promise<Product> => {
  try {
    const response = await putData<ApiResponse>(`/products/${id}`, productData);

    let updatedProduct: unknown;
    if (response && typeof response === "object") {
      const apiResponse = response as ApiResponse;
      if (apiResponse.data && typeof apiResponse.data === "object") {
        updatedProduct = apiResponse.data;
      } else if (
        apiResponse.product &&
        typeof apiResponse.product === "object"
      ) {
        updatedProduct = apiResponse.product;
      } else {
        updatedProduct = response;
      }
    } else {
      updatedProduct = response;
    }

    return normalizeProduct(updatedProduct);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Delete product (admin only)
export const deleteProduct = async (id: number | string): Promise<void> => {
  try {
    await deleteData(`/products/${id}`);
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

// Add review to product
export const addProductReview = async (
  productId: number | string,
  reviewData: {
    name: string;
    comment: string;
    rating: number;
    avatar?: string;
  },
): Promise<Product> => {
  try {
    const response = await postData<ApiResponse>(
      `/products/${productId}/reviews`,
      reviewData,
    );

    let updatedProduct: unknown;
    if (response && typeof response === "object") {
      const apiResponse = response as ApiResponse;
      if (apiResponse.data && typeof apiResponse.data === "object") {
        updatedProduct = apiResponse.data;
      } else if (
        apiResponse.product &&
        typeof apiResponse.product === "object"
      ) {
        updatedProduct = apiResponse.product;
      } else {
        updatedProduct = response;
      }
    } else {
      updatedProduct = response;
    }

    return normalizeProduct(updatedProduct);
  } catch (error) {
    console.error(`Error adding review to product ${productId}:`, error);
    throw error;
  }
};

// Get product statistics (admin only)
export const getProductStats = async (): Promise<{
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  averagePrice: number;
  averageRating: number;
}> => {
  try {
    const stats = await fetchData<{
      totalProducts: number;
      totalCategories: number;
      totalBrands: number;
      averagePrice: number;
      averageRating: number;
    }>("/products/stats");
    return stats;
  } catch (error) {
    console.error("Error fetching product stats:", error);
    throw error;
  }
};

// Get unique values for filters
export const getFilterOptions = async (): Promise<{
  brands: string[];
  categories: string[];
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
}> => {
  try {
    const options = await fetchData<{
      brands: string[];
      categories: string[];
      sizes: string[];
      colors: string[];
      minPrice: number;
      maxPrice: number;
    }>("/products/filter-options");
    return options;
  } catch (error) {
    console.error("Error fetching filter options:", error);
    throw error;
  }
};

// Get full URL for relative image paths uploaded to the backend
export const getFullImageUrl = (imagePath?: string): string => {
  if (!imagePath) return "/images/default.jpg";
  
  const isProd = process.env.NODE_ENV === "production";
  
  // If the path is an absolute URL pointing to a backend uploads folder (e.g. from local testing or older domain)
  if (imagePath.includes("/uploads/")) {
    const uploadIndex = imagePath.indexOf("/uploads/");
    const relativeUploadPath = imagePath.substring(uploadIndex);
    const isLocalUrl = imagePath.includes("localhost") || imagePath.includes("127.0.0.1");
    
    if (isProd || isLocalUrl) {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        (isProd
          ? "https://api.osheenoracle.com/api"
          : "http://localhost:5000/api");
      const baseUrl = apiBaseUrl.replace(/\/api\/?$/, "");
      return `${baseUrl}${relativeUploadPath}`;
    }
  }
  
  if (
    imagePath.startsWith("/images/") ||
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath;
  }
  
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    (isProd
      ? "https://api.osheenoracle.com/api"
      : "http://localhost:5000/api");
      
  const baseUrl = apiBaseUrl.replace(/\/api\/?$/, "");
  const formattedPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${baseUrl}${formattedPath}`;
};

export default api;
