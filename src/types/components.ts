import { Product } from './product';

export interface ProductModalProps {
  product: Product | null;
  userInfo: {
    email: string;
    district: string;
    upazilla: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterBarProps {
  filter: {
    district: string;
    upazilla: string;
    month: number;
    year: number;
  };
  months: Array<{ value: number; label: string }>;
  years: number[];
  districts: string[];
  upazillas: string[];
  onFilterChange: (key: string, value: string | number) => void;
}

export interface ProductCardProps {
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  totalEntries: number;
  img?: string;
  unit: string;
}