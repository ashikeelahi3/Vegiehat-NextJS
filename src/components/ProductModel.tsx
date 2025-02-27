import { useState } from 'react';
import { supabase } from '../../lib/supabase'

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
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
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
    try {
      const { data, error } = await supabase
      .from('price_entries')
      .insert([
        {
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
        console.error('Error inserting product:', error);
        return;
      }
      
      console.log('Data inserted successfully:', data);
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
      return;
    }
    console.log('Data inserted successfully:');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4">
        <div className="max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{product.name}</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-150"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price per {product.unit} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                {product.categories && (
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik03LjQxIDguNTlTMTIgMTMuMTdsNC41OS00LjU4TDE4IDEwbC02IDYtNi02IDEuNDEtMS40MXoiLz48L3N2Zz4=')] bg-no-repeat bg-[right:1rem_center] bg-[length:1.5em] appearance-none"
                    >
                      <option value="" disabled>Select Category</option>
                      {product.categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {formData.category === "Other" && (
                      <input
                        type="text"
                        id="other-category"
                        name="otherCategory"
                        value={formData.otherCategory}
                        onChange={handleChange}
                        placeholder="Specify category"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  </div>
                )}

                {product.purchaseOption && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Option
                    </label>
                    <div className="flex flex-wrap gap-1 items-start justify-start">
                      {product.purchaseOption.map((option) => (
                        <div key={option} className=" min-w-[70px]">
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
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'}`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formData.purchaseOption === "Other" && (
                      <input
                        type="text"
                        id="otherPurchaseOption"
                        name="otherPurchaseOption"
                        value={formData.otherPurchaseOption}
                        onChange={handleChange}
                        placeholder="Specify purchase option"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Online/Supershop", "Traditional-Shop", "other"].map((option) => (
                      <div key={option} className="min-w-[140px]">
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
                              ? 'bg-indigo-600 text-white border-indigo-600' 
                              : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-300'}`}
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
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik07LjQxIDguNTlTMTIgMTMuMTdsNC41OS00LjU4TDE4IDEwbC02IDYtNi02IDEuNDEtMS40MXoiLz48L3N2Zz4=')] bg-no-repeat bg-[right:1rem_center] bg-[length:1.5em] appearance-none"
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
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  )}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                    ${isSubmitting 
                      ? 'bg-indigo-400 cursor-not-allowed' 
                      : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                {/* If there is error in submitting */}
                {error && (
                  <div className="mt-2 text-red-600 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}