import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { toast } from 'react-hot-toast';

export default function useProductForm(product: any, userInfo: any, onClose: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    price: '',
    category: '',
    otherCategory: '',
    purchaseOption: '',
    otherPurchaseOption: '',
    shopType: '',
    otherShopType: '', 
    onlineShopName: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === "price") {
      let sanitizedValue = value.replace(/[^0-9.]/g, '');
      if(sanitizedValue.split(".").length > 2) return;
      setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    } else if(name === "category") {
      setFormData(prev => ({ ...prev, [name]: value, otherCategory: ""}));
    } else if(name === "purchaseOption") {
      setFormData(prev => ({ ...prev, [name]: value, otherPurchaseOption: ""}));
    } else if(name === "shopType") {
      setFormData(prev => ({ ...prev, [name]: value, otherShopType: "", onlineShopName: ""}));
    } else if(name === "otherShopType") {
      setFormData(prev => ({ ...prev, [name]: value, onlineShopName: ""}));
    } else if(name === "onlineShopName") {
      setFormData(prev => ({ ...prev, [name]: value, otherShopType: ""}));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.price) {
        toast.error('Price is required');
        return;
      }

      if (product?.categories && !formData.category) {
        toast.error('Category is required');
        return;
      }

      const { data, error } = await supabase
        .from('price_entries_2')
        .insert([
          {
            user_email: userInfo.email,
            district: userInfo.district,
            upazilla: userInfo.upazilla,
            product_id: product.id,
            product_name: product.name,
            price: parseFloat(formData.price),
            category: formData.category,
            other_category: formData.otherCategory,
            purchase_option: formData.purchaseOption,
            other_purchase_option: formData.otherPurchaseOption,
            shop_type: formData.shopType,
            other_shop_type: formData.otherShopType,
            online_shop_name: formData.onlineShopName,
            notes: formData.notes
          }
        ])
        .select();

      if (error) {
        setError(error.message);
        toast.error('Failed to submit data. Please try again.');
        console.error('Error inserting product:', error);
        return;
      }
      
      toast.success('Data submitted successfully!');
      // Reset form data
      setFormData({
        price: '',
        category: '',
        otherCategory: '',
        purchaseOption: '',
        otherPurchaseOption: '',
        shopType: '',
        otherShopType: '', 
        onlineShopName: '',
        notes: ''
      });
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      toast.error('Failed to submit data. Please try again.');
      console.error('Error saving product:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    error,
    isSubmitting,
    handleChange,
    handleSubmit
  };
} 