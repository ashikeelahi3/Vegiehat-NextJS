export default function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center">
      <div className="rounded-full p-3 mr-4 bg-gray-300 dark:bg-gray-600 h-10 w-10"></div>
      <div>
        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-600 rounded mb-1"></div>
        <div className="h-6 w-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
      </div>
    </div>
  );
} 