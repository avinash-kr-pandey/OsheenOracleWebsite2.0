// LayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import HeroHeader from "@/components/Hero/HeroHeader";
import Footer from "@/components/Footer/Footer";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  const hideHeaderFooter = isAuthRoute;

  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen flex flex-col">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 2000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                  },
                }}
              />

              {!hideHeaderFooter && <HeroHeader />}

              <main className="flex-1">{children}</main>

              {!hideHeaderFooter && <Footer />}
            </div>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
