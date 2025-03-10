"use client";

import { TrendingUp, TrendingDown, AlertTriangle, BarChart3, ShoppingBag } from "lucide-react";

interface StatsSummaryProps {
  totalSubmissions: number;
  productCount: number;
  isLoading: boolean;
}

export default function StatsSummary({ totalSubmissions, productCount, isLoading }: StatsSummaryProps) {
  // These would be calculated from actual data
  const increasingProducts = 7;
  const decreasingProducts = 5;
  const anomalies = 2;
  
  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    color: string 
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center">
      <div className={`rounded-full p-3 mr-4 ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {isLoading ? '...' : value}
        </p>
      </div>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Summary Statistics
      </h2>
      
      <div className="grid grid-cols-2 gap-4">
        <StatCard 
          title="Total Submissions" 
          value={totalSubmissions} 
          icon={BarChart3} 
          color="bg-blue-500" 
        />
        
        <StatCard 
          title="Products Tracked" 
          value={productCount} 
          icon={ShoppingBag} 
          color="bg-purple-500" 
        />
        
        <StatCard 
          title="Price Increases" 
          value={increasingProducts} 
          icon={TrendingUp} 
          color="bg-red-500" 
        />
        
        <StatCard 
          title="Price Decreases" 
          value={decreasingProducts} 
          icon={TrendingDown} 
          color="bg-green-500" 
        />
      </div>
    </div>
  );
} 