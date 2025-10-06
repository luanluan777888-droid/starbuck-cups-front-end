﻿"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { LoadingState } from "@/components/admin/LoadingState";
import { ErrorMessage } from "@/components/admin/ErrorMessage";
import { useStatistics } from "@/hooks/useStatistics";
import { OverviewCards } from "@/components/admin/statistics/OverviewCards";
import { TopSellingProducts } from "@/components/admin/statistics/TopSellingProducts";
import { TopCustomersList } from "@/components/admin/statistics/TopCustomersList";
import { LowStockAlert } from "@/components/admin/statistics/LowStockAlert";
import { RevenueTrend } from "@/components/admin/statistics/RevenueTrend";
import { AnalyticsOverview } from "@/components/admin/analytics/AnalyticsOverview";
import { TopClickedProducts } from "@/components/admin/analytics/TopClickedProducts";
import { TopConversionProducts } from "@/components/admin/analytics/TopConversionProducts";

export default function StatisticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [clickedProductsPage, setClickedProductsPage] = useState(1);
  const [conversionProductsPage, setConversionProductsPage] = useState(1);
  const { data, loading, error, fetchStatistics } = useStatistics(period);

  const handlePeriodChange = (newPeriod: "week" | "month" | "year") => {
    setPeriod(newPeriod);
  };

  const handleClickedProductsPageChange = (page: number) => {
    setClickedProductsPage(page);
  };

  const handleConversionProductsPageChange = (page: number) => {
    setConversionProductsPage(page);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorMessage error={error} onRetry={() => fetchStatistics(period)} />
    );
  }

  if (!data) {
    return (
      <ErrorMessage
        error="Không có dữ liệu thống kê"
        onRetry={() => fetchStatistics(period)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thống kê"
        description="Báo cáo chi tiết về doanh số, khách hàng và sản phẩm"
      />

      {/* Period Selector */}
      <div className="flex space-x-2">
        <button
          onClick={() => handlePeriodChange("week")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === "week"
              ? "bg-gray-700 text-white"
              : "bg-gray-800 text-gray-400 hover:text-gray-300"
          }`}
        >
          Tuần
        </button>
        <button
          onClick={() => handlePeriodChange("month")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === "month"
              ? "bg-gray-700 text-white"
              : "bg-gray-800 text-gray-400 hover:text-gray-300"
          }`}
        >
          Tháng
        </button>
        <button
          onClick={() => handlePeriodChange("year")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            period === "year"
              ? "bg-gray-700 text-white"
              : "bg-gray-800 text-gray-400 hover:text-gray-300"
          }`}
        >
          Năm
        </button>
      </div>

      {/* Overview Cards */}
      <OverviewCards
        data={data.overview}
        period={period}
        lowStockCount={data.lowStockProducts.length}
      />

      {/* Revenue Trend */}
      <RevenueTrend data={data.revenueTrend} period={period} />

      {/* Top Selling Products & Top Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingProducts products={data.topSellingProducts} />
        <TopCustomersList customers={data.topCustomers} />
      </div>

      {/* Low Stock Products Alert */}
      <LowStockAlert products={data.lowStockProducts} />

      {/* Product Analytics Section */}
      {data.productAnalytics && (
        <>
          {/* Analytics Overview */}
          <AnalyticsOverview
            data={{
              totalClicks: data.productAnalytics.summary.totalClicks,
              totalAddToCarts: data.productAnalytics.summary.totalAddToCarts,
              overallConversionRate:
                data.productAnalytics.summary.overallConversionRate,
              uniqueProductsClicked:
                data.productAnalytics.topClickedProducts.length,
              uniqueProductsAddedToCart:
                data.productAnalytics.topAddToCartProducts.length,
              topClickedProducts: data.productAnalytics.topClickedProducts,
              topConversionProducts:
                data.productAnalytics.topConversionProducts,
            }}
          />

          {/* Top Clicked Products & Top Conversion Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopClickedProducts
              page={clickedProductsPage}
              onPageChange={handleClickedProductsPageChange}
              products={data.productAnalytics.topClickedProducts}
              loading={false}
            />
            <TopConversionProducts
              page={conversionProductsPage}
              onPageChange={handleConversionProductsPageChange}
              products={data.productAnalytics.topConversionProducts}
              loading={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
