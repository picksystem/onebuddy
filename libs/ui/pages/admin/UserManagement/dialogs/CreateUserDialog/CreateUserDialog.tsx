import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip,
  Paper,
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PeopleIcon from '@mui/icons-material/People';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArticleIcon from '@mui/icons-material/Article';
import PolicyIcon from '@mui/icons-material/Policy';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GavelIcon from '@mui/icons-material/Gavel';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CarRentalIcon from '@mui/icons-material/CarRental';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GarageIcon from '@mui/icons-material/Garage';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useFieldError } from '@bandi/hooks';
import { useStyles } from './styles';

// ─── City → Area → Pincode Map ────────────────────────────────────────────────
// Each city lists its key areas with their standard pincodes.
// Pincode auto-fills when an area is selected but remains editable.
const CITY_AREA_MAP: Record<string, Array<{ area: string; pincode: string }>> = {
  Ahmedabad: [
    { area: 'Bopal', pincode: '380058' },
    { area: 'CG Road', pincode: '380006' },
    { area: 'Maninagar', pincode: '380008' },
    { area: 'Navrangpura', pincode: '380009' },
    { area: 'Satellite', pincode: '380015' },
    { area: 'SG Highway', pincode: '380054' },
    { area: 'Vastrapur', pincode: '380015' },
    { area: 'Other', pincode: '' },
  ],
  Bengaluru: [
    { area: 'Banashankari', pincode: '560070' },
    { area: 'BTM Layout', pincode: '560029' },
    { area: 'Electronic City', pincode: '560100' },
    { area: 'HSR Layout', pincode: '560102' },
    { area: 'Indiranagar', pincode: '560038' },
    { area: 'Jayanagar', pincode: '560041' },
    { area: 'Koramangala', pincode: '560034' },
    { area: 'Marathahalli', pincode: '560037' },
    { area: 'Whitefield', pincode: '560066' },
    { area: 'Yelahanka', pincode: '560064' },
    { area: 'Other', pincode: '' },
  ],
  Bhopal: [
    { area: 'Arera Colony', pincode: '462016' },
    { area: 'Hoshangabad Road', pincode: '462026' },
    { area: 'Kolar Road', pincode: '462042' },
    { area: 'MP Nagar', pincode: '462011' },
    { area: 'New Market', pincode: '462003' },
    { area: 'Other', pincode: '' },
  ],
  Chennai: [
    { area: 'Adyar', pincode: '600020' },
    { area: 'Anna Nagar', pincode: '600040' },
    { area: 'Chromepet', pincode: '600044' },
    { area: 'OMR (IT Corridor)', pincode: '600097' },
    { area: 'Perambur', pincode: '600011' },
    { area: 'Porur', pincode: '600116' },
    { area: 'T. Nagar', pincode: '600017' },
    { area: 'Tambaram', pincode: '600045' },
    { area: 'Velachery', pincode: '600042' },
    { area: 'Other', pincode: '' },
  ],
  Coimbatore: [
    { area: 'Gandhipuram', pincode: '641012' },
    { area: 'Peelamedu', pincode: '641004' },
    { area: 'RS Puram', pincode: '641002' },
    { area: 'Saibaba Colony', pincode: '641011' },
    { area: 'Singanallur', pincode: '641005' },
    { area: 'Other', pincode: '' },
  ],
  Delhi: [
    { area: 'Connaught Place', pincode: '110001' },
    { area: 'Dwarka', pincode: '110075' },
    { area: 'Janakpuri', pincode: '110058' },
    { area: 'Karol Bagh', pincode: '110005' },
    { area: 'Lajpat Nagar', pincode: '110024' },
    { area: 'Preet Vihar', pincode: '110092' },
    { area: 'Rohini', pincode: '110085' },
    { area: 'Saket', pincode: '110017' },
    { area: 'Other', pincode: '' },
  ],
  Hyderabad: [
    { area: 'Ameerpet', pincode: '500016' },
    { area: 'Banjara Hills', pincode: '500034' },
    { area: 'Begumpet', pincode: '500003' },
    { area: 'Dilsukhnagar', pincode: '500060' },
    { area: 'Gachibowli', pincode: '500032' },
    { area: 'Hitech City', pincode: '500081' },
    { area: 'Jubilee Hills', pincode: '500033' },
    { area: 'Kukatpally', pincode: '500072' },
    { area: 'LB Nagar', pincode: '500074' },
    { area: 'Mehdipatnam', pincode: '500028' },
    { area: 'Secunderabad', pincode: '500003' },
    { area: 'Shamshabad', pincode: '501218' },
    { area: 'SR Nagar', pincode: '500038' },
    { area: 'Uppal', pincode: '500039' },
    { area: 'Other', pincode: '' },
  ],
  Indore: [
    { area: 'Bhawarkua', pincode: '452001' },
    { area: 'Palasia', pincode: '452001' },
    { area: 'Rajwada', pincode: '452002' },
    { area: 'Vijay Nagar', pincode: '452010' },
    { area: 'Other', pincode: '' },
  ],
  Jaipur: [
    { area: 'C Scheme', pincode: '302001' },
    { area: 'Malviya Nagar', pincode: '302017' },
    { area: 'Mansarovar', pincode: '302020' },
    { area: 'Sodala', pincode: '302019' },
    { area: 'Tonk Road', pincode: '302018' },
    { area: 'Vaishali Nagar', pincode: '302021' },
    { area: 'Other', pincode: '' },
  ],
  Kolkata: [
    { area: 'Alipore', pincode: '700027' },
    { area: 'Dum Dum', pincode: '700028' },
    { area: 'Gariahat', pincode: '700019' },
    { area: 'Howrah', pincode: '711101' },
    { area: 'Jadavpur', pincode: '700032' },
    { area: 'New Town', pincode: '700156' },
    { area: 'Park Street', pincode: '700016' },
    { area: 'Salt Lake', pincode: '700091' },
    { area: 'Other', pincode: '' },
  ],
  Lucknow: [
    { area: 'Aliganj', pincode: '226024' },
    { area: 'Gomti Nagar', pincode: '226010' },
    { area: 'Hazratganj', pincode: '226001' },
    { area: 'Indira Nagar', pincode: '226016' },
    { area: 'Mahanagar', pincode: '226006' },
    { area: 'Other', pincode: '' },
  ],
  Mumbai: [
    { area: 'Andheri', pincode: '400053' },
    { area: 'Bandra', pincode: '400050' },
    { area: 'Borivali', pincode: '400066' },
    { area: 'Dadar', pincode: '400014' },
    { area: 'Kurla', pincode: '400070' },
    { area: 'Lower Parel', pincode: '400013' },
    { area: 'Malad', pincode: '400064' },
    { area: 'Powai', pincode: '400076' },
    { area: 'Other', pincode: '' },
  ],
  Nagpur: [
    { area: 'Civil Lines', pincode: '440001' },
    { area: 'Dharampeth', pincode: '440010' },
    { area: 'Hingna', pincode: '440016' },
    { area: 'Sitabuldi', pincode: '440012' },
    { area: 'Wadi', pincode: '440023' },
    { area: 'Other', pincode: '' },
  ],
  Patna: [
    { area: 'Bailey Road', pincode: '800014' },
    { area: 'Boring Road', pincode: '800001' },
    { area: 'Fraser Road', pincode: '800001' },
    { area: 'Kankarbagh', pincode: '800020' },
    { area: 'Rajendra Nagar', pincode: '800016' },
    { area: 'Other', pincode: '' },
  ],
  Pune: [
    { area: 'Baner', pincode: '411045' },
    { area: 'Deccan Gymkhana', pincode: '411004' },
    { area: 'Hadapsar', pincode: '411028' },
    { area: 'Hinjewadi', pincode: '411057' },
    { area: 'Kalyani Nagar', pincode: '411006' },
    { area: 'Kothrud', pincode: '411038' },
    { area: 'Shivajinagar', pincode: '411005' },
    { area: 'Viman Nagar', pincode: '411014' },
    { area: 'Wakad', pincode: '411057' },
    { area: 'Other', pincode: '' },
  ],
  Surat: [
    { area: 'Adajan', pincode: '395009' },
    { area: 'Katargam', pincode: '395004' },
    { area: 'Rander', pincode: '395005' },
    { area: 'Udhna', pincode: '394210' },
    { area: 'Varachha', pincode: '395006' },
    { area: 'Other', pincode: '' },
  ],
  Thane: [
    { area: 'Ghodbunder Road', pincode: '400615' },
    { area: 'Kalyan', pincode: '421301' },
    { area: 'Kopri', pincode: '400603' },
    { area: 'Majiwada', pincode: '400610' },
    { area: 'Vasant Vihar', pincode: '400610' },
    { area: 'Other', pincode: '' },
  ],
  Vadodara: [
    { area: 'Alkapuri', pincode: '390007' },
    { area: 'Fatehgunj', pincode: '390002' },
    { area: 'Gotri', pincode: '390021' },
    { area: 'Karelibaug', pincode: '390018' },
    { area: 'Other', pincode: '' },
  ],
  Visakhapatnam: [
    { area: 'Dwaraka Nagar', pincode: '530016' },
    { area: 'Gajuwaka', pincode: '530026' },
    { area: 'MVP Colony', pincode: '530017' },
    { area: 'Rushikonda', pincode: '530045' },
    { area: 'Steel Plant', pincode: '530031' },
    { area: 'Other', pincode: '' },
  ],
  Other: [{ area: 'Other', pincode: '' }],
};

const CITY_OPTIONS = Object.keys(CITY_AREA_MAP);

// ─── Vehicle Configuration ────────────────────────────────────────────────────
const VEHICLE_CONFIG = {
  // Mobility — carries PEOPLE
  bike: {
    label: 'Bike / Scooter',
    category: 'mobility' as const,
    subTypes: ['Bike', 'Scooter'],
    fuelTypes: ['petrol', 'electric'],
    isCommercial: false,
    permitLabel: null as string | null,
    dlCategory: 'MCWG',
    desc: 'Quick city rides & delivery',
  },
  auto: {
    label: 'Auto Rickshaw',
    category: 'mobility' as const,
    subTypes: ['Auto Rickshaw'],
    fuelTypes: ['petrol', 'cng', 'electric'],
    isCommercial: true,
    permitLabel: 'Auto Permit / Badge',
    dlCategory: 'LMV',
    desc: 'Affordable three-wheeler commute',
  },
  cab: {
    label: 'Cab',
    category: 'mobility' as const,
    subTypes: ['Mini (Hatchback)', 'Sedan', 'SUV', 'Luxury / Premium'],
    fuelTypes: ['petrol', 'diesel', 'cng', 'electric'],
    isCommercial: true,
    permitLabel: 'Commercial Vehicle Permit',
    dlCategory: 'LMV',
    desc: 'Four-wheeler taxi service',
  },
  shuttle: {
    label: 'Shuttle / Bus',
    category: 'mobility' as const,
    subTypes: ['Minivan', 'Mini Bus'],
    fuelTypes: ['diesel', 'cng'],
    isCommercial: true,
    permitLabel: 'Tourist / State Carriage Permit',
    dlCategory: 'LMV / HPMV',
    desc: 'Shared group transport',
  },
  // Logistics — carries GOODS
  tata_ace: {
    label: 'Tata Ace / Mini Cargo',
    category: 'logistics' as const,
    subTypes: ['Tata Ace', 'Mini Truck'],
    fuelTypes: ['petrol', 'diesel', 'cng'],
    isCommercial: true,
    permitLabel: 'Goods Carriage Permit',
    dlCategory: 'LMV-T',
    desc: 'Small cargo, last-mile delivery',
  },
  dcm: {
    label: 'DCM / Medium Goods',
    category: 'logistics' as const,
    subTypes: ['DCM', 'Medium Goods Vehicle'],
    fuelTypes: ['diesel'],
    isCommercial: true,
    permitLabel: 'Goods Carriage Permit',
    dlCategory: 'HMV',
    desc: 'Medium loads, city & outstation',
  },
  lorry: {
    label: 'Lorry / Heavy Truck',
    category: 'logistics' as const,
    subTypes: ['Lorry', 'Heavy Truck', 'Multi-Axle'],
    fuelTypes: ['diesel'],
    isCommercial: true,
    permitLabel: 'Goods Carriage Permit + National Permit',
    dlCategory: 'HMV / HGMV',
    desc: 'Heavy cargo, long-haul transport',
  },
} as const;

