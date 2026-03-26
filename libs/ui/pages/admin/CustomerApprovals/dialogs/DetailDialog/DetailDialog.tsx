import React from 'react';
import { Typography, Dialog, DialogContent, Chip, IconButton } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SecurityIcon from '@mui/icons-material/Security';
import AirIcon from '@mui/icons-material/Air';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonIcon from '@mui/icons-material/Person';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, Button } from '@bandi/component';
import { useReviewModalStyles } from '@bandi/pages/admin/CreateCustomer/dialogs/ReviewModal/styles';
import {
  ReviewCard,
  SlideUp,
} from '@bandi/pages/admin/CreateCustomer/dialogs/ReviewModal/ReviewModal';
import { CustomerApprovalRow, ApprovalAction } from '../../hooks/useCustomerApprovals';

const BUNDLE_LABELS: Record<string, string> = {
  rental: 'Rent & Ride Bundle',
  driver_hire: 'Driver Hire Bundle',
  multi_vehicle: 'Multi-Vehicle Bundle',
  parcel_combo: 'Parcel + Ride Combo',
  cargo_coride: 'Cargo Co-Ride',
};

// ─── Safe JSON array parser ───────────────────────────────────────────────────

const safeArr = (v: unknown): string[] => {
  if (Array.isArray(v)) return v as string[];
  if (typeof v === 'string' && v.startsWith('[')) {
    try {
      return JSON.parse(v);
    } catch {
      return [];
    }
  }
  return [];
};

// ─── Customer ID generator ────────────────────────────────────────────────────

