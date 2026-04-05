import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import type { CustomerType, TypeConfig, DocField, FormData } from '../types/createCustomer.types';

// ─── Section Meta ─────────────────────────────────────────────────────────────

export const SECTION_META = [
  {
    icon: PersonOutlineIcon,
    label: 'Personal Information',
    color: '#1976d2',
    gradient: 'linear-gradient(135deg,#1565c0,#1976d2)',
    glow: 'rgba(25,118,210,0.22)',
  },
  {
    icon: DirectionsCarIcon,
    label: 'Vehicle Setup',
    color: '#7b1fa2',
    gradient: 'linear-gradient(135deg,#6a1b9a,#8e24aa)',
    glow: 'rgba(123,31,162,0.22)',
  },
  {
    icon: FolderOpenIcon,
    label: 'Vehicle Documents',
    color: '#2e7d32',
    gradient: 'linear-gradient(135deg,#1b5e20,#2e7d32)',
    glow: 'rgba(46,125,50,0.22)',
  },
  {
    icon: ContactPageIcon,
    label: 'Personal Documents',
    color: '#e65100',
    gradient: 'linear-gradient(135deg,#bf360c,#e65100)',
    glow: 'rgba(230,81,0,0.22)',
  },
  {
    icon: LocalOfferIcon,
    label: 'Bundle Options',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg,#d97706,#f59e0b)',
    glow: 'rgba(245,158,11,0.22)',
  },
];

// ─── Type Config ──────────────────────────────────────────────────────────────

export const TYPE_CONFIG: Record<CustomerType, TypeConfig> = {
  mobility: {
    label: 'Mobility',
    tagline: 'Passenger Transport',
    gradient: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)',
    shadow: '0 8px 32px rgba(99,102,241,0.35)',
    color: '#6366f1',
    Icon: DirectionsBusIcon,
  },
  logistics: {
    label: 'Logistics',
    tagline: 'Goods Transport',
    gradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
    shadow: '0 8px 32px rgba(245,158,11,0.35)',
    color: '#f59e0b',
    Icon: LocalShippingIcon,
  },
  parcel: {
    label: 'Parcel Delivery',
    tagline: 'Last-Mile Delivery',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #f97316 100%)',
    shadow: '0 8px 32px rgba(234,88,12,0.35)',
    color: '#ea580c',
    Icon: Inventory2Icon,
  },
};

// ─── City → Area Map ──────────────────────────────────────────────────────────

export const CITY_AREA_MAP: Record<string, Array<{ area: string; pincode: string }>> = {
  Ahmedabad: [
    { area: 'Bopal', pincode: '380058' },
    { area: 'CG Road', pincode: '380006' },
    { area: 'Maninagar', pincode: '380008' },
    { area: 'Navrangpura', pincode: '380009' },
    { area: 'Satellite', pincode: '380015' },
    { area: 'SG Highway', pincode: '380054' },
    { area: 'Other', pincode: '' },
  ],
  Bengaluru: [
    { area: 'BTM Layout', pincode: '560029' },
    { area: 'Electronic City', pincode: '560100' },
    { area: 'HSR Layout', pincode: '560102' },
    { area: 'Indiranagar', pincode: '560038' },
    { area: 'Koramangala', pincode: '560034' },
    { area: 'Marathahalli', pincode: '560037' },
    { area: 'Whitefield', pincode: '560066' },
    { area: 'Other', pincode: '' },
  ],
  Chennai: [
    { area: 'Adyar', pincode: '600020' },
    { area: 'Anna Nagar', pincode: '600040' },
    { area: 'OMR (IT Corridor)', pincode: '600097' },
    { area: 'T. Nagar', pincode: '600017' },
    { area: 'Velachery', pincode: '600042' },
    { area: 'Other', pincode: '' },
  ],
  Delhi: [
    { area: 'Connaught Place', pincode: '110001' },
    { area: 'Dwarka', pincode: '110075' },
    { area: 'Karol Bagh', pincode: '110005' },
    { area: 'Rohini', pincode: '110085' },
    { area: 'Saket', pincode: '110017' },
    { area: 'Other', pincode: '' },
  ],
  Hyderabad: [
    { area: 'Banjara Hills', pincode: '500034' },
    { area: 'Gachibowli', pincode: '500032' },
    { area: 'Hitech City', pincode: '500081' },
    { area: 'Kukatpally', pincode: '500072' },
    { area: 'Secunderabad', pincode: '500003' },
    { area: 'Other', pincode: '' },
  ],
  Mumbai: [
    { area: 'Andheri', pincode: '400053' },
    { area: 'Bandra', pincode: '400050' },
    { area: 'Borivali', pincode: '400066' },
    { area: 'Dadar', pincode: '400014' },
    { area: 'Lower Parel', pincode: '400013' },
    { area: 'Other', pincode: '' },
  ],
  Pune: [
    { area: 'Baner', pincode: '411045' },
    { area: 'Hinjewadi', pincode: '411057' },
    { area: 'Kothrud', pincode: '411038' },
    { area: 'Shivajinagar', pincode: '411005' },
    { area: 'Viman Nagar', pincode: '411014' },
    { area: 'Other', pincode: '' },
  ],
  Kolkata: [
    { area: 'Gariahat', pincode: '700019' },
    { area: 'Jadavpur', pincode: '700032' },
    { area: 'New Town', pincode: '700156' },
    { area: 'Salt Lake', pincode: '700091' },
    { area: 'Other', pincode: '' },
  ],
  Other: [{ area: 'Other', pincode: '' }],
};

