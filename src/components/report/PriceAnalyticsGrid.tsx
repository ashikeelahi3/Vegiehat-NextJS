"use client";

import { useReportContext } from "@/context/ReportContext";
import ProductCard from "./ProductCard";

export default function PriceAnalyticsGrid() {
  const { stats, isLoading } = useReportContext();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Product Price Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 dark:bg-gray-700 animate-pulse h-48 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Product Price Analysis
        </h2>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No data available for the selected filters
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Product Price Analysis
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map(product => (
          <ProductCard key={product.productName} product={product} />
        ))}
      </div>
    </div>
  );
} 