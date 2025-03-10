"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useReportContext } from "@/context/ReportContext";
import { supabase } from "../../../lib/supabase";

export default function LocationFilter() {
  const { locationFilter, setLocationFilter, refreshData } = useReportContext();
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazillas, setUpazillas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all districts on initial load
  useEffect(() => {
    async function fetchDistricts() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("price_entries_2")
          .select("district")
          .order("district");
          
        if (error) throw error;
        
        // Get unique districts
        const uniqueDistricts = [...new Set(data?.map(item => item.district))].filter(Boolean);
        setDistricts(uniqueDistricts);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDistricts();
  }, []);

  // Fetch upazillas when district changes
  useEffect(() => {
    async function fetchUpazillas() {
      if (!locationFilter.district) {
        setUpazillas([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("price_entries_2")
          .select("upazilla")
          .eq("district", locationFilter.district)
          .order("upazilla");
          
        if (error) throw error;
        
        // Get unique upazillas
        const uniqueUpazillas = [...new Set(data?.map(item => item.upazilla))].filter(Boolean);
        setUpazillas(uniqueUpazillas);
      } catch (error) {
        console.error("Error fetching upazillas:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUpazillas();
  }, [locationFilter.district]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const district = e.target.value;
    setLocationFilter({
      district,
      upazilla: "" // Reset upazilla when district changes
    });
    refreshData();
  };

  const handleUpazillaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const upazilla = e.target.value;
    setLocationFilter({
      ...locationFilter,
      upazilla
    });
    refreshData();
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          District
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MapPin className="w-4 h-4" />
          </span>
          <select
            id="district"
            value={locationFilter.district}
            onChange={handleDistrictChange}
            disabled={isLoading || districts.length === 0}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
          >
            <option value="">All Districts</option>
            {districts.map(district => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>

      <div>
        <label htmlFor="upazilla" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Upazilla
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <MapPin className="w-4 h-4" />
          </span>
          <select
            id="upazilla"
            value={locationFilter.upazilla}
            onChange={handleUpazillaChange}
            disabled={isLoading || !locationFilter.district || upazillas.length === 0}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
          >
            <option value="">All Upazillas</option>
            {upazillas.map(upazilla => (
              <option key={upazilla} value={upazilla}>
                {upazilla}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">লোড হচ্ছে...</span>
        </div>
      )}

      {locationFilter.district && locationFilter.upazilla && (
        <div className="mt-2 py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-lg text-sm">
          <p className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              বর্তমান লোকেশন: <strong>{locationFilter.upazilla}, {locationFilter.district}</strong>
            </span>
          </p>
        </div>
      )}
    </div>
  );
} 