export const CITY_OPTIONS = Object.keys(CITY_AREA_MAP);

// ─── Vehicle Config ───────────────────────────────────────────────────────────

export const VEHICLE_CONFIG = {
  bike: {
    label: 'Bike / Scooter',
    category: 'mobility' as const,
    subTypes: ['Bike', 'Scooter'],
    fuelTypes: ['petrol', 'electric'],
    isCommercial: false,
    permitLabel: null as string | null,
    dlCategory: 'MCWG',
  },
  auto: {
    label: 'Auto Rickshaw',
    category: 'mobility' as const,
    subTypes: ['Auto Rickshaw'],
    fuelTypes: ['petrol', 'cng', 'electric'],
    isCommercial: true,
    permitLabel: 'Auto Permit / Badge',
    dlCategory: 'LMV',
  },
  cab: {
    label: 'Cab',
    category: 'mobility' as const,
    subTypes: ['Mini (Hatchback)', 'Sedan', 'SUV', 'Luxury / Premium'],
    fuelTypes: ['petrol', 'diesel', 'cng', 'electric'],
    isCommercial: true,
    permitLabel: 'Commercial Vehicle Permit',
    dlCategory: 'LMV',
  },
  shuttle: {
    label: 'Shuttle / Bus',
    category: 'mobility' as const,
    subTypes: ['Minivan', 'Mini Bus'],
    fuelTypes: ['diesel', 'cng'],
    isCommercial: true,
    permitLabel: 'Tourist / State Carriage Permit',
    dlCategory: 'LMV / HPMV',
  },
  tata_ace: {
    label: 'Tata Ace / Mini Cargo',
    category: 'logistics' as const,
    subTypes: ['Tata Ace', 'Mini Truck'],
    fuelTypes: ['petrol', 'diesel', 'cng'],
    isCommercial: true,
    permitLabel: 'Goods Carriage Permit',
    dlCategory: 'LMV-T',
  },
  dcm: {
    label: 'DCM / Medium Goods',
    category: 'logistics' as const,
    subTypes: ['DCM', 'Medium Goods Vehicle'],
    fuelTypes: ['diesel'],
    isCommercial: true,
    permitLabel: 'Goods Carriage Permit',
    dlCategory: 'HMV',
  },
  lorry: {
    label: 'Lorry / Heavy Truck',
    category: 'logistics' as const,
    subTypes: ['Lorry', 'Heavy Truck', 'Multi-Axle'],
    fuelTypes: ['diesel'],
    isCommercial: true,
    permitLabel: 'Goods Carriage Permit + National Permit',
    dlCategory: 'HMV / HGMV',
  },
} as const;

export type VehicleKey = keyof typeof VEHICLE_CONFIG;

export const MOBILITY_VEHICLES: VehicleKey[] = ['bike', 'auto', 'cab', 'shuttle'];
export const LOGISTICS_VEHICLES: VehicleKey[] = ['tata_ace', 'dcm', 'lorry'];
export const PARCEL_VEHICLES: VehicleKey[] = ['bike', 'auto', 'tata_ace'];

// ─── Bundle ───────────────────────────────────────────────────────────────────

export const BUNDLE_LABELS: Record<string, string> = {
  rental: 'Rent & Ride Bundle',
  driver_hire: 'Driver Hire Bundle',
  multi_vehicle: 'Multi-Vehicle Bundle',
  parcel_combo: 'Parcel + Ride Combo',
  cargo_coride: 'Cargo Co-Ride',
};

export const BUNDLE_DISCOUNT_MAP: Record<string, number> = {
  rental: 10,
  driver_hire: 8,
  multi_vehicle: 12,
  parcel_combo: 0,
  cargo_coride: 0,
};

