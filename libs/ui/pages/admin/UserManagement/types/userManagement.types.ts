import React from 'react';
import { IAuthUser } from '@bandi/interfaces';

export type UserRow = IAuthUser & { sno: number };

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface EditFormShape {
  firstName: string;
  lastName: string;
  phone: string;
  businessUnit: string;
  employeeId: string;
  role: string;
  isActive: boolean;
  accessFromDate: string;
  accessToDate: string;
  application: string;
  applicationLead: string;
  reasonForAccess: string;
  adminNotes: string;
}

export type InitialCreateValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  businessUnit: string;
  reasonForAccess: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export interface NewUserDraftData {
  values: InitialCreateValues;
  savedAt: string;
  expiresAt: string;
}

export type ChangeProfileErrors = {
  role?: string;
  reasonCode?: string;
  note?: string;
};

export type ResetPwErrors = {
  password?: string;
  confirm?: string;
};

export interface ChangeLogEntry {
  id?: string | number | null;
  createdAt?: string | null;
  changeType?: string | null;
  fieldName?: string | null;
  previousValue?: string | null;
  newValue?: string | null;
  changedByName?: string | null;
  reasonCode?: string | null;
  reasonNotes?: string | null;
}

export type EditOnboardingFormShape = {
  // Personal
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  pincode: string;
  // Service & Vehicle
  serviceCategory: string;
  vehicleType: string;
  vehicleSubType: string;
  fuelType: string;
  tripPreference: string;
  vehicleNumber: string;
  // RC
  rcNumber: string;
  rcExpiry: string;
  // DL
  dlNumber: string;
  dlExpiry: string;
  // Insurance
  insuranceNumber: string;
  insuranceExpiry: string;
  // PUC
  pucNumber: string;
  pucExpiry: string;
  // Fitness Certificate (commercial)
  fitnessNumber: string;
  fitnessExpiry: string;
  // Permit (commercial)
  permitNumber: string;
  permitExpiry: string;
  // Identity
  idProofType: string;
  idProofNumber: string;
  // Bundle Options
  bundleTypes: string;
  bundleDiscount: string;
  // Rent & Ride Bundle
  rentalVehiclePref: string;
  rentalDuration: string;
  rentalPickupZone: string;
  // Driver Hire Bundle
  driverHireCount: string;
  driverHireShift: string;
  driverHireBudget: string;
  // Multi-Vehicle Bundle
  additionalVehicles: string;
  // Parcel Combo Bundle
  parcelComboTypes: string;
  parcelMaxWeight: string;
  parcelRadiusPref: string;
  // Cargo Co-Ride Bundle
  cargoCoRideMax: string;
  cargoCoRideHaulPref: string;
  cargoCoRideRatePref: string;
  // Access & Status
  accessFromDate: string;
  accessToDate: string;
  status: string;
  adminNotes: string;
};

export type CustomerOnboardingRow = {
  id: number;
  sno: number;
  customerId: string | null;
  firstName: string;
  lastName: string;
  gender: string | null;
  phone: string;
  emergencyContact: string | null;
  email: string | null;
  city: string;
  area: string | null;
  pincode: string | null;
  serviceCategory: string;
  vehicleType: string;
  vehicleSubType: string | null;
  fuelType: string;
  tripPreference: string;
  vehicleNumber: string;
  // RC
  rcNumber: string;
  rcExpiry: string | null;
  // Insurance
  insuranceNumber: string | null;
  insuranceExpiry: string | null;
  // PUC
  pucNumber: string | null;
  pucExpiry: string | null;
  // Fitness Certificate
  fitnessNumber: string | null;
  fitnessExpiry: string | null;
  // Permit
  permitNumber: string | null;
  permitExpiry: string | null;
  // Driving License
  dlNumber: string;
  dlExpiry: string | null;
  // Identity proof (Aadhaar / PAN)
  idProofType: string;
  idProofNumber: string | null;
  // Bundle Options
  bundleTypes: string | null;
  bundleDiscount: number | null;
  rentalVehiclePref: string | null;
  rentalDuration: string | null;
  rentalPickupZone: string | null;
  driverHireCount: number | null;
  driverHireShift: string | null;
  driverHireBudget: string | null;
  additionalVehicles: string | null;
  parcelComboTypes: string | null;
  parcelMaxWeight: string | null;
  parcelRadiusPref: string | null;
  cargoCoRideMax: number | null;
  cargoCoRideHaulPref: string | null;
  cargoCoRideRatePref: string | null;
  // Platform access window (set by admin after approval)
  accessFromDate: string | null;
  accessToDate: string | null;
  status: string;
  adminNotes: string | null;
  submittedAt: string | null;
  createdAt: string;
};
