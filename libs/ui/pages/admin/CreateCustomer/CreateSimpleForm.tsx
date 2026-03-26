import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Typography, Alert, Snackbar, LinearProgress } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HailIcon from '@mui/icons-material/Hail';
import CarRentalIcon from '@mui/icons-material/CarRental';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button } from '@bandi/component';
import { useAuth } from '@bandi/hooks';
import { useAuthActionMutation } from '@bandi/services';
import { constants } from '@bandi/utils';

import InlineSelect from './components/InlineSelect';
import {
  CITY_AREA_MAP,
  CITY_OPTIONS,
  MOBILITY_VEHICLES,
  HIRE_SHIFT_OPTIONS,
  RENTAL_DURATION_OPTIONS,
  VEHICLE_CONFIG,
} from './constants/createCustomer.constants';

// ─── Type config ──────────────────────────────────────────────────────────────

type SimpleType = 'user' | 'driver-hire' | 'vehicle-rental';

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
};

const VEHICLE_OPTIONS = MOBILITY_VEHICLES.map((v) => ({
  id: v,
  label: VEHICLE_CONFIG[v]?.label ?? v,
}));

// ─── Form state ───────────────────────────────────────────────────────────────

interface SimpleForm {
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  emergencyContact: string;
  email: string;
  city: string;
  area: string;
  pincode: string;
  // driver-hire specific
  vehicleType: string;
  driverHireCount: string;
  driverHireShift: string;
  driverHireBudget: string;
  // vehicle-rental specific
  rentalVehiclePref: string;
  rentalDuration: string;
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
  city: '',
  area: '',
  pincode: '',
  vehicleType: '',
  driverHireCount: '',
  driverHireShift: '',
  driverHireBudget: '',
  rentalVehiclePref: '',
  rentalDuration: '',
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

  const [userId] = useState<string>(() => {
    const prefix = simpleType === 'user' ? 'USER' : 'MOBIL';
    const storageKey = `customer_uid_${simpleType}`;
    const stored = window.localStorage.getItem(storageKey);
    if (stored) return stored;
    const id = `${prefix}${String(Math.floor(10000 + Math.random() * 90000))}`;
    window.localStorage.setItem(storageKey, id);
    return id;
  });

  const [form, setForm] = useState<SimpleForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const areaOptions = form.city ? (CITY_AREA_MAP[form.city] ?? []) : [];

  const set = (field: keyof SimpleForm, value: string) => {
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

  const touch = (field: string) => setTouched((p) => ({ ...p, [field]: true }));
  const fe = (field: string) => (touched[field] && errors[field] ? errors[field] : undefined);

  // ── Validation ──────────────────────────────────────────────────────────────

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

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
      if (!form.vehicleType) errs['vehicleType'] = 'Select a vehicle type';
      if (!form.driverHireCount.trim()) errs['driverHireCount'] = 'Required';
      if (!form.driverHireShift) errs['driverHireShift'] = 'Required';
    }

    if (simpleType === 'vehicle-rental') {
      if (!form.rentalVehiclePref) errs['rentalVehiclePref'] = 'Select a vehicle preference';
      if (!form.rentalDuration) errs['rentalDuration'] = 'Required';
    }

    setErrors(errs);
    const allFields = Object.keys(INITIAL_FORM);
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
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
        payload['vehicleType'] = form.vehicleType;
        payload['driverHireCount'] = form.driverHireCount;
        payload['driverHireShift'] = form.driverHireShift;
        if (form.driverHireBudget) payload['driverHireBudget'] = form.driverHireBudget;
      }

      if (simpleType === 'vehicle-rental') {
        payload['rentalVehiclePref'] = form.rentalVehiclePref;
        payload['rentalDuration'] = form.rentalDuration;
      }

      await authAction({ action: 'create-customer-onboarding', data: payload }).unwrap();

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
                gridColumn: { xs: '1', sm: '1 / -1' },
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: '#1976d2',
                  fontWeight: 700,
                },
              }}
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
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <InlineSelect
              label='Vehicle Type Required'
              value={form.vehicleType}
              onChange={(v) => set('vehicleType', v)}
              onBlur={() => touch('vehicleType')}
              options={VEHICLE_OPTIONS}
              error={Boolean(touched['vehicleType'] && errors['vehicleType'])}
              helperText={fe('vehicleType')}
              required
            />
            <TextField
              label='Number of Drivers'
              value={form.driverHireCount}
              onChange={(e) => set('driverHireCount', e.target.value)}
              onBlur={() => touch('driverHireCount')}
              error={Boolean(touched['driverHireCount'] && errors['driverHireCount'])}
              helperText={fe('driverHireCount')}
              required
              size='small'
              fullWidth
              type='number'
              inputProps={{ min: 1 }}
            />
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
            <TextField
              label='Budget per Day (₹)'
              value={form.driverHireBudget}
              onChange={(e) => set('driverHireBudget', e.target.value)}
              size='small'
              fullWidth
              type='number'
              inputProps={{ min: 0 }}
            />
          </Box>
        </Section>
      )}

      {/* ── Vehicle Rental Details ───────────────────────────────────────── */}
      {simpleType === 'vehicle-rental' && (
        <Section icon={TuneIcon} label='Rental Preferences' color='#7c3aed'>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
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
          </Box>
        </Section>
      )}

      {/* ── Actions ─────────────────────────────────────────────────────── */}
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
          justifyContent: 'flex-end',
          gap: 1,
          zIndex: 10,
        }}
      >
        <Button
          variant='outlined'
          color='error'
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
          {isSubmitting ? 'Submitting…' : `Create ${config.label}`}
        </Button>
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
