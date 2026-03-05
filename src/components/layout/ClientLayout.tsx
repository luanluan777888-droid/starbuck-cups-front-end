
import React, { Suspense } from "react";

import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster, toast } from "sonner";
import { useAppSelector, useAppDispatch } from "@/store";
import { clearLastAction } from "@/store/slices/cartSlice";
import EffectsRuntime from "@/components/layout/EffectsRuntime";

// Dynamic imports để giảm TBT
const Header = React.lazy(() =>
  import("@/components/layout/Header").then((m) => ({ default: m.Header ?? m.default }))
);

const Footer = React.lazy(() => import("@/components/layout/Footer").then(module => ({ default: module.Footer || module.default })));

const Cart = React.lazy(() => import("@/components/ui/Cart").then(module => ({ default: module.Cart || module.default })));

const FloatingContactButton = React.lazy(() =>
  import("@/components/ui/FloatingContactButton").then((mod) => ({
    default: mod.FloatingContactButton,
  }))
);

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = useLocation().pathname;
  const isAdminRoute = pathname?.startsWith("/admin");

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

  return <PublicClientLayout>{children}</PublicClientLayout>;
}

function PublicClientLayout({ children }: ClientLayoutProps) {
  const dispatch = useAppDispatch();
  const { lastAction, isOpen: isCartOpen } = useAppSelector(
    (state) => state.cart
  );

  useEffect(() => {
    if (!lastAction) return;

    switch (lastAction.type) {
      case "added":
        toast.success(`Đã thêm ${lastAction.productName} vào giỏ tư vấn`, {
          duration: 3000,
        });
        break;
      case "already_exists":
        toast.info(`${lastAction.productName} đã có trong giỏ tư vấn`, {
          duration: 3000,
        });
        break;
    }

    dispatch(clearLastAction());
  }, [lastAction, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <EffectsRuntime />
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
      {isCartOpen ? <Cart /> : null}
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
