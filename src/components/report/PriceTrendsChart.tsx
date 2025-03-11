"use client";

import { useState, useEffect } from "react";
import { useReportContext } from "@/context/ReportContext";
import { fetchPriceTimeSeries, PriceDataPoint } from "@/services/dataAnalyzerService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from "../../../lib/supabase";
import { DateRangeFilter } from "@/app/report/page";
import { LocationFilter } from "@/types/analytics";

// Define specific color constants that will survive Tailwind's purge
const CHART_COLORS = [
  { color: '#2563eb', hoverColor: '#1d4ed8' }, // blue-600, blue-700
  { color: '#8b5cf6', hoverColor: '#7c3aed' }, // violet-500, violet-600
  { color: '#ec4899', hoverColor: '#db2777' }, // pink-500, pink-600
  { color: '#ef4444', hoverColor: '#dc2626' }, // red-500, red-600
  { color: '#f59e0b', hoverColor: '#d97706' }, // amber-500, amber-600
  { color: '#10b981', hoverColor: '#059669' }, // emerald-500, emerald-600
  { color: '#06b6d4', hoverColor: '#0891b2' }, // cyan-500, cyan-600
  { color: '#6366f1', hoverColor: '#4f46e5' }, // indigo-500, indigo-600
  { color: '#84cc16', hoverColor: '#65a30d' }, // lime-500, lime-600
  { color: '#14b8a6', hoverColor: '#0d9488' }, // teal-500, teal-600
  { color: '#f472b6', hoverColor: '#db2777' }, // pink-400, pink-600
  { color: '#9333ea', hoverColor: '#7e22ce' }  // purple-600, purple-700
];

// These classes are predefined in Tailwind and safe from purging
const PRODUCT_BUTTON_CLASSES = {
  base: "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
  inactive: "bg-gray-100 border-gray-300 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300",
  active: {
    blue: "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300",
    violet: "bg-violet-100 border-violet-300 text-violet-800 dark:bg-violet-900/30 dark:border-violet-700 dark:text-violet-300",
    pink: "bg-pink-100 border-pink-300 text-pink-800 dark:bg-pink-900/30 dark:border-pink-700 dark:text-pink-300",
    red: "bg-red-100 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300",
    amber: "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-300",
    emerald: "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300",
    cyan: "bg-cyan-100 border-cyan-300 text-cyan-800 dark:bg-cyan-900/30 dark:border-cyan-700 dark:text-cyan-300",
    indigo: "bg-indigo-100 border-indigo-300 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-700 dark:text-indigo-300",
    lime: "bg-lime-100 border-lime-300 text-lime-800 dark:bg-lime-900/30 dark:border-lime-700 dark:text-lime-300",
    teal: "bg-teal-100 border-teal-300 text-teal-800 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-300",
    fuchsia: "bg-fuchsia-100 border-fuchsia-300 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:border-fuchsia-700 dark:text-fuchsia-300",
    purple: "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300"
  }
};

// Define corresponding color names for the active classes
const COLOR_NAMES = ['blue', 'violet', 'pink', 'red', 'amber', 'emerald', 'cyan', 'indigo', 'lime', 'teal', 'fuchsia', 'purple'];

/**
 * Get available products from the database
 */
export async function getAvailableProducts(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("price_entries_2")
      .select("product_name")
      .order("product_name");
    
    if (error) {
      console.error("Error fetching available products:", error);
      return [];
    }
    
    // Extract unique product names
    const uniqueProducts = new Set<string>();
    data?.forEach(item => {
      if (item.product_name) {
        uniqueProducts.add(item.product_name);
      }
    });
    
    return Array.from(uniqueProducts);
  } catch (error) {
    console.error("Error in getAvailableProducts:", error);
    return [];
  }
}

/**
 * Analyze price trends over time for specific products
 * This provides more detailed trend analysis than the basic stats
 */
