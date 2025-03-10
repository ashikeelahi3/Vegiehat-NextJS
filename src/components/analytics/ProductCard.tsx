"use client";

import { BarChart3, ImageOff, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { products } from '@/Data/productData';

type ProductCardProps = {
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  totalEntries: number;
};

export default function ProductCard({
  productName,
  minPrice,
  maxPrice,
  avgPrice,
  totalEntries,
}: ProductCardProps) {
  const productData = products.find(p => p.name === productName);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="w-full md:w-64 h-48 relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
          {productData?.img ? (
            <Image
              src={`/images/products/${productData.img}`}
              alt={productName}
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 256px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageOff className="w-12 h-12 text-gray-400/50" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {productName}
                </h3>
                <span className="px-2.5 py-0.5 bg-gradient-to-r from-indigo-50 to-blue-50 
                  dark:from-indigo-900/20 dark:to-blue-900/20 text-indigo-700 dark:text-indigo-300 
                  text-sm font-medium rounded-full border border-indigo-100 dark:border-indigo-800/50">
                  Per {productData?.unit || 'kg'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-4 h-4" />
                <span>{totalEntries} price entries recorded</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 
              dark:to-emerald-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800/50">
              <div className="text-green-700 dark:text-green-300 text-sm font-medium">
                Lowest Price
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-green-800 dark:text-green-200">
                  ৳{minPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 
              dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/50">
              <div className="text-blue-700 dark:text-blue-300 text-sm font-medium">
                Average Price
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  ৳{avgPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 
              dark:to-rose-900/20 p-4 rounded-xl border border-red-100 dark:border-red-800/50">
              <div className="text-red-700 dark:text-red-300 text-sm font-medium">
                Highest Price
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-red-800 dark:text-red-200">
                  ৳{maxPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Categories and Purchase Options */}
          {(productData?.categories || productData?.purchaseOption) && (
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productData.categories && (
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Categories
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productData.categories.map((category) => (
                        <span
                          key={category}
                          className="px-2.5 py-1 text-xs bg-gray-50 dark:bg-gray-700 
                            text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 
                            dark:border-gray-600"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {productData.purchaseOption && (
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Purchase Options
                    </span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {productData.purchaseOption.map((option) => (
                        <span
                          key={option}
                          className="px-2.5 py-1 text-xs bg-gray-50 dark:bg-gray-700 
                            text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 
                            dark:border-gray-600"
                        >
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}