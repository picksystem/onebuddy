import React, { ReactNode } from 'react';
import { Typography, Dialog, DialogContent, Slide, Chip, IconButton } from '@mui/material';
import type { TransitionProps } from '@mui/material/transitions';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button } from '@bandi/component';
import { useReviewModalStyles } from './styles';
import {
  VEHICLE_CONFIG,
  FUEL_LABELS,
  ID_PROOF_OPTIONS,
  BUNDLE_LABELS,
  VehicleKey,
} from '../../constants/createCustomer.constants';
import type { FormData, CustomerType, TypeConfig } from '../../types/createCustomer.types';

// ─── SlideUp transition ───────────────────────────────────────────────────────

export const SlideUp = React.forwardRef(
  (props: TransitionProps & { children: React.ReactElement }, ref: React.Ref<unknown>) => {
    return <Slide direction='up' ref={ref} {...props} />;
  },
);

// ─── ReviewRow ────────────────────────────────────────────────────────────────

interface ReviewRowProps {
  label: string;
  value: string;
}

export const ReviewRow: React.FC<ReviewRowProps> = ({ label, value }) => {
  const { classes } = useReviewModalStyles();
  if (!value) return null;
  return (
    <Box className={classes.reviewRowRoot}>
      <Typography className={classes.reviewRowLabel}>{label}</Typography>
      <Typography className={classes.reviewRowValue}>{value}</Typography>
    </Box>
  );
};

// ─── ReviewCard ───────────────────────────────────────────────────────────────

interface ReviewField {
  label: string;
  value: string;
  highlight?: boolean;
}

