// utils/api/productApi.ts - ONLY PUBLIC APIs (No Admin, No Auth)
import { fetchData } from "./api";
import { Product, normalizeProduct, isProduct } from "@/types/product";

// Types for Product API responses
interface ProductApiResponse<T = unknown> {
  success?: boolean;
  data?: T;
  products?: T[];
  product?: T;
  message?: string;
  count?: number;
}

export interface FilterOptions {
  brands: string[];
  categories: string[];
  sizes: string[];
  colors: string[];
  minPrice: number;
  maxPrice: number;
}

// Extended Product type with additional fields
interface ExtendedProduct extends Product {
  gender?: string[];
  catalogue?: string;
  subCategory?: string;
  sizeOptions?: string[];
  createdAt?: string;
}

/* =======================
   ALL PUBLIC PRODUCT APIs (No Login Required)
======================= */

/**
 * Get all products with optional filtering and pagination
 */
export const fetchProducts = async (filters?: {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price-low" | "price-high" | "newest" | "rating";
  limit?: number;
  page?: number;
}): Promise<ExtendedProduct[]> => {
  try {
    console.log("🔄 Fetching products with filters:", filters);

    const params: Record<string, string | number | undefined> = {};
    if (filters?.category) params.category = filters.category;
    if (filters?.brand) params.brand = filters.brand;
    if (filters?.minPrice) params.minPrice = filters.minPrice;
    if (filters?.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters?.sort) params.sort = filters.sort;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.page) params.page = filters.page;

    const response = await fetchData<unknown>("/products", params);
    console.log("📦 API Response:", response);

    let productsArray: unknown[] = [];

    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const res = response as ProductApiResponse;

      if (Array.isArray(res.data)) {
        productsArray = res.data;
      } else if (Array.isArray(res.products)) {
        productsArray = res.products;
      } else {
        const values = Object.values(res);
        const arrayValue = values.find(Array.isArray);
        if (arrayValue) productsArray = arrayValue;
      }
    }

    const products = productsArray.map(
      (item: unknown) => normalizeProduct(item) as ExtendedProduct,
    );
    console.log(`✅ Loaded ${products.length} products`);

    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};

/**
 * Get single product by ID
 */
export const fetchProductById = async (
  id: string | number,
): Promise<ExtendedProduct | null> => {
  try {
    console.log(`🔄 Fetching product with ID: ${id}`);

    const response = await fetchData<unknown>(`/products/${id}`);
    console.log("📦 Product API Response:", response);

    let productData: unknown = null;

    if (response && typeof response === "object") {
      const res = response as ProductApiResponse;

      if (res.data && typeof res.data === "object") {
        productData = res.data;
      } else if (res.product && typeof res.product === "object") {
        productData = res.product;
      } else {
        productData = response;
      }
    } else {
      productData = response;
    }

    if (!productData) {
      console.error("❌ No product data found");
      return null;
    }

    const product = normalizeProduct(productData) as ExtendedProduct;

    if (!isProduct(product)) {
      console.error("❌ Invalid product structure:", product);
      return null;
    }

    console.log(`✅ Product loaded: ${product.name}`);
    return product;
  } catch (error) {
    console.error(`❌ Error fetching product ${id}:`, error);
    return null;
  }
};

/**
 * Search products by keyword
 */
export const searchProducts = async (
  query: string,
): Promise<ExtendedProduct[]> => {
  try {
    console.log(`🔍 Searching products for: "${query}"`);

    const response = await fetchData<unknown>("/products/search", { q: query });

    let productsArray: unknown[] = [];

    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const res = response as ProductApiResponse;
      if (Array.isArray(res.data)) productsArray = res.data;
      else if (Array.isArray(res.products)) productsArray = res.products;
    }

    const products = productsArray.map(
      (item: unknown) => normalizeProduct(item) as ExtendedProduct,
    );
    console.log(`✅ Found ${products.length} products for "${query}"`);

    return products;
  } catch (error) {
    console.error(`❌ Error searching products:`, error);
    return [];
  }
};

/**
 * Get products by category
 */
export const fetchProductsByCategory = async (
  category: string,
): Promise<ExtendedProduct[]> => {
  try {
    console.log(`📂 Fetching products in category: ${category}`);

    const response = await fetchData<unknown>("/products/category", {
      category,
    });

    let productsArray: unknown[] = [];

    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const res = response as ProductApiResponse;
      if (Array.isArray(res.data)) productsArray = res.data;
      else if (Array.isArray(res.products)) productsArray = res.products;
    }

    const products = productsArray.map(
      (item: unknown) => normalizeProduct(item) as ExtendedProduct,
    );
    console.log(`✅ Found ${products.length} products in ${category}`);

    return products;
  } catch (error) {
    console.error(`❌ Error fetching products by category:`, error);
    return [];
  }
};

/**
 * Get products by brand
 */
export const fetchProductsByBrand = async (
  brand: string,
): Promise<ExtendedProduct[]> => {
  try {
    console.log(`🏷️ Fetching products by brand: ${brand}`);

    const response = await fetchData<unknown>("/products/brand", { brand });

    let productsArray: unknown[] = [];

    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const res = response as ProductApiResponse;
      if (Array.isArray(res.data)) productsArray = res.data;
      else if (Array.isArray(res.products)) productsArray = res.products;
    }

    const products = productsArray.map(
      (item: unknown) => normalizeProduct(item) as ExtendedProduct,
    );
    console.log(`✅ Found ${products.length} products from ${brand}`);

    return products;
  } catch (error) {
    console.error(`❌ Error fetching products by brand:`, error);
    return [];
  }
};

/**
 * Get featured products for homepage
 */
