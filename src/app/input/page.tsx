"use client";
import ProductModal from "@/components/ProductModel";
import { products } from "../../Data/productData"
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  unit: string;
  img?: string;
  purchaseOption?: Array<string>;
  categories?: Array<string>;
  onlineShops: Array<string>;
};

export default function Input() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("")
  const [district, setDistrict] = useState("")
  const [upazilla, setUpazilla] = useState("")

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
            <input
              type="text"
              id="district"
              name="district"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your district"
            />
          </div>
          <div>
            <label htmlFor="upazilla" className="block text-sm font-medium text-gray-700">Upazilla</label>
            <input
              type="text"
              id="upazilla"
              name="upazilla"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your upazilla"
            />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div 
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={() => handleProductClick(product)}
              onKeyDown={(e) => e.key === 'Enter' && handleProductClick(product)}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 
                         border-2 border-gray-200 hover:border-indigo-200 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer p-4 h-full flex flex-col"
            >
              <div className="flex-1 flex flex-col items-center">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  {product.name}
                </h2>
                {product.img && (
                  <div className="w-full p-4 bg-gray-50 rounded-lg flex items-center justify-center">
                    <img 
                      src={`./images/products/${product.img}`} 
                      alt={product.name} 
                      className="w-full max-w-[150px] h-32 object-contain object-center"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                {!product.img && (
                  <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    <svg 
                      className="w-12 h-12" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-indigo-600 font-medium text-center">
                Click to add information
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}