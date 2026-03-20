import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { useStyles } from './styles';
import { CustomerOnboardingRow, EditOnboardingFormShape } from '../../types/userManagement.types';

interface EditOnboardingDialogProps {
  open: boolean;
  onClose: () => void;
  selectedOnboarding: CustomerOnboardingRow | null;
  editForm: EditOnboardingFormShape;
  onFormChange: (updater: (prev: EditOnboardingFormShape) => EditOnboardingFormShape) => void;
  isSaving: boolean;
  isDirty: boolean;
  onSave: () => void;
}

const SERVICE_CATEGORIES = ['mobility', 'logistics'];
const VEHICLE_TYPES = ['bike', 'auto', 'cab', 'shuttle', 'tata_ace', 'dcm', 'lorry'];
const COMMERCIAL_VEHICLE_TYPES = ['tata_ace', 'dcm', 'lorry'];
const FUEL_TYPES = ['petrol', 'diesel', 'cng', 'electric'];
const TRIP_PREFS = ['local', 'outstation', 'both', 'local_delivery', 'outstation_delivery'];
const STATUS_OPTIONS = ['pending', 'approved', 'rejected', 'under_review'];
const ID_PROOF_TYPES = ['aadhaar', 'pan'];
const RENTAL_DURATIONS = ['daily', 'weekly', 'monthly'];
const HIRE_SHIFTS = ['day', 'night', 'both'];
const PARCEL_WEIGHTS = ['2kg', '5kg', '10kg', '15kg'];
const PARCEL_RADIUS = ['0.5km', '1km', '1.5km', '2km'];
const HAUL_PREFS = ['short', 'medium', 'long'];
const RATE_PREFS = ['platform_suggested', 'negotiable'];

const fmtLabel = (v: string) =>
  v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const statusColor = (status: string): 'warning' | 'success' | 'error' | 'default' => {
  const map: Record<string, 'warning' | 'success' | 'error' | 'default'> = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
    under_review: 'default',
  };
  return map[status] ?? 'default';
};

