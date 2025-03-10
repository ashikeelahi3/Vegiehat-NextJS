import { ChevronDown } from "lucide-react";

type FilterBarProps = {
  filter: {
    month: number;
    year: number;
    district: string;
    upazilla: string;
  };
  months: Array<{ value: number; label: string }>;
  years: number[];
  districts: string[];
  upazillas: string[];
  onFilterChange: (key: string, value: string | number) => void;
};

export default function FilterBar({
  filter,
  months,
  years,
  districts,
  upazillas,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Month Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Month
        </label>
        <select
          aria-label="Select month"
          value={filter.month}
          onChange={(e) => onFilterChange('month', Number(e.target.value))}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {/* Year Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Year
        </label>
        <select
          aria-label="Select year"
          value={filter.year}
          onChange={(e) => onFilterChange('year', Number(e.target.value))}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* District Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          District
        </label>
        <select
          aria-label="Select district"
          value={filter.district}
          onChange={(e) => onFilterChange('district', e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Districts</option>
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" size={16} />
      </div>

      {/* Upazilla Selection */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Upazilla
        </label>
        <select
          aria-label="Select upazilla"
          value={filter.upazilla}
          onChange={(e) => onFilterChange('upazilla', e.target.value)}
          disabled={!filter.district}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
            focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
            disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          <option value="">All Upazillas</option>
          {upazillas.map((upazilla) => (
            <option key={upazilla} value={upazilla}>
              {upazilla}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-9 text-gray-400 pointer-events-none" size={16} />
      </div>
    </div>
  );
}