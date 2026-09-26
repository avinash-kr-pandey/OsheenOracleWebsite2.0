import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) | Osheen Oracle",
  description:
    "Find answers to common questions about Tarot Readings, Astrological Guidance, Session Bookings, Membership Plans, and Healing Products at Osheen Oracle.",
  alternates: {
    canonical: "/faq",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