export const genCustomerId = (row: CustomerApprovalRow): string => {
  const prefix = row.serviceCategory === 'mobility' ? 'MOBIL' : 'LOGST';
  const num = Number(row.id) || 0;
  return `${prefix}${String(num).padStart(5, '0')}`;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmtDate = (v?: string) => {
  if (!v) return '';
  try {
    return new Date(v).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return v;
  }
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#d97706', bg: '#fef3c7' },
  under_review: { label: 'Under Review', color: '#2563eb', bg: '#dbeafe' },
  approved: { label: 'Approved', color: '#16a34a', bg: '#dcfce7' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: '#fee2e2' },
};

// ─── DetailDialog ─────────────────────────────────────────────────────────────

interface DetailDialogProps {
  row: CustomerApprovalRow | null;
  onClose: () => void;
  onOpenAction: (row: CustomerApprovalRow, type: ApprovalAction) => void;
}

const DetailDialog: React.FC<DetailDialogProps> = ({ row, onClose, onOpenAction }) => {
  const { classes } = useReviewModalStyles();

  if (!row) return null;

  const isMobility = row.serviceCategory === 'mobility';
  const heroGradient = isMobility
    ? 'linear-gradient(135deg,#1565c0,#1d4ed8)'
    : 'linear-gradient(135deg,#92400e,#b45309)';
  const statusMeta = STATUS_META[row.status] ?? STATUS_META['pending'];
  const customerId = genCustomerId(row);
  const canAct = row.status === 'pending' || row.status === 'under_review';

  return (
    <Dialog
      open={!!row}
      onClose={onClose}
      TransitionComponent={SlideUp}
      fullWidth
      maxWidth='md'
      className={classes.dialog}
    >
      {/* ── Modal Hero (same as ReviewModal) ── */}
      <Box className={classes.modalHero} sx={{ background: heroGradient }}>
        <Box className={classes.modalIconBox}>
          {isMobility ? (
            <DirectionsBusIcon sx={{ fontSize: 26, color: '#fff' }} />
          ) : (
            <LocalShippingIcon sx={{ fontSize: 26, color: '#fff' }} />
          )}
        </Box>
        <Box className={classes.modalTitleBox}>
          <Typography className={classes.modalTitle}>
            {`${row.firstName} ${row.lastName}`.trim()}
          </Typography>
          <Typography className={classes.modalSubtitle}>
            {isMobility ? 'Mobility' : 'Logistics'} Customer · {customerId}
          </Typography>
        </Box>
        {/* Stat chips */}
        <Box className={classes.modalStatChips}>
          <Box className={classes.modalStatChip}>
            <AssignmentIndIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }} />
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
              {statusMeta.label}
            </Typography>
          </Box>
          {row.submittedAt && (
            <Box className={classes.modalStatChip}>
              <CheckCircleOutlineIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }} />
              <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff' }}>
                {fmtDate(row.submittedAt)}
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
            { label: 'Customer ID', value: customerId, highlight: true },
            { label: 'Full Name', value: `${row.firstName} ${row.lastName}`.trim() },
            { label: 'Phone', value: row.phone ?? '', highlight: true },
            { label: 'Email', value: row.email ?? '' },
            { label: 'City', value: row.city ?? '' },
            { label: 'Area', value: row.area ?? '' },
            { label: 'Pincode', value: row.pincode ?? '' },
            {
              label: 'Submitted By',
              value: row.isSelfRegistered
                ? 'Self-registered'
                : row.createdByName
                  ? `${row.createdByName}${row.createdByEmail ? ` (${row.createdByEmail})` : ''}`
                  : '',
            },
          ]}
        />

        {/* Vehicle Setup */}
        <ReviewCard
          title='Vehicle Setup'
          color='#7b1fa2'
          gradient='linear-gradient(135deg,#6a1b9a,#8e24aa)'
          glow='rgba(123,31,162,0.3)'
          icon={<DirectionsCarIcon />}
          fields={[
            {
              label: 'Service Type',
              value: isMobility ? 'Mobility' : 'Logistics',
              highlight: true,
            },
            { label: 'Vehicle Type', value: row.vehicleType ?? '', highlight: true },
            { label: 'Sub-type', value: row.vehicleSubType ?? '' },
            { label: 'Fuel Type', value: row.fuelType ?? '' },
            { label: 'Trip Preference', value: (row.tripPreference ?? '').replace(/_/g, ' ') },
            { label: 'Vehicle Number', value: row.vehicleNumber ?? '', highlight: true },
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
            { label: 'RC Number', value: row.rcNumber ?? '', highlight: true },
            { label: 'RC Expiry', value: fmtDate(row.rcExpiry) },
            { label: 'Insurance No.', value: row.insuranceNumber ?? '', highlight: true },
            { label: 'Insurance Expiry', value: fmtDate(row.insuranceExpiry) },
            { label: 'PUC Number', value: row.pucNumber ?? '' },
            { label: 'PUC Expiry', value: fmtDate(row.pucExpiry) },
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
            { label: 'DL Number', value: row.dlNumber ?? '', highlight: true },
            { label: 'DL Expiry', value: fmtDate(row.dlExpiry) },
            { label: 'ID Proof Type', value: (row.idProofType ?? '').toUpperCase() },
            { label: 'ID Number', value: row.idProofNumber ?? '', highlight: true },
            ...(row.fitnessNumber
              ? [{ label: 'Fitness No.', value: row.fitnessNumber, highlight: true as const }]
              : []),
            ...(row.fitnessExpiry
              ? [{ label: 'Fitness Expiry', value: fmtDate(row.fitnessExpiry) }]
              : []),
            ...(row.permitNumber
              ? [{ label: 'Permit No.', value: row.permitNumber, highlight: true as const }]
              : []),
            ...(row.permitExpiry
              ? [{ label: 'Permit Expiry', value: fmtDate(row.permitExpiry) }]
              : []),
          ]}
        />

        {/* Created By */}
        <ReviewCard
          title='Registration Details'
          color='#0891b2'
          gradient='linear-gradient(135deg,#0e7490,#0891b2)'
          glow='rgba(8,145,178,0.3)'
          icon={<BadgeIcon />}
          fields={[
            {
              label: 'Registered By',
              value: row.isSelfRegistered ? 'Self-Registered' : 'Admin / Consultant',
              highlight: true,
            },
            {
              label: 'Name',
              value: row.isSelfRegistered
                ? `${row.firstName} ${row.lastName}`.trim()
                : (row.createdByName ?? ''),
            },
            {
              label: 'Email',
              value: row.isSelfRegistered ? (row.email ?? '') : (row.createdByEmail ?? ''),
            },
            ...(row.createdByPhone ? [{ label: 'Phone', value: row.createdByPhone }] : []),
            { label: 'Submitted On', value: fmtDate(row.submittedAt ?? row.createdAt) },
          ]}
        />

        {/* Bundle Options */}
        {safeArr(row.bundleTypes).length > 0 && (
          <ReviewCard
            title='Bundle Options'
            color='#f59e0b'
            gradient='linear-gradient(135deg,#d97706,#f59e0b)'
            glow='rgba(245,158,11,0.3)'
            icon={<LocalOfferIcon />}
            fields={[
              ...safeArr(row.bundleTypes).map((bt, i) => ({
                label: `Bundle ${i + 1}`,
                value: BUNDLE_LABELS[bt] ?? bt,
                highlight: true as const,
              })),
              {
                label: 'Commission Discount',
                value: row.bundleDiscount ? `${row.bundleDiscount}%` : '',
              },
              { label: 'Rental Duration', value: row.rentalDuration ?? '' },
              { label: 'Driver Shift', value: row.driverHireShift ?? '' },
              {
                label: 'Driver Count',
                value: row.driverHireCount ? String(row.driverHireCount) : '',
              },
              { label: 'Parcel Types', value: safeArr(row.parcelComboTypes).join(', ') },
              { label: 'Max Parcel Weight', value: row.parcelMaxWeight ?? '' },
              { label: 'Parcel Radius', value: row.parcelRadiusPref ?? '' },
              { label: 'Co-Ride Max', value: row.cargoCoRideMax ?? '' },
              { label: 'Haul Preference', value: row.cargoCoRideHaulPref ?? '' },
            ].filter((f) => f.value)}
          />
        )}

        {/* Documents on File — card grid */}
        {(() => {
          type DocMeta = {
            label: string;
            icon: React.ReactNode;
            color: string;
            numberKey?: keyof CustomerApprovalRow;
            expiryKey?: keyof CustomerApprovalRow;
          };
          const DOC_META: Record<string, DocMeta> = {
            regFront: { label: 'Registration (Front)', icon: <AssignmentIcon />, color: '#2e7d32' },
            rcFront: {
              label: 'RC (Front)',
              icon: <AssignmentIcon />,
              color: '#2e7d32',
              numberKey: 'rcNumber',
              expiryKey: 'rcExpiry',
            },
            rcBack: {
              label: 'RC (Back)',
              icon: <AssignmentIcon />,
              color: '#2e7d32',
              numberKey: 'rcNumber',
              expiryKey: 'rcExpiry',
            },
            insuranceFront: {
              label: 'Insurance',
              icon: <SecurityIcon />,
              color: '#0891b2',
              numberKey: 'insuranceNumber',
              expiryKey: 'insuranceExpiry',
            },
            pucFront: {
              label: 'PUC Certificate',
              icon: <AirIcon />,
              color: '#16a34a',
              numberKey: 'pucNumber',
              expiryKey: 'pucExpiry',
            },
            fitnessFront: {
              label: 'Fitness Certificate',
              icon: <HealthAndSafetyIcon />,
              color: '#7c3aed',
              numberKey: 'fitnessNumber',
              expiryKey: 'fitnessExpiry',
            },
            permitFront: {
              label: 'Permit',
              icon: <AssignmentTurnedInIcon />,
              color: '#d97706',
              numberKey: 'permitNumber',
              expiryKey: 'permitExpiry',
            },
            photoFront: { label: 'Personal Photo', icon: <PersonIcon />, color: '#0891b2' },
            dlFront: {
              label: 'DL (Front)',
              icon: <DriveEtaIcon />,
              color: '#e65100',
              numberKey: 'dlNumber',
              expiryKey: 'dlExpiry',
            },
            dlBack: {
              label: 'DL (Back)',
              icon: <DriveEtaIcon />,
              color: '#e65100',
              numberKey: 'dlNumber',
              expiryKey: 'dlExpiry',
            },
            idFront: {
              label: 'ID Proof (Front)',
              icon: <FingerprintIcon />,
              color: '#6366f1',
              numberKey: 'idProofNumber',
            },
            idBack: {
              label: 'ID Proof (Back)',
              icon: <FingerprintIcon />,
              color: '#6366f1',
              numberKey: 'idProofNumber',
            },
          };
          const uploadedKeys = safeArr(row.uploadedFiles);
          const docKeys: string[] =
            uploadedKeys.length > 0
              ? uploadedKeys
              : [
                  ...(row.rcNumber ? ['rcFront', 'rcBack'] : []),
                  ...(row.insuranceNumber ? ['insuranceFront'] : []),
                  ...(row.pucNumber ? ['pucFront'] : []),
                  ...(row.fitnessNumber ? ['fitnessFront'] : []),
                  ...(row.permitNumber ? ['permitFront'] : []),
                  ...(row.dlNumber ? ['dlFront', 'dlBack'] : []),
                  ...(row.idProofNumber ? ['idFront', 'idBack'] : []),
                ];
          if (docKeys.length === 0) return null;
          return (
            <Box
              sx={{
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1.5px solid rgba(46,125,50,0.25)',
                mb: 2,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2.5,
                  py: 1.25,
                  background:
                    'linear-gradient(135deg,rgba(46,125,50,0.1) 0%,rgba(46,125,50,0.04) 100%)',
                  borderBottom: '1px solid rgba(46,125,50,0.15)',
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '8px',
                    flexShrink: 0,
                    background: 'linear-gradient(135deg,#1b5e20,#2e7d32)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 3px 8px rgba(46,125,50,0.3)',
                  }}
                >
                  <AttachFileIcon sx={{ fontSize: '0.95rem', color: '#fff' }} />
                </Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#2e7d32' }}>
                  Documents on File
                </Typography>
                <Box
                  sx={{
                    ml: 'auto',
                    px: 1,
                    py: 0.25,
                    borderRadius: '20px',
                    background: 'rgba(46,125,50,0.12)',
                    border: '1px solid rgba(46,125,50,0.25)',
                  }}
                >
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#2e7d32' }}>
                    {docKeys.length} doc{docKeys.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
              {/* Card grid */}
              <Box
                sx={{
                  p: 2,
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: 'repeat(2,1fr)',
                    sm: 'repeat(3,1fr)',
                    md: 'repeat(4,1fr)',
                  },
                  gap: 1.5,
                }}
              >
                {docKeys.map((key) => {
                  const meta: DocMeta = DOC_META[key] ?? {
                    label: key,
                    icon: <DescriptionIcon />,
                    color: '#64748b',
                  };
                  const numVal = meta.numberKey ? row[meta.numberKey] : undefined;
                  const expVal = meta.expiryKey ? row[meta.expiryKey] : undefined;
                  return (
                    <Box
                      key={key}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: '16px 10px 12px',
                        borderRadius: '16px',
                        background: `linear-gradient(145deg,${meta.color}0e 0%,${meta.color}1a 100%)`,
                        border: `1.5px solid ${meta.color}30`,
                        transition: 'all 0.22s ease',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: `0 10px 24px ${meta.color}25`,
                          border: `1.5px solid ${meta.color}55`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '14px',
                          background: `linear-gradient(135deg,${meta.color}22,${meta.color}40)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1.25,
                          boxShadow: `0 4px 14px ${meta.color}30`,
                          color: meta.color,
                          '& svg': { fontSize: '1.5rem' },
                        }}
                      >
                        {meta.icon}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: meta.color,
                          textAlign: 'center',
                          lineHeight: 1.3,
                          mb: 0.4,
                        }}
                      >
                        {meta.label}
                      </Typography>
                      {numVal && (
                        <Typography
                          sx={{ fontSize: '0.6rem', color: '#64748b', textAlign: 'center' }}
                        >
                          {String(numVal)}
                        </Typography>
                      )}
                      {expVal && (
                        <Typography
                          sx={{ fontSize: '0.58rem', color: '#94a3b8', textAlign: 'center' }}
                        >
                          Exp: {fmtDate(String(expVal))}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3, mt: 0.6 }}>
                        <CheckCircleOutlineIcon sx={{ fontSize: '0.68rem', color: meta.color }} />
                        <Typography
                          sx={{ fontSize: '0.58rem', fontWeight: 700, color: meta.color }}
                        >
                          Uploaded
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })()}

        {/* Admin Notes */}
        {row.adminNotes && (
          <Box
            sx={{
              borderRadius: '14px',
              overflow: 'hidden',
              border: '1.5px solid rgba(100,116,139,0.25)',
              mb: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2.5,
                py: 1.25,
                background:
                  'linear-gradient(135deg,rgba(100,116,139,0.1) 0%,rgba(100,116,139,0.04) 100%)',
                borderBottom: '1px solid rgba(100,116,139,0.15)',
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '8px',
                  flexShrink: 0,
                  background: 'linear-gradient(135deg,#475569,#64748b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 8px rgba(100,116,139,0.3)',
                }}
              >
                <AssignmentIndIcon sx={{ fontSize: '0.95rem', color: '#fff' }} />
              </Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.86rem', color: '#475569' }}>
                Admin Notes
              </Typography>
            </Box>
            <Box sx={{ px: 2.5, py: 1.5 }}>
              <Typography sx={{ fontSize: '0.84rem', color: 'text.secondary' }}>
                {row.adminNotes}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* ── Action bar (same layout as ReviewModal) ── */}
      <Box className={classes.actionBar}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={statusMeta.label}
            size='small'
            sx={{
              fontWeight: 700,
              fontSize: '0.72rem',
              bgcolor: statusMeta.bg,
              color: statusMeta.color,
              border: 'none',
            }}
          />
          {row.reviewedAt && (
            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
              {row.status === 'approved' ? 'Approved' : 'Reviewed'} on {fmtDate(row.reviewedAt)}
            </Typography>
          )}
        </Box>
        <Box className={classes.actionBarButtons}>
          <Button
            variant='outlined'
            size='small'
            onClick={onClose}
            sx={{ height: 40, px: 2.5, fontSize: '0.8125rem', minWidth: 90 }}
          >
            Close
          </Button>
          {canAct && (
            <>
              <Button
                variant='outlined'
                color='error'
                size='small'
                onClick={() => {
                  onOpenAction(row, 'reject');
                  onClose();
                }}
                sx={{
                  height: 40,
                  px: 2.5,
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  minWidth: 90,
                }}
              >
                <CancelOutlinedIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                Reject
              </Button>
              <Button
                variant='contained'
                color='success'
                size='small'
                onClick={() => {
                  onOpenAction(row, 'approve');
                  onClose();
                }}
                sx={{
                  height: 40,
                  px: 3,
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  minWidth: 110,
                  background: isMobility
                    ? 'linear-gradient(135deg,#1565c0,#1d4ed8)'
                    : 'linear-gradient(135deg,#92400e,#b45309)',
                  boxShadow: isMobility
                    ? '0 4px 14px rgba(29,78,216,0.35)'
                    : '0 4px 14px rgba(180,83,9,0.35)',
                  '&:hover': {
                    filter: 'brightness(1.08)',
                    background: isMobility
                      ? 'linear-gradient(135deg,#1565c0,#1d4ed8)'
                      : 'linear-gradient(135deg,#92400e,#b45309)',
                  },
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                Approve
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Dialog>
  );
};

export default DetailDialog;
