"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ProductModal from "@/components/ProductModel";
import { products } from "../../Data/productData"
import { Districts } from "@/Data/Upazilla";
import { toast } from 'react-hot-toast';
import { Search } from "lucide-react";

type Product = {
  id: number;
  name: string;
  unit: string;
  img?: string;
  purchaseOption?: Array<string>;
  categories?: Array<string>;
  onlineShops: Array<string>;
};

export default function Input() {
  const { user, isLoaded } = useUser();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('');
  const [upazilla, setUpazilla] = useState('');

  const [filteredDistricts, setFilteredDistricts] = useState(Districts);
  const [availableUpazillas, setAvailableUpazillas] = useState<string[]>([]);
  const [districtFilter, setDistrictFilter] = useState("");
  const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
  const districtInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [upazillaFilter, setUpazillaFilter] = useState("");
  const [isUpazillaDropdownOpen, setIsUpazillaDropdownOpen] = useState(false);
  const upazillaInputRef = useRef<HTMLInputElement>(null);
  const upazillaDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [upazillaSelectedIndex, setUpazillaSelectedIndex] = useState(-1);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !districtInputRef.current?.contains(event.target as Node)
      ) {
        setIsDistrictDropdownOpen(false);
      }

      if (
        upazillaDropdownRef.current && 
        !upazillaDropdownRef.current.contains(event.target as Node) &&
        !upazillaInputRef.current?.contains(event.target as Node)
      ) {
        setIsUpazillaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load stored values after component mounts
    setEmail(localStorage.getItem('userEmail') || '');
    const storedDistrict = localStorage.getItem('userDistrict') || '';
    setDistrict(storedDistrict);
    setDistrictFilter(storedDistrict);
    
    if (storedDistrict) {
      const districtData = Districts.find(d => d.name === storedDistrict);
      if (districtData) {
        setAvailableUpazillas(districtData.upazilla);
        const storedUpazilla = localStorage.getItem('userUpazilla') || '';
        if (storedUpazilla && districtData.upazilla.includes(storedUpazilla)) {
          setUpazilla(storedUpazilla);
          setUpazillaFilter(storedUpazilla);
        }
      }
    }
  }, []); // Run once on mount

  useEffect(() => {
    if (district) {
      const districtData = Districts.find(d => d.name === district);
      if (districtData) {
        setAvailableUpazillas(districtData.upazilla);
        setDistrictFilter(district);
        
        // If upazilla exists in localStorage, set it and its filter
        const savedUpazilla = localStorage.getItem('userUpazilla');
        if (savedUpazilla && districtData.upazilla.includes(savedUpazilla)) {
          setUpazilla(savedUpazilla);
          setUpazillaFilter(savedUpazilla);
        }
      }
    }
  }, [district]);

  useEffect(() => {
    if (isLoaded && user) {
      const userEmail = user.primaryEmailAddress?.emailAddress || '';
      setEmail(userEmail);
      localStorage.setItem('userEmail', userEmail);
    } else if (!user) {
      const storedEmail = localStorage.getItem('userEmail') || '';
      setEmail(storedEmail);
    }
  }, [isLoaded, user]);

  const handleProductClick = (product: Product) => {
    // Collect all validation errors
    const errors = [];
    
    if (!email) {
      errors.push('Please enter your email address');
    }
    
    if (!district) {
      errors.push('Please select your district');
    }
    
    if (!upazilla) {
      errors.push('Please select your upazilla');
    }
    
    // If there are errors, show them one by one with animation
    if (errors.length > 0) {
      // Show errors sequentially with a delay
      errors.forEach((error, index) => {
        setTimeout(() => {
          toast.error(error, {
            duration: 3000,
            position: 'top-right',
            // Custom styling for better visibility
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
              padding: '16px',
              border: '1px solid #F87171',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            },
            // Add animation
            icon: '❌',
            // Custom animation
            className: 'animate-bounce-short',
          });
        }, index * 500); // 500ms delay between each notification
      });
      return;
    }
    
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    localStorage.setItem('userEmail', value);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistrict(e.target.value);
  };

  const handleUpazillaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpazilla(e.target.value);
  };

  const handleDistrictFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = e.target.value;
    setDistrictFilter(filterValue);
    setDistrict(''); // Clear selected district when typing
    setUpazilla('');
    setUpazillaFilter('');
    setIsDistrictDropdownOpen(true);
    
    const filtered = Districts.filter(district => 
      district.name.toLowerCase().includes(filterValue.toLowerCase())
    );
    setFilteredDistricts(filtered);
  };

  const handleDistrictSelect = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    setDistrictFilter(selectedDistrict);
    setIsDistrictDropdownOpen(false);
    setUpazilla(''); // Reset upazilla
    localStorage.setItem('userDistrict', selectedDistrict);
    localStorage.removeItem('userUpazilla'); // Clear stored upazilla when district changes

    const districtData = Districts.find(d => d.name === selectedDistrict);
    if (districtData) {
      setAvailableUpazillas(districtData.upazilla);
    } else {
      setAvailableUpazillas([]);
    }
  };

  const handleUpazillaFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = e.target.value;
    setUpazillaFilter(filterValue);
    setUpazilla('');
    setIsUpazillaDropdownOpen(true);

    // Get the original upazillas for the selected district
    const districtData = Districts.find(d => d.name === district);
    const originalUpazillas = districtData ? districtData.upazilla : [];

    // Filter from original upazillas
    const filtered = originalUpazillas.filter(upz => 
      upz.toLowerCase().includes(filterValue.toLowerCase())
    );
    setAvailableUpazillas(filtered);
  };

  const handleUpazillaSelect = (selectedUpazilla: string) => {
    setUpazilla(selectedUpazilla);
    setUpazillaFilter(selectedUpazilla);
    setIsUpazillaDropdownOpen(false);
    localStorage.setItem('userUpazilla', selectedUpazilla);
  };

  const handleDistrictKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDistrictDropdownOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredDistricts.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && filteredDistricts[selectedIndex]) {
          handleDistrictSelect(filteredDistricts[selectedIndex].name);
          setSelectedIndex(-1);
        }
        break;
      case 'Escape':
      case 'Tab':
        setIsDistrictDropdownOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleUpazillaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isUpazillaDropdownOpen || !district) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setUpazillaSelectedIndex(prev => 
          prev < availableUpazillas.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setUpazillaSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (upazillaSelectedIndex >= 0 && availableUpazillas[upazillaSelectedIndex]) {
          handleUpazillaSelect(availableUpazillas[upazillaSelectedIndex]);
          setUpazillaSelectedIndex(-1);
        }
        break;
      case 'Escape':
      case 'Tab':
        setIsUpazillaDropdownOpen(false);
        setUpazillaSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Location Information</h2>
          
          <div className="space-y-6">
            {/* Only show email input if user is not logged in */}
            {!user && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="mt-1 p-3 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div className="relative">
              <label htmlFor="district" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                District
              </label>
              <div className="relative">
                <input
                  ref={districtInputRef}
                  type="text"
                  id="district"
                  value={districtFilter}
                  onChange={handleDistrictFilterChange}
                  onFocus={() => setIsDistrictDropdownOpen(true)}
                  onKeyDown={handleDistrictKeyDown}
                  className="mt-1 p-3 pl-10 block w-full rounded-lg border border-gray-300 dark:border-gray-600 
                    shadow-sm focus:border-indigo-500 focus:ring-indigo-500 
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="Search and select district..."
                  autoComplete="off"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              </div>
              
              {isDistrictDropdownOpen && filteredDistricts.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg 
                    max-h-60 overflow-auto border border-gray-200 dark:border-gray-600 transition-all duration-200"
                >
                  {filteredDistricts.map((dist, index) => (
                    <div
                      key={dist.id}
                      className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                        district === dist.name 
                          ? 'bg-indigo-600 dark:bg-indigo-700 text-white dark:text-white font-medium' 
                          : index === selectedIndex
                          ? 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => handleDistrictSelect(dist.name)}
                    >
                      {dist.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <label htmlFor="upazilla" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Upazilla
              </label>
              <div className="relative">
                <input
                  ref={upazillaInputRef}
                  type="text"
                  id="upazilla"
                  value={upazillaFilter}
                  onChange={handleUpazillaFilterChange}
                  onFocus={() => district && setIsUpazillaDropdownOpen(true)}
                  onKeyDown={handleUpazillaKeyDown}
                  disabled={!district}
                  className={`mt-1 p-3 pl-10 block w-full rounded-lg shadow-sm ${
                    !district 
                      ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  } transition-colors duration-200`}
                  placeholder={district ? "Search and select upazilla..." : "Select a district first"}
                  autoComplete="off"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              </div>
              
              {isUpazillaDropdownOpen && district && availableUpazillas.length > 0 && (
                <div
                  ref={upazillaDropdownRef}
                  className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 rounded-md shadow-lg 
                    max-h-60 overflow-auto border border-gray-200 dark:border-gray-600 transition-all duration-200"
                >
                  {availableUpazillas.map((upz, index) => (
                    <div
                      key={upz}
                      className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                        upazilla === upz 
                          ? 'bg-indigo-600 dark:bg-indigo-700 text-white dark:text-white font-medium' 
                          : index === upazillaSelectedIndex
                          ? 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => handleUpazillaSelect(upz)}
                    >
                      {upz}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Select a Product</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg dark:hover:shadow-gray-800/50 
                transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-100 dark:border-gray-700"
            >
              <div className="aspect-square relative mb-3 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-700">
                {product.img ? (
                  <img 
                    src={`/images/products/${product.img}`} 
                    alt={product.name} 
                    className="w-full h-full object-contain p-2 transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
                    <svg 
                      className="w-12 h-12" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{product.unit}</p>
            </div>
          ))}
        </div>

        <ProductModal 
          product={selectedProduct}
          userInfo={{email, district, upazilla}}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}