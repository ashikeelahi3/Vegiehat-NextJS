"use client";
import ProductModal from "@/components/ProductModel";
import { products } from "./data"
import { useState } from "react";

type Product = {
  id: number;
  name: string;
  unit: string;
  img?: string;
  purchaseOption ?: Array<string>;
  categories ?: Array<string>;
  onlineShops: Array<string>;
};

const handleProductClick = (product: Product) => {
  console.log(product.name); // This will log the clicked product object to the console.
} 
export default function Input() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full min-h-96 flex flex-wrap justify-center gap-2">
        {products.map(product => (
          <div 
            className="min-w-[200px] min-h-[150px] 
            border-[1px] border-red-500 rounded-md 
            cursor-pointer p-2 flex flex-col items-center"
            key={product.id}
            onClick={() => handleProductClick(product)}
          >
            <h1 className="text-center">{product.name}</h1>
            <img 
              src={`./images/products/${product.img}`} 
              alt={product.name} 
              className="max-w-[150px] h-auto"
            />
          </div>
        ))}
      </div>

      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
} 