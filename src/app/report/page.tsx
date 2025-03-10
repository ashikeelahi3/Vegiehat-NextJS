"use client";

import { Suspense } from "react";
import { ReportContextProvider } from "@/context/ReportContext";
import ReportDashboard from "@/components/report/ReportDashboard";
import ReportSkeleton from "@/components/report/ReportSkeleton";

export default function Report() {
  return (
    <ReportContextProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Price Analytics Dashboard
          </h1>
          
          <Suspense fallback={<ReportSkeleton />}>
            <ReportDashboard />
          </Suspense>
        </div>
      </div>
    </ReportContextProvider>
  );
}

export interface PriceStats {
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  medianPrice: number;
  totalEntries: number;
  unit: string;
  priceChange?: number;
  trendDirection?: 'up' | 'down' | 'stable';
}

export interface DateRangeFilter {
  startDate: Date;
  endDate: Date;
}

export interface LocationFilter {
  district: string;
  upazilla: string;
}

