import type { Metadata } from "next";
import ProductListing from "@/components/Products/ProductListing";
import React from "react";

export const metadata: Metadata = {
  title: "Spiritual Products | Crystal Bracelets, Spell Jars & Healing Items",
  description:
    "Shop authentic spiritual products at Osheen Oracle. Explore charged Crystal Bracelets, Spell Jars, Energy Cleansing items, and Healing Tools.",
  alternates: {
    canonical: "/products",
  },
};

const Page = () => {
  return (
    <div className="bg-white min-h-screen">
      <ProductListing />
    </div>
  );
};

export default Page;

