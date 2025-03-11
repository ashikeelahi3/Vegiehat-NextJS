export default function ChartSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className="space-y-4">
      <div className="h-7 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
          ></div>
        ))}
      </div>
      
      <div className={`${height} bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse`}></div>
    </div>
  );
} 