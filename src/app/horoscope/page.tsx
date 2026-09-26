import type { Metadata } from "next";
import Horoscope from '@/components/Horoscope/Horoscope';
import React from 'react';

export const metadata: Metadata = {
  title: "Daily Horoscope & Zodiac Predictions",
  description:
    "Read accurate Daily Horoscopes, Zodiac sign insights, astrological forecasts, love, career, and finance predictions at Osheen Oracle.",
  alternates: {
    canonical: "/horoscope",
  },
};

const page = () => {
  return <div><Horoscope /> </div>;
};

export default page;