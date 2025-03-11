"use client";

export default function ReportSkeleton() {
  return (
    <div className="space-y-8">
      {/* ফিল্টার এবং সামারি স্কেলেটন */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="h-7 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <div className="space-y-4">
            {/* ডেট রেঞ্জ সিলেক্টর স্কেলেটন */}
            <div>
              <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
            
            {/* লোকেশন ফিল্টার স্কেলেটন */}
            <div className="space-y-4">
              <div>
                <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
              <div>
                <div className="h-5 w-1/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* স্ট্যাটস সামারি স্কেলেটন */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="h-7 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 flex">
                <div className="rounded-full h-10 w-10 bg-gray-300 dark:bg-gray-600 mr-4"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-6 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* প্রাইস ট্রেন্ডস চার্ট স্কেলেটন */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="h-7 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
        <div className="mb-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
      
      {/* প্রাইস এনালিটিক্স গ্রিড স্কেলেটন */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="h-7 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-48 animate-pulse"></div>
          ))}
        </div>
      </div>

      {/* আঞ্চলিক তুলনা স্কেলেটন */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="h-7 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    </div>
  );
} 