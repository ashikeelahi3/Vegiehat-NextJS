"use client";

import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '@/types/analytics';
import { toast } from 'react-hot-toast';

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productName: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: CartItem) => {
    if (items.some(i => i.productName === item.productName)) {
      toast.error('Item already in cart');
      return;
    }
    setItems(prev => [...prev, item]);
    toast.success('Added to cart');
  };

  const removeItem = (productName: string) => {
    setItems(prev => prev.filter(item => item.productName !== productName));
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};