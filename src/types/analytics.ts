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

export type DateFilter = {
  month: number;
  year: number;
};

export type PriceEntry = {
  id: string;
  user_email: string;
  district: string;
  upazilla: string;
  product_id: number;
  product_name: string;
  price: number;
  category?: string;
  other_category?: string;
  purchase_option?: string;
  other_purchase_option?: string;
  shop_type?: string;
  other_shop_type?: string;
  online_shop_name?: string;
  notes?: string;
  created_at: string;
};

export type CartItem = {
  productName: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  img?: string;
};