type VehicleKey = keyof typeof VEHICLE_CONFIG;
const MOBILITY_VEHICLES: VehicleKey[] = ['bike', 'auto', 'cab', 'shuttle'];
const LOGISTICS_VEHICLES: VehicleKey[] = ['tata_ace', 'dcm', 'lorry'];

const FUEL_LABELS: Record<string, string> = {
  petrol: 'Petrol',
  diesel: 'Diesel',
  cng: 'CNG',
  electric: 'Electric',
};

const TRIP_OPTIONS = {
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
};

const ID_PROOF_OPTIONS = [
  { id: 'aadhaar', label: 'Aadhaar Card' },
  { id: 'pan', label: 'PAN Card' },
];

// ─── Bundle Configuration ─────────────────────────────────────────────────────
// Bundles are 100% optional. Each bundle unlocks a platform commission discount.
// Business logic:
//   rental       → Captain's own vehicle is in repair / unavailable. They rent
//                  a verified platform vehicle to keep earning.
//   driver_hire  → Captain owns a vehicle but cannot drive (busy / ill / trip).
//                  Platform matches a verified driver to operate their vehicle.
//   multi_vehicle→ Captain has 2+ vehicles (e.g. bike + cab). Register all under
//                  one profile and switch service type based on daily demand.
//
// Discount stacking:
//   1 bundle  → flat discount for that bundle
//   2 bundles → sum + 2% loyalty bonus
//   3 bundles → sum + 5% loyalty bonus  (capped at 20%)

// Bundles split into two categories:
//   Commission-discount bundles: rental, driver_hire, multi_vehicle
//   Bonus-earning bundles:       parcel_combo, cargo_coride

const BUNDLE_DISCOUNT_MAP: Record<string, number> = {
  rental: 10,
  driver_hire: 8,
  multi_vehicle: 12,
  parcel_combo: 0, // not commission-based — bonus earning per combo trip
  cargo_coride: 0, // not commission-based — bonus earning per co-passenger
};

type BundleEntry = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  tag: string | null;
  tagColor: 'primary' | 'success' | 'warning' | 'info' | 'default';
  Icon: React.ElementType;
  // commission-discount bundles
  discount?: number;
  // bonus-earning bundles (shown instead of discount chip)
  bonusLabel?: string;
  bonusSub?: string;
  // eligibility — if set, only shown when captain matches
  eligibleVehicles?: string[];
  eligibleCategory?: string;
};

const BUNDLE_CONFIG: BundleEntry[] = [
  {
    id: 'rental',
    title: 'Rent & Ride Bundle',
    subtitle: 'Vehicle unavailable? Keep earning.',
    description:
      'Your vehicle is damaged, in the workshop, or temporarily off-road? Rent a verified partner vehicle from our fleet and continue accepting rides without any downtime.',
    highlight: 'Ideal when your vehicle is under repair or not roadworthy.',
    discount: BUNDLE_DISCOUNT_MAP['rental'],
    tag: 'Popular',
    tagColor: 'primary',
    Icon: CarRentalIcon,
  },
  {
    id: 'driver_hire',
    title: 'Driver Hire Bundle',
    subtitle: 'Own a vehicle, need a driver.',
    description:
      'You own a vehicle but cannot drive today — or want your car earning while you sleep. We match you with a background-verified driver who operates your vehicle under your account.',
    highlight: 'Monetise your vehicle 24 × 7 without driving it yourself.',
    discount: BUNDLE_DISCOUNT_MAP['driver_hire'],
    tag: null,
    tagColor: 'default',
    Icon: PersonAddIcon,
  },
  {
    id: 'multi_vehicle',
    title: 'Multi-Vehicle Bundle',
    subtitle: 'More vehicles, more earnings.',
    description:
      'Have a bike for quick city deliveries and a cab for passenger rides? Register all your vehicles under one profile and switch between service categories on demand.',
    highlight: 'Perfect for captains who own both a two-wheeler and a four-wheeler.',
    discount: BUNDLE_DISCOUNT_MAP['multi_vehicle'],
    tag: 'Best Value',
    tagColor: 'success',
    Icon: GarageIcon,
  },
  // ── Smart Combo Bundles ────────────────────────────────────────────────────
  // parcel_combo: bike / auto / cab captain accepts a small parcel delivery
  //   WHILE on a passenger trip going the same direction.
  //   Smart-match finds parcels within 1.5 km of the captain's drop point.
  //   Captain earns both the ride fare AND the parcel delivery fee.
  {
    id: 'parcel_combo',
    title: 'Parcel + Ride Combo',
    subtitle: 'Deliver a parcel on your way — earn twice.',
    description:
      'While dropping off a passenger, deliver a small parcel going to the same area. Our platform smart-matches parcels within 1.5 km of your drop point so you earn a ride fare plus a delivery bonus on the same trip — zero detour required.',
    highlight:
      'Works for Bike, Auto and Cab. E.g. drop a passenger at Koramangala and deliver a document at a shop 800 m away.',
    bonusLabel: 'Earn ₹30 – ₹150',
    bonusSub: 'extra per combo delivery',
    tag: 'Smart Earn',
    tagColor: 'warning',
    Icon: Inventory2Icon,
    eligibleVehicles: ['bike', 'auto', 'cab'],
    eligibleCategory: 'mobility',
  },
  // cargo_coride: lorry / tata_ace / dcm captain doing an outstation cargo trip
  //   offers a seat to a co-passenger heading in the same direction.
  //   Co-passenger books at a subsidised fare; captain retains 100% of that.
  {
    id: 'cargo_coride',
    title: 'Cargo Co-Ride',
    subtitle: 'Take a co-passenger on your cargo trip.',
    description:
      'Heading to another city with a load of goods? Accept a co-passenger travelling in the same direction. Safe, legally compliant, and profitable — you earn the full cargo rate plus the co-ride fare without any additional trip.',
    highlight:
      'For Lorry, Tata Ace, DCM. E.g. transporting goods Chennai → Bengaluru? A co-passenger going the same way adds ₹500 – ₹2,000 to your trip.',
    bonusLabel: 'Earn ₹500 – ₹2,000',
    bonusSub: 'extra per co-passenger',
    tag: 'New',
    tagColor: 'info',
    Icon: PeopleIcon,
    eligibleVehicles: ['tata_ace', 'dcm', 'lorry'],
    eligibleCategory: 'logistics',
  },
];

const calcBundleDiscount = (selected: string[]): number => {
  const discountBundles = selected.filter((id) => (BUNDLE_DISCOUNT_MAP[id] ?? 0) > 0);
  const base = discountBundles.reduce((sum, id) => sum + (BUNDLE_DISCOUNT_MAP[id] ?? 0), 0);
  const bonus = discountBundles.length >= 3 ? 5 : discountBundles.length === 2 ? 2 : 0;
  return Math.min(base + bonus, 20);
};

const PARCEL_TYPE_OPTIONS = [
  { id: 'documents', label: 'Documents & Envelopes' },
  { id: 'food', label: 'Food / Perishables' },
  { id: 'general', label: 'General Goods (≤ box size)' },
  { id: 'fragile', label: 'Fragile Items (handled with care)' },
];

const PARCEL_WEIGHT_OPTIONS = [
  { id: '2kg', label: 'Up to 2 kg (documents, small box)' },
  { id: '5kg', label: 'Up to 5 kg (medium parcel)' },
  { id: '10kg', label: 'Up to 10 kg (large box)' },
  { id: '15kg', label: 'Up to 15 kg (heavy parcel)' },
];

const PARCEL_RADIUS_OPTIONS = [
  { id: '0.5km', label: 'Within 0.5 km of drop point' },
  { id: '1km', label: 'Within 1 km of drop point' },
  { id: '1.5km', label: 'Within 1.5 km of drop point' },
  { id: '2km', label: 'Within 2 km of drop point (max detour)' },
];

const CORIDE_MAX_OPTIONS = [
  { id: '1', label: '1 co-passenger' },
  { id: '2', label: '2 co-passengers' },
];

const CORIDE_HAUL_OPTIONS = [
  { id: 'short', label: 'Short haul (< 100 km)' },
  { id: 'medium', label: 'Medium haul (100 – 300 km)' },
  { id: 'long', label: 'Long haul (300 km+)' },
];

const CORIDE_RATE_OPTIONS = [
  { id: 'platform_suggested', label: 'Platform suggested rate' },
  { id: 'negotiable', label: 'Negotiable with co-passenger' },
];

const RENTAL_DURATION_OPTIONS = [
  { id: 'daily', label: 'Daily (Pay per day)' },
  { id: 'weekly', label: 'Weekly (7-day plan)' },
  { id: 'monthly', label: 'Monthly (30-day plan — best rate)' },
];

const HIRE_SHIFT_OPTIONS = [
  { id: 'day', label: 'Day Shift (6 AM – 10 PM)' },
  { id: 'night', label: 'Night Shift (10 PM – 6 AM)' },
  { id: 'both', label: 'Both Shifts (24 × 7)' },
];

const STEPS = [
  'Personal Info',
  'Service Category',
  'Vehicle Setup',
  'Vehicle Documents',
  'Personal Documents',
  'Bundle Options',
  'Review & Submit',
];

// ─── Types ────────────────────────────────────────────────────────────────────
type DocField = { number: string; expiry: string };
const EMPTY_DOC: DocField = { number: '', expiry: '' };
type DocKey = 'rc' | 'insurance' | 'puc' | 'fitness' | 'permit' | 'drivingLicense' | 'idProof';

