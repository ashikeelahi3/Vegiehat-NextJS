export default function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
        <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-600 rounded"></div>
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
        </div>

        <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
      </div>
    </div>
  );
} 