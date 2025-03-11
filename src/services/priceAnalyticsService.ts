import { supabase } from "../../lib/supabase";
import { PriceStats, DateRangeFilter, LocationFilter } from "@/app/report/page";

export interface PriceDataPoint {
  date: string;
  price: number;
  product: string;
  location: string;
}

export async function fetchPriceStats(
  dateRange: DateRangeFilter,
  locationFilter: LocationFilter
): Promise<PriceStats[]> {
  try {
    // Create the base query
    let query = supabase
      .from("price_entries_2")
      .select("product_name, price, unit, created_at");

    // Apply date filters
    const startDateStr = dateRange.startDate.toISOString();
    const endDateStr = dateRange.endDate.toISOString();
    query = query.gte("created_at", startDateStr).lte("created_at", endDateStr);

    // Apply location filters
    if (locationFilter.district) {
      query = query.eq("district", locationFilter.district);
    }
    
    if (locationFilter.upazilla) {
      query = query.eq("upazilla", locationFilter.upazilla);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching price data: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Group data by product
    const productGroups: Record<string, { prices: number[], unit: string, dates: string[] }> = {};
    
    data.forEach(item => {
      if (!productGroups[item.product_name]) {
        productGroups[item.product_name] = {
          prices: [],
          unit: item.unit || 'kg',
          dates: []
        };
      }
      
      productGroups[item.product_name].prices.push(item.price);
      productGroups[item.product_name].dates.push(item.created_at);
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

    // Calculate price change and trend
    const calculatePriceChange = (dates: string[], prices: number[]): { change: number, direction: 'up' | 'down' | 'stable' } => {
      if (dates.length < 2) return { change: 0, direction: 'stable' };
      
      // Create date-price pairs and sort by date
      const pairs = dates.map((date, index) => ({ date, price: prices[index] }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Group by week or month depending on the date range span
      const dateSpan = (new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()) / (1000 * 60 * 60 * 24);
      
      let earliestAvg: number;
      let latestAvg: number;
      
      if (dateSpan <= 30) {
        // For shorter ranges, compare first week vs last week
        const firstWeekPrices = pairs.slice(0, Math.max(Math.floor(pairs.length / 3), 1)).map(p => p.price);
        const lastWeekPrices = pairs.slice(-Math.max(Math.floor(pairs.length / 3), 1)).map(p => p.price);
        
        earliestAvg = firstWeekPrices.reduce((sum, price) => sum + price, 0) / firstWeekPrices.length;
        latestAvg = lastWeekPrices.reduce((sum, price) => sum + price, 0) / lastWeekPrices.length;
      } else {
        // For longer ranges, compare first month vs last month
        const firstMonthPrices = pairs.slice(0, Math.max(Math.floor(pairs.length / 4), 1)).map(p => p.price);
        const lastMonthPrices = pairs.slice(-Math.max(Math.floor(pairs.length / 4), 1)).map(p => p.price);
        
        earliestAvg = firstMonthPrices.reduce((sum, price) => sum + price, 0) / firstMonthPrices.length;
        latestAvg = lastMonthPrices.reduce((sum, price) => sum + price, 0) / lastMonthPrices.length;
      }
      
      const priceDiff = latestAvg - earliestAvg;
      const percentChange = (priceDiff / earliestAvg) * 100;
      
      let direction: 'up' | 'down' | 'stable' = 'stable';
      if (percentChange > 1) direction = 'up';
      else if (percentChange < -1) direction = 'down';
      
      return {
        change: parseFloat(percentChange.toFixed(2)),
        direction
      };
    };

    // Transform into PriceStats array
    const stats: PriceStats[] = Object.entries(productGroups).map(([productName, data]) => {
      const { prices, unit, dates } = data;
      const priceChange = calculatePriceChange(dates, prices);
      
      return {
        productName,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
        medianPrice: calculateMedian(prices),
        totalEntries: prices.length,
        unit,
        priceChange: priceChange.change,
        trendDirection: priceChange.direction
      };
    });

    return stats.sort((a, b) => a.productName.localeCompare(b.productName));
    
  } catch (error) {
    console.error("Error in fetchPriceStats:", error);
    return [];
  }
}

export async function fetchPriceTimeSeries(
  productNames: string[],
  dateRange: DateRangeFilter,
  locationFilter: LocationFilter
): Promise<PriceDataPoint[]> {
  try {
    if (productNames.length === 0) return [];

    // Create the base query
    let query = supabase
      .from("price_entries_2")
      .select("product_name, price, created_at, district, upazilla")
      .in("product_name", productNames);

    // Apply date filters
    const startDateStr = dateRange.startDate.toISOString();
    const endDateStr = dateRange.endDate.toISOString();
    query = query.gte("created_at", startDateStr).lte("created_at", endDateStr);

    // Apply location filters
    if (locationFilter.district) {
      query = query.eq("district", locationFilter.district);
    }
    
    if (locationFilter.upazilla) {
      query = query.eq("upazilla", locationFilter.upazilla);
    }

    // Order by date
    query = query.order("created_at");

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching price time series: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Transform into time series data points
    const timeSeriesData: PriceDataPoint[] = data.map(item => ({
      date: new Date(item.created_at).toISOString().split('T')[0], // Format as YYYY-MM-DD
      price: item.price,
      product: item.product_name,
      location: `${item.upazilla}, ${item.district}`
    }));

    return timeSeriesData;
    
  } catch (error) {
    console.error("Error in fetchPriceTimeSeries:", error);
    return [];
  }
}

export async function fetchRegionalPriceComparison(
  productName: string,
  dateRange: DateRangeFilter
): Promise<{district: string, avgPrice: number}[]> {
  try {
    if (!productName) return [];

    // Create the base query
    let query = supabase
      .from("price_entries_2")
      .select("district, price")
      .eq("product_name", productName);

    // Apply date filters
    const startDateStr = dateRange.startDate.toISOString();
    const endDateStr = dateRange.endDate.toISOString();
    query = query.gte("created_at", startDateStr).lte("created_at", endDateStr);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error fetching regional price comparison: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return [];
    }

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
      avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length
    }));

    return regionalComparison.sort((a, b) => a.avgPrice - b.avgPrice);
    
  } catch (error) {
    console.error("Error in fetchRegionalPriceComparison:", error);
    return [];
  }
} 