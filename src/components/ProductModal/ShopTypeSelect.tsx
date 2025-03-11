interface ShopTypeSelectProps {
  selectedType: string;
  otherType: string;
  onlineShopName: string;
  onlineShops: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function ShopTypeSelect({ 
  selectedType, 
  otherType, 
  onlineShopName, 
  onlineShops, 
  onChange 
}: ShopTypeSelectProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Shop Type
        </label>
        {selectedType === 'other' && (
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
              checked={selectedType === option}
              onChange={onChange}
              className="hidden"
            />
            <label
              htmlFor={option}
              className={`w-full px-4 py-2 text-sm font-medium text-center rounded-lg border transition-all duration-200 cursor-pointer
                ${selectedType === option 
                  ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-400'}`}
            >
              {option.replace(/\b\w/g, l => l.toUpperCase())}
            </label>
          </div>
        ))}
      </div>
      
      {selectedType === 'Online/Supershop' && (                
        <select
          id="onlineShopName"
          name="onlineShopName"
          value={onlineShopName}
          onChange={onChange}
          aria-label="Select online shop name"
          className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJjdXJyZW50Q29sb3IiPjxwYXRoIGQ9Ik03LjQxIDguNTlTMTIgMTMuMTdsNC41OS00LjU4TDE4IDEwbC02IDYtNi02IDEuNDEtMS40MXoiLz48L3N2Zz4=')] bg-no-repeat bg-[right:1rem_center] bg-[length:1.5em] appearance-none"
        >
          <option value="" disabled>Select Shop Name</option>
          {onlineShops.map((shop) => (
            <option key={shop} value={shop}>{shop}</option>
          ))}
        </select>
      )}

      {selectedType === "other" && (
        <input
          type="text"
          id="otherShopType"
          name="otherShopType"
          value={otherType}
          onChange={onChange}
          placeholder="Specify shop type"
          className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      )}
    </div>
  );
} 