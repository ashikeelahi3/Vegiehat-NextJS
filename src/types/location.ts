export interface District {
  id: number;
  name: string;
  division: string;
  upazilla: string[];
}

export interface Upazilla {
  id: number;
  name: string;
  district: string;
}

export interface LocationFilter {
  district: string;
  upazilla: string;
}

export interface LocationSelectProps {
  selectedDistrict: string;
  selectedUpazilla: string;
  onDistrictChange: (district: string) => void;
  onUpazillaChange: (upazilla: string) => void;
}