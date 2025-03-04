"use client";

import { useState, useRef, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ProductModal from "@/components/ProductModel";
import { products } from "../../Data/productData"
import { Districts } from "@/Data/Upazilla";
import { toast } from 'react-hot-toast';

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
    // Validate required fields
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }
    if (!district) {
      toast.error('Please select your district');
      return;
    }
    if (!upazilla) {
      toast.error('Please select your upazilla');
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
        setIsUpazillaDropdownOpen(false);
        setUpazillaSelectedIndex(-1);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 space-y-4">
          {/* Only show email input if user is not logged in */}
          {!user && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={email}
                onChange={handleEmailChange}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter your email"
              />
            </div>
          )}

          <div className="relative">
            <label htmlFor="district" className="block text-sm font-medium text-gray-700">
              District
            </label>
            <input
              ref={districtInputRef}
              type="text"
              id="district"
              value={districtFilter}
              onChange={handleDistrictFilterChange}
              onFocus={() => setIsDistrictDropdownOpen(true)}
              onKeyDown={handleDistrictKeyDown}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm 
                focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search and select district..."
              autoComplete="off"
            />
            {isDistrictDropdownOpen && filteredDistricts.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-20 w-full mt-1 bg-white rounded-md shadow-lg 
                  max-h-60 overflow-auto border border-gray-200"
              >
                {filteredDistricts.map((dist, index) => (
                  <div
                    key={dist.id}
                    className={`px-4 py-2 cursor-pointer ${
                      district === dist.name 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : index === selectedIndex
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
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
            <label htmlFor="upazilla" className="block text-sm font-medium text-gray-700">
              Upazilla
            </label>
            <input
              ref={upazillaInputRef}
              type="text"
              id="upazilla"
              value={upazillaFilter}
              onChange={handleUpazillaFilterChange}
              onFocus={() => district && setIsUpazillaDropdownOpen(true)}
              onKeyDown={handleUpazillaKeyDown}
              disabled={!district}
              className={`mt-1 p-2 block w-full rounded-md shadow-sm ${
                !district 
                  ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              } sm:text-sm`}
              placeholder={district ? "Search and select upazilla..." : "Select a district first"}
              autoComplete="off"
            />
            {isUpazillaDropdownOpen && district && availableUpazillas.length > 0 && (
              <div
                ref={upazillaDropdownRef}
                className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg 
                  max-h-60 overflow-auto border border-gray-200"
              >
                {availableUpazillas.map((upz, index) => (
                  <div
                    key={upz}
                    className={`px-4 py-2 cursor-pointer ${
                      upazilla === upz 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : index === upazillaSelectedIndex
                        ? 'bg-gray-100'
                        : 'hover:bg-gray-50'
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

        {/* Add product grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="aspect-square relative mb-2">
                {product.img ? (
                  <img 
                    src={`/images/products/${product.img}`} 
                    alt={product.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
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
              <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">{product.unit}</p>
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