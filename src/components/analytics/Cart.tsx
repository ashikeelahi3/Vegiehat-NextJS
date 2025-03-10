import { ShoppingCart, X, ImageOff } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { useState } from 'react';

export default function Cart() {
  const { items, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-96 max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2" />
            Comparison Cart ({items.length})
          </h3>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div 
              key={item.productName}
              className="flex items-center gap-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg"
            >
              <div className="w-12 h-12 relative flex-shrink-0 bg-gray-100 dark:bg-gray-600 rounded-md">
                {item.img ? (
                  <Image
                    src={item.img}
                    alt={item.productName}
                    fill
                    sizes="48px"
                    className="object-cover rounded-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = document.createElement('div');
                        fallback.className = 'w-full h-full flex items-center justify-center';
                        fallback.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18V3H3zm16 16H5V5h14v14z"/><path d="M14 10l-3 3-2-2-3 3"/><circle cx="8" cy="8" r="1.5"/></svg>';
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageOff className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-white truncate">
                  {item.productName}
                </h4>
                <div className="flex gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="text-green-600 dark:text-green-400">Min: ৳{item.minPrice}</span>
                  <span className="text-blue-600 dark:text-blue-400">Avg: ৳{item.avgPrice.toFixed(2)}</span>
                  <span className="text-red-600 dark:text-red-400">Max: ৳{item.maxPrice}</span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.productName)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                aria-label={`Remove ${item.productName} from cart`}
              >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}