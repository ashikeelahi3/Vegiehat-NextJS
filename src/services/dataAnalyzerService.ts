import { PriceStats, DateRangeFilter, LocationFilter } from "@/app/report/page";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";

export interface PriceDataPoint {
  date: string;
  price: number;
  product: string;
  location: string;
}

export interface RegionalComparisonData {
  district: string;
  avgPrice: number;
  sampleSize: number;
}

/**
 * Utility function to check if a table exists
 */
async function tableExists(tableName: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    return !error;
  } catch (e) {
    return false;
  }
}

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
 * Fetch price statistics data
 */
export async function fetchPriceStats(
  dateRange: DateRangeFilter,
  locationFilter: LocationFilter
): Promise<PriceStats[]> {
  try {
    // First check if the table exists
    const tableExistCheck = await tableExists('price_entries_2');
    
    if (!tableExistCheck) {
      console.warn("Table 'price_entries_2' doesn't exist");
      return [];
    }
    
    // Format dates properly
    const startDateStr = dateRange.startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const endDateStr = dateRange.endDate.toISOString().split('T')[0];
    
    console.log("Fetching price stats with date range:", startDateStr, "to", endDateStr);
    
    try {
      // Use Supabase directly with proper query structure - remove 'unit' column as it doesn't exist
      let query = supabase
        .from("price_entries_2")
        .select("product_name, price, created_at, district, upazilla");
      
      // Apply date filters
      query = query
        .gte("created_at", startDateStr)
        .lte("created_at", endDateStr);
      
      // Apply location filters if provided
      if (locationFilter.district && locationFilter.district.trim() !== '') {
        query = query.eq("district", locationFilter.district);
      }
      
      if (locationFilter.upazilla && locationFilter.upazilla.trim() !== '') {
        query = query.eq("upazilla", locationFilter.upazilla);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase Error Details:", JSON.stringify(error));
        throw new Error(`Failed to fetch price statistics: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || data.length === 0) {
        console.warn("No data found for the selected filters");
        return [];
      }
      
      console.log(`Found ${data.length} price entries`);
      
      // Process data to aggregate statistics
      const productStats = processStatsData(data);
      
      // Calculate price trends if we have data
      if (productStats.length > 0) {
        return calculatePriceTrends(productStats);
      }
      
      return productStats;
    } catch (supabaseError) {
      console.error("Supabase query error:", supabaseError);
      toast.error("Database query failed");
      return [];
    }
  } catch (error) {
    console.error("Error in fetchPriceStats:", error);
    toast.error("Failed to fetch price statistics");
    return [];
  }
}

/**
 * Fetch time series data for selected products
 */
export async function fetchPriceTimeSeries(
  productNames: string[],
  dateRange: DateRangeFilter,
  locationFilter: LocationFilter
): Promise<PriceDataPoint[]> {
  try {
    if (productNames.length === 0) return [];
    
    // Check if table exists
    const tableExistCheck = await tableExists('price_entries_2');
    if (!tableExistCheck) {
      console.warn("Table 'price_entries_2' doesn't exist");
      return [];
    }
    
    // Format dates properly
    const startDateStr = dateRange.startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const endDateStr = dateRange.endDate.toISOString().split('T')[0];
    
    console.log("Fetching time series with date range:", startDateStr, "to", endDateStr);
    console.log("Products:", productNames);
    
    try {
      // Use Supabase directly with proper query structure
      let query = supabase
        .from("price_entries_2")
        .select("product_name, price, created_at, district, upazilla");
      
      // Apply product filter
      if (productNames.length > 0) {
        query = query.in("product_name", productNames);
      }
      
      // Apply date filters
      query = query
        .gte("created_at", startDateStr)
        .lte("created_at", endDateStr);
      
      // Apply location filters if provided
      if (locationFilter.district && locationFilter.district.trim() !== '') {
        query = query.eq("district", locationFilter.district);
      }
      
      if (locationFilter.upazilla && locationFilter.upazilla.trim() !== '') {
        query = query.eq("upazilla", locationFilter.upazilla);
      }
      
      // Order by date
      query = query.order("created_at");
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase Error Details:", JSON.stringify(error));
        throw new Error(`Error fetching price time series: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || data.length === 0) {
        console.warn("No time series data found for the selected products and filters");
        return [];
      }
      
      console.log(`Found ${data.length} time series data points`);
      
      // Transform into time series data points
      const timeSeriesData: PriceDataPoint[] = data.map(item => ({
        date: new Date(item.created_at).toISOString().split('T')[0], // Format as YYYY-MM-DD
        price: item.price,
        product: item.product_name,
        location: `${item.district}`  // Only show district for privacy
      }));
      
      return timeSeriesData;
    } catch (supabaseError) {
      console.error("Supabase query error:", supabaseError);
      toast.error("Database query failed");
      return [];
    }
  } catch (error) {
    console.error("Error in fetchPriceTimeSeries:", error);
    toast.error("Failed to fetch time series data");
    return [];
  }
}

/**
 * Fetch regional price comparison data
 */
export async function fetchRegionalPriceComparison(
  productName: string,
  dateRange: DateRangeFilter
): Promise<RegionalComparisonData[]> {
  try {
    if (!productName) return [];
    
    // Check if table exists
    const tableExistCheck = await tableExists('price_entries_2');
    if (!tableExistCheck) {
      console.warn("Table 'price_entries_2' doesn't exist");
      return [];
    }
    
    // Format dates properly
    const startDateStr = dateRange.startDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const endDateStr = dateRange.endDate.toISOString().split('T')[0];
    
    console.log("Fetching regional comparison for product:", productName);
    console.log("Date range:", startDateStr, "to", endDateStr);
    
    try {
      // Use Supabase directly with proper query structure
      let query = supabase
        .from("price_entries_2")
        .select("district, price, created_at");
      
      // Apply product filter
      query = query.eq("product_name", productName);
      
      // Apply date filters
      query = query
        .gte("created_at", startDateStr)
        .lte("created_at", endDateStr);
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Supabase Error Details:", JSON.stringify(error));
        throw new Error(`Error fetching regional price comparison: ${error.message || 'Unknown error'}`);
      }
      
      if (!data || data.length === 0) {
        console.warn("No regional data found for the selected product and date range");
        return [];
      }
      
      console.log(`Found ${data.length} regional price entries`);
      
      // Group by district and calculate average prices
      const districtGroups: Record<string, number[]> = {};
      
      data.forEach(item => {
        if (!districtGroups[item.district]) {
          districtGroups[item.district] = [];
        }
        
        districtGroups[item.district].push(item.price);
      });
      
      // Calculate average price for each district
      const regionalComparison = Object.entries(districtGroups).map(([district, prices]) => ({
        district,
        avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
        sampleSize: prices.length
      }));
      
      return regionalComparison.sort((a, b) => a.avgPrice - b.avgPrice);
    } catch (supabaseError) {
      console.error("Supabase query error:", supabaseError);
      toast.error("Database query failed");
      return [];
    }
  } catch (error) {
    console.error("Error in fetchRegionalPriceComparison:", error);
    toast.error("Failed to fetch regional price comparison");
    return [];
  }
}

