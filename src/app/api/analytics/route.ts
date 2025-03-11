import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { auth } from "@clerk/nextjs/server";
import { anonymizeData } from "../../../../lib/accessControl";

// Validate date string function
const isValidDateString = (dateStr: string): boolean => {
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
};

export async function GET(request: NextRequest) {
  // Get user authentication using the new clerk auth() approach
  const { userId } = await auth();
  
  // Check if the user is authenticated
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const district = searchParams.get("district") || "";
  const upazilla = searchParams.get("upazilla") || "";
  const product = searchParams.get("product") || "";
  const type = searchParams.get("type") || "stats";
  
  // Validate required date parameters
  if (!startDate || !endDate || !isValidDateString(startDate) || !isValidDateString(endDate)) {
    return NextResponse.json(
      { error: "Invalid or missing date parameters" }, 
      { status: 400 }
    );
  }
  
  try {
    // Base query
    let query = supabase.from("price_entries_2");
    
    // Determine what data to return based on type
    let result;
    
    switch (type) {
      case "stats":
        // For aggregate statistics, we only need specific fields
        const { data, error } = await query
          .select("product_name, price, unit, created_at")
          .gte("created_at", startDate)
          .lte("created_at", endDate)
          .eq(district ? "district" : "", district || "")
          .eq(upazilla ? "upazilla" : "", upazilla || "")
          .eq(product ? "product_name" : "", product || "");
        
        if (error) throw error;
        
        // Process data to aggregate statistics
        const productStats = processStatsData(data || []);
        result = productStats;
        break;
        
      case "timeseries":
        // For time series, we need the date, price and location
        const { data: timeseriesData, error: timeseriesError } = await query
          .select("product_name, price, created_at, district, upazilla")
          .gte("created_at", startDate)
          .lte("created_at", endDate)
          .eq(district ? "district" : "", district || "")
          .eq(upazilla ? "upazilla" : "", upazilla || "")
          .eq(product ? "product_name" : "", product || "");
        
        if (timeseriesError) throw timeseriesError;
        
        // Process data for time series visualization
        // Only return necessary fields, anonymize locations if needed
        result = (timeseriesData || []).map((item: any) => ({
          date: new Date(item.created_at).toISOString().split('T')[0],
          price: item.price,
          product: item.product_name,
          location: `${item.district}`  // Only show district, not specific upazilla for privacy
        }));
        break;
        
      case "districts":
        // For district comparison, get aggregated data by district
        const { data: districtData, error: districtError } = await query
          .select("district, price, product_name")
          .gte("created_at", startDate)
          .lte("created_at", endDate)
          .eq(district ? "district" : "", district || "")
          .eq(upazilla ? "upazilla" : "", upazilla || "")
          .eq(product ? "product_name" : "", product || "");
        
        if (districtError) throw districtError;
        
        // Process district comparison data
        result = processDistrictData(districtData || [], product);
        break;
        
      default:
        return NextResponse.json(
          { error: "Invalid type parameter" }, 
          { status: 400 }
        );
    }
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" }, 
      { status: 500 }
    );
  }
}

// Process stats data
function processStatsData(data: any[]) {
  // Group data by product
  const productGroups: Record<string, { prices: number[], unit: string }> = {};
  
  data.forEach(item => {
    if (!productGroups[item.product_name]) {
      productGroups[item.product_name] = {
        prices: [],
        unit: item.unit || 'kg',
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

// Process district data
function processDistrictData(data: any[], productFilter: string) {
  // If a product filter is specified, only keep rows matching that product
  const filteredData = productFilter
    ? data.filter(item => item.product_name === productFilter)
    : data;
  
  // Group by district
  const districtGroups: Record<string, number[]> = {};
  
  filteredData.forEach(item => {
    if (!districtGroups[item.district]) {
      districtGroups[item.district] = [];
    }
    
    districtGroups[item.district].push(item.price);
  });
  
  // Calculate average price for each district
  return Object.entries(districtGroups).map(([district, prices]) => ({
    district,
    avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
    sampleSize: prices.length
  }));
} 