import type { Metadata } from "next";
import React from 'react';

export const metadata: Metadata = {
  title: "Spiritual Services | Tarot Reading & Energy Healing",
  description:
    "Explore our range of spiritual services including Tarot Card Reading, Numerology, Energy Healing, Chakra Balancing, and Astrology Consultations.",
  alternates: {
    canonical: "/services",
  },
};

const page = () => {
  return <div className="text-gray-900 min-h-screen pt-30">Services</div>;
};

export default page;