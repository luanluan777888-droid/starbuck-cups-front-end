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

const Cart = dynamic(() => import("@/components/ui/Cart"), {
  ssr: false,
});

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
        case 'added':
          toast.success(`Đã thêm "${lastAction.productName}" vào giỏ tư vấn`, {
            duration: 3000,
          });
          break;
        case 'already_exists':
          toast.info(`Bạn đã bỏ "${lastAction.productName}" vào giỏ tư vấn rồi`, {
            duration: 3000,
          });
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Cart />
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
