interface ModalFooterProps {
  onClose: () => void;
  isSubmitting: boolean;
}

export default function ModalFooter({ onClose, isSubmitting }: ModalFooterProps) {
  return (
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
  );
} 