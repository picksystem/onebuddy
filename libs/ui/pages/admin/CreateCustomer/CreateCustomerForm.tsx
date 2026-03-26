import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Accordion as MuiAccordion,
  AccordionSummary as MuiAccordionSummary,
  AccordionDetails as MuiAccordionDetails,
  TextField,
  TextField as MuiTextField,
  Autocomplete,
  Alert,
  Chip,
  LinearProgress,
  Snackbar,
  IconButton,
  Paper,
  Checkbox,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DescriptionIcon from '@mui/icons-material/Description';
import SecurityIcon from '@mui/icons-material/Security';
import AirIcon from '@mui/icons-material/Air';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PortraitIcon from '@mui/icons-material/Portrait';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CarRentalIcon from '@mui/icons-material/CarRental';
import HailIcon from '@mui/icons-material/Hail';
import GarageIcon from '@mui/icons-material/Garage';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { Box, Button } from '@bandi/component';

import { useStyles } from './styles';
import useCreateCustomerForm from './hooks/useCreateCustomerForm';
import { ReviewModal } from './dialogs/ReviewModal/ReviewModal';
import InlineSelect from './components/InlineSelect';
import UploadField from './components/UploadField';
import DocSection from './components/DocSection';
import {
  SECTION_META,
  VEHICLE_CONFIG,
  FUEL_LABELS,
  MOBILITY_VEHICLES,
  LOGISTICS_VEHICLES,
  RENTAL_DURATION_OPTIONS,
  HIRE_SHIFT_OPTIONS,
  PARCEL_TYPE_OPTIONS,
  PARCEL_WEIGHT_OPTIONS,
  PARCEL_RADIUS_OPTIONS,
  CORIDE_MAX_OPTIONS,
  CORIDE_HAUL_OPTIONS,
  CITY_OPTIONS,
} from './constants/createCustomer.constants';
import type { CustomerType } from './types/createCustomer.types';

// ─── Vehicle Icon ──────────────────────────────────────────────────────────────