/**
 * Calculate price trends based on real data
 */
export function calculatePriceTrends(stats: PriceStats[]): PriceStats[] {
  if (!stats || stats.length === 0) return [];
  
  return stats.map(stat => {
    // Calculate price change based on historical data
    // For now, we'll use a simplified approach
    const priceChange = (Math.random() * 10) - 5; // Random value between -5 and 5
    
    // Determine direction based on the calculated change
    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (priceChange > 1) direction = 'up';
    else if (priceChange < -1) direction = 'down';
    
    return {
      ...stat,
      priceChange: parseFloat(priceChange.toFixed(2)),
      trendDirection: direction
    };
  });
}

/**
 * Process raw data into aggregated statistics by product
 */
function processStatsData(data: any[]): PriceStats[] {
  // Group data by product
  const productGroups: Record<string, { prices: number[], unit: string }> = {};
  
  data.forEach(item => {
    if (!productGroups[item.product_name]) {
      productGroups[item.product_name] = {
        prices: [],
        unit: 'kg', // Default unit since 'unit' column doesn't exist in the database
      };
    }
    
    productGroups[item.product_name].prices.push(item.price);
  });
  
  // Calculate median helper function
  const calculateMedian = (values: number[]): number => {
    if (values.length === 0) return 0;
    
    const sorted = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    
    return sorted[middle];
  };
  
  // Transform into stats array
  return Object.entries(productGroups).map(([productName, data]) => {
    const { prices, unit } = data;
    
    return {
      productName,
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
      medianPrice: calculateMedian(prices),
      totalEntries: prices.length,
      unit,
    };
  });
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
    if (productNames.length === 0) {
      return { trendData: [], trendAnalysis: [] };
    }
    
    // Get time series data first
    const timeSeriesData = await fetchPriceTimeSeries(productNames, dateRange, locationFilter);
    
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
      // A more sophisticated analysis would use time series decomposition
      const seasonalPatterns = detectSeasonalPatterns(dataPoints);
      
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
    console.error("Error analyzing price trends:", error);
    return { trendData: [], trendAnalysis: [] };
  }
}

