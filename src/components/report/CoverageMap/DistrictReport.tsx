"use client";

import { useState, useEffect } from 'react';
import { supabase } from "../../../../lib/supabase";
import DistrictMap from './DistrictMap';
import { Loader2 } from "lucide-react";

// Define types for district statistics
interface DistrictStatistics {
  productPrices: ProductPriceData[];
}

// Define type for product-wise price data
interface ProductPriceData {
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  submissionCount: number;
}

const DistrictReport = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [districtStats, setDistrictStats] = useState<DistrictStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Handle district selection and fetch real data
  const handleDistrictClick = async (districtName: string) => {
    setSelectedDistrict(districtName);
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch detailed product data for this district
      const { data: productDetailData, error: productDetailError } = await supabase
        .from("price_entries_2")
        .select("product_name, price")
        .eq("district", districtName);
      
      if (productDetailError) throw new Error(`Failed to fetch product detail data: ${productDetailError.message}`);
      
      // Group by product to calculate product-wise statistics
      const productGroups: Record<string, number[]> = {};
      productDetailData?.forEach(item => {
        if (!productGroups[item.product_name]) {
          productGroups[item.product_name] = [];
        }
        productGroups[item.product_name].push(item.price);
      });
      
      // Calculate statistics for each product
      const productPrices: ProductPriceData[] = Object.entries(productGroups).map(([productName, prices]) => {
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
        
        return {
          productName,
          minPrice,
          maxPrice,
          avgPrice,
          submissionCount: prices.length
        };
      });
      
      // Sort by submission count (most submissions first)
      productPrices.sort((a, b) => b.submissionCount - a.submissionCount);
      
      setDistrictStats({
        productPrices
      });
    } catch (err: any) {
      console.error("Error fetching district data:", err);
      setError(err.message || "Failed to load district data");
      setDistrictStats(null);
    } finally {
      setIsLoading(false);
    }
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
      
      {selectedDistrict && isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedDistrict} District Statistics
            </h3>
          </div>
          <div className="p-20 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading data...</span>
          </div>
        </div>
      )}

      {selectedDistrict && error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Error
            </h3>
          </div>
          <div className="p-6 text-center">
            <p className="text-red-500 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      {selectedDistrict && districtStats && !isLoading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {selectedDistrict} Product-wise Price Breakdown
            </h3>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Min Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Max Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Avg Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Submissions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {districtStats.productPrices.map((product, index) => (
                    <tr key={product.productName} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/30'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ৳{product.minPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ৳{product.maxPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ৳{product.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                          {product.submissionCount}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {districtStats.productPrices.length === 0 && (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                No product price data available for this district
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictReport;