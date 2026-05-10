"use client";
import React, { useState, useMemo, useEffect } from "react";
import Products from "./Products";
import Filters from "./Filters";
import CommonPageHeader from "../CommonPages/CommonPageHeader";
import {
  fetchProducts,
  fetchFilterOptions,
  FilterOptions,
} from "@/utils/api/productApi";
import { Product } from "@/types/product";

// Extended Product type for additional fields
interface ExtendedProduct extends Product {
  gender?: string[];
  catalogue?: string;
  subCategory?: string;
  sizeOptions?: number[];
  createdAt?: string;
}

const ProductListing: React.FC = () => {
  const [allProducts, setAllProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter options from API
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    categories: [],
    sizes: [],
    colors: [],
    minPrice: 0,
    maxPrice: 10000,
  });

  // Filter states
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProductCatalogues, setSelectedProductCatalogues] = useState<
    string[]
  >([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    [],
  );
  const [sortOption, setSortOption] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Fetch products and filter options
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("🔄 Fetching products...");

        const products = await fetchProducts();
        const options = await fetchFilterOptions();

        console.log("📦 Products loaded:", products.length);
        console.log("🎯 Filter options:", options);

        setAllProducts(products);
        setFilterOptions(options);

        if (options.maxPrice) {
          setMaxPrice(options.maxPrice);
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter logic - Get filtered products based on selected filters
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts) || allProducts.length === 0) return [];

    const filtered = allProducts.filter((product) => {
      if (!product) return false;

      // Price filter
      if (product.price < minPrice || product.price > maxPrice) return false;

      // Gender filter
      if (selectedGenders.length > 0) {
        const productGender = product.gender;
        if (!productGender || !Array.isArray(productGender)) return false;
        if (!selectedGenders.some((g) => productGender.includes(g)))
          return false;
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        if (!product.brand || !selectedBrands.includes(product.brand))
          return false;
      }

      // Size filter
      if (selectedSizes.length > 0) {
        const productSizes = product.sizeOptions || [];
        if (productSizes.length === 0) return false;
        const hasMatchingSize = productSizes.some((size: number) =>
          selectedSizes.includes(size.toString()),
        );
        if (!hasMatchingSize) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        if (!product.category || !selectedCategories.includes(product.category))
          return false;
      }

      // Product Catalogue filter
      if (selectedProductCatalogues.length > 0) {
        const productCatalogue = product.catalogue;
        if (
          !productCatalogue ||
          !selectedProductCatalogues.includes(productCatalogue)
        )
          return false;
      }

      // Sub Categories filter
      if (selectedSubCategories.length > 0) {
        const productSubCategory = product.subCategory;
        if (
          !productSubCategory ||
          !selectedSubCategories.includes(productSubCategory)
        )
          return false;
      }

      return true;
    });

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "newest":
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });
    }

    return filtered;
  }, [
    allProducts,
    minPrice,
    maxPrice,
    selectedGenders,
    selectedBrands,
    selectedSizes,
    selectedCategories,
    selectedProductCatalogues,
    selectedSubCategories,
    sortOption,
  ]);

  // Prepare data for Filters component
  const availableGenders = useMemo(() => {
    const genders = new Set<string>();
    allProducts.forEach((product) => {
      const productGender = product.gender;
      if (productGender && Array.isArray(productGender)) {
        productGender.forEach((g: string) => genders.add(g));
      }
    });
    return Array.from(genders);
  }, [allProducts]);

  const availableProductCatalogues = useMemo(() => {
    const catalogues = new Set<string>();
    allProducts.forEach((product) => {
      const catalogue = product.catalogue;
      if (catalogue) catalogues.add(catalogue);
    });
    return Array.from(catalogues);
  }, [allProducts]);

  const availableSubCategories = useMemo(() => {
    const subCategories = new Set<string>();
    allProducts.forEach((product) => {
      const subCategory = product.subCategory;
      if (subCategory) subCategories.add(subCategory);
    });
    return Array.from(subCategories);
  }, [allProducts]);

  const availableSizesAsString = useMemo(() => {
    return filterOptions.sizes.map((size) => size.toString());
  }, [filterOptions.sizes]);

  // Handlers
  const handleGenderChange = (gender: string) => {
    setSelectedGenders((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender],
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleProductCatalogueChange = (catalogue: string) => {
    setSelectedProductCatalogues((prev) =>
      prev.includes(catalogue)
        ? prev.filter((c) => c !== catalogue)
        : [...prev, catalogue],
    );
  };

  const handleSubCategoryChange = (subCategory: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((s) => s !== subCategory)
        : [...prev, subCategory],
    );
  };

  const handleSortChange = (option: string) => setSortOption(option);

  const clearAllFilters = () => {
    setMinPrice(0);
    setMaxPrice(filterOptions.maxPrice || 10000);
    setSelectedGenders([]);
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSelectedProductCatalogues([]);
    setSelectedSubCategories([]);
    setSortOption("newest");
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#C4F9FF]">
        <CommonPageHeader title="Products" subtitle="Home - Products" />
        <div className="flex justify-center items-center flex-grow">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-[#C4F9FF]">
        <CommonPageHeader title="Products" subtitle="Home - Products" />
        <div className="flex justify-center items-center flex-grow">
          <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {error}
            </h3>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (allProducts.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-[#C4F9FF]">
        <CommonPageHeader title="Products" subtitle="Home - Products" />
        <div className="flex justify-center items-center flex-grow">
          <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <div className="text-5xl mb-4">😔</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No products available
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Check back later for new products!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#C4F9FF]">
      <CommonPageHeader title="Products" subtitle="Home - Products" />

      {/* Mobile Filter Toggle */}
      <div className="md:hidden border-b border-gray-200 flex justify-between items-center px-4 sticky top-0 z-20 py-2 bg-white shadow-sm">
        <h2 className="text-lg font-semibold">
          All Products ({filteredProducts.length})
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-grow">
        {/* Filters Sidebar */}
        <div
          className={`${
            showFilters ? "block" : "hidden"
          } md:block w-full md:w-80 lg:w-96 md:sticky md:top-0 z-10 bg-[#C4F9FF] border-r border-gray-200`}
        >
          <div className="h-full overflow-y-auto">
            <Filters
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedGenders={selectedGenders}
              onGenderChange={handleGenderChange}
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
              selectedSizes={selectedSizes}
              onSizeChange={handleSizeChange}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              selectedProductCatalogues={selectedProductCatalogues}
              onProductCatalogueChange={handleProductCatalogueChange}
              selectedSubCategories={selectedSubCategories}
              onSubCategoryChange={handleSubCategoryChange}
              onClearFilters={clearAllFilters}
              availableGenders={availableGenders}
              availableBrands={filterOptions.brands}
              availableSizes={availableSizesAsString}
              availableCategories={filterOptions.categories}
              availableProductCatalogues={availableProductCatalogues}
              availableSubCategories={availableSubCategories}
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <Products
            products={filteredProducts}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            totalProducts={filteredProducts.length}
            allProductsCount={allProducts.length}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
