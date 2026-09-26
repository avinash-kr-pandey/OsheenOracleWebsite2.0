import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spiritual & Astrology Blog | Cosmic Insights",
  description:
    "Explore cosmic wisdom, spiritual guidance, tarot reading tips, astrological forecasts, and healing articles on the Osheen Oracle Blog.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
