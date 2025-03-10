"use client";

import { FC } from 'react';

type ReportEntry = {
  id: string;
  product_name: string;
  price: number;
  category?: string;
  other_category?: string;
  district: string;
  upazilla: string;
  shop_type?: string;
  other_shop_type?: string;
  online_shop_name?: string;
  created_at: string;
};

interface ReportTableProps {
  data: ReportEntry[];
  isLoading: boolean;
}

const ReportTable: FC<ReportTableProps> = ({ data, isLoading }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center text-gray-500 dark:text-gray-400 transition-colors">
        No data found matching your criteria.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
        <thead className="bg-gray-50 dark:bg-gray-700 transition-colors">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Product
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Shop Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors">
          {data.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900 dark:text-white">{entry.product_name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">৳{entry.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {entry.category || 'N/A'}
                  {entry.other_category && ` (${entry.other_category})`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {entry.upazilla}, {entry.district}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {entry.shop_type || 'N/A'}
                  {entry.other_shop_type && ` (${entry.other_shop_type})`}
                  {entry.online_shop_name && ` - ${entry.online_shop_name}`}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {formatDate(entry.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;