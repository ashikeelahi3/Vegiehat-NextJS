// import { Product } from '../app/input/page';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="mb-4">
          <img 
            src={`./images/products/${product.img}`}
            alt={product.name}
            className="w-full h-auto rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <p><strong>Unit:</strong> {product.unit}</p>
          {product.purchaseOption && (
            <p><strong>Purchase Options:</strong> {product.purchaseOption.join(', ')}</p>
          )}
          {product.categories && (
            <p><strong>Categories:</strong> {product.categories.join(', ')}</p>
          )}
        </div>
      </div>
    </div>
  );
}