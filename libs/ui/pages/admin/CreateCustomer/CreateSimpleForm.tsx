import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Typography,
  Alert,
  Snackbar,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HailIcon from '@mui/icons-material/Hail';
import CarRentalIcon from '@mui/icons-material/CarRental';
import BuildIcon from '@mui/icons-material/Build';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TuneIcon from '@mui/icons-material/Tune';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Box, Button } from '@bandi/component';
import { useAuth, useFieldError } from '@bandi/hooks';
import { useAuthActionMutation } from '@bandi/services';
import { constants } from '@bandi/utils';

import InlineSelect from './components/InlineSelect';
import {
  CITY_AREA_MAP,
  CITY_OPTIONS,
  MOBILITY_VEHICLES,
  LOGISTICS_VEHICLES,
  HIRE_SHIFT_OPTIONS,
  RENTAL_DURATION_OPTIONS,
  VEHICLE_CONFIG,
} from './constants/createCustomer.constants';

// ─── Type config ──────────────────────────────────────────────────────────────

type SimpleType = 'user' | 'driver-hire' | 'vehicle-rental' | 'mechanic-hire';

const TYPE_CONFIG: Record<
  SimpleType,
  {
    label: string;
    tagline: string;
    gradient: string;
    shadow: string;
    color: string;
    Icon: React.ElementType;
    serviceCategory: string;
    bundleTypes: string[];
  }
> = {
  user: {
    label: 'Platform User',
    tagline: 'App User Registration',
    gradient: 'linear-gradient(135deg, #0e7490 0%, #0891b2 50%, #22d3ee 100%)',
    shadow: '0 8px 32px rgba(8,145,178,0.35)',
    color: '#0891b2',
    Icon: PersonAddIcon,
    serviceCategory: 'user',
    bundleTypes: [],
  },
  'driver-hire': {
    label: 'Driver Hire',
    tagline: 'Dedicated Driver Services',
    gradient: 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #4ade80 100%)',
    shadow: '0 8px 32px rgba(22,163,74,0.35)',
    color: '#16a34a',
    Icon: HailIcon,
    serviceCategory: 'mobility',
    bundleTypes: ['driver_hire'],
  },
  'vehicle-rental': {
    label: 'Vehicle Rental',
    tagline: 'Self-Drive & Rentals',
    gradient: 'linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #a78bfa 100%)',
    shadow: '0 8px 32px rgba(124,58,237,0.35)',
    color: '#7c3aed',
    Icon: CarRentalIcon,
    serviceCategory: 'mobility',
    bundleTypes: ['rental'],
  },
  'mechanic-hire': {
    label: 'Mechanic Hire',
    tagline: 'On-Demand Roadside Repair',
    gradient: 'linear-gradient(135deg, #c2410c 0%, #ea580c 50%, #fb923c 100%)',
    shadow: '0 8px 32px rgba(234,88,12,0.35)',
    color: '#ea580c',
    Icon: BuildIcon,
    serviceCategory: 'mechanic',
    bundleTypes: [],
  },
};

const VEHICLE_OPTIONS = MOBILITY_VEHICLES.map((v) => ({
  id: v,
  label: VEHICLE_CONFIG[v]?.label ?? v,
}));

const MECHANIC_VEHICLE_OPTIONS = [
  { id: 'bike', label: 'Bike / Scooter' },
  { id: 'auto', label: 'Auto Rickshaw' },
  { id: 'car', label: 'Car' },
  { id: 'van', label: 'Van / Mini Van' },
  { id: 'truck', label: 'Truck / Lorry' },
  { id: 'bus', label: 'Bus' },
];

const MECHANIC_ISSUE_OPTIONS = [
  { id: 'flat_tyre', label: 'Flat Tyre / Puncture' },
  { id: 'dead_battery', label: 'Dead Battery / Jump Start' },
  { id: 'engine_failure', label: 'Engine Failure' },
  { id: 'overheating', label: 'Engine Overheating' },
  { id: 'brake_issue', label: 'Brake Issue' },
  { id: 'fuel_empty', label: 'Fuel Empty / Refuel' },
  { id: 'electrical', label: 'Electrical / Wiring Issue' },
  { id: 'other', label: 'Other / General Repair' },
];

