"use client";

import { useEffect } from "react";
import { useReportContext } from "@/context/ReportContext";
import StatsSummary from "./StatsSummary";
import DateRangeSelector from "./DateRangeSelector";
import LocationFilter from "./LocationFilter";
import PriceAnalyticsGrid from "./PriceAnalyticsGrid";
import PriceTrendsChart from "./PriceTrendsChart";
import RegionalComparison from "./RegionalComparison";
import ExportData from "./ExportData";
import DistrictReport from "./CoverageMap/DistrictReport";

export default function ReportDashboard() {
  const { 
    stats,
    isLoading, 
    totalSubmissions,
    refreshData 
  } = useReportContext();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Filters
            </h2>
            <ExportData />
          </div>
          <div className="space-y-4">
            <DateRangeSelector />
            <LocationFilter />
          </div>
        </div>
        
        <StatsSummary 
          totalSubmissions={totalSubmissions}
          productCount={stats.length}
          isLoading={isLoading}
        />
      </div>

      <PriceTrendsChart />
      
      <PriceAnalyticsGrid />
      
      <RegionalComparison />

      <DistrictReport />
    </div>
  );
} 