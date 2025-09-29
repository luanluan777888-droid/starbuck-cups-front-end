"use client";

import { MousePointer, ShoppingCart } from "lucide-react";
import { ProductAnalytics } from "@/hooks/admin/useProductAnalytics";

interface TopClickedProductsProps {
  products: ProductAnalytics[];
}

export function TopClickedProducts({ products }: TopClickedProductsProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  if (products.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Top Clicked Products
        </h3>
        <p className="text-gray-400 text-center py-8">
          Chưa có dữ liệu về sản phẩm được click
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Top Clicked Products</h3>
        <p className="text-sm text-gray-400">{products.length} sản phẩm</p>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={product.productId}
            className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                #{index + 1}
              </div>

              <div>
                <h4 className="font-medium text-white truncate max-w-48">
                  {product.productName || `Product ${product.productId}`}
                </h4>
                <p className="text-xs text-gray-400">
                  Lần cuối: {formatDate(product.lastClicked)}
                </p>
              </div>
            </div>

            <div className="text-right space-y-1">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-blue-400">
                  <MousePointer className="w-4 h-4" />
                  <span className="text-sm font-medium">{product.clickCount}</span>
                </div>

                <div className="flex items-center space-x-1 text-green-400">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-sm font-medium">{product.addToCartCount}</span>
                </div>
              </div>

              <div className="text-xs text-gray-400">
                Chuyển đổi: {formatPercentage(product.conversionRate)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}