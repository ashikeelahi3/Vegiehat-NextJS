interface CategorySelectProps {
  categories: string[];
  selectedCategory: string;
  otherCategory: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CategorySelect({ categories, selectedCategory, otherCategory, onChange }: CategorySelectProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        {selectedCategory === 'Others' && (
          <span className="text-xs text-indigo-600 dark:text-indigo-400">Custom category enabled</span>
        )}
      </div>
      
      <div className="flex flex-wrap gap-1 items-start justify-start mb-2">
        {categories.map((category) => (
          <RadioButton
            key={category}
            id={category}
            name="category"
            value={category}
            isSelected={selectedCategory === category}
            onChange={onChange}
            label={category}
          />
        ))}
      </div>
      
      {selectedCategory === 'Others' && (
        <input
          type="text"
          id="otherCategory"
          name="otherCategory"
          value={otherCategory}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="Specify other category"
        />
      )}
    </div>
  );
}

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  isSelected: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

function RadioButton({ id, name, value, isSelected, onChange, label }: RadioButtonProps) {
  return (
    <div className="mr-[1px] mb-3">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={isSelected}
        onChange={onChange}
        className="hidden"
      />
      <label
        htmlFor={id}
        className={`w-full px-4 py-2 text-sm font-medium text-center rounded-lg border transition-all duration-200 cursor-pointer
          ${isSelected 
            ? 'bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700' 
            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-400'}`}
      >
        {label}
      </label>
    </div>
  );
} 