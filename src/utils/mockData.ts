import { PriceStats } from "@/app/report/page";
import { PriceDataPoint } from "@/services/dataAnalyzerService";

// Generate mock product statistics data
export function getMockPriceStats(): PriceStats[] {
  const products = [
    { name: 'Rice', min: 60, max: 120, unit: 'kg' },
    { name: 'Potato', min: 30, max: 60, unit: 'kg' },
    { name: 'Onion', min: 50, max: 90, unit: 'kg' },
    { name: 'Chicken', min: 150, max: 220, unit: 'kg' },
    { name: 'Beef', min: 550, max: 700, unit: 'kg' },
    { name: 'Tomato', min: 40, max: 80, unit: 'kg' },
    { name: 'Fish (Rui)', min: 250, max: 350, unit: 'kg' },
    { name: 'Egg', min: 100, max: 150, unit: 'dozen' }
  ];
  
  return products.map(product => {
    const min = product.min;
    const max = product.max;
    const avg = min + (max - min) * 0.6; // Closer to max
    const median = min + (max - min) * 0.55;
    
    // Generate a consistent trend value based on product name
    const nameHash = product.name.split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const change = ((nameHash % 20) - 10);
    
    let direction: 'up' | 'down' | 'stable';
    if (change > 1) direction = 'up';
    else if (change < -1) direction = 'down';
    else direction = 'stable';
    
    return {
      productName: product.name,
      minPrice: min,
      maxPrice: max,
      avgPrice: avg,
      medianPrice: median,
      totalEntries: 5 + Math.floor(Math.random() * 25),
      unit: product.unit,
      priceChange: parseFloat(change.toFixed(1)),
      trendDirection: direction
    };
  });
}

// Generate mock time series data for trending
export function getMockTimeSeriesData(
  productNames: string[],
  startDate: Date,
  endDate: Date
): PriceDataPoint[] {
  if (productNames.length === 0) return [];
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const result: PriceDataPoint[] = [];
  
  // Create base prices for products (should match the stats)
  const productBasePrices: Record<string, number> = {
    'Rice': 90,
    'Potato': 45,
    'Onion': 70, 
    'Chicken': 190,
    'Beef': 650,
    'Tomato': 60,
    'Fish (Rui)': 300,
    'Egg': 120
  };
  
  // Generate data points for each date in the range
  for (let i = 0; i <= daysDiff; i += 3) { // Every 3 days for less noise
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Generate a point for each product
    productNames.forEach(product => {
      const basePrice = productBasePrices[product] || 100;
      
      // Create small variations for each date
      const variation = Math.sin(i * 0.1) * 10; // Sine wave pattern
      const randomFactor = (Math.random() - 0.5) * 5; // Small random variation
      const price = basePrice + variation + randomFactor;
      
      result.push({
        date: dateStr,
        price: Math.round(price * 100) / 100, // Round to 2 decimal places
        product,
        location: 'Mock Data'
      });
    });
  }
  
  return result;
}

// Generate mock regional comparison data
export function getMockRegionalData(productName: string): { district: string, avgPrice: number, sampleSize: number }[] {
  // Base price depends on product
  const productBasePrices: Record<string, number> = {
    'Rice': 90,
    'Potato': 45,
    'Onion': 70, 
    'Chicken': 190,
    'Beef': 650,
    'Tomato': 60,
    'Fish': 300,
    'Egg': 120
  };
  
  const basePrice = productBasePrices[productName] || 100;
  
  // List of districts
  const districts = [
    'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 
    'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
  ];
  
  // Generate regional variation based on district name hash
  return districts.map(district => {
    const districtHash = district.split('')
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);
    
    // +/- 20% variation based on district
    const variation = ((districtHash % 40) - 20) / 100;
    const price = basePrice * (1 + variation);
    
    return {
      district,
      avgPrice: Math.round(price * 100) / 100,
      sampleSize: 10 + (districtHash % 20)
    };
  }).sort((a, b) => a.avgPrice - b.avgPrice);
}

try {
  // বাহ্যিক try-catch ব্লক
  try {
    // Supabase কুয়েরি
    const startDateStr = '2021-01-01'; // উদাহরণ তারিখ
    const endDateStr = '2021-12-31'; // উদাহরণ তারিখ
    const data = []; // উদাহরণ ডেটা

    console.log("Fetching price stats with date range:", startDateStr, "to", endDateStr);
    console.log(`Found ${data.length} price entries`);
  } catch (supabaseError) {
    // Supabase নির্দিষ্ট ত্রুটি হ্যান্ডলিং
    console.error("Supabase ত্রুটি:", supabaseError);
  }
} catch (error) {
  // সাধারণ ত্রুটি হ্যান্ডলিং
} 