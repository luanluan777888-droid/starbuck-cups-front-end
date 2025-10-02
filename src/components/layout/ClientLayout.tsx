"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster, toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearLastAction } from "@/store/slices/cartSlice";

// Dynamic imports để giảm TBT
const Header = dynamic(() => import("@/components/layout/Header"), {
  ssr: false,
  loading: () => (
    <div className="h-16 bg-white border-b border-gray-200 animate-pulse" />
  ),
});

const Footer = dynamic(() => import("@/components/layout/Footer"), {
  ssr: false,
});

const Cart = dynamic(() => import("@/components/ui/Cart"), {
  ssr: false,
});

const FloatingContactButton = dynamic(
  () =>
    import("@/components/ui/FloatingContactButton").then((mod) => ({
      default: mod.FloatingContactButton,
    })),
  {
    ssr: false,
  }
);

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isAdminRoute = pathname?.startsWith("/admin");

  // Get cart state for global notifications
  const { lastAction } = useAppSelector((state) => state.cart);

  // Global cart notification handler
  useEffect(() => {
    if (lastAction) {
      switch (lastAction.type) {
        case "added":
          {
            const colorText = lastAction.colorRequest
              ? ` (màu ${lastAction.colorRequest})`
              : "";
            toast.success(
              `Đã thêm ${lastAction.productName} vào giỏ tư vấn${colorText}`,
              {
                duration: 3000,
              }
            );
          }
          break;
        case "already_exists":
          {
            const colorText = lastAction.colorRequest
              ? ` với màu ${lastAction.colorRequest}`
              : "";
            toast.info(`${lastAction.productName} đã có trong giỏ hàng${colorText}`, {
              duration: 3000,
            });
          }
          break;
      }
      dispatch(clearLastAction());
    }
  }, [lastAction, dispatch]);

  // For admin routes, don't show customer header and cart
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            style: {
              fontFamily: "Inter, sans-serif",
            },
          }}
        />
      </div>
    );
  }

  // For customer routes, show full layout with header and cart
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
      <Cart />
      <FloatingContactButton />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            fontFamily: "Inter, sans-serif",
          },
        }}
      />
    </div>
  );
}

export default ClientLayout;
