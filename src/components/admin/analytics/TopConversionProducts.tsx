"use client";

import { TrendingUp, MousePointer, ShoppingCart } from "lucide-react";
import { ProductAnalytics } from "@/hooks/admin/useProductAnalytics";

interface TopConversionProductsProps {
  products: ProductAnalytics[];
}

export function TopConversionProducts({ products }: TopConversionProductsProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const getConversionColor = (rate: number) => {
    if (rate >= 50) return "text-green-400";
    if (rate >= 25) return "text-yellow-400";
    return "text-red-400";
  };

  const getConversionBgColor = (rate: number) => {
    if (rate >= 50) return "bg-green-500/20";
    if (rate >= 25) return "bg-yellow-500/20";
    return "bg-red-500/20";
  };

  // Filter products with meaningful conversion data (at least 1 click)
  const meaningfulProducts = products.filter(product => product.clickCount > 0);

  if (meaningfulProducts.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-white mb-4">
          Top Conversion Products
        </h3>
        <p className="text-gray-400 text-center py-8">
          Chưa có dữ liệu về tỷ lệ chuyển đổi
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">Top Conversion Products</h3>
        <p className="text-sm text-gray-400">{meaningfulProducts.length} sản phẩm</p>
      </div>

      <div className="space-y-4">
        {meaningfulProducts.map((product, index) => (
          <div
            key={product.productId}
            className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 ${getConversionBgColor(product.conversionRate)} ${getConversionColor(product.conversionRate)} rounded-full text-sm font-medium`}>
                #{index + 1}
              </div>

              <div>
                <h4 className="font-medium text-white truncate max-w-48">
                  {product.productName || `Product ${product.productId}`}
                </h4>
                <p className="text-xs text-gray-400">
                  Cập nhật: {formatDate(product.lastAddedToCart)}
                </p>
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className={`flex items-center space-x-2 ${getConversionColor(product.conversionRate)}`}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-lg font-bold">
                  {formatPercentage(product.conversionRate)}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <MousePointer className="w-3 h-3" />
                  <span>{product.clickCount}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <ShoppingCart className="w-3 h-3" />
                  <span>{product.addToCartCount}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {meaningfulProducts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <div className="text-xs text-gray-500 space-y-1">
            <div>🟢 Tỷ lệ cao: ≥50% (Rất tốt)</div>
            <div>🟡 Tỷ lệ trung bình: 25-49% (Có thể cải thiện)</div>
            <div>🔴 Tỷ lệ thấp: &lt;25% (Cần tối ưu)</div>
          </div>
        </div>
      )}
    </div>
  );
}