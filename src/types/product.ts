export type Product = {
  id: number;
  name: string;
  unit: string;
  img?: string;
  purchaseOption?: Array<string>;
  categories?: Array<string>;
  onlineShops: Array<string>;
};

export type FormData = {
  price: string;
  category: string;
  otherCategory: string;
  purchaseOption: string;
  otherPurchaseOption: string;
  shopType: string;
  otherShopType: string;
  onlineShopName: string;
  notes: string;
};

export interface ProductModalProps {
  product: Product | null;
  userInfo: any;
  isOpen: boolean;
  onClose: () => void;
}