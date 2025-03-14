"use client";

import { useState } from 'react';
import DistrictMap from './DistrictMap';
import DistrictReportContent from './DistrictReportContent';
import { X } from "lucide-react";

const DistrictReport = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Handle district selection and show modal
  const handleDistrictClick = (districtName: string) => {
    setSelectedDistrict(districtName);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
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
              Click on a district to view price submission data
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
      
      {/* District Data Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedDistrict} District Price Data
              </h3>
              <button 
                onClick={handleCloseModal}
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
                onClick={handleCloseModal}
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
};

export default DistrictReport;