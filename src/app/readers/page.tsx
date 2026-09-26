import type { Metadata } from "next";
import React from 'react';

export const metadata: Metadata = {
  title: "Our Expert Readers & Spiritual Mentors",
  description:
    "Meet our certified tarot readers, astrologers, numerologists, and spiritual healers at Osheen Oracle dedicated to guiding your life path.",
  alternates: {
    canonical: "/readers",
  },
};

const page = () => {
  return <div className="text-gray-900"> Readers</div>;
};

export default page;