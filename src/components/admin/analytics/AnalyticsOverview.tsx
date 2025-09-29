"use client";

import { MousePointer, ShoppingCart, TrendingUp, Eye } from "lucide-react";
import { AnalyticsSummary } from "@/hooks/admin/useProductAnalytics";

interface AnalyticsOverviewProps {
  data: AnalyticsSummary;
}

export function AnalyticsOverview({ data }: AnalyticsOverviewProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const cards = [
    {
      title: "Tổng lượt click",
      value: formatNumber(data.totalClicks),
      icon: MousePointer,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      description: `${data.uniqueProductsClicked} sản phẩm được click`,
    },
    {
      title: "Tổng lượt thêm giỏ hàng",
      value: formatNumber(data.totalAddToCarts),
      icon: ShoppingCart,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      description: `${data.uniqueProductsAddedToCart} sản phẩm được thêm`,
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: formatPercentage(data.overallConversionRate),
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      description: "Click → Thêm vào giỏ",
    },
    {
      title: "Sản phẩm phổ biến",
      value: data.topClickedProducts.length.toString(),
      icon: Eye,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      description: "Sản phẩm được theo dõi",
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium text-white mb-2">Product Analytics Overview</h2>
        <p className="text-sm text-gray-400">
          Thống kê tương tác người dùng với sản phẩm
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.description}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}