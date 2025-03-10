"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import ReportTable from "./ReportTable";
import PriceAnalytics from "./PriceAnalytics";

export default function PriceReport() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [uniqueDistricts, setUniqueDistricts] = useState<string[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data, error } = await supabase
          .from("price_entries_2")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setData(data || []);
        setFilteredData(data || []);
        const districts = [...new Set(data?.map((item) => item.district))];
        setUniqueDistricts(districts);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    let result = [...data];

    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.upazilla.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDistrict) {
      result = result.filter((item) => item.district === selectedDistrict);
    }

    setFilteredData(result);
  }, [searchTerm, selectedDistrict, data]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Price Reports
        </h1>

        {/* Add PriceAnalytics component */}
        <PriceAnalytics />

        {/* Existing search and filter controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by product, district, or upazilla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by District
            </label>
            <select
              id="district"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="">All Districts</option>
              {uniqueDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Existing ReportTable component */}
        <ReportTable data={filteredData} isLoading={isLoading} />
      </div>
    </div>
  );
}