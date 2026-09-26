import type { Metadata } from "next";
import { Charm, Cormorant, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";

// Fonts
const charm = Charm({
  variable: "--font-charm",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});
const cormorant = Cormorant({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-MEASUREMENT_ID";

// Global Metadata Configuration
export const metadata: Metadata = {
  metadataBase: new URL("https://osheenoracle.com"),
  title: {
    default: "Osheen Oracle | Tarot Reading, Astrology & Spiritual Healing",
    template: "%s | Osheen Oracle",
  },
  description:
    "Welcome to Osheen Oracle - Let The Healing Begin. Discover authentic Tarot Readings, Astrology Guidance, Daily Horoscopes, Spiritual Healing Services, Crystal Bracelets, and Spell Jars.",
  keywords: [
    "Osheen Oracle",
    "Tarot Reading",
    "Astrology",
    "Spiritual Healing",
    "Daily Horoscope",
    "Oracle Cards",
    "Psychic Reader",
    "Chakra Healing",
    "Crystal Bracelets",
    "Spell Jars",
  ],
  authors: [{ name: "Osheen Oracle" }],
  creator: "Osheen Oracle",
  publisher: "Osheen Oracle",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://osheenoracle.com",
    siteName: "Osheen Oracle",
    title: "Osheen Oracle | Tarot Reading, Astrology & Spiritual Healing",
    description:
      "Transform your life with expert Tarot Readings, Personal Astrology Consultation, Daily Horoscopes, and Healing Products.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Osheen Oracle Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Osheen Oracle | Tarot Reading, Astrology & Spiritual Healing",
    description:
      "Transform your life with expert Tarot Readings, Personal Astrology Consultation, Daily Horoscopes, and Healing Products.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://osheenoracle.com/#organization",
        "name": "Osheen Oracle",
        "url": "https://osheenoracle.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://osheenoracle.com/logo.png",
        },
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+91-8146668328",
            "contactType": "customer service",
            "availableLanguage": ["English", "Hindi"],
          },
        ],
        "sameAs": ["https://www.instagram.com/osheen_oracle"],
      },
      {
        "@type": "WebSite",
        "@id": "https://osheenoracle.com/#website",
        "url": "https://osheenoracle.com",
        "name": "Osheen Oracle",
        "description":
          "Authentic Tarot Card Reading, Astrology Consultations, Energy Healing, and Spiritual Wellness Products",
        "publisher": {
          "@id": "https://osheenoracle.com/#organization",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        {/* Google Analytics GA4 Script */}
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* Schema.org Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${charm.variable} ${cormorant.variable} ${montserrat.variable} antialiased`}
      >
        {/* All providers are inside LayoutWrapper */}
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}


