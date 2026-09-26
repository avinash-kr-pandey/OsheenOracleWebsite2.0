import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/my-requests",
          "/order-confirmation",
          "/reset-password",
          "/cart",
        ],
      },
    ],
    sitemap: "https://osheenoracle.com/sitemap.xml",
  };
}