// ─── Fuel Labels ──────────────────────────────────────────────────────────────

export const FUEL_LABELS: Record<string, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  cng: 'CNG',
  electric: 'Electric',
};

// ─── Trip Options ─────────────────────────────────────────────────────────────

export const TRIP_OPTIONS = {
  mobility: [
    { id: 'local', label: 'Local (City only)' },
    { id: 'outstation', label: 'Outstation (Inter-city)' },
    { id: 'both', label: 'Both (Local + Outstation)' },
  ],
  logistics: [
    { id: 'local_delivery', label: 'Local Delivery (City)' },
    { id: 'outstation_delivery', label: 'Outstation Delivery' },
    { id: 'both', label: 'Both (City + Outstation)' },
  ],
  parcel: [
    { id: 'local_delivery', label: 'Local Delivery (City)' },
    { id: 'outstation_delivery', label: 'Outstation Delivery' },
    { id: 'both', label: 'Both (City + Outstation)' },
  ],
};

// ─── ID Proof Options ────────────────────────────────────────────────────────

export const ID_PROOF_OPTIONS = [
  { id: 'aadhaar', label: 'Aadhaar Card' },
  { id: 'pan', label: 'PAN Card' },
  { id: 'passport', label: 'Passport' },
  { id: 'voter_id', label: "Voter's ID" },
];

// ─── Bundle Sub-options ───────────────────────────────────────────────────────

export const RENTAL_DURATION_OPTIONS = [
  { id: 'daily', label: 'Daily (Pay per day)' },
  { id: 'weekly', label: 'Weekly (7-day plan)' },
  { id: 'monthly', label: 'Monthly (30-day plan)' },
];

export const HIRE_SHIFT_OPTIONS = [
  { id: 'day', label: 'Day Shift (6 AM – 10 PM)' },
  { id: 'night', label: 'Night Shift (10 PM – 6 AM)' },
  { id: 'both', label: 'Both Shifts (24 × 7)' },
];

export const PARCEL_TYPE_OPTIONS = [
  { id: 'documents', label: 'Documents & Envelopes' },
  { id: 'food', label: 'Food / Perishables' },
  { id: 'general', label: 'General Goods (≤ box size)' },
  { id: 'fragile', label: 'Fragile Items' },
];

export const PARCEL_WEIGHT_OPTIONS = [
  { id: '2kg', label: 'Up to 2 kg' },
  { id: '5kg', label: 'Up to 5 kg' },
  { id: '10kg', label: 'Up to 10 kg' },
  { id: '15kg', label: 'Up to 15 kg' },
];

export const PARCEL_RADIUS_OPTIONS = [
  { id: '0.5km', label: 'Within 0.5 km of drop point' },
  { id: '1km', label: 'Within 1 km of drop point' },
  { id: '1.5km', label: 'Within 1.5 km of drop point' },
  { id: '2km', label: 'Within 2 km (max detour)' },
];

export const CORIDE_MAX_OPTIONS = [
  { id: '1', label: '1 co-passenger' },
  { id: '2', label: '2 co-passengers' },
];

export const CORIDE_HAUL_OPTIONS = [
  { id: 'short', label: 'Short haul (< 100 km)' },
  { id: 'medium', label: 'Medium haul (100 – 300 km)' },
  { id: 'long', label: 'Long haul (300 km+)' },
];

// ─── Initial Form State ───────────────────────────────────────────────────────

export const EMPTY_DOC: DocField = { number: '', expiry: '' };

export const INITIAL: FormData = {
  aadharCard: '',
  firstName: '',
  lastName: '',
  gender: '',
  phone: '',
  emergencyContact: '',
  email: '',
  city: '',
  area: '',
  pincode: '',
  vehicleType: '',
  vehicleSubType: '',
  fuelType: '',
  tripPreference: '',
  vehicleNumber: '',
  rc: EMPTY_DOC,
  insurance: EMPTY_DOC,
  puc: EMPTY_DOC,
  fitness: EMPTY_DOC,
  permit: EMPTY_DOC,
  drivingLicense: EMPTY_DOC,
  idProofType: '',
  idProof: EMPTY_DOC,
  bundleTypes: [],
  rentalVehiclePref: '',
  rentalDuration: '',
  driverHireCount: '',
  driverHireShift: '',
  driverHireBudget: '',
  additionalVehicles: [],
  parcelComboTypes: [],
  parcelMaxWeight: '',
  parcelRadiusPref: '',
  cargoCoRideMax: '',
  cargoCoRideHaulPref: '',
};