export async function analyzePriceTrendsOverTime(
  productNames: string[],
  dateRange: DateRangeFilter,
  locationFilter: LocationFilter
): Promise<{
  trendData: PriceDataPoint[],
  trendAnalysis: {
    productName: string,
    overallTrend: 'increasing' | 'decreasing' | 'stable',
    percentageChange: number,
    volatility: number,
    seasonalPatterns: boolean
  }[]
}> {
  try {
    // If no products specified, get all available products
    let productsToAnalyze = productNames;
    if (productsToAnalyze.length === 0) {
      productsToAnalyze = await getAvailableProducts();
    }
    
    if (productsToAnalyze.length === 0) {
      return { trendData: [], trendAnalysis: [] };
    }
    
    // Get time series data
    const timeSeriesData = await fetchPriceTimeSeries(productsToAnalyze, dateRange, locationFilter);
    
    if (!timeSeriesData || timeSeriesData.length === 0) {
      return { trendData: [], trendAnalysis: [] };
    }
    
    // Group data by product
    const productGroups: Record<string, PriceDataPoint[]> = {};
    
    timeSeriesData.forEach(dataPoint => {
      if (!productGroups[dataPoint.product]) {
        productGroups[dataPoint.product] = [];
      }
      
      productGroups[dataPoint.product].push(dataPoint);
    });
    
    // Analyze trends for each product
    const trendAnalysis = Object.entries(productGroups).map(([productName, dataPoints]) => {
      // Sort by date
      dataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Calculate overall trend
      const firstPrice = dataPoints[0]?.price || 0;
      const lastPrice = dataPoints[dataPoints.length - 1]?.price || 0;
      const percentageChange = firstPrice > 0 
        ? ((lastPrice - firstPrice) / firstPrice) * 100 
        : 0;
      
      // Determine trend direction
      let overallTrend: 'increasing' | 'decreasing' | 'stable' = 'stable';
      if (percentageChange > 5) overallTrend = 'increasing';
      else if (percentageChange < -5) overallTrend = 'decreasing';
      
      // Calculate volatility (standard deviation of price changes)
      const priceChanges = [];
      for (let i = 1; i < dataPoints.length; i++) {
        priceChanges.push(dataPoints[i].price - dataPoints[i-1].price);
      }
      
      const avgChange = priceChanges.reduce((sum, change) => sum + change, 0) / 
        (priceChanges.length || 1);
      
      const volatility = Math.sqrt(
        priceChanges.reduce((sum, change) => sum + Math.pow(change - avgChange, 2), 0) / 
        (priceChanges.length || 1)
      );
      
      // Check for seasonal patterns (simplified)
      const seasonalPatterns = false; // Simplified implementation
      
      return {
        productName,
        overallTrend,
        percentageChange: parseFloat(percentageChange.toFixed(2)),
        volatility: parseFloat(volatility.toFixed(2)),
        seasonalPatterns
      };
    });
    
    return {
      trendData: timeSeriesData,
      trendAnalysis
    };
  } catch (error) {
    console.error("Error in analyzePriceTrendsOverTime:", error);
    return { trendData: [], trendAnalysis: [] };
  }
}