// ─── Form state ───────────────────────────────────────────────────────────────

type StringKeys<T> = { [K in keyof T]: T[K] extends string ? K : never }[keyof T];

interface SimpleForm {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  emergencyContact: string;
  email: string;
  aadharCard: string;
  city: string;
  area: string;
  pincode: string;
  // driver-hire specific
  selectedVehicles: string[];
  vehicleBudgets: Record<string, string>;
  driverHireShift: string;
  // vehicle-rental specific
  rentalVehiclePref: string;
  rentalDuration: string;
  vehicleImage: string;
  costPerDay: string;
  // mechanic-hire specific
  mechanicVehicleType: string;
  mechanicIssueType: string;
}

const GENDER_OPTIONS = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
  { id: 'prefer_not_to_say', label: 'Prefer not to say' },
];

const INITIAL_FORM: SimpleForm = {
  firstName: '',
  lastName: '',
  gender: '',
  phone: '',
  emergencyContact: '',
  email: '',
  aadharCard: '',
  city: '',
  area: '',
  pincode: '',
  selectedVehicles: [],
  vehicleBudgets: {},
  driverHireShift: '',
  rentalVehiclePref: '',
  rentalDuration: '',
  vehicleImage: '',
  costPerDay: '',
  mechanicVehicleType: '',
  mechanicIssueType: '',
};

// ─── Section wrapper ──────────────────────────────────────────────────────────

interface SectionProps {
  icon: React.ElementType;
  label: string;
  color: string;
  children: React.ReactNode;
}

const Section = ({ icon: Icon, label, color, children }: SectionProps) => (
  <Box
    sx={{
      border: `1px solid ${color}22`,
      borderLeft: `4px solid ${color}`,
      borderRadius: '14px',
      overflow: 'hidden',
      backgroundColor: 'background.paper',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2.5,
        py: 1.5,
        background: `${color}0d`,
        borderBottom: `1px solid ${color}18`,
      }}
    >
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '8px',
          background: `linear-gradient(135deg, ${color}bb, ${color})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 15, color: '#fff' }} />
      </Box>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.82rem',
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </Typography>
    </Box>
    <Box sx={{ p: 2.5 }}>{children}</Box>
  </Box>
);

// ─── Main component ───────────────────────────────────────────────────────────

const CreateSimpleForm = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const { AdminPath } = constants;
  const { user } = useAuth();
  const [authAction] = useAuthActionMutation();

  const simpleType = (type as SimpleType) in TYPE_CONFIG ? (type as SimpleType) : 'user';
  const config = TYPE_CONFIG[simpleType];
  const { Icon } = config;
  const DRAFT_KEY = `simple_draft_${simpleType}`;

  const [userId] = useState<string>(() => {
    const prefix =
      simpleType === 'user'
        ? 'USER'
        : simpleType === 'driver-hire'
          ? 'DHIRE'
          : simpleType === 'vehicle-rental'
            ? 'VRENT'
            : 'Mhire';
    const storageKey = `customer_uid_${simpleType}`;
    const stored = window.localStorage.getItem(storageKey);
    if (stored && stored.startsWith(prefix)) return stored;
    const id = `${prefix}${String(Math.floor(10000 + Math.random() * 90000))}`;
    window.localStorage.setItem(storageKey, id);
    return id;
  });

  const [form, setForm] = useState<SimpleForm>(() => {
    try {
      const stored = window.localStorage.getItem(DRAFT_KEY);
      if (stored) return { ...INITIAL_FORM, ...JSON.parse(stored) };
    } catch {
      /* ignore */
    }
    return INITIAL_FORM;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const areaOptions = form.city ? (CITY_AREA_MAP[form.city] ?? []) : [];

  // ── Auto-save draft to localStorage ─────────────────────────────────────────
  useEffect(() => {
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form, DRAFT_KEY]);

  // ── Completion progress ──────────────────────────────────────────────────────
  const REQUIRED_FIELDS_BASE = ['firstName', 'lastName', 'phone', 'email', 'city', 'area'];
  const REQUIRED_FIELDS_EXTRA =
    simpleType === 'driver-hire'
      ? ['driverHireShift']
      : simpleType === 'vehicle-rental'
        ? ['rentalVehiclePref', 'rentalDuration', 'costPerDay']
        : simpleType === 'mechanic-hire'
          ? ['mechanicVehicleType', 'mechanicIssueType']
          : [];
  const REQUIRED_FIELDS = [...REQUIRED_FIELDS_BASE, ...REQUIRED_FIELDS_EXTRA];

  const vehicleSelectionFilled =
    simpleType === 'driver-hire' ? (form.selectedVehicles.length > 0 ? 1 : 0) : 0;
  const vehicleSelectionTotal = simpleType === 'driver-hire' ? 1 : 0;

  const filledCount =
    REQUIRED_FIELDS.filter((k) => !!(form as unknown as Record<string, unknown>)[k]).length +
    vehicleSelectionFilled;
  const completionPct = Math.round(
    (filledCount / (REQUIRED_FIELDS.length + vehicleSelectionTotal)) * 100,
  );

  const set = (field: StringKeys<SimpleForm>, value: string) => {
    setForm((p) => {
      let next = { ...p, [field]: value };
      if (field === 'city') next = { ...next, area: '', pincode: '' };
      if (field === 'area') {
        const entry = (CITY_AREA_MAP[p.city] ?? []).find((a) => a.area === value);
        next = { ...next, pincode: entry?.pincode ?? '' };
      }
      return next;
    });
    setErrors((p) => {
      const n = { ...p };
      delete n[field];
      return n;
    });
  };

  const toggleVehicle = (vehicleKey: string, checked: boolean) => {
    setForm((p) => {
      const newVehicles = checked
        ? [...p.selectedVehicles, vehicleKey]
        : p.selectedVehicles.filter((v) => v !== vehicleKey);
      const newBudgets = { ...p.vehicleBudgets };
      if (!checked) delete newBudgets[vehicleKey];
      return { ...p, selectedVehicles: newVehicles, vehicleBudgets: newBudgets };
    });
    setErrors((p) => {
      const n = { ...p };
      delete n['selectedVehicles'];
      return n;
    });
  };

  const setVehicleBudget = (vehicleKey: string, value: string) => {
    setForm((p) => ({
      ...p,
      vehicleBudgets: { ...p.vehicleBudgets, [vehicleKey]: value },
    }));
    setErrors((p) => {
      const n = { ...p };
      delete n[`budget_${vehicleKey}`];
      return n;
    });
  };

  const reqError = useFieldError();
  const touch = (field: string) => setTouched((p) => ({ ...p, [field]: true }));
  const fe = (field: string) => reqError(touched[field], errors[field]);

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (simpleType === 'user' || simpleType === 'mechanic-hire') {
      if (!form.aadharCard.trim()) errs['aadharCard'] = 'Required';
      else if (!/^\d{12}$/.test(form.aadharCard.trim()))
        errs['aadharCard'] = 'Enter valid 12-digit Aadhar number';
    }

    if (!form.firstName.trim()) errs['firstName'] = 'Required';
    if (!form.lastName.trim()) errs['lastName'] = 'Required';
    if (!form.phone.trim()) errs['phone'] = 'Required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s\-+]/g, '')))
      errs['phone'] = 'Enter valid 10-digit mobile number';
    if (!form.email.trim()) errs['email'] = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs['email'] = 'Invalid email';
    if (!form.city) errs['city'] = 'Required';
    if (!form.area) errs['area'] = 'Required';
    if (!form.pincode.trim()) errs['pincode'] = 'Required';
    else if (!/^\d{6}$/.test(form.pincode.trim())) errs['pincode'] = '6-digit pincode required';

    if (simpleType === 'driver-hire') {
      if (form.selectedVehicles.length === 0)
        errs['selectedVehicles'] = 'Select at least one vehicle type';
      form.selectedVehicles.forEach((v) => {
        if (!form.vehicleBudgets[v]?.trim()) errs[`budget_${v}`] = 'Budget per day is required';
      });
      if (!form.driverHireShift) errs['driverHireShift'] = 'Required';
    }

    if (simpleType === 'vehicle-rental') {
      if (!form.rentalVehiclePref) errs['rentalVehiclePref'] = 'Select a vehicle preference';
      if (!form.rentalDuration) errs['rentalDuration'] = 'Required';
      if (!form.costPerDay.trim()) errs['costPerDay'] = 'Required';
      else if (isNaN(Number(form.costPerDay)) || Number(form.costPerDay) <= 0)
        errs['costPerDay'] = 'Enter a valid amount greater than 0';
    }

    if (simpleType === 'mechanic-hire') {
      if (!form.mechanicVehicleType) errs['mechanicVehicleType'] = 'Select a vehicle type';
      if (!form.mechanicIssueType) errs['mechanicIssueType'] = 'Select an issue type';
    }

    setErrors(errs);
    const allFields = Object.keys(INITIAL_FORM).filter(
      (k) => k !== 'selectedVehicles' && k !== 'vehicleBudgets',
    );
    const budgetTouches = form.selectedVehicles.map((v) => [`budget_${v}`, true]);
    setTouched(
      Object.fromEntries([
        ...allFields.map((f) => [f, true]),
        ['selectedVehicles', true],
        ...budgetTouches,
      ]),
    );
    return Object.keys(errs).length === 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validate()) {
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
      const payload: Record<string, unknown> = {
        customerId: userId || null,
        aadharCard:
          simpleType === 'user' || simpleType === 'mechanic-hire'
            ? form.aadharCard.trim() || null
            : undefined,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        gender: form.gender || null,
        phone: form.phone.trim(),
        emergencyContact: form.emergencyContact.trim() || null,
        email: form.email.trim(),
        city: form.city,
        area: form.area,
        pincode: form.pincode.trim(),
        serviceCategory: config.serviceCategory,
        bundleTypes: config.bundleTypes,
        createdByEmail: user?.email || undefined,
        createdByName: user
          ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.name || undefined
          : undefined,
        createdByPhone: user?.phone || undefined,
      };

      if (simpleType === 'driver-hire') {
        payload['selectedVehicles'] = form.selectedVehicles;
        payload['vehicleBudgets'] = form.vehicleBudgets;
        payload['driverHireShift'] = form.driverHireShift;
      }

      if (simpleType === 'vehicle-rental') {
        payload['rentalVehiclePref'] = form.rentalVehiclePref;
        payload['rentalDuration'] = form.rentalDuration;
        payload['vehicleImage'] = form.vehicleImage || null;
        payload['costPerDay'] = form.costPerDay ? Number(form.costPerDay) : null;
      }

      if (simpleType === 'mechanic-hire') {
        payload['mechanicVehicleType'] = form.mechanicVehicleType;
        payload['mechanicIssueType'] = form.mechanicIssueType;
      }

      await authAction({ action: 'create-customer-onboarding', data: payload }).unwrap();

      window.localStorage.removeItem(DRAFT_KEY);
      window.localStorage.removeItem(`customer_uid_${simpleType}`);
      setSnackbar({
        open: true,
        message: `${config.label} customer created successfully!`,
        severity: 'success',
      });
      setTimeout(() => navigate(AdminPath.USER_MANAGEMENT), 1500);
    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to create customer. Please try again.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => navigate(AdminPath.CREATE_CUSTOMER);

  const handleClearDraft = () => {
    window.localStorage.removeItem(DRAFT_KEY);
    window.localStorage.removeItem(`customer_uid_${simpleType}`);
    setForm(INITIAL_FORM);
    setErrors({});
    setTouched({});
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {isSubmitting && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            height: 3,
            '& .MuiLinearProgress-bar': { background: config.gradient },
          }}
        />
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 2.5,
          background: config.gradient,
          boxShadow: config.shadow,
          borderRadius: '16px',
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.01em' }}
          >
            Create {config.label} Customer
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem' }}>
            {config.tagline} — fill in the details below to register
          </Typography>
        </Box>
      </Box>

      {/* ── Personal Information ─────────────────────────────────────────── */}
      <Section icon={PersonOutlineIcon} label='Personal Information' color='#1976d2'>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {userId && (
            <TextField
              label='Customer ID'
              value={userId}
              size='small'
              fullWidth
              disabled
              InputProps={{ readOnly: true }}
              sx={{
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#1976d2',
                  fontWeight: 700,
                },
              }}
            />
          )}
          {(simpleType === 'user' || simpleType === 'mechanic-hire') && (
            <TextField
              label='Aadhar Card Number'
              value={form.aadharCard}
              onChange={(e) => set('aadharCard', e.target.value.replace(/\D/g, ''))}
              onBlur={() => touch('aadharCard')}
              error={Boolean(touched['aadharCard'] && errors['aadharCard'])}
              helperText={fe('aadharCard')}
              required
              size='small'
              fullWidth
              inputProps={{ maxLength: 12 }}
              placeholder='12-digit Aadhar number'
            />
          )}
          <TextField
            label='First Name'
            value={form.firstName}
            onChange={(e) => set('firstName', e.target.value)}
            onBlur={() => touch('firstName')}
            error={Boolean(touched['firstName'] && errors['firstName'])}
            helperText={fe('firstName')}
            required
            size='small'
            fullWidth
          />
          <TextField
            label='Last Name'
            value={form.lastName}
            onChange={(e) => set('lastName', e.target.value)}
            onBlur={() => touch('lastName')}
            error={Boolean(touched['lastName'] && errors['lastName'])}
            helperText={fe('lastName')}
            required
            size='small'
            fullWidth
          />

          <InlineSelect
            label='Gender'
            value={form.gender}
            onChange={(v) => set('gender', v)}
            onBlur={() => touch('gender')}
            options={GENDER_OPTIONS}
          />

          <TextField
            label='Phone Number'
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            onBlur={() => touch('phone')}
            error={Boolean(touched['phone'] && errors['phone'])}
            helperText={fe('phone')}
            required
            size='small'
            fullWidth
            inputProps={{ maxLength: 10 }}
          />
          <TextField
            label='Emergency Contact (optional)'
            value={form.emergencyContact}
            onChange={(e) => set('emergencyContact', e.target.value)}
            size='small'
            fullWidth
            inputProps={{ maxLength: 10 }}
            placeholder='Alternate phone number'
          />
          <TextField
            label='Email Address'
            type='email'
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            onBlur={() => touch('email')}
            error={Boolean(touched['email'] && errors['email'])}
            helperText={fe('email')}
            required
            size='small'
            fullWidth
          />
          <InlineSelect
            label='City'
            value={form.city}
            onChange={(v) => set('city', v)}
            onBlur={() => touch('city')}
            options={CITY_OPTIONS.map((c) => ({ id: c, label: c }))}
            error={Boolean(touched['city'] && errors['city'])}
            helperText={fe('city')}
            required
          />
          <InlineSelect
            label='Area'
            value={form.area}
            onChange={(v) => set('area', v)}
            onBlur={() => touch('area')}
            options={areaOptions.map((a) => ({ id: a.area, label: a.area }))}
            error={Boolean(touched['area'] && errors['area'])}
            helperText={fe('area')}
            disabled={!form.city}
            required
          />
          <TextField
            label='Pincode'
            value={form.pincode}
            onChange={(e) => set('pincode', e.target.value)}
            onBlur={() => touch('pincode')}
            error={Boolean(touched['pincode'] && errors['pincode'])}
            helperText={fe('pincode')}
            required
            size='small'
            fullWidth
            inputProps={{ maxLength: 6 }}
          />
        </Box>
      </Section>

      {/* ── Driver Hire Details ──────────────────────────────────────────── */}
      {simpleType === 'driver-hire' && (
        <Section icon={TuneIcon} label='Driver Hire Details' color='#16a34a'>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Vehicle Type Services */}
            <Box>
              <Typography
                variant='body2'
                sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary', fontSize: '0.85rem' }}
              >
                Select Vehicle Type Services *
              </Typography>

              {/* Mobility Services */}
              <Typography
                variant='caption'
                sx={{
                  fontWeight: 700,
                  color: '#1d4ed8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  display: 'block',
                  mb: 1,
                }}
              >
                Mobility Services
              </Typography>
              <FormGroup>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                    mb: 2,
                  }}
                >
                  {MOBILITY_VEHICLES.map((v) => {
                    const vConf = VEHICLE_CONFIG[v];
                    const isChecked = form.selectedVehicles.includes(v);
                    return (
                      <Box
                        key={v}
                        sx={{
                          border: `1.5px solid ${isChecked ? '#16a34a' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          p: 1.5,
                          transition: 'all 0.2s ease',
                          background: isChecked ? 'rgba(22,163,74,0.05)' : 'transparent',
                          boxShadow: isChecked ? '0 2px 8px rgba(22,163,74,0.12)' : 'none',
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => toggleVehicle(v, e.target.checked)}
                              size='small'
                              sx={{
                                color: '#94a3b8',
                                '&.Mui-checked': { color: '#16a34a' },
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant='body2'
                              sx={{
                                fontWeight: isChecked ? 700 : 500,
                                color: isChecked ? '#15803d' : 'text.primary',
                              }}
                            >
                              {vConf.label}
                            </Typography>
                          }
                          sx={{ m: 0, width: '100%' }}
                        />
                        {isChecked && (
                          <TextField
                            label={`Budget per Day for ${vConf.label} (₹)`}
                            value={form.vehicleBudgets[v] || ''}
                            onChange={(e) => setVehicleBudget(v, e.target.value)}
                            onBlur={() => touch(`budget_${v}`)}
                            size='small'
                            fullWidth
                            required
                            type='number'
                            inputProps={{ min: 0 }}
                            error={Boolean(touched[`budget_${v}`] && errors[`budget_${v}`])}
                            helperText={fe(`budget_${v}`)}
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </FormGroup>

              {/* Logistics Services */}
              <Typography
                variant='caption'
                sx={{
                  fontWeight: 700,
                  color: '#d97706',
                  textTransform: 'uppercase',
                  letterSpacing: '0.6px',
                  display: 'block',
                  mb: 1,
                }}
              >
                Logistics Services
              </Typography>
              <FormGroup>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 1.5,
                  }}
                >
                  {LOGISTICS_VEHICLES.map((v) => {
                    const vConf = VEHICLE_CONFIG[v];
                    const isChecked = form.selectedVehicles.includes(v);
                    return (
                      <Box
                        key={v}
                        sx={{
                          border: `1.5px solid ${isChecked ? '#d97706' : '#e2e8f0'}`,
                          borderRadius: '12px',
                          p: 1.5,
                          transition: 'all 0.2s ease',
                          background: isChecked ? 'rgba(217,119,6,0.05)' : 'transparent',
                          boxShadow: isChecked ? '0 2px 8px rgba(217,119,6,0.12)' : 'none',
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={(e) => toggleVehicle(v, e.target.checked)}
                              size='small'
                              sx={{
                                color: '#94a3b8',
                                '&.Mui-checked': { color: '#d97706' },
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant='body2'
                              sx={{
                                fontWeight: isChecked ? 700 : 500,
                                color: isChecked ? '#92400e' : 'text.primary',
                              }}
                            >
                              {vConf.label}
                            </Typography>
                          }
                          sx={{ m: 0, width: '100%' }}
                        />
                        {isChecked && (
                          <TextField
                            label={`Budget per Day for ${vConf.label} (₹)`}
                            value={form.vehicleBudgets[v] || ''}
                            onChange={(e) => setVehicleBudget(v, e.target.value)}
                            onBlur={() => touch(`budget_${v}`)}
                            size='small'
                            fullWidth
                            required
                            type='number'
                            inputProps={{ min: 0 }}
                            error={Boolean(touched[`budget_${v}`] && errors[`budget_${v}`])}
                            helperText={fe(`budget_${v}`)}
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </FormGroup>

              {touched['selectedVehicles'] && errors['selectedVehicles'] && (
                <FormHelperText error sx={{ mt: 0.5, ml: 0.5 }}>
                  {errors['selectedVehicles']}
                </FormHelperText>
              )}
            </Box>

            {/* Shift Preference */}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
            >
              <InlineSelect
                label='Shift Preference'
                value={form.driverHireShift}
                onChange={(v) => set('driverHireShift', v)}
                onBlur={() => touch('driverHireShift')}
                options={HIRE_SHIFT_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
                error={Boolean(touched['driverHireShift'] && errors['driverHireShift'])}
                helperText={fe('driverHireShift')}
                required
              />
            </Box>
          </Box>
        </Section>
      )}

      {/* ── Vehicle Rental Details ───────────────────────────────────────── */}
      {simpleType === 'vehicle-rental' && (
        <Section icon={TuneIcon} label='Rental Preferences' color='#7c3aed'>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Vehicle image upload + preview */}
            <Box>
              <Typography
                variant='body2'
                sx={{ fontWeight: 700, mb: 1, color: 'text.primary', fontSize: '0.85rem' }}
              >
                Vehicle Photo
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
                {/* Preview box */}
                <Box
                  sx={{
                    width: 120,
                    height: 90,
                    borderRadius: '12px',
                    border: '1.5px dashed #7c3aed55',
                    background: form.vehicleImage ? 'transparent' : 'rgba(124,58,237,0.04)',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {form.vehicleImage ? (
                    <img
                      src={form.vehicleImage}
                      alt='Vehicle preview'
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Typography
                      variant='caption'
                      color='text.disabled'
                      sx={{ textAlign: 'center', px: 1 }}
                    >
                      No image selected
                    </Typography>
                  )}
                </Box>

                {/* Upload button + clear */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <label htmlFor='vehicle-image-upload'>
                    <input
                      id='vehicle-image-upload'
                      type='file'
                      accept='image/*'
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          const result = ev.target?.result;
                          if (typeof result === 'string') set('vehicleImage', result);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <Typography
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 1,
                        borderRadius: '8px',
                        border: '1.5px solid #7c3aed',
                        color: '#7c3aed',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { background: 'rgba(124,58,237,0.06)' },
                      }}
                    >
                      Upload Photo
                    </Typography>
                  </label>
                  {form.vehicleImage && (
                    <Typography
                      onClick={() => set('vehicleImage', '')}
                      sx={{
                        fontSize: '0.75rem',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontWeight: 500,
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      Remove photo
                    </Typography>
                  )}
                  <Typography variant='caption' color='text.disabled'>
                    JPG, PNG, WEBP — max 5 MB
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Preference, Duration, Cost per day */}
            <Box
              sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}
            >
              <InlineSelect
                label='Vehicle Preference'
                value={form.rentalVehiclePref}
                onChange={(v) => set('rentalVehiclePref', v)}
                onBlur={() => touch('rentalVehiclePref')}
                options={VEHICLE_OPTIONS}
                error={Boolean(touched['rentalVehiclePref'] && errors['rentalVehiclePref'])}
                helperText={fe('rentalVehiclePref')}
                required
              />
              <InlineSelect
                label='Rental Duration'
                value={form.rentalDuration}
                onChange={(v) => set('rentalDuration', v)}
                onBlur={() => touch('rentalDuration')}
                options={RENTAL_DURATION_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
                error={Boolean(touched['rentalDuration'] && errors['rentalDuration'])}
                helperText={fe('rentalDuration')}
                required
              />
              <TextField
                label='Cost Per Day (₹)'
                value={form.costPerDay}
                onChange={(e) => set('costPerDay', e.target.value)}
                onBlur={() => touch('costPerDay')}
                error={Boolean(touched['costPerDay'] && errors['costPerDay'])}
                helperText={fe('costPerDay')}
                required
                size='small'
                fullWidth
                type='number'
                inputProps={{ min: 0 }}
                placeholder='e.g. 1500'
              />
            </Box>
          </Box>
        </Section>
      )}

      {/* ── Mechanic Hire Details ────────────────────────────────────────── */}
      {simpleType === 'mechanic-hire' && (
        <Section icon={TuneIcon} label='Breakdown Details' color='#ea580c'>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <InlineSelect
              label='Vehicle Type'
              value={form.mechanicVehicleType}
              onChange={(v) => set('mechanicVehicleType', v)}
              onBlur={() => touch('mechanicVehicleType')}
              options={MECHANIC_VEHICLE_OPTIONS}
              error={Boolean(touched['mechanicVehicleType'] && errors['mechanicVehicleType'])}
              helperText={fe('mechanicVehicleType')}
              required
            />
            <InlineSelect
              label='Issue Type'
              value={form.mechanicIssueType}
              onChange={(v) => set('mechanicIssueType', v)}
              onBlur={() => touch('mechanicIssueType')}
              options={MECHANIC_ISSUE_OPTIONS}
              error={Boolean(touched['mechanicIssueType'] && errors['mechanicIssueType'])}
              helperText={fe('mechanicIssueType')}
              required
            />
          </Box>
        </Section>
      )}

      {/* ── Sticky CTA bar ───────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 20,
          px: 2.5,
          py: 1.75,
          backgroundColor: 'background.paper',
          borderRadius: '14px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1,
          zIndex: 10,
        }}
      >
        {/* Progress indicator */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: { sm: 180 },
            flex: { xs: 1, sm: 'none' },
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: '1rem', color: 'text.disabled', flexShrink: 0 }} />
          <Typography
            sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', flexShrink: 0 }}
          >
            Completion
          </Typography>
          <LinearProgress
            variant='determinate'
            value={completionPct}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              bgcolor: 'action.hover',
              '& .MuiLinearProgress-bar': { bgcolor: 'text.secondary', borderRadius: 3 },
            }}
          />
          <Typography
            sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', flexShrink: 0 }}
          >
            {completionPct}%
          </Typography>
        </Box>

        {/* Action buttons */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1,
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Button
            variant='outlined'
            size='small'
            onClick={handleBack}
            disabled={isSubmitting}
            sx={{
              height: '40px',
              padding: '0 12px',
              fontSize: '0.8125rem',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant='outlined'
            size='small'
            onClick={handleClearDraft}
            disabled={isSubmitting}
            sx={{
              height: '40px',
              padding: '0 12px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Draft
          </Button>
          <Button
            variant='contained'
            size='small'
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{
              height: '40px',
              padding: '0 20px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 140 },
              background: config.gradient,
              boxShadow: config.shadow,
              '&:hover': { background: config.gradient, filter: 'brightness(1.08)' },
              '&:disabled': { opacity: 0.6 },
            }}
          >
            {isSubmitting ? 'Submitting…' : `Submit`}
          </Button>
        </Box>
      </Box>

      {/* ── Snackbar ─────────────────────────────────────────────────────── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateSimpleForm;
