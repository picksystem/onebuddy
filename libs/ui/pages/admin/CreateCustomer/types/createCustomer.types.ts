import type { ElementType } from 'react';

// ─── Customer Type ─────────────────────────────────────────────────────────────

export type CustomerType = 'mobility' | 'logistics';

// ─── Type Config ──────────────────────────────────────────────────────────────

export interface TypeConfig {
  label: string;
  tagline: string;
  gradient: string;
  shadow: string;
  color: string;
  Icon: ElementType;
}

// ─── Doc Field ────────────────────────────────────────────────────────────────

export type DocField = { number: string; expiry: string };

// ─── Additional Vehicle ───────────────────────────────────────────────────────

export type AdditionalVehicle = { vehicleType: string; vehicleNumber: string; fuelType: string };

// ─── Form Data ────────────────────────────────────────────────────────────────

export type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  pincode: string;
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
  bundleTypes: string[];
  rentalVehiclePref: string;
  rentalDuration: string;
  driverHireCount: string;
  driverHireShift: string;
  driverHireBudget: string;
  additionalVehicles: AdditionalVehicle[];
  parcelComboTypes: string[];
  parcelMaxWeight: string;
  parcelRadiusPref: string;
  cargoCoRideMax: string;
  cargoCoRideHaulPref: string;
};

// ─── Errors ───────────────────────────────────────────────────────────────────

export type Errors = Record<string, string>;
