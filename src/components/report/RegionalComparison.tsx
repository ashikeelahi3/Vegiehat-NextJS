"use client";

import { useState, useEffect } from "react";
import { useReportContext } from "@/context/ReportContext";
import { fetchRegionalPriceComparison } from "@/services/dataAnalyzerService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface RegionalComparisonData {
  district: string;
  avgPrice: number;
  sampleSize: number;
}

export default function RegionalComparison() {
  const { stats, dateRange, isLoading } = useReportContext();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [regionalData, setRegionalData] = useState<RegionalComparisonData[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  
  // Update product selection when stats change
  useEffect(() => {
    if (stats.length > 0 && !selectedProduct) {
      setSelectedProduct(stats[0].productName);
    }
  }, [stats, selectedProduct]);
  
  // Fetch regional comparison data when product changes
  useEffect(() => {
    async function fetchRegionalData() {
      if (!selectedProduct) {
        setRegionalData([]);
        return;
      }
      
      setIsChartLoading(true);
      try {
        const comparisonData = await fetchRegionalPriceComparison(
          selectedProduct,
          dateRange
        );
        
        setRegionalData(comparisonData);
      } catch (error) {
        console.error("Error fetching regional comparison data:", error);
        setRegionalData([]);
      } finally {
        setIsChartLoading(false);
      }
    }
    
    fetchRegionalData();
  }, [selectedProduct, dateRange]);
  
  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProduct(e.target.value);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("bn-BD", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Regional Price Comparison
        </h2>
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Regional Price Comparison
      </h2>
      
      {stats.length > 0 ? (
        <>
          <div className="mb-4">
            <label htmlFor="product-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Product
            </label>
            <select
              id="product-select"
              value={selectedProduct}
              onChange={handleProductChange}
              className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {stats.map(product => (
                <option key={product.productName} value={product.productName}>
                  {product.productName}
                </option>
              ))}
            </select>
          </div>
          
          <div className="h-64">
            {isChartLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : regionalData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={regionalData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `৳${value}`}
                  />
                  <YAxis 
                    dataKey="district" 
                    type="category"
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatPrice(Number(value)), 'Average Price']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="avgPrice" 
                    name="Average Price" 
                    fill="#8884d8" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <p>No regional data available for the selected product</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>No products available for comparison</p>
        </div>
      )}
    </div>
  );
} 