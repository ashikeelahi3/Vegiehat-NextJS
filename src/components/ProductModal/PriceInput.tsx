interface PriceInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
}

export default function PriceInput({ value, onChange, unit }: PriceInputProps) {
  return (
    <div>
      <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Price (Tk) <span className="text-red-500">*</span>
      </label>
      <input
        type="number"
        id="price"
        name="price"
        value={value}
        onChange={onChange}
        step="0.01"
        min="0"
        required
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder={`Enter price per ${unit}`}
      />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Price per {unit}</p>
    </div>
  );
} 