const getInitials = (first: string, last: string) =>
  `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase() || '?';

const EditOnboardingDialog = ({
  open,
  onClose,
  selectedOnboarding,
  editForm,
  onFormChange,
  isSaving,
  isDirty,
  onSave,
}: EditOnboardingDialogProps) => {
  const { classes } = useStyles();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) setTouched({});
  }, [open]);

  const errors: Record<string, string> = {};
  if (!editForm.firstName?.trim()) errors.firstName = 'Required';
  if (!editForm.lastName?.trim()) errors.lastName = 'Required';
  if (!editForm.phone?.trim()) errors.phone = 'Required';
  if (!editForm.vehicleNumber?.trim()) errors.vehicleNumber = 'Required';
  if (!editForm.rcNumber?.trim()) errors.rcNumber = 'Required';
  if (!editForm.dlNumber?.trim()) errors.dlNumber = 'Required';

  const touch = (field: string) => setTouched((p) => ({ ...p, [field]: true }));

  const handleSaveClick = () => {
    setTouched({
      firstName: true, lastName: true, phone: true,
      vehicleNumber: true, rcNumber: true, dlNumber: true,
    });
    if (Object.keys(errors).length === 0) onSave();
  };

  // ── Reusable field renderers ───────────────────────────────────────────────
  const field = (
    label: string,
    key: keyof EditOnboardingFormShape,
    opts?: { xs?: number; required?: boolean; multiline?: boolean; rows?: number; placeholder?: string }
  ) => (
    <Grid size={{ xs: opts?.xs ?? 6 }}>
      <TextField
        label={label}
        fullWidth
        size='small'
        required={opts?.required}
        multiline={opts?.multiline}
        minRows={opts?.rows}
        placeholder={opts?.placeholder}
        value={editForm[key] as string}
        onChange={(e) => onFormChange((p) => ({ ...p, [key]: e.target.value }))}
        onBlur={() => opts?.required && touch(String(key))}
        error={opts?.required && !!touched[String(key)] && !!errors[String(key)]}
        helperText={opts?.required && touched[String(key)] ? errors[String(key)] : undefined}
      />
    </Grid>
  );

  const datePicker = (label: string, key: keyof EditOnboardingFormShape, xs?: number) => (
    <Grid size={{ xs: xs ?? 6 }}>
      <DatePicker
        label={label}
        value={editForm[key] ? dayjs(editForm[key] as string) : null}
        onChange={(newValue) =>
          onFormChange((p) => ({ ...p, [key]: newValue ? newValue.format('YYYY-MM-DD') : '' }))
        }
        slotProps={{ textField: { fullWidth: true, size: 'small' } }}
      />
    </Grid>
  );

  const selectField = (
    label: string,
    key: keyof EditOnboardingFormShape,
    options: string[],
    xs?: number
  ) => (
    <Grid size={{ xs: xs ?? 6 }}>
      <FormControl fullWidth size='small'>
        <InputLabel>{label}</InputLabel>
        <Select
          value={editForm[key] as string}
          label={label}
          onChange={(e) => onFormChange((p) => ({ ...p, [key]: e.target.value }))}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {options.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {fmtLabel(opt)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  const isCommercial = COMMERCIAL_VEHICLE_TYPES.includes(editForm.vehicleType);
  const hasBundles = !!editForm.bundleTypes;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      slotProps={{ paper: { className: classes.dialogPaper } }}
    >
      {/* ── Header ── */}
      <Box className={classes.header}>
        <Box className={classes.badgeRow}>
          <EditIcon className={classes.badgeIcon} />
          <Typography variant='caption' fontWeight={700} className={classes.badgeLabel}>
            Edit Onboarding
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Avatar with initials */}
          <Avatar
            sx={{
              width: 56,
              height: 56,
              fontSize: '1.3rem',
              fontWeight: 700,
              bgcolor: 'rgba(255,255,255,0.22)',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.45)',
              flexShrink: 0,
            }}
          >
            {selectedOnboarding
              ? getInitials(selectedOnboarding.firstName, selectedOnboarding.lastName)
              : <DirectionsCarIcon />}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box className={classes.nameRow}>
              <Typography variant='h6' fontWeight={700} className={classes.headerTitle}>
                {selectedOnboarding
                  ? `${selectedOnboarding.firstName} ${selectedOnboarding.lastName}`.trim()
                  : '—'}
              </Typography>
              {isDirty && (
                <Chip label='Unsaved changes' size='small' className={classes.unsavedChip} />
              )}
            </Box>
            <Typography variant='body2' className={classes.headerSub}>
              {selectedOnboarding?.phone}
              {selectedOnboarding?.email ? ` · ${selectedOnboarding.email}` : ''}
            </Typography>
            <Box className={classes.chipRow}>
              {selectedOnboarding?.status && (
                <Chip
                  label={fmtLabel(selectedOnboarding.status)}
                  color={statusColor(selectedOnboarding.status)}
                  size='small'
                  variant='outlined'
                  sx={{ fontWeight: 700, fontSize: '0.68rem' }}
                />
              )}
              {selectedOnboarding?.serviceCategory && (
                <Chip
                  label={fmtLabel(selectedOnboarding.serviceCategory)}
                  color={selectedOnboarding.serviceCategory === 'mobility' ? 'primary' : 'secondary'}
                  size='small'
                  variant='outlined'
                  sx={{ fontSize: '0.68rem' }}
                />
              )}
              {selectedOnboarding?.vehicleType && (
                <Chip
                  label={fmtLabel(selectedOnboarding.vehicleType)}
                  size='small'
                  variant='outlined'
                  sx={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.3)' }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <IconButton size='small' onClick={onClose} className={classes.closeBtn}>
          <CloseIcon fontSize='small' />
        </IconButton>
      </Box>

      {/* ── Body ── */}
      <DialogContent dividers>
        <Grid container spacing={2}>

          {/* ── 1. Personal Info ────────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Typography variant='subtitle2' color='primary' fontWeight={700}>
              Personal Info
            </Typography>
          </Grid>
          {field('First Name', 'firstName', { required: true })}
          {field('Last Name', 'lastName', { required: true })}
          {field('Phone', 'phone', { required: true })}
          {field('Email', 'email')}
          {field('City', 'city')}
          {field('Area / Locality', 'area')}
          {field('Pincode', 'pincode')}

          {/* ── 2. Service & Vehicle ────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Divider />
            <Typography variant='subtitle2' color='primary' fontWeight={700} sx={{ mt: 1 }}>
              Service &amp; Vehicle
            </Typography>
          </Grid>
          {selectField('Service Category', 'serviceCategory', SERVICE_CATEGORIES)}
          {selectField('Vehicle Type', 'vehicleType', VEHICLE_TYPES)}
          {field('Vehicle Sub-Type', 'vehicleSubType', { placeholder: 'e.g. hatchback, sedan…' })}
          {selectField('Fuel Type', 'fuelType', FUEL_TYPES)}
          {selectField('Trip Preference', 'tripPreference', TRIP_PREFS)}
          {field('Vehicle Number', 'vehicleNumber', { required: true })}

          {/* ── 3. Documents ────────────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Divider />
            <Typography variant='subtitle2' color='primary' fontWeight={700} sx={{ mt: 1 }}>
              Documents
            </Typography>
          </Grid>

          {/* RC */}
          {field('RC Number', 'rcNumber', { required: true })}
          {datePicker('RC Expiry', 'rcExpiry')}

          {/* Driving License */}
          {field('Driving License No.', 'dlNumber', { required: true })}
          {datePicker('DL Expiry', 'dlExpiry')}

          {/* Insurance */}
          {field('Insurance No.', 'insuranceNumber')}
          {datePicker('Insurance Expiry', 'insuranceExpiry')}

          {/* PUC */}
          {field('PUC No.', 'pucNumber')}
          {datePicker('PUC Expiry', 'pucExpiry')}

          {/* Fitness & Permit — commercial vehicles only */}
          {isCommercial && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                  Commercial vehicle documents
                </Typography>
              </Grid>
              {field('Fitness Certificate No.', 'fitnessNumber')}
              {datePicker('Fitness Expiry', 'fitnessExpiry')}
              {field('Permit No.', 'permitNumber')}
              {datePicker('Permit Expiry', 'permitExpiry')}
            </>
          )}

          {/* ── 4. Identity Proof ───────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Divider />
            <Typography variant='subtitle2' color='primary' fontWeight={700} sx={{ mt: 1 }}>
              Identity Proof
            </Typography>
          </Grid>
          {selectField('ID Proof Type', 'idProofType', ID_PROOF_TYPES)}
          {field('ID Proof Number', 'idProofNumber')}

          {/* ── 5. Bundle Options ───────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Divider />
            <Typography variant='subtitle2' color='primary' fontWeight={700} sx={{ mt: 1 }}>
              Bundle Options
            </Typography>
          </Grid>
          {field('Bundle Types (JSON)', 'bundleTypes', {
            xs: 8,
            placeholder: '["rental","driver_hire","parcel_combo"]',
          })}
          {field('Bundle Discount (%)', 'bundleDiscount', { xs: 4, placeholder: '0' })}

          {/* Rent & Ride */}
          {(hasBundles || editForm.rentalVehiclePref || editForm.rentalDuration) && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                  Rent &amp; Ride Bundle
                </Typography>
              </Grid>
              {field('Rental Vehicle Pref.', 'rentalVehiclePref')}
              {selectField('Rental Duration', 'rentalDuration', RENTAL_DURATIONS)}
              {field('Rental Pickup Zone', 'rentalPickupZone')}
            </>
          )}

          {/* Driver Hire */}
          {(hasBundles || editForm.driverHireCount || editForm.driverHireShift) && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                  Driver Hire Bundle
                </Typography>
              </Grid>
              {field('Drivers Needed (1–5)', 'driverHireCount', { xs: 4, placeholder: '1' })}
              {selectField('Hire Shift', 'driverHireShift', HIRE_SHIFTS, 4)}
              {field('Budget', 'driverHireBudget', { xs: 4 })}
            </>
          )}

          {/* Parcel Combo */}
          {(hasBundles || editForm.parcelComboTypes || editForm.parcelMaxWeight) && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                  Parcel + Ride Combo Bundle
                </Typography>
              </Grid>
              {field('Parcel Types (JSON)', 'parcelComboTypes', {
                xs: 12,
                placeholder: '["documents","food","general","fragile"]',
              })}
              {selectField('Max Parcel Weight', 'parcelMaxWeight', PARCEL_WEIGHTS)}
              {selectField('Parcel Radius Pref.', 'parcelRadiusPref', PARCEL_RADIUS)}
            </>
          )}

          {/* Cargo Co-Ride — commercial only */}
          {isCommercial && (hasBundles || editForm.cargoCoRideMax || editForm.cargoCoRideHaulPref) && (
            <>
              <Grid size={{ xs: 12 }}>
                <Typography variant='caption' color='text.secondary' sx={{ fontStyle: 'italic' }}>
                  Cargo Co-Ride Bundle
                </Typography>
              </Grid>
              {field('Max Co-Passengers (1–2)', 'cargoCoRideMax', { xs: 4, placeholder: '1' })}
              {selectField('Haul Preference', 'cargoCoRideHaulPref', HAUL_PREFS, 4)}
              {selectField('Rate Preference', 'cargoCoRideRatePref', RATE_PREFS, 4)}
            </>
          )}

          {/* Additional Vehicles */}
          {(hasBundles || editForm.additionalVehicles) && (
            <Grid size={{ xs: 12 }}>
              <TextField
                label='Additional Vehicles (JSON)'
                fullWidth
                size='small'
                multiline
                minRows={2}
                placeholder='[{"vehicleType":"bike","vehicleNumber":"KA01AB1234","fuelType":"petrol"}]'
                value={editForm.additionalVehicles}
                onChange={(e) => onFormChange((p) => ({ ...p, additionalVehicles: e.target.value }))}
              />
            </Grid>
          )}

          {/* ── 6. Platform Access Window ───────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Divider />
            <Typography variant='subtitle2' color='primary' fontWeight={700} sx={{ mt: 1 }}>
              Platform Access Window
            </Typography>
          </Grid>
          {datePicker('Access From Date', 'accessFromDate')}
          {datePicker('Access To Date', 'accessToDate')}

          {/* ── 7. Status & Notes ───────────────────────────────────────── */}
          <Grid size={{ xs: 12 }}>
            <Divider />
            <Typography variant='subtitle2' color='primary' fontWeight={700} sx={{ mt: 1 }}>
              Status &amp; Notes
            </Typography>
          </Grid>
          {selectField('Status', 'status', STATUS_OPTIONS, 6)}
          {field('Admin Notes', 'adminNotes', { xs: 12, multiline: true, rows: 2 })}

        </Grid>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button onClick={onClose} variant='outlined' sx={{ borderRadius: 2 }}>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={handleSaveClick}
          disabled={isSaving || !isDirty}
          sx={{ borderRadius: 2, px: 3 }}
        >
          {isSaving ? 'Saving…' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditOnboardingDialog;