export default function PriceTrendsChart() {
  const { stats, dateRange, locationFilter, isLoading } = useReportContext();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  
  // Initialize with top 5 products selected
  // Define the PriceStats type
  type PriceStats = {
    productName: string;
    dataCount?: number; // Optional to avoid errors if it's sometimes missing
    // Add other properties as necessary
  };

  useEffect(() => {
    if (stats.length > 0 && selectedProducts.length === 0) {
      // Sort products by data count (assuming more inputs means more important)
      const sortedStats = [...(stats as PriceStats[])].sort((a, b) =>
        (b.dataCount || 0) - (a.dataCount || 0)
      );

      // Select top 5 or fewer if less than 5 are available
      const topProducts = sortedStats.slice(0, 5).map(product => product.productName);
      setSelectedProducts(topProducts);
    }
  }, [stats, selectedProducts.length]);
  
  const toggleProduct = (productName: string) => {
    setSelectedProducts(prev => 
      prev.includes(productName)
        ? prev.filter(p => p !== productName)
        : [...prev, productName]
    );
  };
  
  // Add select/deselect all functionality
  const toggleAllProducts = () => {
    if (selectedProducts.length === stats.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(stats.map(product => product.productName));
    }
  };
  
  // Fetch time series data when selection changes
  useEffect(() => {
    async function fetchTimeSeriesData() {
      if (selectedProducts.length === 0) {
        setChartData([]);
        return;
      }
      
      setIsChartLoading(true);
      try {
        const timeSeriesData = await fetchPriceTimeSeries(
          selectedProducts,
          dateRange,
          locationFilter
        );
        
        // Process data for chart
        const processedData = processTimeSeriesForChart(timeSeriesData);
        setChartData(processedData);
      } catch (error) {
        console.error("Error fetching time series data:", error);
      } finally {
        setIsChartLoading(false);
      }
    }
    
    fetchTimeSeriesData();
  }, [selectedProducts, dateRange, locationFilter]);
  
  // Process time series data into a format suitable for the chart
  const processTimeSeriesForChart = (data: PriceDataPoint[]) => {
    // Create a map of all dates and initialize with null values for all products
    const dateGroups: Record<string, Record<string, number | null>> = {};
    const products = new Set(data.map(point => point.product));
  
    // First pass: collect all unique dates
    data.forEach(point => {
      if (!dateGroups[point.date]) {
        dateGroups[point.date] = {};
        // Initialize all products with null for this date
        products.forEach(product => {
          dateGroups[point.date][product] = null;
        });
      }
    });
  
    // Second pass: fill in actual values
    data.forEach(point => {
      if (dateGroups[point.date][point.product] !== null) {
        // If there's already a value, take average
        dateGroups[point.date][point.product] = 
          ((dateGroups[point.date][point.product] as number) + point.price) / 2;
      } else {
        dateGroups[point.date][point.product] = point.price;
      }
    });
  
    // Convert to array and sort by date
    return Object.entries(dateGroups)
      .map(([date, products]) => ({
        date,
        ...products
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  // Get product button class based on index and selection state
  const getProductButtonClass = (productName: string, index: number): string => {
    const baseClass = PRODUCT_BUTTON_CLASSES.base;
    
    if (!selectedProducts.includes(productName)) {
      return `${baseClass} ${PRODUCT_BUTTON_CLASSES.inactive}`;
    }
    
    const colorName = COLOR_NAMES[index % COLOR_NAMES.length];
    return `${baseClass} ${PRODUCT_BUTTON_CLASSES.active[colorName as keyof typeof PRODUCT_BUTTON_CLASSES.active]}`;
  };
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Price Trends Over Time
        </h2>
        <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
         Price Trends Over Time
      </h2>
      
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {selectedProducts.length} of {stats.length} products selected
        </span>
        <button
          onClick={toggleAllProducts}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          {selectedProducts.length === stats.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {stats.map((product, index) => (
          <button
            key={product.productName}
            onClick={() => toggleProduct(product.productName)}
            className={getProductButtonClass(product.productName, index)}
          >
            {product.productName}
          </button>
        ))}
      </div>
      
      <div className="h-96"> {/* Increased height from h-64 to h-96 */}
        {isChartLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : selectedProducts.length > 0 && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getDate()}/${d.getMonth() + 1}`;
                }}
                height={50}
                interval="preserveStartEnd"
                minTickGap={20}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `৳${value}`}
                width={60}
              />
              <Tooltip 
                formatter={(value: any) => [`৳${Number(value).toFixed(2)}`, '']}
                labelFormatter={(label: any) => new Date(label).toLocaleDateString()}
                isAnimationActive={false}
                wrapperStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {selectedProducts.map((product, index) => (
                <Line
                  key={product}
                  type="monotone"
                  dataKey={product}
                  stroke={CHART_COLORS[index % CHART_COLORS.length].color}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  name={product}
                  connectNulls={true}
                  dot={{ strokeWidth: 1, r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>Select products above to view their price trends</p>
          </div>
        )}
      </div>
    </div>
  );
}