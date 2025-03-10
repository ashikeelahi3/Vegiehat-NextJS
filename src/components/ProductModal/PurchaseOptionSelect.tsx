interface PurchaseOptionSelectProps {
  options: string[];
  selectedOption: string;
  otherOption: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PurchaseOptionSelect({ 
  options, 
  selectedOption, 
  otherOption, 
  onChange 
}: PurchaseOptionSelectProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Purchase Option
        </label>
        {selectedOption === 'Others' && (
          <span className="text-xs text-indigo-600 dark:text-indigo-400">Custom option enabled</span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1 items-start justify-start mb-2">
        {options.map((option) => (
          <div key={option} className="mr-[1px] mb-3">
            <input
              type="radio"
              id={option}
              name="purchaseOption"
              value={option}
              checked={selectedOption === option}
              onChange={onChange}
              className="hidden"
            />
            <label
              htmlFor={option}
              className={`w-full px-4 py-2 text-sm font-medium text-center rounded-lg border transition-all duration-200 cursor-pointer
                ${selectedOption === option 
                  ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-400'}`}
            >
              {option}
            </label>
          </div>
        ))}
      </div>
      
      {selectedOption === 'Others' && (
        <input
          type="text"
          id="otherPurchaseOption"
          name="otherPurchaseOption"
          value={otherOption}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Specify other purchase option"
        />
      )}
    </div>
  );
} 