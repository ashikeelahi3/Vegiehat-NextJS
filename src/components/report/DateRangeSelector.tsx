"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import { useReportContext } from "@/context/ReportContext";

export default function DateRangeSelector() {
  const { dateRange, setDateRange, refreshData } = useReportContext();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newDate = new Date(value);
    setDateRange({
      ...dateRange,
      [field]: newDate
    });
  };

  const handleQuickSelect = (days: number) => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    setDateRange({ startDate, endDate });
    setIsOpen(false);
    refreshData();
  };

  const handleApply = () => {
    setIsOpen(false);
    refreshData();
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Date Range
      </label>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
        </span>
        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input 
                aria-label="Start Date"
                type="date" 
                value={dateRange.startDate.toISOString().substring(0, 10)}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input 
                aria-label="End Date"
                type="date"
                value={dateRange.endDate.toISOString().substring(0, 10)}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => handleQuickSelect(7)}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Last 7 days
            </button>
            <button 
              onClick={() => handleQuickSelect(30)}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Last 30 days
            </button>
            <button 
              onClick={() => handleQuickSelect(90)}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Last 3 months
            </button>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={handleApply}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 