import type { Metadata } from "next";
import ContactUs from "@/components/Contact/ContactUs";
import React from "react";

export const metadata: Metadata = {
  title: "Contact Us | Get In Touch With Osheen Oracle",
  description:
    "Have questions about our Tarot Readings or Healing Services? Contact Osheen Oracle team via email or phone for personalized assistance.",
  alternates: {
    canonical: "/contact",
  },
};

const page = () => {
  return (
    <div>
      <ContactUs />
    </div>
  );
};

export default page;