interface ReviewCardProps {
  title: string;
  color: string;
  gradient: string;
  glow: string;
  icon: ReactNode;
  fields: ReviewField[];
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  title,
  color,
  gradient,
  glow,
  icon,
  fields,
}) => {
  const { classes } = useReviewModalStyles();
  const filled = fields.filter((f) => f.value);
  if (!filled.length) return null;

  return (
    <Box className={classes.reviewCardRoot} sx={{ borderColor: `${color}28` }}>
      {/* Card header */}
      <Box
        className={classes.reviewCardHeader}
        sx={{
          background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
          borderColor: `${color}18`,
        }}
      >
        <Box
          className={classes.reviewCardIconBox}
          sx={{ background: gradient, boxShadow: `0 3px 8px ${glow}` }}
        >
          <Box sx={{ color: '#fff', display: 'flex', '& svg': { fontSize: '0.95rem' } }}>
            {icon}
          </Box>
        </Box>
        <Typography sx={{ fontWeight: 700, fontSize: '0.86rem', color, letterSpacing: '-0.01em' }}>
          {title}
        </Typography>
        <Box
          className={classes.reviewCardCountBadge}
          sx={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color }}>
            {filled.length} field{filled.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>

      {/* Fields grid */}
      <Box className={classes.reviewCardGrid}>
        {filled.map((f, i) => (
          <Box
            key={f.label}
            className={classes.reviewCardCell}
            sx={{
              borderBottom: i < filled.length - 1 ? '1px solid' : 'none',
              borderRight: { sm: i % 2 === 0 && i < filled.length - 1 ? '1px solid' : 'none' },
              borderColor: 'divider',
              background: f.highlight ? `${color}06` : 'transparent',
            }}
          >
            <Typography className={classes.reviewFieldLabel}>{f.label}</Typography>
            <Typography
              className={classes.reviewFieldValue}
              sx={{
                fontWeight: f.highlight ? 700 : 500,
                color: f.highlight ? color : 'text.primary',
              }}
            >
              {f.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

// ─── ReviewModal ─────────────────────────────────────────────────────────────

export interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  form: FormData;
  customerType: CustomerType;
  config: TypeConfig;
  isCommercial: boolean;
  vConfig: (typeof VEHICLE_CONFIG)[VehicleKey] | null;
  bundleDiscount: number;
  files: Record<string, File | null>;
  userId: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  form,
  customerType,
  config,
  isCommercial,
  bundleDiscount,
  files,
  userId,
}) => {
  const { classes } = useReviewModalStyles();
  const uploadedCount = Object.values(files).filter(Boolean).length;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={SlideUp}
      fullWidth
      maxWidth='md'
      className={classes.dialog}
    >
      {/* ── Modal Hero ── */}
      <Box className={classes.modalHero} sx={{ background: config.gradient }}>
        <Box className={classes.modalIconBox}>
          <CheckCircleOutlineIcon sx={{ fontSize: 26, color: '#fff' }} />
        </Box>
        <Box className={classes.modalTitleBox}>
          <Typography className={classes.modalTitle}>Review Before Submitting</Typography>
          <Typography className={classes.modalSubtitle}>
            {customerType === 'mobility' ? 'Mobility' : 'Logistics'} customer onboarding — verify
            all details below
          </Typography>
        </Box>
        {/* Stats chips */}
        <Box className={classes.modalStatChips}>
          <Box className={classes.modalStatChip}>
            <CheckCircleIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
              {uploadedCount} doc{uploadedCount !== 1 ? 's' : ''} attached
            </Typography>
          </Box>
          {bundleDiscount > 0 && (
            <Box className={classes.modalStatChip}>
              <AutoAwesomeIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                {bundleDiscount}% bundle discount
              </Typography>
            </Box>
          )}
        </Box>
        <IconButton onClick={onClose} className={classes.modalCloseBtn}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* ── Scrollable content ── */}
      <DialogContent sx={{ p: 3, bgcolor: 'background.default' }}>
        {/* Personal Information */}
        <ReviewCard
          title='Personal Information'
          color='#1976d2'
          gradient='linear-gradient(135deg,#1565c0,#1976d2)'
          glow='rgba(25,118,210,0.3)'
          icon={<PersonOutlineIcon />}
          fields={[
            { label: 'Customer ID', value: userId, highlight: true },
            {
              label: 'Full Name',
              value: `${form.firstName} ${form.lastName}`.trim(),
              highlight: false,
            },
            { label: 'Phone', value: form.phone },
            { label: 'Email', value: form.email },
            { label: 'City', value: form.city },
            { label: 'Area', value: form.area },
            { label: 'Pincode', value: form.pincode },
          ]}
        />

        {/* Vehicle */}
        <ReviewCard
          title='Vehicle Setup'
          color='#7b1fa2'
          gradient='linear-gradient(135deg,#6a1b9a,#8e24aa)'
          glow='rgba(123,31,162,0.3)'
          icon={<DirectionsCarIcon />}
          fields={[
            {
              label: 'Service Type',
              value: customerType.charAt(0).toUpperCase() + customerType.slice(1),
              highlight: true,
            },
            {
              label: 'Vehicle Type',
              value: form.vehicleType
                ? (VEHICLE_CONFIG[form.vehicleType as VehicleKey]?.label ?? '')
                : '',
            },
            { label: 'Sub-type', value: form.vehicleSubType },
            {
              label: 'Fuel',
              value: form.fuelType ? (FUEL_LABELS[form.fuelType] ?? form.fuelType) : '',
            },
            { label: 'Trip Preference', value: form.tripPreference },
            { label: 'Vehicle Number', value: form.vehicleNumber, highlight: true },
          ]}
        />

        {/* Vehicle Documents */}
        <ReviewCard
          title='Vehicle Documents'
          color='#2e7d32'
          gradient='linear-gradient(135deg,#1b5e20,#2e7d32)'
          glow='rgba(46,125,50,0.3)'
          icon={<FolderOpenIcon />}
          fields={[
            { label: 'RC Number', value: form.rc.number, highlight: true },
            { label: 'RC Expiry', value: form.rc.expiry },
            { label: 'Insurance Policy', value: form.insurance.number, highlight: true },
            { label: 'Insurance Expiry', value: form.insurance.expiry },
            { label: 'PUC Number', value: form.puc.number },
            { label: 'PUC Expiry', value: form.puc.expiry },
            ...(isCommercial
              ? [
                  { label: 'Fitness Number', value: form.fitness.number, highlight: true },
                  { label: 'Fitness Expiry', value: form.fitness.expiry },
                  { label: 'Permit Number', value: form.permit.number, highlight: true },
                  { label: 'Permit Expiry', value: form.permit.expiry },
                ]
              : []),
          ]}
        />

        {/* Personal Documents */}
        <ReviewCard
          title='Personal Documents'
          color='#e65100'
          gradient='linear-gradient(135deg,#bf360c,#e65100)'
          glow='rgba(230,81,0,0.3)'
          icon={<ContactPageIcon />}
          fields={[
            { label: 'DL Number', value: form.drivingLicense.number, highlight: true },
            { label: 'DL Expiry', value: form.drivingLicense.expiry },
            {
              label: 'ID Proof Type',
              value:
                ID_PROOF_OPTIONS.find((o) => o.id === form.idProofType)?.label ?? form.idProofType,
            },
            { label: 'ID Number', value: form.idProof.number, highlight: true },
            { label: 'ID Expiry', value: form.idProof.expiry },
          ]}
        />

        {/* Bundles */}
        {form.bundleTypes.length > 0 && (
          <ReviewCard
            title='Bundle Options'
            color='#f59e0b'
            gradient='linear-gradient(135deg,#d97706,#f59e0b)'
            glow='rgba(245,158,11,0.3)'
            icon={<LocalOfferIcon />}
            fields={[
              ...form.bundleTypes.map((bt, i) => ({
                label: `Bundle ${i + 1}`,
                value: BUNDLE_LABELS[bt] ?? bt,
                highlight: true,
              })),
              {
                label: 'Commission Discount',
                value: bundleDiscount > 0 ? `${bundleDiscount}%` : '',
              },
              { label: 'Rental Duration', value: form.rentalDuration },
              { label: 'Driver Shift', value: form.driverHireShift },
              { label: 'Parcel Types', value: form.parcelComboTypes.join(', ') },
            ]}
          />
        )}

        {/* Attachments summary */}
        {uploadedCount > 0 && (
          <Box className={classes.attachmentsRoot}>
            <Box className={classes.attachmentsHeader}>
              <Box className={classes.attachmentsIconBox}>
                <CheckCircleIcon sx={{ fontSize: '0.95rem', color: '#fff' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#2e7d32' }}>
                Attached Documents
              </Typography>
              <Box className={classes.attachmentsCountBadge}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2e7d32' }}>
                  {uploadedCount} file{uploadedCount !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
            <Box className={classes.attachmentsChipsRow}>
              {Object.entries(files)
                .filter(([, f]) => f)
                .map(([key]) => (
                  <Chip
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').trim()}
                    size='small'
                    color='success'
                    variant='outlined'
                    icon={<CheckCircleIcon />}
                    sx={{ fontSize: '0.72rem', textTransform: 'capitalize' }}
                  />
                ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* ── Action bar ── */}
      <Box className={classes.actionBar}>
        <Typography className={classes.actionBarHint}>
          Please review carefully — submitted data will be used for customer onboarding.
        </Typography>
        <Box className={classes.actionBarButtons}>
          <Button
            variant='outlined'
            size='small'
            onClick={onClose}
            disabled={isSubmitting}
            sx={{ height: 40, px: 2.5, fontSize: '0.8125rem', minWidth: 90 }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            size='small'
            onClick={onSubmit}
            disabled={isSubmitting}
            sx={{
              height: 40,
              px: 3,
              fontSize: '0.8125rem',
              fontWeight: 700,
              minWidth: 110,
              background: config.gradient,
              boxShadow: config.shadow,
              '&:hover': { filter: 'brightness(1.08)', background: config.gradient },
              '&:disabled': { opacity: 0.45 },
            }}
          >
            {isSubmitting ? 'Submitting…' : 'Submit'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ReviewModal;
