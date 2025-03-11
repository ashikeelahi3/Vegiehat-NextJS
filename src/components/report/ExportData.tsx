"use client";

import { useState } from "react";
// import { Download, FileSpreadsheet, FileCsv } from "lucide-react";
import { Download, FileSpreadsheet } from "lucide-react";
import { useReportContext } from "@/context/ReportContext";
import { toast } from "react-hot-toast";

export default function ExportData() {
  const { stats, dateRange, locationFilter } = useReportContext();
  const [isExporting, setIsExporting] = useState(false);
  
  const generateCSV = () => {
    if (stats.length === 0) {
      toast.error("No data available to export");
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Generate CSV headers
      const headers = [
        "Product", 
        "Min Price (৳)", 
        "Max Price (৳)", 
        "Average Price (৳)", 
        "Median Price (৳)", 
        "Entries", 
        "Unit", 
        "Price Change (%)", 
        "Trend"
      ];
      
      // Generate CSV rows
      const rows = stats.map(product => [
        product.productName,
        product.minPrice.toString(),
        product.maxPrice.toString(),
        product.avgPrice.toFixed(2),
        product.medianPrice.toFixed(2),
        product.totalEntries.toString(),
        product.unit,
        product.priceChange ? product.priceChange.toString() : "0",
        product.trendDirection || "stable"
      ]);
      
      // Build the CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      // Add filter information
      const locationInfo = locationFilter.district 
        ? (locationFilter.upazilla 
            ? `${locationFilter.upazilla}, ${locationFilter.district}` 
            : locationFilter.district)
        : "All Locations";
        
      const dateInfo = `${dateRange.startDate.toLocaleDateString()} to ${dateRange.endDate.toLocaleDateString()}`;
      
      const metadataContent = `
Data Export
Date Range: ${dateInfo}
Location: ${locationInfo}
Exported on: ${new Date().toLocaleString()}
      `;
      
      // Create the full CSV content with metadata
      const fullCSV = metadataContent + "\n\n" + csvContent;
      
      // Create a download link
      const blob = new Blob([fullCSV], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      // Create a hidden link and trigger download
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `price_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={generateCSV}
        disabled={isExporting || stats.length === 0}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <><div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> Exporting...</>
        ) : (
          <><Download className="w-4 h-4" /> Export Report</>
        )}
      </button>
    </div>
  );
} 