"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabase'
import { toast } from 'react-hot-toast';

type Product = {
  id: number;
  name: string;
  unit: string;
  img?: string;
  purchaseOption?: Array<string>;
  categories?: Array<string>;
  onlineShops: Array<string>;
};

interface ProductModalProps {
  product: Product | null;
  userInfo: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, userInfo, isOpen, onClose }: ProductModalProps) {
  if (!isOpen || !product) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    price: '',
    category: '',
    otherCategory: '',
    purchaseOption: '',
    otherPurchaseOption: '',
    shopType: '',
    otherShopType: '', 
    onlineShopName: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === "price") {
      let sanitizedValue = value.replace(/[^0-9.]/g, '');
      if(sanitizedValue.split(".").length > 2) return;
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else if(name === "category") {
      setFormData(prev => ({ ...prev, [name]: value, otherCategory: ""}));
    } else if(name === "purchaseOption") {
      setFormData(prev => ({ ...prev, [name]: value, otherPurchaseOption: ""}));
    } else if(name === "shopType") {
      setFormData(prev => ({ ...prev, [name]: value, otherShopType: "", onlineShopName: ""}));
    } else if(name === "otherShopType") {
      setFormData(prev => ({ ...prev, [name]: value, onlineShopName: ""}));
    } else if(name === "onlineShopName") {
      setFormData(prev => ({ ...prev, [name]: value, otherShopType: ""}));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.price) {
        toast.error('Price is required');
        return;
      }

      if (product?.categories && !formData.category) {
        toast.error('Category is required');
        return;
      }

      const { data, error } = await supabase
        .from('price_entries_2')
        .insert([
          {
            user_email: userInfo.email,
            district: userInfo.district,
            upazilla: userInfo.upazilla,
            product_id: product.id,
            product_name: product.name,
            price: parseFloat(formData.price),
            category: formData.category,
            other_category: formData.otherCategory,
            purchase_option: formData.purchaseOption,
            other_purchase_option: formData.otherPurchaseOption,
            shop_type: formData.shopType,
            other_shop_type: formData.otherShopType,
            online_shop_name: formData.onlineShopName,
            notes: formData.notes
          }
        ])
        .select();

      if (error) {
        setError(error.message);
        toast.error('Failed to submit data. Please try again.');
        console.error('Error inserting product:', error);
        return;
      }
      
      toast.success('Data submitted successfully!');
      // Reset form data
      setFormData({
        price: '',
        category: '',
        otherCategory: '',
        purchaseOption: '',
        otherPurchaseOption: '',
        shopType: '',
        otherShopType: '', 
        onlineShopName: '',
        notes: ''
      });
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to submit data. Please try again.');
      console.error('Error saving product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto transition-all">
        <div className="sticky top-0 bg-white dark:bg-gray-800 z-10 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Report Price for {product.name}</h2>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {product.img && (
          <div className="mb-6 flex justify-center p-1">
            <img 
              src={`./images/products/${product.img}`}
              alt={product.name}
              className="w-1/3 h-auto object-contain rounded-md"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price (Tk) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder={`Enter price per ${product.unit}`}
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Price per {product.unit}</p>
          </div>
          
          {product.categories && (
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                {formData.category === 'Others' && (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400">Custom category enabled</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 items-start justify-start mb-2">
                {product.categories.map((category) => (
                  <div key={category} className="mr-[1px] mb-3">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      value={category}
                      checked={formData.category === category}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <label
                      htmlFor={category}
                      className={`w-full px-4 py-2 text-sm font-medium text-center rounded-lg border transition-all duration-200 cursor-pointer
                        ${formData.category === category 
                          ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-400'}`}
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
              
              {formData.category === 'Others' && (
                <input
                  type="text"
                  id="otherCategory"
                  name="otherCategory"
                  value={formData.otherCategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Specify other category"
                />
              )}
            </div>
          )}

          {product.purchaseOption && (
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purchase Option
                </label>
                {formData.purchaseOption === 'Others' && (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400">Custom option enabled</span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-1 items-start justify-start mb-2">
                {product.purchaseOption.map((option) => (
                  <div key={option} className="mr-[1px] mb-3">
                    <input
                      type="radio"
                      id={option}
                      name="purchaseOption"
                      value={option}
                      checked={formData.purchaseOption === option}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <label
                      htmlFor={option}
                      className={`w-full px-4 py-2 text-sm font-medium text-center rounded-lg border transition-all duration-200 cursor-pointer
                        ${formData.purchaseOption === option 
                          ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700' 
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-400'}`}
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
              
              {formData.purchaseOption === 'Others' && (
                <input
                  type="text"
                  id="otherPurchaseOption"
                  name="otherPurchaseOption"
                  value={formData.otherPurchaseOption}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Specify other purchase option"
                />
              )}
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Shop Type
              </label>
              {formData.shopType === 'Others' && (
                <span className="text-xs text-indigo-600 dark:text-indigo-400">Custom shop type enabled</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 items-start justify-start mb-2">
              {["Online/Supershop", "Traditional-Shop", "other"].map((option) => (
                <div key={option} className="mr-[1px] mb-3">
                  <input
                    type="radio"
                    id={option}
                    name="shopType"
                    value={option}
                    checked={formData.shopType === option}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <label
                    htmlFor={option}
                    className={`w-full px-4 py-2 text-sm font-medium text-center rounded-lg border transition-all duration-200 cursor-pointer
                      ${formData.shopType === option 
                        ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-400'}`}
                  >
                    {option.replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
            
            {formData.shopType === 'Online/Supershop' && (                
              <select
                id="onlineShopName"
                name="onlineShopName"
                value={formData.onlineShopName}
                onChange={handleChange}
                aria-label="Select online shop name"
                className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik07LjQxIDguNTlTMTIgMTMuMTdsNC41OS00LjU4TDE4IDEwbC02IDYtNi02IDEuNDEtMS40MXoiLz48L3N2Zz4=')] bg-no-repeat bg-[right:1rem_center] bg-[length:1.5em] appearance-none"
              >
                <option value="" disabled>Select Shop Name</option>
                {product.onlineShops.map((shop) => (
                  <option key={shop} value={shop}>{shop}</option>
                ))}
              </select>
            )}

            {formData.shopType === "other" && (
              <input
                type="text"
                id="otherShopType"
                name="otherShopType"
                value={formData.otherShopType}
                onChange={handleChange}
                placeholder="Specify shop type"
                className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            )}
          </div>

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
          
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 
              border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-700 
              border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-800
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Price'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}