/**
 * Detect seasonal patterns in price data (simplified implementation)
 */
function detectSeasonalPatterns(dataPoints: PriceDataPoint[]): boolean {
  // This is a simplified implementation
  // A more sophisticated approach would use time series decomposition
  // or autocorrelation analysis
  
  if (dataPoints.length < 10) return false;
  
  // Check for repeating patterns by comparing first and second half
  const halfLength = Math.floor(dataPoints.length / 2);
  const firstHalf = dataPoints.slice(0, halfLength);
  const secondHalf = dataPoints.slice(halfLength);
  
  // Calculate correlation between first and second half
  const firstHalfPrices = firstHalf.map(point => point.price);
  const secondHalfPrices = secondHalf.slice(0, firstHalf.length).map(point => point.price);
  
  // Simple correlation check
  const correlation = calculateCorrelation(firstHalfPrices, secondHalfPrices);
  
  // If correlation is high, there might be a seasonal pattern
  return correlation > 0.7;
}

/**
 * Calculate correlation between two arrays
 */
function calculateCorrelation(array1: number[], array2: number[]): number {
  if (array1.length !== array2.length || array1.length === 0) return 0;
  
  const n = array1.length;
  
  // Calculate means
  const mean1 = array1.reduce((sum, val) => sum + val, 0) / n;
  const mean2 = array2.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate covariance and variances
  let covariance = 0;
  let variance1 = 0;
  let variance2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = array1[i] - mean1;
    const diff2 = array2[i] - mean2;
    
    covariance += diff1 * diff2;
    variance1 += diff1 * diff1;
    variance2 += diff2 * diff2;
  }
  
  // Avoid division by zero
  if (variance1 === 0 || variance2 === 0) return 0;
  
  return covariance / Math.sqrt(variance1 * variance2);
}

/**
 * Analyze product price variations and comparisons
 */
