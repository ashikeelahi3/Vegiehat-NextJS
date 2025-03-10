"use client";

import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";
import { supabase } from "../../lib/supabase";
import FilterBar from "./analytics/FilterBar";
import ProductCard from "./analytics/ProductCard";
import Cart from "./analytics/Cart";
import { PriceStats, LocationFilter } from "@/types/analytics";

export default function PriceAnalytics() {
  const [products, setProducts] = useState<PriceStats[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazillas, setUpazillas] = useState<string[]>([]);
  const [totalSubmissions, setTotalSubmissions] = useState<number>(0);
  const [filter, setFilter] = useState<LocationFilter>({
    district: "",
    upazilla: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [isLoading, setIsLoading] = useState(true);

  // Generate year options (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" }
  ];

  const handleFilterChange = (key: string, value: string | number) => {
    setFilter(prev => {
      const newFilter = { ...prev, [key]: value };
      // Reset upazilla when district changes
      if (key === 'district') {
        newFilter.upazilla = '';
      }
      return newFilter;
    });
  };

  // Fetch districts and initial stats
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const { data: districtsData } = await supabase
          .from("price_entries_2")
          .select("district")
          .order("district");
        
        const uniqueDistricts = [...new Set(districtsData?.map(d => d.district))];
        setDistricts(uniqueDistricts);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    }

    fetchInitialData();
  }, []);

  // Update upazillas when district changes
  useEffect(() => {
    async function fetchUpazillas() {
      if (!filter.district) {
        setUpazillas([]);
        return;
      }

      const { data } = await supabase
        .from("price_entries_2")
        .select("upazilla")
        .eq("district", filter.district)
        .order("upazilla");

      const uniqueUpazillas = [...new Set(data?.map(u => u.upazilla))];
      setUpazillas(uniqueUpazillas);
    }

    fetchUpazillas();
  }, [filter.district]);

  // Fetch price statistics when filters change
  useEffect(() => {
    async function fetchStats() {
      setIsLoading(true);
      try {
        let query = supabase
          .from("price_entries_2")
          .select("product_name, price, created_at");

        if (filter.district) {
          query = query.eq("district", filter.district);
        }
        if (filter.upazilla) {
          query = query.eq("upazilla", filter.upazilla);
        }

        // Add date filtering
        const startDate = new Date(filter.year, filter.month - 1, 1).toISOString();
        const endDate = new Date(filter.year, filter.month, 0).toISOString();
        query = query.gte("created_at", startDate).lte("created_at", endDate);

        const { data } = await query;

        if (data) {
          // Calculate total submissions
          setTotalSubmissions(data.length);

          // Group by product and calculate stats
          const productStats = data.reduce((acc: { [key: string]: number[] }, curr) => {
            if (!acc[curr.product_name]) {
              acc[curr.product_name] = [];
            }
            acc[curr.product_name].push(curr.price);
            return acc;
          }, {});

          const stats = Object.entries(productStats).map(([product, prices]): PriceStats => ({
            productName: product,
            minPrice: Math.min(...prices),
            maxPrice: Math.max(...prices),
            avgPrice: prices.reduce((a, b) => a + b, 0) / prices.length,
            totalEntries: prices.length,
            unit: 'kg' // Add a default unit or fetch it from your database
          }));

          setProducts(stats.sort((a, b) => a.productName.localeCompare(b.productName)));
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [filter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="mr-2" />
          Price Analytics
        </h2>
        <div className="text-gray-600 dark:text-gray-300">
          Total Submissions: <span className="font-bold">{totalSubmissions}</span>
        </div>
      </div>

      <FilterBar
        filter={filter}
        months={months}
        years={years}
        districts={districts}
        upazillas={upazillas}
        onFilterChange={handleFilterChange}
      />

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <ProductCard key={product.productName} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12 bg-white dark:bg-gray-800 rounded-lg">
          No data available for the selected filters
        </div>
      )}
    </div>
  );
}