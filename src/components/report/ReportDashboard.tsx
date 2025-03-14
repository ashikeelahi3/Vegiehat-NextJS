"use client";

import { useState, useEffect } from "react";
import { useReportContext } from "@/context/ReportContext";
import StatsSummary from "./StatsSummary";
import DateRangeSelector from "./DateRangeSelector";
import LocationFilter from "./LocationFilter";
import PriceAnalyticsGrid from "./PriceAnalyticsGrid";
import PriceTrendsChart from "./PriceTrendsChart";
import RegionalComparison from "./RegionalComparison";
import ExportData from "./ExportData";
import DistrictReport from "./CoverageMap/DistrictReport";
import DistrictMap from "./CoverageMap/DistrictMap";
import { X } from "lucide-react";
import DistrictReportContent from "./CoverageMap/DistrictReportContent";

export default function ReportDashboard() {
  const { 
    stats,
    isLoading, 
    totalSubmissions,
    refreshData 
  } = useReportContext();
  const [isDistrictModalOpen, setIsDistrictModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  // Handle district selection from the map
  const handleDistrictSelect = (districtName: string) => {
    setSelectedDistrict(districtName);
    setIsDistrictModalOpen(true);
  };

  // Close the district report modal
  const closeDistrictModal = () => {
    setIsDistrictModalOpen(false);
  };
  
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

      {/* District Map Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Bangladesh District Map
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Click on a district to view detailed price statistics.
        </p>
        <div className="h-[500px] bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <DistrictMap 
            height="100%" 
            selectedDistrict={selectedDistrict}
            onDistrictClick={handleDistrictSelect} 
          />
        </div>
      </div>

      {/* District Report Modal */}
      {isDistrictModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedDistrict} District Price Data
              </h3>
              <button 
                onClick={closeDistrictModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <DistrictReportContent 
                districtName={selectedDistrict}
                inModal={true}
              />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
              <button
                onClick={closeDistrictModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-gray-800 dark:text-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}