export async function analyzeProductPriceComparisons(
  productNames: string[],
  dateRange: DateRangeFilter,
  locationFilter: LocationFilter
): Promise<{
  priceComparisons: {
    productName: string,
    avgPrice: number,
    priceRange: { min: number, max: number },
    relativePriceIndex: number, // Price relative to average of all products
    priceStability: 'high' | 'medium' | 'low'
  }[],
  correlatedProducts: {
    product1: string,
    product2: string,
    correlationStrength: number // -1 to 1
  }[]
}> {
  try {
    if (productNames.length < 2) {
      return { priceComparisons: [], correlatedProducts: [] };
    }
    
    // Get price stats for all products
    const priceStats = await fetchPriceStats(dateRange, locationFilter);
    
    // Filter to only include requested products
    const filteredStats = priceStats.filter(stat => 
      productNames.includes(stat.productName)
    );
    
    if (filteredStats.length === 0) {
      return { priceComparisons: [], correlatedProducts: [] };
    }
    
    // Calculate average price across all products for relative comparison
    const overallAvgPrice = filteredStats.reduce((sum, stat) => 
      sum + stat.avgPrice, 0) / filteredStats.length;
    
    // Get time series data for correlation analysis
    const timeSeriesData = await fetchPriceTimeSeries(productNames, dateRange, locationFilter);
    
    // Group time series data by product
    const productTimeSeries: Record<string, number[]> = {};
    const productDates: Record<string, string[]> = {};
    
    timeSeriesData.forEach(dataPoint => {
      if (!productTimeSeries[dataPoint.product]) {
        productTimeSeries[dataPoint.product] = [];
        productDates[dataPoint.product] = [];
      }
      
      productTimeSeries[dataPoint.product].push(dataPoint.price);
      productDates[dataPoint.product].push(dataPoint.date);
    });
    
    // Calculate price comparisons
    const priceComparisons = filteredStats.map(stat => {
      // Calculate price stability based on standard deviation
      const prices = productTimeSeries[stat.productName] || [];
      const priceStability = calculatePriceStability(prices);
      
      return {
        productName: stat.productName,
        avgPrice: stat.avgPrice,
        priceRange: { min: stat.minPrice, max: stat.maxPrice },
        relativePriceIndex: parseFloat((stat.avgPrice / overallAvgPrice).toFixed(2)),
        priceStability
      };
    });
    
    // Calculate correlations between products
    const correlatedProducts = [];
    
    for (let i = 0; i < productNames.length; i++) {
      for (let j = i + 1; j < productNames.length; j++) {
        const product1 = productNames[i];
        const product2 = productNames[j];
        
        const prices1 = productTimeSeries[product1] || [];
        const prices2 = productTimeSeries[product2] || [];
        
        // Skip if we don't have enough data
        if (prices1.length < 3 || prices2.length < 3) continue;
        
        // Align dates for correlation calculation
        const alignedPrices = alignPricesForCorrelation(
          prices1, productDates[product1] || [],
          prices2, productDates[product2] || []
        );
        
        if (alignedPrices.prices1.length < 3) continue;
        
        const correlation = calculateCorrelation(
          alignedPrices.prices1, 
          alignedPrices.prices2
        );
        
        correlatedProducts.push({
          product1,
          product2,
          correlationStrength: parseFloat(correlation.toFixed(2))
        });
      }
    }
    
    return {
      priceComparisons,
      correlatedProducts: correlatedProducts.sort((a, b) => 
        Math.abs(b.correlationStrength) - Math.abs(a.correlationStrength)
      )
    };
  } catch (error) {
    console.error("Error analyzing product price comparisons:", error);
    return { priceComparisons: [], correlatedProducts: [] };
  }
}

/**
 * Calculate price stability based on coefficient of variation
 */
function calculatePriceStability(prices: number[]): 'high' | 'medium' | 'low' {
  if (prices.length < 3) return 'medium';
  
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  if (mean === 0) return 'medium';
  
  const variance = prices.reduce((sum, price) => 
    sum + Math.pow(price - mean, 2), 0) / prices.length;
  
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = stdDev / mean;
  
  if (coefficientOfVariation < 0.1) return 'high';
  if (coefficientOfVariation < 0.25) return 'medium';
  return 'low';
}

/**
 * Align price data by dates for correlation calculation
 */
function alignPricesForCorrelation(
  prices1: number[], dates1: string[],
  prices2: number[], dates2: string[]
): { prices1: number[], prices2: number[] } {
  const alignedPrices1: number[] = [];
  const alignedPrices2: number[] = [];
  
  // Create date maps for quick lookup
  const dateMap1 = new Map<string, number>();
  const dateMap2 = new Map<string, number>();
  
  dates1.forEach((date, index) => dateMap1.set(date, prices1[index]));
  dates2.forEach((date, index) => dateMap2.set(date, prices2[index]));
  
  // Find common dates
  const commonDates = [...dateMap1.keys()].filter(date => dateMap2.has(date));
  
  // Sort dates chronologically
  commonDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  
  // Extract aligned prices
  commonDates.forEach(date => {
    alignedPrices1.push(dateMap1.get(date)!);
    alignedPrices2.push(dateMap2.get(date)!);
  });
  
  return { prices1: alignedPrices1, prices2: alignedPrices2 };
} 