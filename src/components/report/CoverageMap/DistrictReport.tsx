"use client";

import { useState } from 'react';
import DistrictMap from './DistrictMap';

// Define types for district statistics
interface DistrictStatistics {
  totalFarmers: number;
  totalArea: number;
  mainCrops: string[];
  averageYield: number;
}

const DistrictReport = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtStats, setDistrictStats] = useState<DistrictStatistics | null>(null);

  // Handle district selection
  const handleDistrictClick = (districtName: string) => {
    setSelectedDistrict(districtName);
    
    // In a real application, you would fetch data for this district
    // For now, we'll simulate some data
    setDistrictStats({
      totalFarmers: Math.floor(Math.random() * 10000) + 5000,
      totalArea: Math.floor(Math.random() * 1000) + 200,
      mainCrops: ['Rice', 'Vegetables', 'Fruits'].sort(() => 0.5 - Math.random()).slice(0, 2),
      averageYield: parseFloat((Math.random() * 5 + 2).toFixed(1))
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Bangladesh District Map
      </h2>
      
      <div className="mb-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Interactive District Map
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Click on a district to view agricultural data
            </p>
          </div>
          <div className="h-[500px]">
            <DistrictMap 
              height="100%" 
              selectedDistrict={selectedDistrict}
              onDistrictClick={handleDistrictClick} 
            />
          </div>
        </div>
      </div>
      
      {selectedDistrict && districtStats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedDistrict} District Statistics
            </h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Total Farmers
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {districtStats.totalFarmers.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Total Agricultural Area
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {districtStats.totalArea.toLocaleString()} km²
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Main Crops
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {districtStats.mainCrops.join(', ')}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Average Yield
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {districtStats.averageYield} tons/hectare
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Data is for demonstration purposes only. In a production environment, real district data would be displayed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictReport;