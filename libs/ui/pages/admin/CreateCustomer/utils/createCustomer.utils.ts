import type { FormData } from '../types/createCustomer.types';
import { INITIAL, EMPTY_DOC, BUNDLE_DISCOUNT_MAP } from '../constants/createCustomer.constants';

// ─── File persistence helpers ─────────────────────────────────────────────────

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const base64ToFile = (dataUrl: string, name: string, type: string): File => {
  const arr = dataUrl.split(',');
  const bstr = atob(arr[1]);
  const u8 = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
  return new File([u8], name, { type });
};

// ─── Bundle discount calculation ─────────────────────────────────────────────

export const calcBundleDiscount = (selected: string[]): number => {
  const disc = selected.filter((id) => (BUNDLE_DISCOUNT_MAP[id] ?? 0) > 0);
  const base = disc.reduce((s, id) => s + (BUNDLE_DISCOUNT_MAP[id] ?? 0), 0);
  const bonus = disc.length >= 3 ? 5 : disc.length === 2 ? 2 : 0;
  return Math.min(base + bonus, 20);
};

// ─── Merge stored draft with initial defaults ─────────────────────────────────

export const mergeWithInitial = (stored: Partial<FormData> | null | undefined): FormData => ({
  ...INITIAL,
  ...(stored ?? {}),
  bundleTypes: Array.isArray(stored?.bundleTypes) ? stored!.bundleTypes : [],
  parcelComboTypes: Array.isArray(stored?.parcelComboTypes) ? stored!.parcelComboTypes : [],
  additionalVehicles: Array.isArray(stored?.additionalVehicles) ? stored!.additionalVehicles : [],
  rc: stored?.rc ?? EMPTY_DOC,
  insurance: stored?.insurance ?? EMPTY_DOC,
  puc: stored?.puc ?? EMPTY_DOC,
  fitness: stored?.fitness ?? EMPTY_DOC,
  permit: stored?.permit ?? EMPTY_DOC,
  drivingLicense: stored?.drivingLicense ?? EMPTY_DOC,
  idProof: stored?.idProof ?? EMPTY_DOC,
});
