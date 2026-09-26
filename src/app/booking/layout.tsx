import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Spiritual Session & Tarot Consultation",
  description:
    "Book personalized Tarot Reading sessions, Astrology Consultation, Reiki Energy Healing, and Spiritual Counseling with certified experts at Osheen Oracle.",
  alternates: {
    canonical: "/booking",
  },
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