type AdditionalVehicle = { vehicleType: string; vehicleNumber: string; fuelType: string };

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  pincode: string;
  serviceCategory: string;
  vehicleType: string;
  vehicleSubType: string;
  fuelType: string;
  tripPreference: string;
  vehicleNumber: string;
  rc: DocField;
  insurance: DocField;
  puc: DocField;
  fitness: DocField;
  permit: DocField;
  drivingLicense: DocField;
  idProofType: string;
  idProof: DocField;
  // Bundle Options (all optional)
  bundleTypes: string[];
  rentalVehiclePref: string;
  rentalDuration: string;
  rentalPickupZone: string;
  driverHireCount: string;
  driverHireShift: string;
  driverHireBudget: string;
  additionalVehicles: AdditionalVehicle[];
  // Parcel + Ride Combo bundle
  parcelComboTypes: string[];
  parcelMaxWeight: string;
  parcelRadiusPref: string;
  // Cargo Co-Ride bundle
  cargoCoRideMax: string;
  cargoCoRideHaulPref: string;
  cargoCoRideRatePref: string;
};

type FileStore = {
  driverPhoto: File | null;
  rcFront: File | null;
  rcBack: File | null;
  insuranceFront: File | null;
  pucFront: File | null;
  fitnessFront: File | null;
  permitFront: File | null;
  dlFront: File | null;
  dlBack: File | null;
  idFront: File | null;
  idBack: File | null;
};

type Errors = Record<string, string>;

const INITIAL: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  city: '',
  area: '',
  pincode: '',
  serviceCategory: '',
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
  // Bundles
  bundleTypes: [],
  rentalVehiclePref: '',
  rentalDuration: '',
  rentalPickupZone: '',
  driverHireCount: '',
  driverHireShift: '',
  driverHireBudget: '',
  additionalVehicles: [],
  parcelComboTypes: [],
  parcelMaxWeight: '',
  parcelRadiusPref: '',
  cargoCoRideMax: '',
  cargoCoRideHaulPref: '',
  cargoCoRideRatePref: '',
};

const INIT_FILES: FileStore = {
  driverPhoto: null,
  rcFront: null,
  rcBack: null,
  insuranceFront: null,
  pucFront: null,
  fitnessFront: null,
  permitFront: null,
  dlFront: null,
  dlBack: null,
  idFront: null,
  idBack: null,
};

// ─── Sub-components ───────────────────────────────────────────────────────────
interface UploadFieldProps {
  label: string;
  file: File | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (f: File | null) => void;
}
const UploadField: React.FC<UploadFieldProps> = ({ label, file, inputRef, onFileChange }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', minHeight: 34 }}>
    <input
      type='file'
      ref={inputRef}
      style={{ display: 'none' }}
      accept='image/*,.pdf'
      onChange={(e) => {
        onFileChange(e.target.files?.[0] ?? null);
      }}
    />
    <Button
      variant='outlined'
      size='small'
      startIcon={<UploadFileIcon />}
      onClick={() => inputRef.current?.click()}
      sx={{ textTransform: 'none', fontSize: '0.75rem', borderRadius: 1.5, whiteSpace: 'nowrap' }}
    >
      {label}
    </Button>
    {file ? (
      <Chip
        label={file.name}
        size='small'
        color='success'
        variant='outlined'
        onDelete={() => {
          onFileChange(null);
          if (inputRef.current) inputRef.current.value = '';
        }}
        sx={{ maxWidth: 220, fontSize: '0.68rem' }}
      />
    ) : (
      <Typography variant='caption' color='text.disabled'>
        Not uploaded
      </Typography>
    )}
  </Box>
);

