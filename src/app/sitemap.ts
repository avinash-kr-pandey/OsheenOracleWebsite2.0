import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://osheenoracle.com";
  const currentDate = new Date().toISOString();

  const routes = [
    "",
    "/about",
    "/services",
    "/booking",
    "/horoscope",
    "/products",
    "/catalogue",
    "/readers",
    "/blog",
    "/contact",
    "/faq",
    "/privacypolicy",
    "/termsofservice",
    "/refundpolicy",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/services" || route === "/booking" || route === "/products" ? 0.9 : 0.8,
  }));
}
