"use client";

import { PriceStats } from "@/app/report/page";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ProductCardProps {
  product: PriceStats;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    productName,
    minPrice,
    maxPrice,
    avgPrice,
    medianPrice,
    totalEntries,
    unit,
    priceChange = 0,
    trendDirection = "stable"
  } = product;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Get trend icon and color
  const getTrendInfo = () => {
    if (trendDirection === "up") {
      return {
        icon: TrendingUp,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900/20",
        text: `↑ ${priceChange.toFixed(2)}%`
      };
    } else if (trendDirection === "down") {
      return {
        icon: TrendingDown,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/20",
        text: `↓ ${Math.abs(priceChange).toFixed(2)}%`
      };
    } else {
      return {
        icon: Minus,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/20",
        text: "Stable"
      };
    }
  };

  const trend = getTrendInfo();
  const TrendIcon = trend.icon;

  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden hover:shadow-md transition-shadow">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">
          {productName}
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${trend.color} ${trend.bgColor}`}>
          <span className="flex items-center">
            <TrendIcon className="w-3 h-3 mr-1" />
            {trend.text}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Average Price</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(avgPrice)}/{unit}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Median Price</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(medianPrice)}/{unit}
            </p>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Min: </span>
            <span className="font-medium text-gray-900 dark:text-white">{formatPrice(minPrice)}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Max: </span>
            <span className="font-medium text-gray-900 dark:text-white">{formatPrice(maxPrice)}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Entries: </span>
            <span className="font-medium text-gray-900 dark:text-white">{totalEntries}</span>
          </div>
        </div>

        <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500"
            style={{
              width: `${((avgPrice - minPrice) / (maxPrice - minPrice)) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 