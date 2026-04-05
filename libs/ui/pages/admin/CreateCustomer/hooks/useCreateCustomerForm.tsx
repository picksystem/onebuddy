import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { constants } from '@bandi/utils';
import { useLocalStorage, useFieldError, useAuth } from '@bandi/hooks';
import { useAuthActionMutation } from '@bandi/services';
import {
  VEHICLE_CONFIG,
  CITY_AREA_MAP,
  TRIP_OPTIONS,
  MOBILITY_VEHICLES,
  LOGISTICS_VEHICLES,
  PARCEL_VEHICLES,
} from '../constants/createCustomer.constants';
import type { VehicleKey } from '../constants/createCustomer.constants';
import {
  fileToBase64,
  base64ToFile,
  calcBundleDiscount,
  mergeWithInitial,
} from '../utils/createCustomer.utils';
import type {
  FormData,
  Errors,
  DocField,
  CustomerType,
  AdditionalVehicle,
} from '../types/createCustomer.types';
import { TYPE_CONFIG } from '../constants/createCustomer.constants';

const useCreateCustomerForm = (customerType: CustomerType) => {
  const navigate = useNavigate();
  const { AdminPath } = constants;
  const { user } = useAuth();
  const [authAction] = useAuthActionMutation();
  const reqError = useFieldError();

  const config = TYPE_CONFIG[customerType];
  const serviceCategory = customerType;

  // ── Auto-generated userId ─────────────────────────────────────────────────
  const [userId] = useState<string>(() => {
    const prefix =
      customerType === 'logistics' ? 'LOGST' : customerType === 'parcel' ? 'PARCEL' : 'MOBIL';
    const num = String(Math.floor(10000 + Math.random() * 90000));
    const stored = window.localStorage.getItem(`customer_uid_${customerType}`);
    if (stored) return stored;
    const id = `${prefix}${num}`;
    window.localStorage.setItem(`customer_uid_${customerType}`, id);
    return id;
  });

  const STORAGE_KEY = `customer_draft_${customerType}`;
  const FILES_STORAGE_KEY = `customer_files_${customerType}`;
  const [_stored, _setStored, clearDraft] = useLocalStorage<Partial<FormData>>(STORAGE_KEY, {});
  const form: FormData = mergeWithInitial(_stored);

  const setForm = (updater: (prev: FormData) => FormData) => {
    _setStored((prev) => updater(mergeWithInitial(prev)));
  };

  // ── UI state ──────────────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // ── Referral ──────────────────────────────────────────────────────────────
  const [referredBy, setReferredBy] = useState<{ name: string; email: string } | null>(null);
  const [referralInput, setReferralInput] = useState('');
  const [employeeList, setEmployeeList] = useState<{ name: string; email: string }[]>([]);

  useEffect(() => {
    authAction({ action: 'get-all-users' })
      .unwrap()
      .then((res: { data?: Array<Record<string, unknown>> }) => {
        setEmployeeList(
          (res.data ?? []).map((u) => ({
            name:
              (u['name'] as string) ||
              `${(u['firstName'] as string) ?? ''} ${(u['lastName'] as string) ?? ''}`.trim(),
            email: u['email'] as string,
          })),
        );
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── File refs ─────────────────────────────────────────────────────────────
  const regFrontRef = useRef<HTMLInputElement>(null);
  const rcFrontRef = useRef<HTMLInputElement>(null);
  const rcBackRef = useRef<HTMLInputElement>(null);
  const insuranceFrontRef = useRef<HTMLInputElement>(null);
  const pucFrontRef = useRef<HTMLInputElement>(null);
  const fitnessFrontRef = useRef<HTMLInputElement>(null);
  const permitFrontRef = useRef<HTMLInputElement>(null);
  const photoFrontRef = useRef<HTMLInputElement>(null);
  const dlFrontRef = useRef<HTMLInputElement>(null);
  const dlBackRef = useRef<HTMLInputElement>(null);
  const idFrontRef = useRef<HTMLInputElement>(null);
  const idBackRef = useRef<HTMLInputElement>(null);

  const EMPTY_FILES: Record<string, File | null> = {
    regFront: null,
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

  const [files, setFiles] = useState<Record<string, File | null>>(EMPTY_FILES);

  const setFile = (key: string, file: File | null) => {
    setFiles((p) => ({ ...p, [key]: file }));
    if (file) {
      fileToBase64(file).then((dataUrl) => {
        try {
          const stored: Record<string, { name: string; type: string; data: string }> = JSON.parse(
            window.localStorage.getItem(FILES_STORAGE_KEY) ?? '{}',
          );
          stored[key] = { name: file.name, type: file.type, data: dataUrl };
          window.localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(stored));
        } catch {
          // storage quota exceeded — silently ignore
        }
      });
    } else {
      try {
        const stored: Record<string, unknown> = JSON.parse(
          window.localStorage.getItem(FILES_STORAGE_KEY) ?? '{}',
        );
        delete stored[key];
        window.localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(stored));
      } catch {
        // ignore
      }
    }
  };

  // Restore files from localStorage on mount
  useEffect(() => {
    try {
      const stored: Record<string, { name: string; type: string; data: string }> = JSON.parse(
        window.localStorage.getItem(FILES_STORAGE_KEY) ?? '{}',
      );
      const restored: Record<string, File> = {};
      for (const [k, v] of Object.entries(stored)) {
        if (v?.data && v?.name && v?.type) {
          restored[k] = base64ToFile(v.data, v.name, v.type);
        }
      }
      if (Object.keys(restored).length > 0) {
        setFiles((p) => ({ ...p, ...restored }));
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Field helpers ─────────────────────────────────────────────────────────

  const fe = (field: string) => reqError(touched[field], errors[field]);
  const touch = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const set = (field: keyof FormData, value: string) => {
    setForm((p) => {
      let next = { ...p, [field]: value };
      if (field === 'city') next = { ...next, area: '', pincode: '' };
      if (field === 'area') {
        const entry = (CITY_AREA_MAP[p.city] ?? []).find((a) => a.area === value);
        next = { ...next, pincode: entry?.pincode ?? '' };
      }
      if (field === 'vehicleType') {
        const vc = VEHICLE_CONFIG[value as VehicleKey];
        next = {
          ...next,
          vehicleSubType: vc?.subTypes.length === 1 ? vc.subTypes[0] : '',
          fuelType: vc?.fuelTypes.length === 1 ? String(vc.fuelTypes[0]) : '',
          tripPreference: '',
        };
      }
      return next;
    });
    setErrors((p) => {
      const n = { ...p };
      delete n[field as string];
      return n;
    });
  };

  const setDoc = (doc: string, field: keyof DocField, value: string) => {
    setForm((p) => {
      const existing = (p[doc as keyof FormData] as DocField | undefined) ?? {
        number: '',
        expiry: '',
      };
      return { ...p, [doc]: { ...existing, [field]: value } };
    });
    setErrors((prev) => {
      const n = { ...prev };
      delete n[`${doc}.${field}`];
      return n;
    });
  };

  const toggleBundle = (id: string) => {
    setForm((p) => ({
      ...p,
      bundleTypes: p.bundleTypes.includes(id)
        ? p.bundleTypes.filter((b) => b !== id)
        : [...p.bundleTypes, id],
    }));
  };

  const toggleParcelType = (id: string) => {
    setForm((p) => ({
      ...p,
      parcelComboTypes: p.parcelComboTypes.includes(id)
        ? p.parcelComboTypes.filter((t) => t !== id)
        : [...p.parcelComboTypes, id],
    }));
  };

  const addVehicle = () =>
    setForm((p) => ({
      ...p,
      additionalVehicles: [
        ...p.additionalVehicles,
        { vehicleType: '', vehicleNumber: '', fuelType: '' },
      ],
    }));

  const updateVehicle = (idx: number, field: keyof AdditionalVehicle, value: string) =>
    setForm((p) => ({
      ...p,
      additionalVehicles: p.additionalVehicles.map((v, i) =>
        i === idx ? { ...v, [field]: value } : v,
      ),
    }));

  const removeVehicle = (idx: number) =>
    setForm((p) => ({
      ...p,
      additionalVehicles: p.additionalVehicles.filter((_, i) => i !== idx),
    }));

  // ── Derived values ────────────────────────────────────────────────────────

  const vConfig = form.vehicleType ? VEHICLE_CONFIG[form.vehicleType as VehicleKey] : null;
  const isCommercial = vConfig?.isCommercial ?? false;
  const vehicleList =
    customerType === 'mobility'
      ? MOBILITY_VEHICLES
      : customerType === 'parcel'
        ? PARCEL_VEHICLES
        : LOGISTICS_VEHICLES;
  const tripOpts = TRIP_OPTIONS[customerType];
  const areaOptions = form.city ? (CITY_AREA_MAP[form.city] ?? []) : [];
  const bundleDiscount = calcBundleDiscount(form.bundleTypes);

  // ── Completion ────────────────────────────────────────────────────────────

  const REQUIRED_FIELDS = [
    'firstName',
    'lastName',
    'phone',
    'email',
    'city',
    'area',
    'vehicleType',
    'fuelType',
    'tripPreference',
    'vehicleNumber',
  ];
  const filledCount = REQUIRED_FIELDS.filter((k) => !!(form as Record<string, unknown>)[k]).length;
  const completionPct = Math.round((filledCount / REQUIRED_FIELDS.length) * 100);

  // ── Validation ────────────────────────────────────────────────────────────

  const validateAll = (): boolean => {
    const errs: Errors = {};
    if (!form.aadharCard.trim()) errs['aadharCard'] = 'Required';
    else if (!/^\d{12}$/.test(form.aadharCard.trim()))
      errs['aadharCard'] = 'Enter valid 12-digit Aadhar number';
    if (!form.firstName.trim()) errs['firstName'] = 'Required';
    if (!form.lastName.trim()) errs['lastName'] = 'Required';
    if (!form.gender) errs['gender'] = 'Required';
    if (!form.phone.trim()) errs['phone'] = 'Required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s\-+]/g, '')))
      errs['phone'] = 'Enter valid 10-digit mobile number';
    if (!form.email.trim()) errs['email'] = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs['email'] = 'Invalid email';
    if (!form.city) errs['city'] = 'Required';
    if (!form.area) errs['area'] = 'Required';
    if (!form.pincode.trim()) errs['pincode'] = 'Required';
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs['pincode'] = '6-digit pincode required';
    if (!form.vehicleType) errs['vehicleType'] = 'Select a vehicle type';
    if (vConfig && vConfig.subTypes.length > 1 && !form.vehicleSubType)
      errs['vehicleSubType'] = 'Required';
    if (!form.fuelType) errs['fuelType'] = 'Required';
    if (!form.tripPreference) errs['tripPreference'] = 'Required';
    if (!form.vehicleNumber.trim()) errs['vehicleNumber'] = 'Vehicle number required';
    if (!form.rc.number.trim()) errs['rc.number'] = 'RC number required';
    if (!form.rc.expiry) errs['rc.expiry'] = 'RC expiry required';
    if (!form.insurance.number.trim())
      errs['insurance.number'] = 'Insurance policy number required';
    if (!form.insurance.expiry) errs['insurance.expiry'] = 'Insurance expiry required';
    if (!form.puc.expiry) errs['puc.expiry'] = 'PUC expiry required';
    if (isCommercial) {
      if (!form.fitness.number.trim()) errs['fitness.number'] = 'Fitness certificate required';
      if (!form.fitness.expiry) errs['fitness.expiry'] = 'Fitness expiry required';
      if (!form.permit.number.trim()) errs['permit.number'] = 'Permit number required';
      if (!form.permit.expiry) errs['permit.expiry'] = 'Permit expiry required';
    }
    if (!form.drivingLicense.number.trim()) errs['dl.number'] = 'DL number required';
    if (!form.drivingLicense.expiry) errs['dl.expiry'] = 'DL expiry required';
    if (!form.idProofType) errs['idProofType'] = 'Select ID proof type';
    if (!form.idProof.number.trim()) errs['idProof.number'] = 'ID number required';
    if (!form.idProof.expiry) errs['idProof.expiry'] = 'ID expiry required';
    if (form.bundleTypes.includes('rental') && !form.rentalDuration)
      errs['rentalDuration'] = 'Required';
    if (form.bundleTypes.includes('driver_hire')) {
      if (!form.driverHireCount) errs['driverHireCount'] = 'Required';
      if (!form.driverHireShift) errs['driverHireShift'] = 'Required';
    }
    if (form.bundleTypes.includes('multi_vehicle') && form.additionalVehicles.length === 0)
      errs['additionalVehicles'] = 'Add at least one additional vehicle';
    // File validations
    if (!files['regFront']) errs['file.regFront'] = 'Number plate photo required';
    if (!files['rcFront']) errs['file.rcFront'] = 'RC front required';
    if (!files['rcBack']) errs['file.rcBack'] = 'RC back required';
    if (!files['insuranceFront']) errs['file.insuranceFront'] = 'Insurance document required';
    if (!files['pucFront']) errs['file.pucFront'] = 'PUC certificate required';
    if (!files['fitnessFront']) errs['file.fitnessFront'] = 'Fitness certificate required';
    if (!files['permitFront']) errs['file.permitFront'] = 'Permit document required';
    if (!files['photoFront']) errs['file.photoFront'] = 'Personal photo required';
    if (!files['dlFront']) errs['file.dlFront'] = 'DL front required';
    if (!files['dlBack']) errs['file.dlBack'] = 'DL back required';
    if (!files['idFront']) errs['file.idFront'] = 'ID front required';
    if (!files['idBack']) errs['file.idBack'] = 'ID back required';
    setErrors(errs);
    const allFields = [
      'aadharCard',
      'firstName',
      'lastName',
      'gender',
      'phone',
      'emergencyContact',
      'email',
      'city',
      'area',
      'pincode',
      'vehicleType',
      'vehicleSubType',
      'fuelType',
      'tripPreference',
      'vehicleNumber',
      'rc.number',
      'insurance.number',
      'insurance.expiry',
      'fitness.number',
      'permit.number',
      'dl.number',
      'idProofType',
      'idProof.number',
      'rentalDuration',
      'driverHireCount',
      'driverHireShift',
      'additionalVehicles',
      'file.regFront',
      'file.rcFront',
      'file.rcBack',
      'file.insuranceFront',
      'file.fitnessFront',
      'file.permitFront',
      'file.photoFront',
      'file.dlFront',
      'file.dlBack',
      'file.idFront',
      'file.idBack',
    ];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
    return Object.keys(errs).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateAll()) {
      setSnackbar({
        open: true,
        message: 'Please fix the highlighted errors before submitting.',
        severity: 'error',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsSubmitting(true);
    try {
      const customerEmail = form.email.trim().toLowerCase();
      const adminEmail = user?.email?.toLowerCase() ?? '';
      const isSelfRegistered = !!adminEmail && adminEmail === customerEmail;

      const createdBy = isSelfRegistered
        ? {
            createdByEmail: customerEmail,
            createdByName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
            createdByPhone: form.phone.trim() || undefined,
            isSelfRegistered: true,
          }
        : {
            createdByEmail: user?.email || undefined,
            createdByName: user
              ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.name || undefined
              : undefined,
            createdByPhone: user?.phone || undefined,
            isSelfRegistered: false,
          };

      const payload = {
        aadharCard: form.aadharCard.trim() || null,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender || null,
        phone: form.phone.trim(),
        emergencyContact: form.emergencyContact.trim() || null,
        email: form.email.trim(),
        city: form.city,
        area: form.area,
        pincode: form.pincode.trim(),
        customerId: userId,
        ...createdBy,
        referredByEmail: referredBy?.email || undefined,
        serviceCategory,
        vehicleType: form.vehicleType,
        vehicleSubType: form.vehicleSubType,
        fuelType: form.fuelType,
        tripPreference: form.tripPreference,
        vehicleNumber: form.vehicleNumber.trim(),
        rcNumber: form.rc.number.trim(),
        rcExpiry: form.rc.expiry || undefined,
        insuranceNumber: form.insurance.number.trim(),
        insuranceExpiry: form.insurance.expiry,
        pucNumber: form.puc.number.trim() || undefined,
        pucExpiry: form.puc.expiry || undefined,
        fitnessNumber: form.fitness.number.trim() || undefined,
        fitnessExpiry: form.fitness.expiry || undefined,
        permitNumber: form.permit.number.trim() || undefined,
        permitExpiry: form.permit.expiry || undefined,
        dlNumber: form.drivingLicense.number.trim(),
        dlExpiry: form.drivingLicense.expiry || undefined,
        idProofType: form.idProofType,
        idProofNumber: form.idProof.number.trim(),
        idProofExpiry: form.idProof.expiry || undefined,
        bundleTypes: form.bundleTypes,
        bundleDiscount: calcBundleDiscount(form.bundleTypes),
        ...(form.bundleTypes.includes('rental') && {
          rentalDuration: form.rentalDuration,
          rentalVehiclePref: form.rentalVehiclePref || undefined,
        }),
        ...(form.bundleTypes.includes('driver_hire') && {
          driverHireCount: form.driverHireCount,
          driverHireShift: form.driverHireShift,
          driverHireBudget: form.driverHireBudget || undefined,
        }),
        ...(form.bundleTypes.includes('multi_vehicle') && {
          additionalVehicles: form.additionalVehicles,
        }),
        ...(form.bundleTypes.includes('parcel_combo') && {
          parcelComboTypes: form.parcelComboTypes,
          parcelMaxWeight: form.parcelMaxWeight || undefined,
          parcelRadiusPref: form.parcelRadiusPref || undefined,
        }),
        ...(form.bundleTypes.includes('cargo_coride') && {
          cargoCoRideMax: form.cargoCoRideMax || undefined,
          cargoCoRideHaulPref: form.cargoCoRideHaulPref || undefined,
        }),
        uploadedFiles: Object.entries(files)
          .filter(([, f]) => f !== null)
          .map(([key]) => key),
      };

      await authAction({ action: 'create-customer-onboarding', data: payload }).unwrap();
      clearDraft();
      window.localStorage.removeItem(`customer_uid_${customerType}`);
      window.localStorage.removeItem(FILES_STORAGE_KEY);
      setFiles(EMPTY_FILES);
      setSnackbar({
        open: true,
        message: 'Customer account created successfully!',
        severity: 'success',
      });
      setTimeout(() => navigate(AdminPath.CREATE_CUSTOMER), 1800);
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        (err as Error)?.message ??
        'Failed to create customer. Please try again.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = () => {
    if (!validateAll()) {
      setSnackbar({
        open: true,
        message: 'Please fix the highlighted errors before reviewing.',
        severity: 'error',
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setReviewOpen(true);
  };

  const handleClearDraft = () => {
    clearDraft();
    window.localStorage.removeItem(`customer_uid_${customerType}`);
    window.localStorage.removeItem(FILES_STORAGE_KEY);
    setFiles(EMPTY_FILES);
    setErrors({});
  };

  const handleBack = () => navigate(AdminPath.CREATE_CUSTOMER);

  return {
    // form state
    form,
    errors,
    touched,
    files,
    // derived
    vConfig,
    isCommercial,
    vehicleList,
    tripOpts,
    areaOptions,
    bundleDiscount,
    completionPct,
    config,
    userId,
    // referral
    referredBy,
    setReferredBy,
    referralInput,
    setReferralInput,
    employeeList,
    // ui state
    isSubmitting,
    reviewOpen,
    setReviewOpen,
    snackbar,
    setSnackbar,
    // refs
    regFrontRef,
    rcFrontRef,
    rcBackRef,
    insuranceFrontRef,
    pucFrontRef,
    fitnessFrontRef,
    permitFrontRef,
    photoFrontRef,
    dlFrontRef,
    dlBackRef,
    idFrontRef,
    idBackRef,
    // handlers
    set,
    setDoc,
    setFile,
    touch,
    fe,
    toggleBundle,
    toggleParcelType,
    addVehicle,
    updateVehicle,
    removeVehicle,
    handleReview,
    handleSubmit,
    handleClearDraft,
    handleBack,
    user,
  };
};

export default useCreateCustomerForm;
