"use client";

import { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { DateRangeFilter, LocationFilter, PriceStats } from "@/app/report/page";
import { fetchPriceStats } from "@/services/dataAnalyzerService";
import { toast } from "react-hot-toast";

interface ReportContextType {
  stats: PriceStats[];
  isLoading: boolean;
  totalSubmissions: number;
  dateRange: DateRangeFilter;
  locationFilter: LocationFilter;
  setDateRange: (range: DateRangeFilter) => void;
  setLocationFilter: (filter: LocationFilter) => void;
  refreshData: () => Promise<void>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export function ReportContextProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<PriceStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  
  // Default to current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const [dateRange, setDateRange] = useState<DateRangeFilter>({
    startDate: firstDayOfMonth,
    endDate: lastDayOfMonth
  });
  
  const [locationFilter, setLocationFilter] = useState<LocationFilter>({
    district: "",
    upazilla: ""
  });

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const priceStats = await fetchPriceStats(dateRange, locationFilter);
      setStats(priceStats);
      
      // Calculate total submissions
      const totalEntries = priceStats.reduce(
        (total, product) => total + product.totalEntries, 
        0
      );
      setTotalSubmissions(totalEntries);
      
    } catch (error) {
      console.error("Failed to fetch report data:", error);
      toast.error("Failed to load price data");
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, locationFilter]);

  return (
    <ReportContext.Provider
      value={{
        stats,
        isLoading,
        totalSubmissions,
        dateRange,
        locationFilter,
        setDateRange,
        setLocationFilter,
        refreshData
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReportContext() {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error("useReportContext must be used within a ReportContextProvider");
  }
  return context;
} 