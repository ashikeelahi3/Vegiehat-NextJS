import { useState } from 'react';

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
      // Allow numbers and single decimal point
      let sanitizedValue = value.replace(/[^0-9.]/g, '');
      
      if(sanitizedValue.split(".").length > 2) {
        return
      }
      setFormData(prev => ({
        ...prev,
        [name]: sanitizedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      productId: product.id,
      name: product.name,
      ...formData
    };
    console.log('Form submitted:', data);
    // Here you can handle the form data as needed
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg max-w-md w-96 my-8"> {/* Added my-8 for vertical spacing */}
        <div className="max-h-[90vh] overflow-y-auto"> {/* Added wrapper div with max-height and scroll */}
          <div className="p-6"> {/* Moved padding to inner container */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{product.name}</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 flex justify-center w-full">
              <img 
                src={`./images/products/${product.img}`}
                alt={product.name}
                className="w-1/4 h-auto rounded-md"
              />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">            
                <div className="form-group">
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Price: per ({product.unit})
                  </label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Input Price"
                    required
                    className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                {product.categories && 
                (<div className="form-group">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category:
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="" disabled>Select Category</option>
                    {
                      product.categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))
                    }
                  </select>
                  {formData.category === "Other" && (
                    <input
                      type="text"
                      id="other-category"
                      name="otherCategory"
                      value={formData.otherCategory}
                      onChange={handleChange}
                      placeholder="Other category"
                      className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}
                </div>)}
                  
                {/* ********************************************  */}
                {/* ********* Product Purchase Option *********** */}
                {/* ********************************************* */}  
                {product.purchaseOption && (
                  <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Option:
                    </label>
                    <div className="flex gap-2">
                      {product.purchaseOption.map((option) => (
                        <div key={option}>
                          <input
                            type="radio"
                            id={option}
                            name="purchaseOption"
                            value={option}
                            checked={formData.purchaseOption === option}
                            onChange={handleChange}
                            className="hidden" // Hide the default radio button
                          />
                          <label
                            htmlFor={option}
                            className={`px-4 py-2 text-sm rounded-md cursor-pointer border
                              ${formData.purchaseOption === option 
                                ? 'bg-indigo-600 text-white border-indigo-600' 
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
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
                        placeholder="Other otherPurchaseOption"
                        className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                )}

                {/* ********************************************  */}
                {/* *********** Types of shop ******************* */}
                {/* ********************************************* */}
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Type:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Online/Supershop", "Traditional-Shop", "other"].map((option) => (
                      <div key={option}>
                        <input
                          type="radio"
                          id={option}
                          name="shopType"
                          value={option}
                          checked={formData.shopType === option}
                          onChange={handleChange}
                          className="hidden" // Hide the default radio button
                        />
                        <label
                          htmlFor={option}
                          className={`px-4 gap-1 py-2 text-sm rounded-md cursor-pointer border
                            ${formData.shopType === option 
                              ? 'bg-indigo-600 text-white border-indigo-600' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                          {option[0].toUpperCase()+option.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* ShopType Online */}
                  {formData.shopType === 'Online/Supershop' && (                
                    <select
                      id="onlineShopName"
                      name="onlineShopName"
                      value={formData.onlineShopName}
                      onChange={handleChange}
                      aria-label="Select online shop name"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="" disabled>Select Shop Name</option>
                      {
                        product.onlineShops.map((shop) => (
                          <option key={shop} value={shop}>
                            {shop}
                          </option>
                        ))
                      }
                    </select>
                  )}  
                  {/* ShopType Others */}
                  {formData.shopType === "other" && (
                    <input
                      type="text"
                      id="otherShopType"
                      name="otherShopType"
                      value={formData.otherShopType}
                      onChange={handleChange}
                      placeholder="Other Shop Type"
                      className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}
                </div>
                

                <div className="form-group">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Comment:
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}