export const fetchFeaturedProducts = async (
  limit: number = 10,
): Promise<ExtendedProduct[]> => {
  try {
    console.log(`⭐ Fetching ${limit} featured products`);

    const response = await fetchData<unknown>("/products/featured", { limit });

    let productsArray: unknown[] = [];

    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const res = response as ProductApiResponse;
      if (Array.isArray(res.data)) productsArray = res.data;
      else if (Array.isArray(res.products)) productsArray = res.products;
    }

    const products = productsArray.map(
      (item: unknown) => normalizeProduct(item) as ExtendedProduct,
    );
    console.log(`✅ Loaded ${products.length} featured products`);

    return products;
  } catch (error) {
    console.error(`❌ Error fetching featured products:`, error);
    return [];
  }
};

/**
 * Get new arrivals (latest products)
 */
export const fetchNewArrivals = async (
  limit: number = 10,
): Promise<ExtendedProduct[]> => {
  try {
    console.log(`🆕 Fetching ${limit} new arrivals`);

    const response = await fetchData<unknown>("/products/new", { limit });

    let productsArray: unknown[] = [];

    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const res = response as ProductApiResponse;
      if (Array.isArray(res.data)) productsArray = res.data;
      else if (Array.isArray(res.products)) productsArray = res.products;
    }

    const products = productsArray.map(
      (item: unknown) => normalizeProduct(item) as ExtendedProduct,
    );
    console.log(`✅ Loaded ${products.length} new arrivals`);

    return products;
  } catch (error) {
    console.error(`❌ Error fetching new arrivals:`, error);
    return [];
  }
};

/**
 * Get products by price range
 */
export const fetchProductsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
): Promise<ExtendedProduct[]> => {
  try {
    console.log(`💰 Fetching products between ₹${minPrice} - ₹${maxPrice}`);

    const response = await fetchData<unknown>("/products/price-range", {
      min: minPrice,
      max: maxPrice,
    });

    let productsArray: unknown[] = [];

    if (Array.isArray(response)) {
      productsArray = response;
    } else if (response && typeof response === "object") {
      const res = response as ProductApiResponse;
      if (Array.isArray(res.data)) productsArray = res.data;
      else if (Array.isArray(res.products)) productsArray = res.products;
    }

    const products = productsArray.map(
      (item: unknown) => normalizeProduct(item) as ExtendedProduct,
    );
    console.log(`✅ Found ${products.length} products in price range`);

    return products;
  } catch (error) {
    console.error(`❌ Error fetching products by price range:`, error);
    return [];
  }
};

/**
 * Get all filter options (brands, categories, sizes, colors)
 */
export const fetchFilterOptions = async (): Promise<FilterOptions> => {
  try {
    console.log("🎯 Fetching filter options from products");

    const products = await fetchProducts();

    if (!products.length) {
      return {
        brands: [],
        categories: [],
        sizes: [],
        colors: [],
        minPrice: 0,
        maxPrice: 10000,
      };
    }

    // Extract unique values - Fixed type issue
    const brands = [
      ...new Set(
        products.map((p) => p.brand).filter((b): b is string => Boolean(b)),
      ),
    ];
    const categories = [
      ...new Set(
        products.map((p) => p.category).filter((c): c is string => Boolean(c)),
      ),
    ];

    // Fixed: Properly type the sizes extraction
    const sizes = [
      ...new Set(
        products.flatMap((p) => {
          const sizeOptions = (p as ExtendedProduct).sizeOptions;
          return Array.isArray(sizeOptions) ? sizeOptions : [];
        }),
      ),
    ];

    const colors = [
      ...new Set(
        products.flatMap((p) => {
          const productColors = p.colors;
          return Array.isArray(productColors) ? productColors : [];
        }),
      ),
    ];

    // Find price range
    const prices = products
      .map((p) => p.price)
      .filter((p): p is number => p > 0);
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 10000;

    const filterOptions: FilterOptions = {
      brands: brands.sort(),
      categories: categories.sort(),
      sizes: sizes.sort(),
      colors: colors.sort(),
      minPrice,
      maxPrice,
    };

    console.log("✅ Filter options extracted:", filterOptions);
    return filterOptions;
  } catch (error) {
    console.error("❌ Error fetching filter options:", error);
    return {
      brands: [],
      categories: [],
      sizes: [],
      colors: [],
      minPrice: 0,
      maxPrice: 10000,
    };
  }
};

/**
 * Get related products based on category or brand
 */
export const fetchRelatedProducts = async (
  productId: string | number,
  category?: string,
  brand?: string,
  limit: number = 4,
): Promise<ExtendedProduct[]> => {
  try {
    console.log(`🔗 Fetching related products for ${productId}`);

    const allProducts = await fetchProducts();

    let related = allProducts.filter(
      (p) => p.id !== productId && p._id !== productId,
    );

    if (category) {
      const byCategory = related.filter((p) => p.category === category);
      if (byCategory.length >= limit) {
        related = byCategory;
      } else if (brand) {
        const byBrand = related.filter((p) => p.brand === brand);
        related = [...byCategory, ...byBrand];
      }
    } else if (brand) {
      related = related.filter((p) => p.brand === brand);
    }

    const finalRelated = related.slice(0, limit);
    console.log(`✅ Found ${finalRelated.length} related products`);

    return finalRelated;
  } catch (error) {
    console.error(`❌ Error fetching related products:`, error);
    return [];
  }
};

// Export all public product APIs
export const productApi = {
  fetchProducts,
  fetchProductById,
  searchProducts,
  fetchProductsByCategory,
  fetchProductsByBrand,
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchProductsByPriceRange,
  fetchFilterOptions,
  fetchRelatedProducts,
};

export default productApi;
