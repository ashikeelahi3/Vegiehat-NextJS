"use client";

import { ProductModalProps } from '@/types/product';
import ModalHeader from './ModalHeader';
import ProductImage from './ProductImage';
import PriceInput from './PriceInput';
import CategorySelect from './CategorySelect';
import PurchaseOptionSelect from './PurchaseOptionSelect';
import ShopTypeSelect from './ShopTypeSelect';
import ModalFooter from './ModalFooter';
import useProductForm from './useProductForm';

export default function ProductModal({ product, userInfo, isOpen, onClose }: ProductModalProps) {
  if (!isOpen || !product) return null;

  const {
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit
  } = useProductForm(product, userInfo, onClose);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-all">
        <ModalHeader title={`Report Price for ${product.name}`} onClose={onClose} />
        
        {product.img && <ProductImage src={`./images/products/${product.img}`} alt={product.name} />}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <PriceInput 
            value={formData.price}
            onChange={handleChange}
            unit={product.unit}
          />
          
          {product.categories && (
            <CategorySelect
              categories={product.categories}
              selectedCategory={formData.category}
              otherCategory={formData.otherCategory}
              onChange={handleChange}
            />
          )}

          {product.purchaseOption && (
            <PurchaseOptionSelect
              options={product.purchaseOption}
              selectedOption={formData.purchaseOption}
              otherOption={formData.otherPurchaseOption}
              onChange={handleChange}
            />
          )}

          <ShopTypeSelect
            selectedType={formData.shopType}
            otherType={formData.otherShopType}
            onlineShopName={formData.onlineShopName}
            onlineShops={product.onlineShops}
            onChange={handleChange}
          />

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Comments
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              placeholder="Any additional information about the price, product quality, etc."
            />
          </div>
          
          <ModalFooter onClose={onClose} isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  );
}