interface DocSectionProps {
  title: string;
  icon: React.ReactNode;
  required?: boolean;
  badge?: string;
  children: React.ReactNode;
}
const DocSection: React.FC<DocSectionProps> = ({ title, icon, required, badge, children }) => (
  <Paper variant='outlined' sx={{ p: 2, borderRadius: 2, mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      {icon}
      <Typography variant='subtitle2' fontWeight={700} sx={{ flex: 1 }}>
        {title}
      </Typography>
      {required && (
        <Chip
          label='Required'
          size='small'
          color='error'
          variant='outlined'
          sx={{ fontSize: '0.65rem', height: 20 }}
        />
      )}
      {badge && (
        <Chip
          label={badge}
          size='small'
          color='primary'
          variant='outlined'
          sx={{ fontSize: '0.65rem', height: 20 }}
        />
      )}
    </Box>
    {children}
  </Paper>
);

const getVehicleIcon = (vehicleType: string, selected: boolean) => {
  const sx = { fontSize: 30, color: selected ? 'primary.main' : 'text.secondary' };
  switch (vehicleType) {
    case 'bike':
      return <TwoWheelerIcon sx={sx} />;
    case 'auto':
      return <ElectricRickshawIcon sx={sx} />;
    case 'cab':
      return <LocalTaxiIcon sx={sx} />;
    case 'shuttle':
      return <AirportShuttleIcon sx={sx} />;
    default:
      return <LocalShippingIcon sx={sx} />;
  }
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────
const CreateUserDialog = ({ open, onClose, onSubmit }: CreateUserDialogProps) => {
  const { classes } = useStyles();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [files, setFiles] = useState<FileStore>(INIT_FILES);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File refs
  const driverPhotoRef = useRef<HTMLInputElement>(null);
  const rcFrontRef = useRef<HTMLInputElement>(null);
  const rcBackRef = useRef<HTMLInputElement>(null);
  const insuranceFrontRef = useRef<HTMLInputElement>(null);
  const pucFrontRef = useRef<HTMLInputElement>(null);
  const fitnessFrontRef = useRef<HTMLInputElement>(null);
  const permitFrontRef = useRef<HTMLInputElement>(null);
  const dlFrontRef = useRef<HTMLInputElement>(null);
  const dlBackRef = useRef<HTMLInputElement>(null);
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);
  const reqError = useFieldError();

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const set = (field: string, value: string) => {
    setForm((p) => {
      let next = { ...p, [field]: value } as FormData;
      if (field === 'city') {
        // Reset area and pincode whenever city changes
        next = { ...next, area: '', pincode: '' };
      }
      if (field === 'area') {
        // Auto-fill pincode from the map when an area is chosen
        const areaEntry = (CITY_AREA_MAP[p.city] ?? []).find((a) => a.area === value);
        next = { ...next, pincode: areaEntry?.pincode ?? '' };
      }
      if (field === 'serviceCategory') {
        next = { ...next, vehicleType: '', vehicleSubType: '', fuelType: '', tripPreference: '' };
      }
      if (field === 'vehicleType') {
        const vc = VEHICLE_CONFIG[value as VehicleKey];
        next = {
          ...next,
          vehicleSubType: vc?.subTypes.length === 1 ? vc.subTypes[0] : '',
          fuelType: vc?.fuelTypes.length === 1 ? vc.fuelTypes[0] : '',
          tripPreference: '',
        };
      }
      return next;
    });
    setErrors((p) => {
      const n = { ...p };
      delete n[field];
      return n;
    });
  };

  const setDoc = (doc: DocKey, field: keyof DocField, value: string) => {
    setForm((p) => ({ ...p, [doc]: { ...(p[doc] as DocField), [field]: value } }));
    setErrors((p) => {
      const n = { ...p };
      delete n[`${doc}.${field}`];
      return n;
    });
  };

  const setFile = (key: keyof FileStore, file: File | null) =>
    setFiles((p) => ({ ...p, [key]: file }));

  const vConfig = form.vehicleType ? VEHICLE_CONFIG[form.vehicleType as VehicleKey] : null;
  const isCommercial = vConfig?.isCommercial ?? false;
  const currentVehicles =
    form.serviceCategory === 'mobility' ? MOBILITY_VEHICLES : LOGISTICS_VEHICLES;

  // ── Validation ────────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Errors = {};
    if (step === 0) {
      if (!form.firstName.trim()) errs['firstName'] = 'Required';
      if (!form.lastName.trim()) errs['lastName'] = 'Required';
      if (!form.phone.trim()) errs['phone'] = 'Required';
      else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s\-+]/g, '')))
        errs['phone'] = 'Enter valid 10-digit Indian mobile number';
      if (!form.city) errs['city'] = 'Required';
      if (!form.area) errs['area'] = 'Required';
      if (!form.pincode.trim()) errs['pincode'] = 'Required';
      else if (!/^\d{6}$/.test(form.pincode.trim()))
        errs['pincode'] = 'Enter valid 6-digit pincode';
    }
    if (step === 1) {
      if (!form.serviceCategory) errs['serviceCategory'] = 'Please select a service category';
    }
    if (step === 2) {
      if (!form.vehicleType) errs['vehicleType'] = 'Please select a vehicle type';
      const vc = form.vehicleType ? VEHICLE_CONFIG[form.vehicleType as VehicleKey] : null;
      if (vc && vc.subTypes.length > 1 && !form.vehicleSubType) errs['vehicleSubType'] = 'Required';
      if (!form.fuelType) errs['fuelType'] = 'Required';
      if (!form.tripPreference) errs['tripPreference'] = 'Required';
    }
    if (step === 3) {
      if (!form.vehicleNumber.trim()) errs['vehicleNumber'] = 'Vehicle number is required';
      if (!form.rc.number.trim()) errs['rc.number'] = 'RC number is required';
      if (!form.insurance.number.trim())
        errs['insurance.number'] = 'Insurance policy number is required';
      if (!form.insurance.expiry) errs['insurance.expiry'] = 'Insurance expiry is required';
      if (isCommercial) {
        if (!form.fitness.number.trim())
          errs['fitness.number'] = 'Fitness certificate number is required';
        if (!form.permit.number.trim()) errs['permit.number'] = 'Permit number is required';
      }
    }
    if (step === 4) {
      if (!form.drivingLicense.number.trim()) errs['dl.number'] = 'DL number is required';
      if (!form.idProofType) errs['idProofType'] = 'Select ID proof type';
      if (!form.idProof.number.trim()) errs['idProof.number'] = 'ID number is required';
    }
    // Step 5: Bundle — optional, but if selected sub-fields are required
    if (step === 5) {
      if (form.bundleTypes.includes('rental')) {
        if (!form.rentalVehiclePref) errs['rentalVehiclePref'] = 'Required';
        if (!form.rentalDuration) errs['rentalDuration'] = 'Required';
      }
      if (form.bundleTypes.includes('driver_hire')) {
        if (!form.driverHireCount) errs['driverHireCount'] = 'Required';
        if (!form.driverHireShift) errs['driverHireShift'] = 'Required';
      }
      if (form.bundleTypes.includes('multi_vehicle')) {
        form.additionalVehicles.forEach((av, idx) => {
          if (!av.vehicleType) errs[`addVehicle_${idx}_type`] = 'Required';
          if (!av.vehicleNumber.trim()) errs[`addVehicle_${idx}_number`] = 'Required';
          if (!av.fuelType) errs[`addVehicle_${idx}_fuel`] = 'Required';
        });
        if (form.additionalVehicles.length === 0)
          errs['additionalVehicles'] = 'Add at least one additional vehicle';
      }
      if (form.bundleTypes.includes('parcel_combo')) {
        if (form.parcelComboTypes.length === 0)
          errs['parcelComboTypes'] = 'Select at least one parcel type';
        if (!form.parcelMaxWeight) errs['parcelMaxWeight'] = 'Required';
        if (!form.parcelRadiusPref) errs['parcelRadiusPref'] = 'Required';
      }
      if (form.bundleTypes.includes('cargo_coride')) {
        if (!form.cargoCoRideMax) errs['cargoCoRideMax'] = 'Required';
        if (!form.cargoCoRideHaulPref) errs['cargoCoRideHaulPref'] = 'Required';
        if (!form.cargoCoRideRatePref) errs['cargoCoRideRatePref'] = 'Required';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validate()) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleClose = () => {
    setStep(0);
    setForm(INITIAL);
    setFiles(INIT_FILES);
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email || null,
        city: form.city,
        area: form.area || null,
        pincode: form.pincode || null,
        serviceCategory: form.serviceCategory,
        vehicleType: form.vehicleType,
        vehicleSubType: form.vehicleSubType || null,
        fuelType: form.fuelType,
        tripPreference: form.tripPreference,
        vehicleNumber: form.vehicleNumber,
        rcNumber: form.rc.number,
        rcExpiry: form.rc.expiry || null,
        insuranceNumber: form.insurance.number,
        insuranceExpiry: form.insurance.expiry || null,
        pucNumber: form.puc.number || null,
        pucExpiry: form.puc.expiry || null,
        fitnessNumber: form.fitness.number || null,
        fitnessExpiry: form.fitness.expiry || null,
        permitNumber: form.permit.number || null,
        permitExpiry: form.permit.expiry || null,
        dlNumber: form.drivingLicense.number,
        dlExpiry: form.drivingLicense.expiry || null,
        idProofType: form.idProofType,
        idProofNumber: form.idProof.number || null,
        // Bundle options
        bundleTypes: form.bundleTypes.length > 0 ? JSON.stringify(form.bundleTypes) : null,
        bundleDiscount: form.bundleTypes.length > 0 ? calcBundleDiscount(form.bundleTypes) : null,
        rentalVehiclePref: form.bundleTypes.includes('rental')
          ? form.rentalVehiclePref || null
          : null,
        rentalDuration: form.bundleTypes.includes('rental') ? form.rentalDuration || null : null,
        rentalPickupZone: form.bundleTypes.includes('rental')
          ? form.rentalPickupZone || null
          : null,
        driverHireCount: form.bundleTypes.includes('driver_hire')
          ? parseInt(form.driverHireCount) || null
          : null,
        driverHireShift: form.bundleTypes.includes('driver_hire')
          ? form.driverHireShift || null
          : null,
        driverHireBudget: form.bundleTypes.includes('driver_hire')
          ? form.driverHireBudget || null
          : null,
        additionalVehicles:
          form.bundleTypes.includes('multi_vehicle') && form.additionalVehicles.length > 0
            ? JSON.stringify(form.additionalVehicles)
            : null,
        parcelComboTypes:
          form.bundleTypes.includes('parcel_combo') && form.parcelComboTypes.length > 0
            ? JSON.stringify(form.parcelComboTypes)
            : null,
        parcelMaxWeight: form.bundleTypes.includes('parcel_combo')
          ? form.parcelMaxWeight || null
          : null,
        parcelRadiusPref: form.bundleTypes.includes('parcel_combo')
          ? form.parcelRadiusPref || null
          : null,
        cargoCoRideMax: form.bundleTypes.includes('cargo_coride')
          ? parseInt(form.cargoCoRideMax) || null
          : null,
        cargoCoRideHaulPref: form.bundleTypes.includes('cargo_coride')
          ? form.cargoCoRideHaulPref || null
          : null,
        cargoCoRideRatePref: form.bundleTypes.includes('cargo_coride')
          ? form.cargoCoRideRatePref || null
          : null,
      });
      setStep(0);
      setForm(INITIAL);
      setFiles(INIT_FILES);
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const fmt = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const fileStatus = (f: File | null) => (f ? `✓ ${f.name}` : 'Not uploaded');

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      fullWidth
      slotProps={{ paper: { className: classes.dialogPaper } }}
    >
      {/* Header */}
      <Box className={classes.header}>
        <Box className={classes.badgeRow}>
          <DirectionsCarIcon className={classes.badgeIcon} />
          <Typography variant='caption' fontWeight={700} className={classes.badgeLabel}>
            Customer Onboarding
          </Typography>
        </Box>
        <Box className={classes.userCard}>
          <Avatar className={classes.headerAvatar}>
            <DirectionsCarIcon sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant='h6' fontWeight={700} className={classes.headerTitle}>
              Register New Customer / Driver
            </Typography>
            <Typography variant='body2' className={classes.headerSubtitle}>
              Complete all 7 steps to onboard a new customer to the platform.
            </Typography>
          </Box>
        </Box>
        <IconButton size='small' onClick={handleClose} className={classes.closeBtn}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Stepper */}
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 3, mt: 0.5 }}>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ '& .MuiStepLabel-label': { fontSize: '0.68rem' } }}>
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* ── Step 0: Personal Info ── */}
        {step === 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PersonIcon color='primary' />
              <Typography variant='subtitle1' fontWeight={700} color='primary'>
                Personal Information
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='First Name'
                  required
                  fullWidth
                  size='small'
                  value={form.firstName}
                  onChange={(e) => set('firstName', e.target.value)}
                  error={!!errors['firstName']}
                  helperText={reqError(!!errors['firstName'], errors['firstName'])}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='Last Name'
                  required
                  fullWidth
                  size='small'
                  value={form.lastName}
                  onChange={(e) => set('lastName', e.target.value)}
                  error={!!errors['lastName']}
                  helperText={reqError(!!errors['lastName'], errors['lastName'])}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='Mobile Number'
                  required
                  fullWidth
                  size='small'
                  placeholder='e.g. 9876543210'
                  slotProps={{ htmlInput: { maxLength: 10 } }}
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value.replace(/\D/g, ''))}
                  error={!!errors['phone']}
                  helperText={
                    errors['phone']
                      ? reqError(true, errors['phone'])
                      : 'Indian 10-digit mobile number'
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='Email Address (Optional)'
                  fullWidth
                  size='small'
                  type='email'
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth size='small' required error={!!errors['city']}>
                  <InputLabel required>City</InputLabel>
                  <Select
                    value={form.city}
                    label='City'
                    onChange={(e) => set('city', e.target.value)}
                  >
                    {CITY_OPTIONS.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors['city'] && (
                    <FormHelperText>{reqError(true, errors['city'])}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl
                  fullWidth
                  size='small'
                  required
                  error={!!errors['area']}
                  disabled={!form.city}
                >
                  <InputLabel required>Area / Locality</InputLabel>
                  <Select
                    value={form.area}
                    label='Area / Locality'
                    onChange={(e) => set('area', e.target.value)}
                  >
                    {(CITY_AREA_MAP[form.city] ?? []).map(({ area }) => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {errors['area']
                      ? reqError(true, errors['area'])
                      : form.city
                        ? 'Select your operating area'
                        : 'Select city first'}
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label='Pincode'
                  required
                  fullWidth
                  size='small'
                  placeholder='e.g. 500016'
                  slotProps={{ htmlInput: { maxLength: 6 } }}
                  value={form.pincode}
                  onChange={(e) => set('pincode', e.target.value.replace(/\D/g, ''))}
                  error={!!errors['pincode']}
                  helperText={
                    errors['pincode']
                      ? reqError(true, errors['pincode'])
                      : 'Auto-filled from area — editable'
                  }
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* ── Step 1: Service Category ── */}
        {step === 1 && (
          <Box>
            <Typography variant='subtitle1' fontWeight={700} color='primary' sx={{ mb: 0.5 }}>
              Service Category
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2.5 }}>
              What type of service will this captain provide?
            </Typography>
            <Grid container spacing={2.5}>
              {[
                {
                  id: 'mobility',
                  label: 'Mobility',
                  subtitle: 'Passenger Transport',
                  Icon: PeopleIcon,
                  color: '#4f46e5',
                  desc: 'Bike, Auto Rickshaw, Cab, Shuttle — carries people across city or outstation.',
                  vehicles: 'Bike · Auto · Cab · Shuttle',
                },
                {
                  id: 'logistics',
                  label: 'Logistics',
                  subtitle: 'Goods Transport',
                  Icon: Inventory2Icon,
                  color: '#0f766e',
                  desc: 'Tata Ace, DCM, Lorry — transports goods, parcels, and cargo for businesses.',
                  vehicles: 'Tata Ace · DCM · Lorry',
                },
              ].map(({ id, label, subtitle, Icon, desc, vehicles, color }) => {
                const sel = form.serviceCategory === id;
                return (
                  <Grid key={id} size={{ xs: 12, sm: 6 }}>
                    <Box
                      onClick={() => set('serviceCategory', id)}
                      sx={{
                        border: '2px solid',
                        borderColor: sel ? color : 'divider',
                        borderRadius: 3,
                        p: 3,
                        cursor: 'pointer',
                        backgroundColor: sel ? `${color}0D` : 'background.paper',
                        transition: 'all 0.2s',
                        height: '100%',
                        '&:hover': { borderColor: color },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: `${color}14`, display: 'flex' }}>
                          <Icon sx={{ fontSize: 28, color }} />
                        </Box>
                        <Box>
                          <Typography
                            variant='h6'
                            fontWeight={700}
                            sx={{ lineHeight: 1.1, color: sel ? color : 'text.primary' }}
                          >
                            {label}
                          </Typography>
                          <Typography variant='caption' color='text.secondary' fontWeight={500}>
                            {subtitle}
                          </Typography>
                        </Box>
                        {sel && <CheckCircleIcon sx={{ ml: 'auto', color, fontSize: 22 }} />}
                      </Box>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        sx={{ mb: 1.5, lineHeight: 1.5 }}
                      >
                        {desc}
                      </Typography>
                      <Chip
                        label={vehicles}
                        size='small'
                        variant='outlined'
                        sx={{
                          fontSize: '0.68rem',
                          borderColor: `${color}50`,
                          color,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            {errors['serviceCategory'] && (
              <Typography color='error' variant='caption' sx={{ mt: 1.5, display: 'block' }}>
                {errors['serviceCategory']}
              </Typography>
            )}
          </Box>
        )}

        {/* ── Step 2: Vehicle Setup ── */}
        {step === 2 && (
          <Box>
            <Typography variant='subtitle1' fontWeight={700} color='primary' sx={{ mb: 0.5 }}>
              Vehicle Setup
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Select vehicle type, sub-type, fuel, and service preference.
            </Typography>

            <Typography variant='body2' fontWeight={600} sx={{ mb: 1 }}>
              Select Vehicle Type *
            </Typography>
            <Grid container spacing={1.5} sx={{ mb: errors['vehicleType'] ? 0.5 : 2 }}>
              {currentVehicles.map((vid) => {
                const vc = VEHICLE_CONFIG[vid];
                const sel = form.vehicleType === vid;
                return (
                  <Grid
                    key={vid}
                    size={{ xs: 6, sm: form.serviceCategory === 'logistics' ? 4 : 3 }}
                  >
                    <Box
                      onClick={() => set('vehicleType', vid)}
                      sx={{
                        border: '2px solid',
                        borderColor: sel ? 'primary.main' : 'divider',
                        borderRadius: 2.5,
                        p: 1.5,
                        cursor: 'pointer',
                        textAlign: 'center',
                        bgcolor: sel ? 'primary.50' : 'background.paper',
                        transition: 'all 0.2s',
                        height: '100%',
                        '&:hover': { borderColor: 'primary.main' },
                      }}
                    >
                      {getVehicleIcon(vid, sel)}
                      <Typography
                        variant='caption'
                        fontWeight={700}
                        display='block'
                        sx={{
                          mt: 0.5,
                          lineHeight: 1.2,
                          color: sel ? 'primary.main' : 'text.primary',
                        }}
                      >
                        {vc.label}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.disabled'
                        display='block'
                        sx={{ fontSize: '0.58rem', mt: 0.25 }}
                      >
                        {vc.desc}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
            {errors['vehicleType'] && (
              <Typography color='error' variant='caption' sx={{ display: 'block', mb: 1.5 }}>
                {reqError(true, errors['vehicleType'])}
              </Typography>
            )}

            {vConfig && (
              <Grid container spacing={2}>
                {vConfig.subTypes.length > 1 && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth size='small' required error={!!errors['vehicleSubType']}>
                      <InputLabel required>Vehicle Sub-Type</InputLabel>
                      <Select
                        value={form.vehicleSubType}
                        label='Vehicle Sub-Type'
                        onChange={(e) => set('vehicleSubType', e.target.value)}
                      >
                        {vConfig.subTypes.map((s) => (
                          <MenuItem key={s} value={s}>
                            {s}
                          </MenuItem>
                        ))}
                      </Select>
                      {errors['vehicleSubType'] && (
                        <FormHelperText>{reqError(true, errors['vehicleSubType'])}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                )}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size='small' required error={!!errors['fuelType']}>
                    <InputLabel required>Fuel Type</InputLabel>
                    <Select
                      value={form.fuelType}
                      label='Fuel Type'
                      onChange={(e) => set('fuelType', e.target.value)}
                    >
                      {vConfig.fuelTypes.map((f) => (
                        <MenuItem key={f} value={f}>
                          {FUEL_LABELS[f]}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors['fuelType'] && (
                      <FormHelperText>{reqError(true, errors['fuelType'])}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size='small' required error={!!errors['tripPreference']}>
                    <InputLabel required>
                      {form.serviceCategory === 'logistics'
                        ? 'Delivery Preference'
                        : 'Ride Preference'}
                    </InputLabel>
                    <Select
                      value={form.tripPreference}
                      label={
                        form.serviceCategory === 'logistics'
                          ? 'Delivery Preference'
                          : 'Ride Preference'
                      }
                      onChange={(e) => set('tripPreference', e.target.value)}
                    >
                      {(TRIP_OPTIONS[form.serviceCategory as keyof typeof TRIP_OPTIONS] || []).map(
                        (t) => (
                          <MenuItem key={t.id} value={t.id}>
                            {t.label}
                          </MenuItem>
                        ),
                      )}
                    </Select>
                    {errors['tripPreference'] && (
                      <FormHelperText>{reqError(true, errors['tripPreference'])}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Alert severity='info' sx={{ fontSize: '0.78rem' }}>
                    <strong>Required DL category:</strong> {vConfig.dlCategory}
                    {isCommercial && vConfig.permitLabel && (
                      <>
                        {' '}
                        &nbsp;·&nbsp; <strong>Permit needed:</strong> {vConfig.permitLabel}
                      </>
                    )}
                  </Alert>
                </Grid>
              </Grid>
            )}
          </Box>
        )}

        {/* ── Step 3: Vehicle Documents ── */}
        {step === 3 && (
          <Box>
            <Typography variant='subtitle1' fontWeight={700} color='primary' sx={{ mb: 0.5 }}>
              Vehicle Documents
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Enter document numbers and upload images (front & back where applicable).
            </Typography>

            {/* RC */}
            <DocSection
              title='Vehicle Registration (RC)'
              icon={<ArticleIcon color='primary' sx={{ fontSize: 20 }} />}
              required
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Vehicle Number'
                    required
                    fullWidth
                    size='small'
                    placeholder='e.g. MH 12 AB 1234'
                    value={form.vehicleNumber}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, vehicleNumber: e.target.value.toUpperCase() }));
                      setErrors((p) => {
                        const n = { ...p };
                        delete n['vehicleNumber'];
                        return n;
                      });
                    }}
                    error={!!errors['vehicleNumber']}
                    helperText={reqError(!!errors['vehicleNumber'], errors['vehicleNumber'])}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='RC Number'
                    required
                    fullWidth
                    size='small'
                    value={form.rc.number}
                    onChange={(e) => setDoc('rc', 'number', e.target.value)}
                    error={!!errors['rc.number']}
                    helperText={reqError(!!errors['rc.number'], errors['rc.number'])}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='RC Expiry Date'
                    fullWidth
                    size='small'
                    type='date'
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={form.rc.expiry}
                    onChange={(e) => setDoc('rc', 'expiry', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}
                  >
                    <UploadField
                      label='Upload RC (Front)'
                      file={files.rcFront}
                      inputRef={rcFrontRef}
                      onFileChange={(f) => setFile('rcFront', f)}
                    />
                    <UploadField
                      label='Upload RC (Back)'
                      file={files.rcBack}
                      inputRef={rcBackRef}
                      onFileChange={(f) => setFile('rcBack', f)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </DocSection>

            {/* Insurance */}
            <DocSection
              title='Vehicle Insurance'
              icon={<PolicyIcon color='error' sx={{ fontSize: 20 }} />}
              required
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Insurance Policy Number'
                    required
                    fullWidth
                    size='small'
                    value={form.insurance.number}
                    onChange={(e) => setDoc('insurance', 'number', e.target.value)}
                    error={!!errors['insurance.number']}
                    helperText={reqError(!!errors['insurance.number'], errors['insurance.number'])}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Insurance Expiry Date'
                    required
                    fullWidth
                    size='small'
                    type='date'
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={form.insurance.expiry}
                    onChange={(e) => setDoc('insurance', 'expiry', e.target.value)}
                    error={!!errors['insurance.expiry']}
                    helperText={reqError(!!errors['insurance.expiry'], errors['insurance.expiry'])}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <UploadField
                    label='Upload Insurance Document'
                    file={files.insuranceFront}
                    inputRef={insuranceFrontRef}
                    onFileChange={(f) => setFile('insuranceFront', f)}
                  />
                </Grid>
              </Grid>
            </DocSection>

            {/* PUC */}
            <DocSection
              title='PUC Certificate (Pollution Under Control)'
              icon={<VerifiedUserIcon color='success' sx={{ fontSize: 20 }} />}
              badge='Recommended'
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='PUC Certificate Number'
                    fullWidth
                    size='small'
                    value={form.puc.number}
                    onChange={(e) => setDoc('puc', 'number', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='PUC Expiry Date'
                    fullWidth
                    size='small'
                    type='date'
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={form.puc.expiry}
                    onChange={(e) => setDoc('puc', 'expiry', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <UploadField
                    label='Upload PUC Certificate'
                    file={files.pucFront}
                    inputRef={pucFrontRef}
                    onFileChange={(f) => setFile('pucFront', f)}
                  />
                </Grid>
              </Grid>
            </DocSection>

            {/* Fitness — commercial only */}
            {isCommercial && (
              <DocSection
                title='Fitness Certificate'
                icon={<CheckCircleIcon color='success' sx={{ fontSize: 20 }} />}
                required
              >
                <Typography
                  variant='caption'
                  color='text.secondary'
                  display='block'
                  sx={{ mb: 1.5 }}
                >
                  Mandatory for all commercial vehicles (Auto, Cab, Shuttle, Tata Ace, DCM, Lorry).
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label='Fitness Certificate Number'
                      required
                      fullWidth
                      size='small'
                      value={form.fitness.number}
                      onChange={(e) => setDoc('fitness', 'number', e.target.value)}
                      error={!!errors['fitness.number']}
                      helperText={reqError(!!errors['fitness.number'], errors['fitness.number'])}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label='Fitness Expiry Date'
                      fullWidth
                      size='small'
                      type='date'
                      slotProps={{ inputLabel: { shrink: true } }}
                      value={form.fitness.expiry}
                      onChange={(e) => setDoc('fitness', 'expiry', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <UploadField
                      label='Upload Fitness Certificate'
                      file={files.fitnessFront}
                      inputRef={fitnessFrontRef}
                      onFileChange={(f) => setFile('fitnessFront', f)}
                    />
                  </Grid>
                </Grid>
              </DocSection>
            )}

            {/* Permit — commercial only */}
            {isCommercial && vConfig?.permitLabel && (
              <DocSection
                title={`Permit — ${vConfig.permitLabel}`}
                icon={<GavelIcon color='warning' sx={{ fontSize: 20 }} />}
                required
              >
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label='Permit Number'
                      required
                      fullWidth
                      size='small'
                      value={form.permit.number}
                      onChange={(e) => setDoc('permit', 'number', e.target.value)}
                      error={!!errors['permit.number']}
                      helperText={reqError(!!errors['permit.number'], errors['permit.number'])}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      label='Permit Expiry Date'
                      fullWidth
                      size='small'
                      type='date'
                      slotProps={{ inputLabel: { shrink: true } }}
                      value={form.permit.expiry}
                      onChange={(e) => setDoc('permit', 'expiry', e.target.value)}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <UploadField
                      label='Upload Permit Document'
                      file={files.permitFront}
                      inputRef={permitFrontRef}
                      onFileChange={(f) => setFile('permitFront', f)}
                    />
                  </Grid>
                </Grid>
              </DocSection>
            )}
          </Box>
        )}

        {/* ── Step 4: Personal Documents ── */}
        {step === 4 && (
          <Box>
            <Typography variant='subtitle1' fontWeight={700} color='primary' sx={{ mb: 0.5 }}>
              Personal Documents
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Driver&apos;s identity and license verification documents.
            </Typography>

            {/* Driver Photo */}
            <DocSection
              title='Driver Photo'
              icon={<PersonIcon color='primary' sx={{ fontSize: 20 }} />}
              badge='Recommended'
            >
              <UploadField
                label='Upload Driver Photo'
                file={files.driverPhoto}
                inputRef={driverPhotoRef}
                onFileChange={(f) => setFile('driverPhoto', f)}
              />
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 0.75, display: 'block' }}
              >
                Clear passport-size or selfie. Accepted formats: JPG, PNG
              </Typography>
            </DocSection>

            {/* Driving License */}
            <DocSection
              title='Driving License'
              icon={<BadgeIcon color='primary' sx={{ fontSize: 20 }} />}
              required
            >
              {vConfig && (
                <Alert severity='info' sx={{ mb: 1.5, fontSize: '0.75rem', py: 0.5 }}>
                  Required DL category for <strong>{vConfig.label}</strong>:{' '}
                  <strong>{vConfig.dlCategory}</strong>
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Driving License Number'
                    required
                    fullWidth
                    size='small'
                    placeholder='e.g. MH1420100012345'
                    value={form.drivingLicense.number}
                    onChange={(e) =>
                      setDoc('drivingLicense', 'number', e.target.value.toUpperCase())
                    }
                    error={!!errors['dl.number']}
                    helperText={reqError(!!errors['dl.number'], errors['dl.number'])}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='DL Expiry Date'
                    fullWidth
                    size='small'
                    type='date'
                    slotProps={{ inputLabel: { shrink: true } }}
                    value={form.drivingLicense.expiry}
                    onChange={(e) => setDoc('drivingLicense', 'expiry', e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}
                  >
                    <UploadField
                      label='Upload DL (Front)'
                      file={files.dlFront}
                      inputRef={dlFrontRef}
                      onFileChange={(f) => setFile('dlFront', f)}
                    />
                    <UploadField
                      label='Upload DL (Back)'
                      file={files.dlBack}
                      inputRef={dlBackRef}
                      onFileChange={(f) => setFile('dlBack', f)}
                    />
                  </Box>
                </Grid>
              </Grid>
            </DocSection>

            {/* Identity Proof */}
            <DocSection
              title='Identity Proof'
              icon={<ContactPageIcon color='primary' sx={{ fontSize: 20 }} />}
              required
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size='small' required error={!!errors['idProofType']}>
                    <InputLabel required>ID Proof Type</InputLabel>
                    <Select
                      value={form.idProofType}
                      label='ID Proof Type'
                      onChange={(e) => set('idProofType', e.target.value)}
                    >
                      {ID_PROOF_OPTIONS.map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors['idProofType'] && (
                      <FormHelperText>{reqError(true, errors['idProofType'])}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label={
                      form.idProofType === 'aadhaar'
                        ? 'Aadhaar Number'
                        : form.idProofType === 'pan'
                          ? 'PAN Number'
                          : 'ID Number'
                    }
                    required
                    fullWidth
                    size='small'
                    placeholder={
                      form.idProofType === 'aadhaar'
                        ? 'XXXX XXXX XXXX'
                        : form.idProofType === 'pan'
                          ? 'ABCDE1234F'
                          : ''
                    }
                    value={form.idProof.number}
                    onChange={(e) => setDoc('idProof', 'number', e.target.value.toUpperCase())}
                    error={!!errors['idProof.number']}
                    helperText={reqError(!!errors['idProof.number'], errors['idProof.number'])}
                    slotProps={{
                      htmlInput: {
                        maxLength:
                          form.idProofType === 'aadhaar'
                            ? 12
                            : form.idProofType === 'pan'
                              ? 10
                              : 20,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Box
                    sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5 }}
                  >
                    <UploadField
                      label={`Upload ${form.idProofType === 'aadhaar' ? 'Aadhaar' : form.idProofType === 'pan' ? 'PAN' : 'ID'} (Front)`}
                      file={files.idFront}
                      inputRef={idFrontRef}
                      onFileChange={(f) => setFile('idFront', f)}
                    />
                    {form.idProofType === 'aadhaar' && (
                      <UploadField
                        label='Upload Aadhaar (Back)'
                        file={files.idBack}
                        inputRef={idBackRef}
                        onFileChange={(f) => setFile('idBack', f)}
                      />
                    )}
                  </Box>
                </Grid>
              </Grid>
            </DocSection>
          </Box>
        )}

        {/* ── Step 5: Bundle Options ── */}
        {step === 5 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <WorkspacePremiumIcon color='primary' />
              <Typography variant='subtitle1' fontWeight={700} color='primary'>
                Bundle Options
              </Typography>
              <Chip
                label='Optional'
                size='small'
                color='default'
                variant='outlined'
                sx={{ fontSize: '0.62rem', height: 20, ml: 0.5 }}
              />
            </Box>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
              Select one or more bundles to unlock platform commission discounts. You can skip this
              step entirely — bundles can always be applied later from your profile.
            </Typography>

            {/* Bundle Cards */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {BUNDLE_CONFIG.filter((b) => {
                if (b.eligibleVehicles && !b.eligibleVehicles.includes(form.vehicleType))
                  return false;
                if (b.eligibleCategory && b.eligibleCategory !== form.serviceCategory) return false;
                return true;
              }).map((b) => {
                const selected = form.bundleTypes.includes(b.id);
                const BIcon = b.Icon;
                return (
                  <Grid key={b.id} size={{ xs: 12 }}>
                    <Paper
                      variant='outlined'
                      onClick={() => {
                        setForm((p) => {
                          const already = p.bundleTypes.includes(b.id);
                          return {
                            ...p,
                            bundleTypes: already
                              ? p.bundleTypes.filter((x) => x !== b.id)
                              : [...p.bundleTypes, b.id],
                            // reset sub-fields when deselecting
                            ...(already && b.id === 'rental'
                              ? { rentalVehiclePref: '', rentalDuration: '', rentalPickupZone: '' }
                              : {}),
                            ...(already && b.id === 'driver_hire'
                              ? { driverHireCount: '', driverHireShift: '', driverHireBudget: '' }
                              : {}),
                            ...(already && b.id === 'multi_vehicle'
                              ? { additionalVehicles: [] }
                              : {}),
                          };
                        });
                        setErrors((p) => {
                          const n = { ...p };
                          delete n[`${b.id}`];
                          delete n['additionalVehicles'];
                          return n;
                        });
                      }}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        borderColor: selected ? 'primary.main' : 'divider',
                        borderWidth: selected ? 2 : 1,
                        bgcolor: selected ? 'primary.50' : 'background.paper',
                        transition: 'all 0.15s',
                        '&:hover': { borderColor: 'primary.light', bgcolor: 'action.hover' },
                      }}
                    >
                      {/* Card Header */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            bgcolor: selected ? 'primary.main' : 'action.hover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <BIcon
                            sx={{ fontSize: 24, color: selected ? '#fff' : 'text.secondary' }}
                          />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box
                            sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}
                          >
                            <Typography variant='subtitle2' fontWeight={700}>
                              {b.title}
                            </Typography>
                            {b.tag && (
                              <Chip
                                label={b.tag}
                                size='small'
                                color={b.tagColor}
                                sx={{ fontSize: '0.6rem', height: 18 }}
                              />
                            )}
                            {b.discount ? (
                              <Chip
                                icon={<LocalOfferIcon sx={{ fontSize: '0.8rem !important' }} />}
                                label={`Save ${b.discount}% commission`}
                                size='small'
                                color='success'
                                variant={selected ? 'filled' : 'outlined'}
                                sx={{ fontSize: '0.62rem', height: 20, ml: 'auto' }}
                              />
                            ) : (
                              <Chip
                                icon={<LocalOfferIcon sx={{ fontSize: '0.8rem !important' }} />}
                                label={`${b.bonusLabel} ${b.bonusSub}`}
                                size='small'
                                color='warning'
                                variant={selected ? 'filled' : 'outlined'}
                                sx={{ fontSize: '0.62rem', height: 20, ml: 'auto' }}
                              />
                            )}
                          </Box>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ display: 'block', mt: 0.25 }}
                          >
                            {b.subtitle}
                          </Typography>
                          <Typography
                            variant='body2'
                            color='text.secondary'
                            sx={{ mt: 0.5, fontSize: '0.78rem' }}
                          >
                            {b.description}
                          </Typography>
                          <Alert
                            severity='info'
                            icon={false}
                            sx={{ mt: 1, py: 0.25, px: 1, fontSize: '0.72rem', borderRadius: 1 }}
                          >
                            {b.highlight}
                          </Alert>
                        </Box>
                        <Box
                          sx={{
                            width: 22,
                            height: 22,
                            borderRadius: '50%',
                            border: selected ? 'none' : '2px solid',
                            borderColor: 'divider',
                            bgcolor: selected ? 'primary.main' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {selected && <CheckCircleIcon sx={{ fontSize: 22, color: '#fff' }} />}
                        </Box>
                      </Box>

                      {/* Rental Sub-fields */}
                      {selected && b.id === 'rental' && (
                        <Box
                          sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Typography
                            variant='caption'
                            fontWeight={700}
                            color='primary'
                            sx={{ mb: 1.5, display: 'block' }}
                          >
                            Rental Preferences
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['rentalVehiclePref']}
                              >
                                <InputLabel required>Preferred Vehicle to Rent</InputLabel>
                                <Select
                                  value={form.rentalVehiclePref}
                                  label='Preferred Vehicle to Rent'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, rentalVehiclePref: e.target.value }))
                                  }
                                >
                                  {Object.entries(VEHICLE_CONFIG).map(([key, vc]) => (
                                    <MenuItem key={key} value={key}>
                                      {vc.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['rentalVehiclePref'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['rentalVehiclePref'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['rentalDuration']}
                              >
                                <InputLabel required>Rental Duration</InputLabel>
                                <Select
                                  value={form.rentalDuration}
                                  label='Rental Duration'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, rentalDuration: e.target.value }))
                                  }
                                >
                                  {RENTAL_DURATION_OPTIONS.map((o) => (
                                    <MenuItem key={o.id} value={o.id}>
                                      {o.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['rentalDuration'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['rentalDuration'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <TextField
                                label='Pickup Zone Preference (Optional)'
                                fullWidth
                                size='small'
                                placeholder='e.g. Whitefield, Koramangala'
                                value={form.rentalPickupZone}
                                onChange={(e) =>
                                  setForm((p) => ({ ...p, rentalPickupZone: e.target.value }))
                                }
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      {/* Driver Hire Sub-fields */}
                      {selected && b.id === 'driver_hire' && (
                        <Box
                          sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Typography
                            variant='caption'
                            fontWeight={700}
                            color='primary'
                            sx={{ mb: 1.5, display: 'block' }}
                          >
                            Driver Requirements
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['driverHireCount']}
                              >
                                <InputLabel required>Drivers Needed</InputLabel>
                                <Select
                                  value={form.driverHireCount}
                                  label='Drivers Needed'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, driverHireCount: e.target.value }))
                                  }
                                >
                                  {['1', '2', '3', '4', '5'].map((n) => (
                                    <MenuItem key={n} value={n}>
                                      {n} Driver{n !== '1' ? 's' : ''}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['driverHireCount'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['driverHireCount'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['driverHireShift']}
                              >
                                <InputLabel required>Preferred Shift</InputLabel>
                                <Select
                                  value={form.driverHireShift}
                                  label='Preferred Shift'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, driverHireShift: e.target.value }))
                                  }
                                >
                                  {HIRE_SHIFT_OPTIONS.map((o) => (
                                    <MenuItem key={o.id} value={o.id}>
                                      {o.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['driverHireShift'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['driverHireShift'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <TextField
                                label='Approx. Monthly Budget (Optional)'
                                fullWidth
                                size='small'
                                placeholder='e.g. ₹15,000'
                                value={form.driverHireBudget}
                                onChange={(e) =>
                                  setForm((p) => ({ ...p, driverHireBudget: e.target.value }))
                                }
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      {/* Multi-Vehicle Sub-fields */}
                      {selected && b.id === 'multi_vehicle' && (
                        <Box
                          sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              mb: 1.5,
                            }}
                          >
                            <Typography variant='caption' fontWeight={700} color='primary'>
                              Additional Vehicles
                            </Typography>
                            <Button
                              size='small'
                              startIcon={<AddCircleOutlineIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                setForm((p) => ({
                                  ...p,
                                  additionalVehicles: [
                                    ...p.additionalVehicles,
                                    { vehicleType: '', vehicleNumber: '', fuelType: '' },
                                  ],
                                }));
                                setErrors((p) => {
                                  const n = { ...p };
                                  delete n['additionalVehicles'];
                                  return n;
                                });
                              }}
                              sx={{ textTransform: 'none', fontSize: '0.72rem' }}
                            >
                              Add Vehicle
                            </Button>
                          </Box>
                          {errors['additionalVehicles'] && (
                            <FormHelperText error sx={{ mb: 1 }}>
                              {reqError(true, errors['additionalVehicles'])}
                            </FormHelperText>
                          )}
                          {form.additionalVehicles.map((av, idx) => {
                            const avConfig = av.vehicleType
                              ? VEHICLE_CONFIG[av.vehicleType as VehicleKey]
                              : null;
                            return (
                              <Paper
                                key={idx}
                                variant='outlined'
                                sx={{ p: 1.5, mb: 1.5, borderRadius: 1.5 }}
                              >
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant='caption'
                                    fontWeight={600}
                                    color='text.secondary'
                                  >
                                    Vehicle {idx + 1}
                                  </Typography>
                                  <IconButton
                                    size='small'
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setForm((p) => ({
                                        ...p,
                                        additionalVehicles: p.additionalVehicles.filter(
                                          (_, i) => i !== idx,
                                        ),
                                      }));
                                    }}
                                  >
                                    <DeleteOutlineIcon fontSize='small' color='error' />
                                  </IconButton>
                                </Box>
                                <Grid container spacing={1.5}>
                                  <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormControl
                                      fullWidth
                                      size='small'
                                      required
                                      error={!!errors[`addVehicle_${idx}_type`]}
                                    >
                                      <InputLabel required>Vehicle Type</InputLabel>
                                      <Select
                                        value={av.vehicleType}
                                        label='Vehicle Type'
                                        onChange={(e) => {
                                          const vt = e.target.value;
                                          const vc = VEHICLE_CONFIG[vt as VehicleKey];
                                          setForm((p) => ({
                                            ...p,
                                            additionalVehicles: p.additionalVehicles.map((v, i) =>
                                              i === idx
                                                ? {
                                                    ...v,
                                                    vehicleType: vt,
                                                    fuelType:
                                                      vc?.fuelTypes.length === 1
                                                        ? vc.fuelTypes[0]
                                                        : '',
                                                  }
                                                : v,
                                            ),
                                          }));
                                        }}
                                      >
                                        {Object.entries(VEHICLE_CONFIG).map(([key, vc]) => (
                                          <MenuItem key={key} value={key}>
                                            {vc.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                      {errors[`addVehicle_${idx}_type`] && (
                                        <FormHelperText>
                                          {reqError(true, errors[`addVehicle_${idx}_type`])}
                                        </FormHelperText>
                                      )}
                                    </FormControl>
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 4 }}>
                                    <TextField
                                      label='Vehicle Number'
                                      required
                                      fullWidth
                                      size='small'
                                      placeholder='e.g. KA 01 AB 5678'
                                      value={av.vehicleNumber}
                                      onChange={(e) =>
                                        setForm((p) => ({
                                          ...p,
                                          additionalVehicles: p.additionalVehicles.map((v, i) =>
                                            i === idx
                                              ? {
                                                  ...v,
                                                  vehicleNumber: e.target.value.toUpperCase(),
                                                }
                                              : v,
                                          ),
                                        }))
                                      }
                                      error={!!errors[`addVehicle_${idx}_number`]}
                                      helperText={reqError(
                                        !!errors[`addVehicle_${idx}_number`],
                                        errors[`addVehicle_${idx}_number`],
                                      )}
                                    />
                                  </Grid>
                                  <Grid size={{ xs: 12, sm: 4 }}>
                                    <FormControl
                                      fullWidth
                                      size='small'
                                      required
                                      error={!!errors[`addVehicle_${idx}_fuel`]}
                                    >
                                      <InputLabel required>Fuel Type</InputLabel>
                                      <Select
                                        value={av.fuelType}
                                        label='Fuel Type'
                                        onChange={(e) =>
                                          setForm((p) => ({
                                            ...p,
                                            additionalVehicles: p.additionalVehicles.map((v, i) =>
                                              i === idx ? { ...v, fuelType: e.target.value } : v,
                                            ),
                                          }))
                                        }
                                      >
                                        {(avConfig?.fuelTypes ?? Object.keys(FUEL_LABELS)).map(
                                          (f) => (
                                            <MenuItem key={f} value={f}>
                                              {FUEL_LABELS[f]}
                                            </MenuItem>
                                          ),
                                        )}
                                      </Select>
                                      {errors[`addVehicle_${idx}_fuel`] && (
                                        <FormHelperText>
                                          {reqError(true, errors[`addVehicle_${idx}_fuel`])}
                                        </FormHelperText>
                                      )}
                                    </FormControl>
                                  </Grid>
                                </Grid>
                              </Paper>
                            );
                          })}
                          {form.additionalVehicles.length === 0 && (
                            <Alert severity='warning' sx={{ fontSize: '0.75rem', py: 0.5 }}>
                              Click <strong>Add Vehicle</strong> to register your additional
                              vehicle(s).
                            </Alert>
                          )}
                        </Box>
                      )}
                      {/* Parcel + Ride Combo Sub-fields */}
                      {selected && b.id === 'parcel_combo' && (
                        <Box
                          sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Typography
                            variant='caption'
                            fontWeight={700}
                            color='primary'
                            sx={{ mb: 1.5, display: 'block' }}
                          >
                            Parcel Preferences
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                              <Typography
                                variant='caption'
                                color='text.secondary'
                                sx={{ mb: 1, display: 'block' }}
                              >
                                Parcel Types You&apos;ll Accept{' '}
                                <span style={{ color: 'red' }}>*</span>
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {PARCEL_TYPE_OPTIONS.map((pt) => {
                                  const checked = form.parcelComboTypes.includes(pt.id);
                                  return (
                                    <Chip
                                      key={pt.id}
                                      label={pt.label}
                                      size='small'
                                      color={checked ? 'warning' : 'default'}
                                      variant={checked ? 'filled' : 'outlined'}
                                      onClick={() =>
                                        setForm((p) => ({
                                          ...p,
                                          parcelComboTypes: checked
                                            ? p.parcelComboTypes.filter((x) => x !== pt.id)
                                            : [...p.parcelComboTypes, pt.id],
                                        }))
                                      }
                                      sx={{ cursor: 'pointer', fontSize: '0.7rem' }}
                                    />
                                  );
                                })}
                              </Box>
                              {errors['parcelComboTypes'] && (
                                <FormHelperText error sx={{ mt: 0.5 }}>
                                  {reqError(true, errors['parcelComboTypes'])}
                                </FormHelperText>
                              )}
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['parcelMaxWeight']}
                              >
                                <InputLabel required>Max Parcel Weight</InputLabel>
                                <Select
                                  value={form.parcelMaxWeight}
                                  label='Max Parcel Weight'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, parcelMaxWeight: e.target.value }))
                                  }
                                >
                                  {PARCEL_WEIGHT_OPTIONS.map((o) => (
                                    <MenuItem key={o.id} value={o.id}>
                                      {o.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['parcelMaxWeight'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['parcelMaxWeight'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['parcelRadiusPref']}
                              >
                                <InputLabel required>Max Detour Radius</InputLabel>
                                <Select
                                  value={form.parcelRadiusPref}
                                  label='Max Detour Radius'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, parcelRadiusPref: e.target.value }))
                                  }
                                >
                                  {PARCEL_RADIUS_OPTIONS.map((o) => (
                                    <MenuItem key={o.id} value={o.id}>
                                      {o.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['parcelRadiusPref'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['parcelRadiusPref'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Alert severity='success' sx={{ fontSize: '0.72rem', py: 0.5 }}>
                                <strong>How it works:</strong> When you accept a passenger ride, the
                                platform auto-checks for parcels near your drop point. You choose to
                                accept or decline each combo — zero pressure.
                              </Alert>
                            </Grid>
                          </Grid>
                        </Box>
                      )}

                      {/* Cargo Co-Ride Sub-fields */}
                      {selected && b.id === 'cargo_coride' && (
                        <Box
                          sx={{ mt: 2, pt: 2, borderTop: '1px dashed', borderColor: 'divider' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Typography
                            variant='caption'
                            fontWeight={700}
                            color='primary'
                            sx={{ mb: 1.5, display: 'block' }}
                          >
                            Co-Ride Preferences
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['cargoCoRideMax']}
                              >
                                <InputLabel required>Max Co-Passengers</InputLabel>
                                <Select
                                  value={form.cargoCoRideMax}
                                  label='Max Co-Passengers'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, cargoCoRideMax: e.target.value }))
                                  }
                                >
                                  {CORIDE_MAX_OPTIONS.map((o) => (
                                    <MenuItem key={o.id} value={o.id}>
                                      {o.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['cargoCoRideMax'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['cargoCoRideMax'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['cargoCoRideHaulPref']}
                              >
                                <InputLabel required>Preferred Trip Distance</InputLabel>
                                <Select
                                  value={form.cargoCoRideHaulPref}
                                  label='Preferred Trip Distance'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, cargoCoRideHaulPref: e.target.value }))
                                  }
                                >
                                  {CORIDE_HAUL_OPTIONS.map((o) => (
                                    <MenuItem key={o.id} value={o.id}>
                                      {o.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['cargoCoRideHaulPref'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['cargoCoRideHaulPref'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <FormControl
                                fullWidth
                                size='small'
                                required
                                error={!!errors['cargoCoRideRatePref']}
                              >
                                <InputLabel required>Co-Ride Rate Preference</InputLabel>
                                <Select
                                  value={form.cargoCoRideRatePref}
                                  label='Co-Ride Rate Preference'
                                  onChange={(e) =>
                                    setForm((p) => ({ ...p, cargoCoRideRatePref: e.target.value }))
                                  }
                                >
                                  {CORIDE_RATE_OPTIONS.map((o) => (
                                    <MenuItem key={o.id} value={o.id}>
                                      {o.label}
                                    </MenuItem>
                                  ))}
                                </Select>
                                {errors['cargoCoRideRatePref'] && (
                                  <FormHelperText>
                                    {reqError(true, errors['cargoCoRideRatePref'])}
                                  </FormHelperText>
                                )}
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Alert severity='success' sx={{ fontSize: '0.72rem', py: 0.5 }}>
                                <strong>How it works:</strong> Once you confirm a cargo booking, the
                                platform shows you co-ride requests going the same route. You accept
                                only if it suits your timing. Co-passengers are ID-verified.
                              </Alert>
                            </Grid>
                          </Grid>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Discount Summary */}
            {form.bundleTypes.length > 0 &&
              (() => {
                const discount = calcBundleDiscount(form.bundleTypes);
                const base = 20;
                const loyalty =
                  form.bundleTypes.length >= 3 ? 5 : form.bundleTypes.length === 2 ? 2 : 0;
                const effective = Math.max(base - discount, 0);
                return (
                  <Paper
                    variant='outlined'
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      borderColor: 'success.main',
                      bgcolor: 'success.50',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <LocalOfferIcon color='success' sx={{ fontSize: 20 }} />
                      <Typography variant='subtitle2' fontWeight={700} color='success.dark'>
                        Your Bundle Discount Summary
                      </Typography>
                    </Box>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          {form.bundleTypes.map((id) => {
                            const bc = BUNDLE_CONFIG.find((x) => x.id === id);
                            const isBonus = !bc?.discount || bc.discount === 0;
                            return (
                              <Box
                                key={id}
                                sx={{ display: 'flex', justifyContent: 'space-between' }}
                              >
                                <Typography variant='caption' color='text.secondary'>
                                  {bc?.title}
                                </Typography>
                                {isBonus ? (
                                  <Typography
                                    variant='caption'
                                    fontWeight={600}
                                    color='warning.main'
                                  >
                                    {bc?.bonusLabel}
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant='caption'
                                    fontWeight={600}
                                    color='success.main'
                                  >
                                    -{BUNDLE_DISCOUNT_MAP[id]}%
                                  </Typography>
                                )}
                              </Box>
                            );
                          })}
                          {loyalty > 0 && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant='caption' color='text.secondary'>
                                Multi-bundle loyalty bonus
                              </Typography>
                              <Typography variant='caption' fontWeight={600} color='success.main'>
                                -{loyalty}%
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box
                          sx={{
                            bgcolor: 'success.main',
                            color: '#fff',
                            borderRadius: 1.5,
                            p: 1.5,
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant='caption' sx={{ opacity: 0.85 }}>
                            Standard commission: {base}%
                          </Typography>
                          <Typography variant='h6' fontWeight={800} sx={{ lineHeight: 1.2 }}>
                            Your rate: {effective}%
                          </Typography>
                          <Typography variant='caption' sx={{ opacity: 0.85 }}>
                            You save {discount}% per ride
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                );
              })()}

            {form.bundleTypes.length === 0 && (
              <Alert severity='info' sx={{ fontSize: '0.78rem' }}>
                No bundles selected. You can skip this step or select bundles above to reduce your
                platform commission rate.
              </Alert>
            )}
          </Box>
        )}

        {/* ── Step 6: Review & Submit ── */}
        {step === 6 && (
          <Box>
            <Typography variant='subtitle1' fontWeight={700} color='primary' sx={{ mb: 2 }}>
              Review & Submit
            </Typography>

            {/* Personal */}
            <Paper variant='outlined' sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Typography
                variant='caption'
                fontWeight={700}
                color='text.secondary'
                sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
              >
                Personal
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={0.75}>
                {[
                  { label: 'Full Name', value: `${form.firstName} ${form.lastName}` },
                  { label: 'Phone', value: form.phone },
                  { label: 'Email', value: form.email || '—' },
                  { label: 'City', value: form.city },
                  { label: 'Area', value: form.area || '—' },
                  { label: 'Pincode', value: form.pincode || '—' },
                ].map(({ label, value }) => (
                  <Grid key={label} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant='caption' color='text.secondary' sx={{ minWidth: 80 }}>
                        {label}:
                      </Typography>
                      <Typography variant='caption' fontWeight={600}>
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Service & Vehicle */}
            <Paper variant='outlined' sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Typography
                variant='caption'
                fontWeight={700}
                color='text.secondary'
                sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
              >
                Service & Vehicle
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={0.75}>
                {[
                  { label: 'Category', value: fmt(form.serviceCategory) },
                  { label: 'Vehicle', value: vConfig?.label || '—' },
                  { label: 'Sub-Type', value: form.vehicleSubType || '—' },
                  { label: 'Fuel', value: FUEL_LABELS[form.fuelType] || form.fuelType },
                  {
                    label: form.serviceCategory === 'logistics' ? 'Delivery' : 'Ride Pref.',
                    value: fmt(form.tripPreference),
                  },
                  { label: 'Vehicle No.', value: form.vehicleNumber },
                ].map(({ label, value }) => (
                  <Grid key={label} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant='caption' color='text.secondary' sx={{ minWidth: 80 }}>
                        {label}:
                      </Typography>
                      <Typography variant='caption' fontWeight={600}>
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Vehicle Docs */}
            <Paper variant='outlined' sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Typography
                variant='caption'
                fontWeight={700}
                color='text.secondary'
                sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
              >
                Vehicle Documents
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={0.75}>
                {[
                  { label: 'RC No.', value: form.rc.number },
                  { label: 'RC Expiry', value: form.rc.expiry || '—' },
                  { label: 'RC Front', value: fileStatus(files.rcFront) },
                  { label: 'RC Back', value: fileStatus(files.rcBack) },
                  { label: 'Insurance No.', value: form.insurance.number },
                  { label: 'Ins. Expiry', value: form.insurance.expiry || '—' },
                  { label: 'Insurance Doc', value: fileStatus(files.insuranceFront) },
                  { label: 'PUC No.', value: form.puc.number || '—' },
                  ...(isCommercial
                    ? [
                        { label: 'Fitness No.', value: form.fitness.number },
                        { label: 'Fitness Expiry', value: form.fitness.expiry || '—' },
                        { label: 'Permit No.', value: form.permit.number },
                        { label: 'Permit Expiry', value: form.permit.expiry || '—' },
                      ]
                    : []),
                ].map(({ label, value }) => (
                  <Grid key={label} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant='caption' color='text.secondary' sx={{ minWidth: 90 }}>
                        {label}:
                      </Typography>
                      <Typography
                        variant='caption'
                        fontWeight={600}
                        color={
                          value === 'Not uploaded'
                            ? 'text.disabled'
                            : value.startsWith('✓')
                              ? 'success.main'
                              : undefined
                        }
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Personal Docs */}
            <Paper variant='outlined' sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Typography
                variant='caption'
                fontWeight={700}
                color='text.secondary'
                sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
              >
                Personal Documents
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={0.75}>
                {[
                  { label: 'Driver Photo', value: fileStatus(files.driverPhoto) },
                  { label: 'DL Number', value: form.drivingLicense.number },
                  { label: 'DL Expiry', value: form.drivingLicense.expiry || '—' },
                  { label: 'DL Front', value: fileStatus(files.dlFront) },
                  { label: 'DL Back', value: fileStatus(files.dlBack) },
                  { label: 'ID Type', value: fmt(form.idProofType) },
                  { label: 'ID Number', value: form.idProof.number || '—' },
                  { label: 'ID Front', value: fileStatus(files.idFront) },
                ].map(({ label, value }) => (
                  <Grid key={label} size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant='caption' color='text.secondary' sx={{ minWidth: 90 }}>
                        {label}:
                      </Typography>
                      <Typography
                        variant='caption'
                        fontWeight={600}
                        color={
                          value === 'Not uploaded'
                            ? 'text.disabled'
                            : value.startsWith('✓')
                              ? 'success.main'
                              : undefined
                        }
                      >
                        {value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* Bundle Summary in Review */}
            <Paper variant='outlined' sx={{ p: 2, borderRadius: 2, mb: 2 }}>
              <Typography
                variant='caption'
                fontWeight={700}
                color='text.secondary'
                sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
              >
                Bundle Options
              </Typography>
              <Divider sx={{ my: 1 }} />
              {form.bundleTypes.length === 0 ? (
                <Typography variant='caption' color='text.disabled'>
                  No bundles selected — standard commission applies (20%)
                </Typography>
              ) : (
                <Grid container spacing={0.75}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant='caption' color='text.secondary' sx={{ minWidth: 90 }}>
                        Bundles:
                      </Typography>
                      <Typography variant='caption' fontWeight={600}>
                        {form.bundleTypes
                          .map((id) => BUNDLE_CONFIG.find((b) => b.id === id)?.title)
                          .join(', ')}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Typography variant='caption' color='text.secondary' sx={{ minWidth: 90 }}>
                        Discount:
                      </Typography>
                      <Typography variant='caption' fontWeight={700} color='success.main'>
                        {calcBundleDiscount(form.bundleTypes)}% off → Your rate:{' '}
                        {Math.max(20 - calcBundleDiscount(form.bundleTypes), 0)}%
                      </Typography>
                    </Box>
                  </Grid>
                  {form.bundleTypes.includes('rental') && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Rent Vehicle:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {form.rentalVehiclePref
                              ? VEHICLE_CONFIG[form.rentalVehiclePref as VehicleKey]?.label
                              : '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Rental Plan:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {fmt(form.rentalDuration)}
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                  {form.bundleTypes.includes('driver_hire') && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Drivers Needed:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {form.driverHireCount}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Shift:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {fmt(form.driverHireShift)}
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                  {form.bundleTypes.includes('multi_vehicle') &&
                    form.additionalVehicles.map((av, idx) => (
                      <Grid key={idx} size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Extra Vehicle {idx + 1}:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {VEHICLE_CONFIG[av.vehicleType as VehicleKey]?.label || av.vehicleType}{' '}
                            — {av.vehicleNumber} ({FUEL_LABELS[av.fuelType] || av.fuelType})
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  {form.bundleTypes.includes('parcel_combo') && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Parcel Types:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {form.parcelComboTypes
                              .map((id) => PARCEL_TYPE_OPTIONS.find((o) => o.id === id)?.label)
                              .join(', ') || '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Max Weight:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {PARCEL_WEIGHT_OPTIONS.find((o) => o.id === form.parcelMaxWeight)
                              ?.label || '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Detour Radius:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {PARCEL_RADIUS_OPTIONS.find((o) => o.id === form.parcelRadiusPref)
                              ?.label || '—'}
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                  {form.bundleTypes.includes('cargo_coride') && (
                    <>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Max Co-Passengers:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {form.cargoCoRideMax || '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Haul Preference:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {CORIDE_HAUL_OPTIONS.find((o) => o.id === form.cargoCoRideHaulPref)
                              ?.label || '—'}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ minWidth: 90 }}
                          >
                            Rate Preference:
                          </Typography>
                          <Typography variant='caption' fontWeight={600}>
                            {CORIDE_RATE_OPTIONS.find((o) => o.id === form.cargoCoRideRatePref)
                              ?.label || '—'}
                          </Typography>
                        </Box>
                      </Grid>
                    </>
                  )}
                </Grid>
              )}
            </Paper>

            <Alert severity='success'>
              All required details entered. Click <strong>Submit Registration</strong> to onboard
              this captain. Document images can be verified and managed separately after
              registration.
            </Alert>
          </Box>
        )}
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button onClick={handleClose} variant='outlined' sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        {step > 0 && (
          <Button
            onClick={handleBack}
            variant='outlined'
            color='secondary'
            sx={{ borderRadius: 2 }}
          >
            Back
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <>
            {step === 5 && (
              <Button
                onClick={() => setStep((s) => s + 1)}
                variant='text'
                color='secondary'
                sx={{ borderRadius: 2 }}
              >
                Skip Bundles
              </Button>
            )}
            <Button onClick={handleNext} variant='contained' sx={{ borderRadius: 2, px: 3 }}>
              {step === 5 ? 'Apply & Continue' : 'Next'}
            </Button>
          </>
        ) : (
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {isSubmitting ? 'Submitting…' : 'Submit Registration'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateUserDialog;
