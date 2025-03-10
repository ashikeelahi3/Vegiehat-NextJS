export type PriceStats = {
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  totalEntries: number;
  img?: string;
  unit: string;
};

export type LocationFilter = {
  district: string;
  upazilla: string;
  month: number;
  year: number;
};

export type CartItem = {
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  img?: string;
};