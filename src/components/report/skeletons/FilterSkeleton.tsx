export default function FilterSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      
      <div className="space-y-4">
        <div>
          <div className="h-5 w-1/5 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        
        <div>
          <div className="h-5 w-1/5 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
        
        <div>
          <div className="h-5 w-1/5 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse"></div>
          <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
} 