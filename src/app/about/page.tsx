import type { Metadata } from "next";
import AboutHeader from '@/components/About/AboutHeader';
import AboutPage from '@/components/About/AboutPage';
import SecondSession from '@/components/About/SecondSession';
import StarsOnInstagram from '@/components/About/StarsOnInstagram';
import React from 'react';

export const metadata: Metadata = {
  title: "About Us | Our Story & Spiritual Mission",
  description:
    "Learn about Osheen Oracle's journey, our mission of spiritual healing, tarot guidance, and holistic empowerment for your life.",
  alternates: {
    canonical: "/about",
  },
};

const page = () => {
  return (
    <div className="text-gray-900 ">
      {/* <AboutHeader />
      <SecondSession />
      <StarsOnInstagram /> */}
      <AboutPage />
    </div>
  );
};

export default page;