const VehicleTypeIcon = ({ type }: { type: string }) => {
  const sx = { fontSize: 22 };
  switch (type) {
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

// ─── wrapSection ──────────────────────────────────────────────────────────────

function wrapSection(
  classes: Record<string, string>,
  index: number,
  children: ReactNode,
  collapsible = false,
) {
  const m = SECTION_META[index];
  const Icon = m.icon;

  const iconBadge = (
    <Box
      className={classes.sectionIconBadge}
      sx={{ background: m.gradient, boxShadow: `0 4px 14px ${m.glow}` }}
    >
      <Icon sx={{ fontSize: 16, color: '#fff' }} />
    </Box>
  );

  const title = (
    <Typography className={classes.sectionCardTitle} sx={{ color: m.color }}>
      {m.label}
    </Typography>
  );

  if (collapsible) {
    return (
      <MuiAccordion
        defaultExpanded={false}
        disableGutters
        sx={{
          borderLeft: `4px solid ${m.color}`,
          borderRadius: '14px !important',
          mb: 2,
          overflow: 'hidden',
          backgroundColor: 'background.paper',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          '&::before': { display: 'none' },
        }}
      >
        <MuiAccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: m.color, fontSize: 20 }} />}
          sx={{
            background: `${m.color}12`,
            borderBottom: '1px solid',
            borderColor: 'divider',
            minHeight: 0,
            px: 2.5,
            py: 0,
            '&.Mui-expanded': { minHeight: 0 },
            '& .MuiAccordionSummary-content': {
              margin: '12px 0',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            },
          }}
        >
          {iconBadge}
          {title}
        </MuiAccordionSummary>
        <MuiAccordionDetails sx={{ p: 0 }}>
          <Box className={classes.sectionCardBody}>{children}</Box>
        </MuiAccordionDetails>
      </MuiAccordion>
    );
  }

  return (
    <Box className={classes.sectionCard} sx={{ borderLeftColor: m.color }}>
      <Box className={classes.sectionCardHeader} sx={{ background: `${m.color}12` }}>
        {iconBadge}
        {title}
      </Box>
      <Box className={classes.sectionCardBody}>{children}</Box>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CreateCustomerForm = () => {
  const { type } = useParams<{ type: string }>();
  const customerType: CustomerType = type === 'logistics' ? 'logistics' : 'mobility';
  const { classes } = useStyles();

  const {
    form,
    errors,
    touched,
    files,
    vConfig,
    isCommercial,
    vehicleList,
    tripOpts,
    areaOptions,
    bundleDiscount,
    completionPct,
    config,
    userId,
    referredBy,
    setReferredBy,
    referralInput,
    setReferralInput,
    employeeList,
    isSubmitting,
    reviewOpen,
    setReviewOpen,
    snackbar,
    setSnackbar,
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
  } = useCreateCustomerForm(customerType);

  const { Icon } = config;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={classes.formRoot}>
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <Box
          className={classes.managementHero}
          sx={{ background: config.gradient, boxShadow: config.shadow, mb: 2.5 }}
        >
          <Box className={classes.managementHeroIcon}>
            <Icon sx={{ fontSize: 30, color: '#fff' }} />
          </Box>
          <Box className={classes.managementHeroText}>
            <Typography className={classes.managementHeroTitle}>
              Create {config.label} Customer
            </Typography>
            <Typography className={classes.managementHeroSub}>
              Complete all sections below to onboard a new {config.label.toLowerCase()} customer
            </Typography>
          </Box>
        </Box>

        {/* ── Created By ────────────────────────────────────────────────────── */}
        <Box className={classes.sectionCard} sx={{ borderLeftColor: '#78909c' }}>
          <Box className={classes.sectionCardHeader} sx={{ background: '#78909c12' }}>
            <Box
              className={classes.sectionIconBadge}
              sx={{
                background: 'linear-gradient(135deg,#546e7a,#78909c)',
                boxShadow: '0 4px 14px rgba(120,144,156,0.22)',
              }}
            >
              <BadgeOutlinedIcon sx={{ fontSize: 16, color: '#fff' }} />
            </Box>
            <Typography className={classes.sectionCardTitle} sx={{ color: '#546e7a' }}>
              Created By
            </Typography>
          </Box>
          <Box className={classes.sectionCardBody}>
            <Box className={classes.formGrid}>
              <TextField
                label='Full Name'
                value={
                  user
                    ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.name || '—'
                    : '—'
                }
                disabled
                fullWidth
                size='small'
              />
              <TextField
                label='Email Address'
                value={user?.email ?? '—'}
                disabled
                fullWidth
                size='small'
              />
              <TextField
                label='Phone Number'
                value={user?.phone ?? '—'}
                disabled
                fullWidth
                size='small'
              />
              <Autocomplete
                options={employeeList}
                getOptionLabel={(opt) => opt.email}
                filterOptions={(opts, { inputValue }) => {
                  const q = inputValue.toLowerCase();
                  return opts.filter(
                    (o) => o.email.toLowerCase().includes(q) || o.name.toLowerCase().includes(q),
                  );
                }}
                value={referredBy}
                onChange={(_, val) => setReferredBy(val)}
                inputValue={referralInput}
                onInputChange={(_, val) => setReferralInput(val)}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label='Reference (optional)'
                    placeholder='Search by name or email…'
                    size='small'
                    fullWidth
                  />
                )}
                renderOption={(props, opt) => (
                  <li {...props} key={opt.email}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', py: 0.25 }}>
                      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                        {opt.name}
                      </Typography>
                      <Typography
                        sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.3 }}
                      >
                        {opt.email}
                      </Typography>
                    </Box>
                  </li>
                )}
                clearOnEscape
                isOptionEqualToValue={(opt, val) => opt.email === val.email}
              />
            </Box>
          </Box>
        </Box>

        {/* ── Section 0: Personal Information ──────────────────────────────── */}
        {wrapSection(
          classes,
          0,
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box className={classes.formGrid}>
              <TextField
                label='Customer ID'
                value={userId}
                disabled
                size='small'
                fullWidth
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: {
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: 'text.primary',
                      bgcolor: 'action.hover',
                    },
                  },
                }}
              />
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
          </Box>,
        )}

        {/* ── Section 1: Vehicle Setup ──────────────────────────────────────── */}
        {wrapSection(
          classes,
          1,
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 26,
                    height: 26,
                    borderRadius: '7px',
                    background: config.gradient,
                    boxShadow: `0 3px 8px ${config.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <DirectionsCarIcon sx={{ fontSize: 14, color: '#fff' }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: config.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                  }}
                >
                  Vehicle Type
                  <span style={{ color: '#d32f2f', marginLeft: 3 }}>*</span>
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 1fr', sm: `repeat(${vehicleList.length}, 1fr)` },
                  gap: 1.5,
                }}
              >
                {vehicleList.map((vk) => {
                  const vc = VEHICLE_CONFIG[vk];
                  const selected = form.vehicleType === vk;
                  return (
                    <Box
                      key={vk}
                      onClick={() => set('vehicleType', vk)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.75,
                        p: 1.5,
                        borderRadius: '12px',
                        border: `2px solid ${selected ? config.color : 'rgba(0,0,0,0.1)'}`,
                        background: selected ? `${config.color}12` : 'background.paper',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease',
                        userSelect: 'none',
                        '&:hover': {
                          border: `2px solid ${config.color}80`,
                          background: `${config.color}08`,
                        },
                      }}
                    >
                      <Box sx={{ color: selected ? config.color : 'text.secondary' }}>
                        <VehicleTypeIcon type={vk} />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.72rem',
                          fontWeight: selected ? 700 : 500,
                          textAlign: 'center',
                          color: selected ? config.color : 'text.primary',
                          lineHeight: 1.3,
                        }}
                      >
                        {vc.label}
                      </Typography>
                      {selected && <CheckCircleIcon sx={{ fontSize: 14, color: config.color }} />}
                    </Box>
                  );
                })}
              </Box>
              {errors['vehicleType'] && (
                <Typography sx={{ fontSize: '0.72rem', color: 'error.main', mt: 0.5 }}>
                  {errors['vehicleType']}
                </Typography>
              )}
            </Box>

            {vConfig && (
              <Box
                sx={{
                  background:
                    'linear-gradient(135deg, rgba(123,31,162,0.05) 0%, rgba(123,31,162,0.02) 100%)',
                  border: '1px solid rgba(123,31,162,0.14)',
                  borderRadius: '12px',
                  p: 2,
                  mt: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#7b1fa2',
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                    mb: 1.5,
                  }}
                >
                  Service Configuration
                </Typography>
                <Box className={classes.formGrid}>
                  {vConfig.subTypes.length > 1 && (
                    <InlineSelect
                      label='Vehicle Sub-type'
                      value={form.vehicleSubType}
                      onChange={(v) => set('vehicleSubType', v)}
                      onBlur={() => touch('vehicleSubType')}
                      options={vConfig.subTypes.map((s) => ({ id: s, label: s }))}
                      error={Boolean(touched['vehicleSubType'] && errors['vehicleSubType'])}
                      helperText={fe('vehicleSubType')}
                      required
                    />
                  )}
                  <InlineSelect
                    label='Fuel Type'
                    value={form.fuelType}
                    onChange={(v) => set('fuelType', v)}
                    onBlur={() => touch('fuelType')}
                    options={vConfig.fuelTypes.map((f) => ({
                      id: String(f),
                      label: FUEL_LABELS[f] ?? String(f),
                    }))}
                    error={Boolean(touched['fuelType'] && errors['fuelType'])}
                    helperText={fe('fuelType')}
                    required
                  />
                  <InlineSelect
                    label='Trip Preference'
                    value={form.tripPreference}
                    onChange={(v) => set('tripPreference', v)}
                    onBlur={() => touch('tripPreference')}
                    options={tripOpts.map((t) => ({ id: t.id, label: t.label }))}
                    error={Boolean(touched['tripPreference'] && errors['tripPreference'])}
                    helperText={fe('tripPreference')}
                    required
                  />
                </Box>
              </Box>
            )}
          </Box>,
        )}

        {/* ── Section 2: Vehicle Documents ─────────────────────────────────── */}
        {wrapSection(
          classes,
          2,
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <DocSection
              label='Registration Details'
              icon={<AssignmentIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#2e7d32'
              required
              filePreviews={[{ label: 'Number Plate', file: files['regFront'] }]}
            >
              <Box className={classes.formGrid}>
                <TextField
                  label='Vehicle Registration Number'
                  value={form.vehicleNumber}
                  onChange={(e) => set('vehicleNumber', e.target.value.toUpperCase())}
                  onBlur={() => touch('vehicleNumber')}
                  error={Boolean(touched['vehicleNumber'] && errors['vehicleNumber'])}
                  helperText={fe('vehicleNumber') || 'e.g. KA01AB1234'}
                  required
                  size='small'
                  fullWidth
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <UploadField
                  label='Number Plate'
                  file={files['regFront']}
                  inputRef={regFrontRef}
                  onFileChange={(f) => setFile('regFront', f)}
                  required
                  error={Boolean(errors['file.regFront'])}
                />
              </Box>
            </DocSection>

            <DocSection
              label='RC (Registration Certificate)'
              icon={<DescriptionIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#2e7d32'
              required
              filePreviews={[
                { label: 'RC Front', file: files['rcFront'] },
                { label: 'RC Back', file: files['rcBack'] },
              ]}
            >
              <Box className={classes.formGrid}>
                <TextField
                  label='RC Number'
                  value={form.rc.number}
                  onChange={(e) => setDoc('rc', 'number', e.target.value.toUpperCase())}
                  onBlur={() => touch('rc.number')}
                  error={Boolean(touched['rc.number'] && errors['rc.number'])}
                  helperText={fe('rc.number')}
                  required
                  size='small'
                  fullWidth
                />
                <DatePicker
                  label='RC Expiry'
                  value={form.rc.expiry ? dayjs(form.rc.expiry) : null}
                  onChange={(v: Dayjs | null) =>
                    setDoc('rc', 'expiry', v ? v.format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      required: true,
                      error: Boolean(touched['rc.expiry'] && errors['rc.expiry']),
                      helperText: fe('rc.expiry') as string,
                      onBlur: () => touch('rc.expiry'),
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                <UploadField
                  label='RC Front'
                  file={files['rcFront']}
                  inputRef={rcFrontRef}
                  onFileChange={(f) => setFile('rcFront', f)}
                  required
                  error={Boolean(errors['file.rcFront'])}
                />
                <UploadField
                  label='RC Back'
                  file={files['rcBack']}
                  inputRef={rcBackRef}
                  onFileChange={(f) => setFile('rcBack', f)}
                  required
                  error={Boolean(errors['file.rcBack'])}
                />
              </Box>
            </DocSection>

            <DocSection
              label='Insurance'
              icon={<SecurityIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#1976d2'
              required
              filePreviews={[{ label: 'Insurance Doc', file: files['insuranceFront'] }]}
            >
              <Box className={classes.formGrid}>
                <TextField
                  label='Policy Number'
                  value={form.insurance.number}
                  onChange={(e) => setDoc('insurance', 'number', e.target.value)}
                  onBlur={() => touch('insurance.number')}
                  error={Boolean(touched['insurance.number'] && errors['insurance.number'])}
                  helperText={fe('insurance.number')}
                  required
                  size='small'
                  fullWidth
                />
                <DatePicker
                  label='Expiry Date'
                  value={form.insurance.expiry ? dayjs(form.insurance.expiry) : null}
                  onChange={(v: Dayjs | null) =>
                    setDoc('insurance', 'expiry', v ? v.format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      required: true,
                      error: Boolean(touched['insurance.expiry'] && errors['insurance.expiry']),
                      helperText: fe('insurance.expiry') as string,
                      onBlur: () => touch('insurance.expiry'),
                    },
                  }}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <UploadField
                  label='Insurance Doc'
                  file={files['insuranceFront']}
                  inputRef={insuranceFrontRef}
                  onFileChange={(f) => setFile('insuranceFront', f)}
                  required
                  error={Boolean(errors['file.insuranceFront'])}
                />
              </Box>
            </DocSection>

            <DocSection
              label='PUC (Pollution Under Control)'
              icon={<AirIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#0e7490'
              filePreviews={[{ label: 'PUC Certificate', file: files['pucFront'] }]}
            >
              <Box className={classes.formGrid}>
                <TextField
                  label='PUC Number'
                  value={form.puc.number}
                  onChange={(e) => setDoc('puc', 'number', e.target.value)}
                  size='small'
                  fullWidth
                />
                <DatePicker
                  label='Expiry Date'
                  value={form.puc.expiry ? dayjs(form.puc.expiry) : null}
                  onChange={(v: Dayjs | null) =>
                    setDoc('puc', 'expiry', v ? v.format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      required: true,
                      error: Boolean(touched['puc.expiry'] && errors['puc.expiry']),
                      helperText: fe('puc.expiry') as string,
                      onBlur: () => touch('puc.expiry'),
                    },
                  }}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <UploadField
                  label='PUC Certificate'
                  file={files['pucFront']}
                  inputRef={pucFrontRef}
                  onFileChange={(f) => setFile('pucFront', f)}
                  error={Boolean(errors['file.pucFront'])}
                />
              </Box>
            </DocSection>

            <DocSection
              label='Fitness Certificate'
              icon={<HealthAndSafetyIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#7b1fa2'
              required
              filePreviews={[{ label: 'Fitness Doc', file: files['fitnessFront'] }]}
            >
              <Box className={classes.formGrid}>
                <TextField
                  label='Fitness Number'
                  value={form.fitness.number}
                  onChange={(e) => setDoc('fitness', 'number', e.target.value)}
                  onBlur={() => touch('fitness.number')}
                  error={Boolean(touched['fitness.number'] && errors['fitness.number'])}
                  helperText={fe('fitness.number')}
                  required
                  size='small'
                  fullWidth
                />
                <DatePicker
                  label='Expiry Date'
                  value={form.fitness.expiry ? dayjs(form.fitness.expiry) : null}
                  onChange={(v: Dayjs | null) =>
                    setDoc('fitness', 'expiry', v ? v.format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      required: true,
                      error: Boolean(touched['fitness.expiry'] && errors['fitness.expiry']),
                      helperText: fe('fitness.expiry') as string,
                      onBlur: () => touch('fitness.expiry'),
                    },
                  }}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <UploadField
                  label='Fitness Doc'
                  file={files['fitnessFront']}
                  inputRef={fitnessFrontRef}
                  onFileChange={(f) => setFile('fitnessFront', f)}
                  required
                  error={Boolean(errors['file.fitnessFront'])}
                />
              </Box>
            </DocSection>

            <DocSection
              label='Commercial Permit'
              icon={<AssignmentTurnedInIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#e65100'
              required
              filePreviews={[{ label: 'Permit Doc', file: files['permitFront'] }]}
            >
              <Box className={classes.formGrid}>
                <TextField
                  label='Permit Number'
                  value={form.permit.number}
                  onChange={(e) => setDoc('permit', 'number', e.target.value)}
                  onBlur={() => touch('permit.number')}
                  error={Boolean(touched['permit.number'] && errors['permit.number'])}
                  helperText={fe('permit.number')}
                  required
                  size='small'
                  fullWidth
                />
                <DatePicker
                  label='Expiry Date'
                  value={form.permit.expiry ? dayjs(form.permit.expiry) : null}
                  onChange={(v: Dayjs | null) =>
                    setDoc('permit', 'expiry', v ? v.format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      required: true,
                      error: Boolean(touched['permit.expiry'] && errors['permit.expiry']),
                      helperText: fe('permit.expiry') as string,
                      onBlur: () => touch('permit.expiry'),
                    },
                  }}
                />
              </Box>
              <Box sx={{ mt: 1 }}>
                <UploadField
                  label='Permit Doc'
                  file={files['permitFront']}
                  inputRef={permitFrontRef}
                  onFileChange={(f) => setFile('permitFront', f)}
                  required
                  error={Boolean(errors['file.permitFront'])}
                />
              </Box>
            </DocSection>
          </Box>,
        )}

        {/* ── Section 3: Personal Documents ────────────────────────────────── */}
        {wrapSection(
          classes,
          3,
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <DocSection
              label='Personal Photo'
              icon={<PortraitIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#0891b2'
              required
              filePreviews={[{ label: 'Photo', file: files['photoFront'] }]}
            >
              <Box sx={{ mt: 1 }}>
                <UploadField
                  label='Personal Photo'
                  file={files['photoFront']}
                  inputRef={photoFrontRef}
                  onFileChange={(f) => setFile('photoFront', f)}
                  required
                  error={Boolean(errors['file.photoFront'])}
                />
              </Box>
            </DocSection>

            <DocSection
              label='Driving License'
              icon={<DriveEtaIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#e65100'
              required
              filePreviews={[
                { label: 'DL Front', file: files['dlFront'] },
                { label: 'DL Back', file: files['dlBack'] },
              ]}
            >
              {vConfig && (
                <Chip
                  label={`DL Category: ${vConfig.dlCategory}`}
                  size='small'
                  sx={{
                    mb: 1.5,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: 'rgba(230,81,0,0.08)',
                    color: '#e65100',
                    border: '1px solid rgba(230,81,0,0.2)',
                  }}
                />
              )}
              <Box className={classes.formGrid}>
                <TextField
                  label='DL Number'
                  value={form.drivingLicense.number}
                  onChange={(e) => setDoc('drivingLicense', 'number', e.target.value.toUpperCase())}
                  onBlur={() => touch('dl.number')}
                  error={Boolean(touched['dl.number'] && errors['dl.number'])}
                  helperText={fe('dl.number')}
                  required
                  size='small'
                  fullWidth
                />
                <DatePicker
                  label='Expiry Date'
                  value={form.drivingLicense.expiry ? dayjs(form.drivingLicense.expiry) : null}
                  onChange={(v: Dayjs | null) =>
                    setDoc('drivingLicense', 'expiry', v ? v.format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      required: true,
                      error: Boolean(touched['dl.expiry'] && errors['dl.expiry']),
                      helperText: fe('dl.expiry') as string,
                      onBlur: () => touch('dl.expiry'),
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                <UploadField
                  label='DL Front'
                  file={files['dlFront']}
                  inputRef={dlFrontRef}
                  onFileChange={(f) => setFile('dlFront', f)}
                  required
                  error={Boolean(errors['file.dlFront'])}
                />
                <UploadField
                  label='DL Back'
                  file={files['dlBack']}
                  inputRef={dlBackRef}
                  onFileChange={(f) => setFile('dlBack', f)}
                  required
                  error={Boolean(errors['file.dlBack'])}
                />
              </Box>
            </DocSection>

            <DocSection
              label='Government ID Proof'
              icon={<FingerprintIcon sx={{ fontSize: 18, color: '#fff' }} />}
              accentColor='#1976d2'
              required
              filePreviews={[
                { label: 'ID Front', file: files['idFront'] },
                { label: 'ID Back', file: files['idBack'] },
              ]}
            >
              <Box className={classes.formGrid}>
                <InlineSelect
                  label='ID Proof Type'
                  value={form.idProofType}
                  onChange={(v) => set('idProofType', v)}
                  onBlur={() => touch('idProofType')}
                  options={[
                    { id: 'aadhaar', label: 'Aadhaar Card' },
                    { id: 'pan', label: 'PAN Card' },
                    { id: 'passport', label: 'Passport' },
                    { id: 'voter_id', label: "Voter's ID" },
                  ]}
                  error={Boolean(touched['idProofType'] && errors['idProofType'])}
                  helperText={fe('idProofType')}
                  required
                />
                <TextField
                  label='ID Number'
                  value={form.idProof.number}
                  onChange={(e) => setDoc('idProof', 'number', e.target.value.toUpperCase())}
                  onBlur={() => touch('idProof.number')}
                  error={Boolean(touched['idProof.number'] && errors['idProof.number'])}
                  helperText={fe('idProof.number')}
                  required
                  size='small'
                  fullWidth
                />
                <DatePicker
                  label='Expiry Date'
                  value={form.idProof.expiry ? dayjs(form.idProof.expiry) : null}
                  onChange={(v: Dayjs | null) =>
                    setDoc('idProof', 'expiry', v ? v.format('YYYY-MM-DD') : '')
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                      required: true,
                      error: Boolean(touched['idProof.expiry'] && errors['idProof.expiry']),
                      helperText: fe('idProof.expiry') as string,
                      onBlur: () => touch('idProof.expiry'),
                    },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                <UploadField
                  label='ID Front'
                  file={files['idFront']}
                  inputRef={idFrontRef}
                  onFileChange={(f) => setFile('idFront', f)}
                  required
                  error={Boolean(errors['file.idFront'])}
                />
                <UploadField
                  label='ID Back'
                  file={files['idBack']}
                  inputRef={idBackRef}
                  onFileChange={(f) => setFile('idBack', f)}
                  required
                  error={Boolean(errors['file.idBack'])}
                />
              </Box>
            </DocSection>
          </Box>,
        )}

        {/* ── Section 4: Bundle Options ─────────────────────────────────────── */}
        {wrapSection(
          classes,
          4,
          <Box>
            <Alert severity='info' sx={{ borderRadius: 2, mb: 2 }}>
              Bundles are <strong>optional</strong>. Select any that apply — they unlock platform
              benefits and commission discounts for the captain.
            </Alert>

            {/* Rent & Ride */}
            <Paper variant='outlined' sx={{ borderRadius: 2, mb: 1.5, overflow: 'hidden' }}>
              <Box className={classes.bundleItemRow}>
                <Checkbox
                  checked={form.bundleTypes.includes('rental')}
                  onChange={() => toggleBundle('rental')}
                  size='small'
                  sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#f59e0b' }, mt: 0.25 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box className={classes.bundleItemHeader}>
                    <CarRentalIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Rent & Ride Bundle
                    </Typography>
                    <Chip
                      label='-10% commission'
                      size='small'
                      color='warning'
                      variant='outlined'
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    Vehicle unavailable? Rent a platform vehicle and keep earning without downtime.
                  </Typography>
                </Box>
              </Box>
              {form.bundleTypes.includes('rental') && (
                <Box className={classes.bundleItemExpanded}>
                  <Box className={classes.formGrid} sx={{ pt: 1.5 }}>
                    <InlineSelect
                      label='Rental Duration'
                      value={form.rentalDuration}
                      onChange={(v) => set('rentalDuration', v)}
                      onBlur={() => touch('rentalDuration')}
                      options={RENTAL_DURATION_OPTIONS.map((o) => ({
                        id: o.id,
                        label: o.label,
                      }))}
                      error={Boolean(touched['rentalDuration'] && errors['rentalDuration'])}
                      helperText={fe('rentalDuration')}
                      required
                    />
                    <TextField
                      label='Vehicle Preference'
                      value={form.rentalVehiclePref}
                      onChange={(e) => set('rentalVehiclePref', e.target.value)}
                      size='small'
                      fullWidth
                      placeholder='e.g. same vehicle type'
                    />
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Driver Hire */}
            <Paper variant='outlined' sx={{ borderRadius: 2, mb: 1.5, overflow: 'hidden' }}>
              <Box className={classes.bundleItemRow}>
                <Checkbox
                  checked={form.bundleTypes.includes('driver_hire')}
                  onChange={() => toggleBundle('driver_hire')}
                  size='small'
                  sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#f59e0b' }, mt: 0.25 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box className={classes.bundleItemHeader}>
                    <HailIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Driver Hire Bundle
                    </Typography>
                    <Chip
                      label='-8% commission'
                      size='small'
                      color='warning'
                      variant='outlined'
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    Own a vehicle but can&apos;t drive? Platform assigns a verified driver to your
                    vehicle.
                  </Typography>
                </Box>
              </Box>
              {form.bundleTypes.includes('driver_hire') && (
                <Box className={classes.bundleItemExpanded}>
                  <Box className={classes.formGrid} sx={{ pt: 1.5 }}>
                    <TextField
                      label='Number of Drivers'
                      value={form.driverHireCount}
                      onChange={(e) => set('driverHireCount', e.target.value)}
                      onBlur={() => touch('driverHireCount')}
                      error={Boolean(touched['driverHireCount'] && errors['driverHireCount'])}
                      helperText={fe('driverHireCount')}
                      required
                      size='small'
                      type='number'
                      inputProps={{ min: 1, max: 5 }}
                      fullWidth
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
                      label='Budget / Day (₹)'
                      value={form.driverHireBudget}
                      onChange={(e) => set('driverHireBudget', e.target.value)}
                      size='small'
                      type='number'
                      inputProps={{ min: 0 }}
                      fullWidth
                    />
                  </Box>
                </Box>
              )}
            </Paper>

            {/* Multi-Vehicle */}
            <Paper variant='outlined' sx={{ borderRadius: 2, mb: 1.5, overflow: 'hidden' }}>
              <Box className={classes.bundleItemRow}>
                <Checkbox
                  checked={form.bundleTypes.includes('multi_vehicle')}
                  onChange={() => toggleBundle('multi_vehicle')}
                  size='small'
                  sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#f59e0b' }, mt: 0.25 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Box className={classes.bundleItemHeader}>
                    <GarageIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                    <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                      Multi-Vehicle Bundle
                    </Typography>
                    <Chip
                      label='-12% commission'
                      size='small'
                      color='success'
                      variant='outlined'
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                    <Chip
                      label='Best Value'
                      size='small'
                      color='success'
                      sx={{ fontSize: '0.65rem', height: 18 }}
                    />
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                    Register multiple vehicles under one profile and switch service types on demand.
                  </Typography>
                </Box>
              </Box>
              {form.bundleTypes.includes('multi_vehicle') && (
                <Box sx={{ px: 2, pb: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
                  {errors['additionalVehicles'] && (
                    <Typography sx={{ fontSize: '0.72rem', color: 'error.main', mb: 1 }}>
                      {errors['additionalVehicles']}
                    </Typography>
                  )}
                  {form.additionalVehicles.map((av, idx) => (
                    <Box
                      key={idx}
                      className={classes.formGrid}
                      sx={{ mb: 1.5, alignItems: 'flex-start' }}
                    >
                      <InlineSelect
                        label='Vehicle Type'
                        value={av.vehicleType}
                        onChange={(v) => updateVehicle(idx, 'vehicleType', v)}
                        options={[...MOBILITY_VEHICLES, ...LOGISTICS_VEHICLES].map((vk) => ({
                          id: vk,
                          label: VEHICLE_CONFIG[vk].label,
                        }))}
                      />
                      <TextField
                        label='Vehicle Number'
                        value={av.vehicleNumber}
                        onChange={(e) =>
                          updateVehicle(idx, 'vehicleNumber', e.target.value.toUpperCase())
                        }
                        size='small'
                        fullWidth
                      />
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                        <InlineSelect
                          label='Fuel Type'
                          value={av.fuelType}
                          onChange={(v) => updateVehicle(idx, 'fuelType', v)}
                          options={Object.entries(FUEL_LABELS).map(([id, label]) => ({
                            id,
                            label,
                          }))}
                        />
                        <IconButton
                          size='small'
                          onClick={() => removeVehicle(idx)}
                          sx={{ color: 'error.main', mt: 0.5 }}
                        >
                          <DeleteOutlineIcon fontSize='small' />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                  <Button
                    variant='outlined'
                    size='small'
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={addVehicle}
                    sx={{ borderRadius: '8px', fontSize: '0.78rem' }}
                  >
                    Add Vehicle
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Parcel Combo — mobility only */}
            {customerType === 'mobility' && (
              <Paper variant='outlined' sx={{ borderRadius: 2, mb: 1.5, overflow: 'hidden' }}>
                <Box className={classes.bundleItemRow}>
                  <Checkbox
                    checked={form.bundleTypes.includes('parcel_combo')}
                    onChange={() => toggleBundle('parcel_combo')}
                    size='small'
                    sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#f59e0b' }, mt: 0.25 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box className={classes.bundleItemHeader}>
                      <Inventory2Icon sx={{ fontSize: 18, color: '#f59e0b' }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        Parcel + Ride Combo
                      </Typography>
                      <Chip
                        label='Earn ₹30–₹150 extra'
                        size='small'
                        color='warning'
                        sx={{ fontSize: '0.65rem', height: 18 }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Deliver a parcel on your way to a passenger drop — earn both fares on the same
                      trip.
                    </Typography>
                  </Box>
                </Box>
                {form.bundleTypes.includes('parcel_combo') && (
                  <Box
                    sx={{ px: 2, pb: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider' }}
                  >
                    <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, mb: 1 }}>
                      Accepted Parcel Types
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {PARCEL_TYPE_OPTIONS.map((pt) => (
                        <Chip
                          key={pt.id}
                          label={pt.label}
                          size='small'
                          variant={form.parcelComboTypes.includes(pt.id) ? 'filled' : 'outlined'}
                          color={form.parcelComboTypes.includes(pt.id) ? 'warning' : 'default'}
                          onClick={() => toggleParcelType(pt.id)}
                          sx={{ cursor: 'pointer', fontSize: '0.72rem' }}
                        />
                      ))}
                    </Box>
                    <Box className={classes.formGrid}>
                      <InlineSelect
                        label='Max Parcel Weight'
                        value={form.parcelMaxWeight}
                        onChange={(v) => set('parcelMaxWeight', v)}
                        options={PARCEL_WEIGHT_OPTIONS.map((o) => ({
                          id: o.id,
                          label: o.label,
                        }))}
                      />
                      <InlineSelect
                        label='Pickup Radius'
                        value={form.parcelRadiusPref}
                        onChange={(v) => set('parcelRadiusPref', v)}
                        options={PARCEL_RADIUS_OPTIONS.map((o) => ({
                          id: o.id,
                          label: o.label,
                        }))}
                      />
                    </Box>
                  </Box>
                )}
              </Paper>
            )}

            {/* Cargo Co-Ride — logistics only */}
            {customerType === 'logistics' && (
              <Paper variant='outlined' sx={{ borderRadius: 2, mb: 1.5, overflow: 'hidden' }}>
                <Box className={classes.bundleItemRow}>
                  <Checkbox
                    checked={form.bundleTypes.includes('cargo_coride')}
                    onChange={() => toggleBundle('cargo_coride')}
                    size='small'
                    sx={{ color: '#f59e0b', '&.Mui-checked': { color: '#f59e0b' }, mt: 0.25 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Box className={classes.bundleItemHeader}>
                      <AirlineSeatReclineNormalIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.88rem' }}>
                        Cargo Co-Ride
                      </Typography>
                      <Chip
                        label='Earn ₹500–₹2,000 extra'
                        size='small'
                        color='info'
                        sx={{ fontSize: '0.65rem', height: 18 }}
                      />
                      <Chip
                        label='New'
                        size='small'
                        color='info'
                        variant='outlined'
                        sx={{ fontSize: '0.65rem', height: 18 }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      Take a co-passenger on your outstation cargo trip and earn from both.
                    </Typography>
                  </Box>
                </Box>
                {form.bundleTypes.includes('cargo_coride') && (
                  <Box sx={{ px: 2, pb: 2, pt: 0, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Box className={classes.formGrid} sx={{ pt: 1.5 }}>
                      <InlineSelect
                        label='Max Co-Passengers'
                        value={form.cargoCoRideMax}
                        onChange={(v) => set('cargoCoRideMax', v)}
                        options={CORIDE_MAX_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
                      />
                      <InlineSelect
                        label='Haul Preference'
                        value={form.cargoCoRideHaulPref}
                        onChange={(v) => set('cargoCoRideHaulPref', v)}
                        options={CORIDE_HAUL_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
                      />
                    </Box>
                  </Box>
                )}
              </Paper>
            )}

            {form.bundleTypes.length > 0 && bundleDiscount > 0 && (
              <Box className={classes.bundleDiscountBadge}>
                <CheckCircleIcon sx={{ fontSize: 18, color: '#f59e0b' }} />
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#d97706' }}>
                  Commission discount: {bundleDiscount}% applied
                </Typography>
              </Box>
            )}
          </Box>,
        )}

        {/* ── Sticky CTA bar ───────────────────────────────────────────────── */}
        <Box className={classes.stickyCtaBar}>
          <Box className={classes.stickyCtaLeft}>
            <AutoAwesomeIcon sx={{ fontSize: '1rem', color: 'text.disabled', flexShrink: 0 }} />
            <Typography
              sx={{ fontSize: '0.82rem', fontWeight: 600, color: 'text.secondary', flexShrink: 0 }}
            >
              Completion
            </Typography>
            <LinearProgress
              variant='determinate'
              value={completionPct}
              className={classes.completionBar}
              sx={{
                bgcolor: 'action.hover',
                '& .MuiLinearProgress-bar': { bgcolor: 'text.secondary' },
              }}
            />
            <Typography
              sx={{ fontSize: '0.82rem', fontWeight: 700, color: 'text.secondary', flexShrink: 0 }}
            >
              {completionPct}%
            </Typography>
          </Box>

          <Box className={classes.stickyCtaRight}>
            <Button
              variant='outlined'
              size='small'
              onClick={handleBack}
              sx={{
                height: '40px',
                padding: '0 12px',
                fontSize: '0.8125rem',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Back
            </Button>
            <Button
              variant='outlined'
              size='small'
              onClick={handleClearDraft}
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
              onClick={handleReview}
              sx={{
                height: '40px',
                padding: '0 16px',
                fontSize: '0.8125rem',
                fontWeight: 700,
                background: config.gradient,
                boxShadow: config.shadow,
                width: { xs: '100%', sm: 'auto' },
                minWidth: { sm: 140 },
                '&:hover': { filter: 'brightness(1.08)', background: config.gradient },
              }}
            >
              Review
            </Button>
          </Box>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            severity={snackbar.severity}
            variant='filled'
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>

      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onSubmit={async () => {
          setReviewOpen(false);
          await handleSubmit();
        }}
        isSubmitting={isSubmitting}
        form={form}
        customerType={customerType}
        config={config}
        isCommercial={isCommercial}
        vConfig={vConfig}
        bundleDiscount={bundleDiscount}
        files={files}
        userId={userId}
      />
    </LocalizationProvider>
  );
};

export default CreateCustomerForm;
