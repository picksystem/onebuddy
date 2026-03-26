import React, { useEffect, useState, useCallback } from 'react';
import { Column } from '@bandi/component';
import { Chip, Typography, Button, Stack, Tooltip, Tab } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { genCustomerId } from '../dialogs/DetailDialog/DetailDialog';

export type ApprovalStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

export interface CustomerApprovalRow {
  id: number | string;
  userId?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  serviceCategory: 'mobility' | 'logistics';
  vehicleType: string;
  vehicleSubType?: string;
  fuelType?: string;
  tripPreference?: string;
  vehicleNumber: string;
  rcNumber?: string;
  rcExpiry?: string;
  insuranceNumber?: string;
  insuranceExpiry?: string;
  pucNumber?: string;
  pucExpiry?: string;
  fitnessNumber?: string;
  fitnessExpiry?: string;
  permitNumber?: string;
  permitExpiry?: string;
  dlNumber?: string;
  dlExpiry?: string;
  idProofType?: string;
  idProofNumber?: string;
  idProofExpiry?: string;
  city: string;
  area?: string;
  pincode?: string;
  status: ApprovalStatus;
  adminNotes?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  createdByName?: string;
  createdByEmail?: string;
  createdByPhone?: string;
  isSelfRegistered?: boolean;
  reviewedAt?: string;
  // Bundle fields
  bundleTypes?: string[];
  bundleDiscount?: number;
  rentalDuration?: string;
  rentalVehiclePref?: string;
  driverHireCount?: string;
  driverHireShift?: string;
  driverHireBudget?: string;
  additionalVehicles?: Array<{ vehicleType: string; vehicleNumber: string; fuelType: string }>;
  parcelComboTypes?: string[];
  parcelMaxWeight?: string;
  parcelRadiusPref?: string;
  cargoCoRideMax?: string;
  cargoCoRideHaulPref?: string;
  uploadedFiles?: string[];
}

export type ApprovalAction = 'approve' | 'reject' | 'review';

const STATUS_META: Record<ApprovalStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#d97706', bg: '#fef3c7' },
  under_review: { label: 'Under Review', color: '#2563eb', bg: '#dbeafe' },
  approved: { label: 'Approved', color: '#16a34a', bg: '#dcfce7' },
  rejected: { label: 'Rejected', color: '#dc2626', bg: '#fee2e2' },
};

const fmtDate = (v: unknown) => {
  if (!v) return '—';
  try {
    return new Date(String(v)).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return String(v);
  }
};

export const useCustomerApprovals = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [allRows, setAllRows] = useState<CustomerApprovalRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [detailRow, setDetailRow] = useState<CustomerApprovalRow | null>(null);
  const [actionInProgress, setActionInProgress] = useState<number | string | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    row: CustomerApprovalRow;
    type: ApprovalAction;
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const fetchApprovals = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await authAction({ action: 'get-customer-onboardings' }).unwrap();
      const parseJsonField = (v: unknown): unknown => {
        if (typeof v === 'string') {
          try {
            return JSON.parse(v);
          } catch {
            return v;
          }
        }
        return v;
      };
      const rows = (res.data ?? []).map((r: CustomerApprovalRow) => ({
        ...r,
        bundleTypes: parseJsonField(r.bundleTypes) as string[] | undefined,
        additionalVehicles: parseJsonField(
          r.additionalVehicles,
        ) as CustomerApprovalRow['additionalVehicles'],
        parcelComboTypes: parseJsonField(r.parcelComboTypes) as string[] | undefined,
        uploadedFiles: parseJsonField(r.uploadedFiles) as string[] | undefined,
      }));
      setAllRows(rows);
    } catch {
      setAllRows([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  // ── Tab lists ──────────────────────────────────────────────────────────────

  // Customer Requests only shows pending / under_review — approved/rejected move to Customer Management
  const activeRows = allRows.filter((r) => r.status === 'pending' || r.status === 'under_review');
  const pendingRows = activeRows.filter((r) => r.status === 'pending');
  const mobilityRows = activeRows.filter((r) => r.serviceCategory === 'mobility');
  const logisticsRows = activeRows.filter((r) => r.serviceCategory === 'logistics');
  const underReviewRows = activeRows.filter((r) => r.status === 'under_review');
  const tabLists = [activeRows, mobilityRows, logisticsRows, pendingRows];

  // ── Search ─────────────────────────────────────────────────────────────────

  const getFilteredData = (rows: CustomerApprovalRow[]) => {
    const result = !tableSearch.trim()
      ? rows
      : (() => {
          const q = tableSearch.toLowerCase();
          return rows.filter(
            (r) =>
              genCustomerId(r).toLowerCase().includes(q) ||
              `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
              r.email?.toLowerCase().includes(q) ||
              r.phone?.includes(q) ||
              r.vehicleType?.toLowerCase().includes(q) ||
              r.vehicleNumber?.toLowerCase().includes(q) ||
              r.rcNumber?.toLowerCase().includes(q) ||
              r.dlNumber?.toLowerCase().includes(q) ||
              r.city?.toLowerCase().includes(q),
          );
        })();
    return result;
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const needsActionCount = pendingRows.length;
  const mobilityActiveCount = mobilityRows.length;
  const logisticsActiveCount = logisticsRows.length;

  // ── Action handlers ────────────────────────────────────────────────────────

  const handleOpenAction = (row: CustomerApprovalRow, type: ApprovalAction) => {
    setActionTarget({ row, type });
    setActionNotes('');
  };

  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    setActionInProgress(actionTarget.row.id);
    try {
      const newStatus =
        actionTarget.type === 'approve'
          ? 'approved'
          : actionTarget.type === 'reject'
            ? 'rejected'
            : 'under_review';

      await authAction({
        action: 'update-customer-onboarding',
        onboardingId: actionTarget.row.id,
        data: { status: newStatus, adminNotes: actionNotes || undefined },
      }).unwrap();

      const label =
        actionTarget.type === 'approve'
          ? 'approved'
          : actionTarget.type === 'reject'
            ? 'rejected'
            : 'moved to under review';
      notify.success(`Customer ${label} successfully.`);
      handleCloseAction();
      fetchApprovals();
    } catch {
      notify.error('Action failed. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  // ── Tabs ───────────────────────────────────────────────────────────────────

  const tabs = [
    <Tab key={0} icon={<HowToRegIcon />} iconPosition='start' label='All Customers' />,
    <Tab key={1} icon={<DirectionsBusIcon />} iconPosition='start' label='Mobility' />,
    <Tab key={2} icon={<LocalShippingIcon />} iconPosition='start' label='Logistics' />,
    <Tab key={3} icon={<PendingActionsIcon />} iconPosition='start' label='Pending' />,
  ];

  // ── Columns ────────────────────────────────────────────────────────────────

  const columns: Column<CustomerApprovalRow>[] = [
    {
      id: 'sno',
      label: 'S.No',
      minWidth: 42,
      align: 'center',
      sortable: false,
      format: (_v: unknown, _r: CustomerApprovalRow, i?: number) => (
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>
          {(i ?? 0) + 1}
        </Typography>
      ),
    },
    {
      id: 'firstName',
      label: 'Name',
      minWidth: 130,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Typography
          component='span'
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setDetailRow(row);
          }}
          sx={{
            fontWeight: 700,
            fontSize: '0.84rem',
            cursor: 'pointer',
            color: '#1d4ed8',
            textDecoration: 'underline',
            textDecorationColor: 'rgba(29,78,216,0.35)',
            textUnderlineOffset: '3px',
            '&:hover': { color: '#1e40af' },
          }}
        >
          {`${row.firstName} ${row.lastName}`.trim() || '—'}
        </Typography>
      ),
    },
    {
      id: 'phone',
      label: 'Phone',
      minWidth: 110,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Typography sx={{ fontSize: '0.82rem', color: '#1e293b' }}>{row.phone || '—'}</Typography>
      ),
    },
    {
      id: 'email',
      label: 'Mail',
      minWidth: 160,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Typography sx={{ fontSize: '0.82rem', color: '#1e293b' }}>{row.email || '—'}</Typography>
      ),
    },
    {
      id: 'serviceCategory',
      label: 'Service',
      minWidth: 88,
      format: (v: unknown) => {
        const isMobility = v === 'mobility';
        return (
          <Chip
            icon={
              isMobility ? (
                <DirectionsBusIcon style={{ fontSize: 12 }} />
              ) : (
                <LocalShippingIcon style={{ fontSize: 12 }} />
              )
            }
            label={isMobility ? 'Mobility' : 'Logistics'}
            size='small'
            sx={{
              fontSize: '0.69rem',
              fontWeight: 700,
              height: 20,
              width: 'fit-content',
              bgcolor: isMobility ? '#ede9fe' : '#fef3c7',
              color: isMobility ? '#6d28d9' : '#92400e',
              border: 'none',
            }}
          />
        );
      },
    },
    {
      id: 'vehicleType',
      label: 'Vehicle',
      minWidth: 110,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Stack spacing={0.15}>
          <Typography
            sx={{
              fontSize: '0.82rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              color: '#1e293b',
            }}
          >
            {row.vehicleType || '—'}
          </Typography>
          <Typography
            sx={{ fontSize: '0.74rem', fontFamily: 'monospace', fontWeight: 700, color: '#1d4ed8' }}
          >
            {row.vehicleNumber || ''}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'city',
      label: 'Location',
      minWidth: 90,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Stack spacing={0.1}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
            {row.city || '—'}
          </Typography>
          {row.area && (
            <Typography sx={{ fontSize: '0.71rem', color: '#64748b' }}>{row.area}</Typography>
          )}
        </Stack>
      ),
    },
    {
      id: 'createdByName',
      label: 'Submitted',
      minWidth: 100,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Stack spacing={0.1}>
          <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
            {row.isSelfRegistered ? 'Self' : row.createdByName || '—'}
          </Typography>
          <Typography sx={{ fontSize: '0.69rem', color: '#94a3b8' }}>
            {fmtDate(row.submittedAt || row.createdAt)}
          </Typography>
        </Stack>
      ),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 102,
      align: 'center',
      format: (_v: unknown, row: CustomerApprovalRow) => {
        const s = row.status ?? 'pending';
        const meta = STATUS_META[s] ?? STATUS_META['pending'];
        return (
          <Stack spacing={0.4} alignItems='center'>
            <Chip
              label={meta.label}
              size='small'
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                bgcolor: meta.bg,
                color: meta.color,
                border: 'none',
              }}
            />
            {row.adminNotes && (
              <Tooltip title={row.adminNotes} arrow>
                <Typography
                  sx={{
                    fontSize: '0.68rem',
                    color: 'text.disabled',
                    cursor: 'help',
                    maxWidth: 100,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📝 {row.adminNotes}
                </Typography>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
    {
      id: 'vehicleNumber',
      label: 'Actions',
      minWidth: 160,
      align: 'center',
      sortable: false,
      format: (_v: unknown, row: CustomerApprovalRow) => {
        const isProcessing = actionInProgress === row.id;

        if (row.status === 'approved') {
          return (
            <Stack spacing={0.3} alignItems='center'>
              <Chip
                icon={<CheckCircleOutlineIcon style={{ fontSize: 13 }} />}
                label='Active Customer'
                size='small'
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  bgcolor: '#dcfce7',
                  color: '#15803d',
                  border: 'none',
                }}
              />
              {row.reviewedAt && (
                <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
                  Since {fmtDate(row.reviewedAt)}
                </Typography>
              )}
            </Stack>
          );
        }

        if (row.status === 'rejected') {
          return (
            <Stack spacing={0.3} alignItems='center'>
              <Chip
                icon={<CancelOutlinedIcon style={{ fontSize: 13 }} />}
                label='Rejected'
                size='small'
                sx={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  bgcolor: '#fee2e2',
                  color: '#dc2626',
                  border: 'none',
                }}
              />
              {row.reviewedAt && (
                <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled' }}>
                  On {fmtDate(row.reviewedAt)}
                </Typography>
              )}
            </Stack>
          );
        }

        return (
          <Stack direction='row' spacing={0.75} justifyContent='center'>
            <Tooltip title='Approve customer'>
              <Button
                size='small'
                variant='contained'
                color='success'
                disabled={isProcessing}
                onClick={() => handleOpenAction(row, 'approve')}
                startIcon={<CheckCircleOutlineIcon sx={{ fontSize: '0.9rem !important' }} />}
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  minWidth: 0,
                  px: 1,
                }}
              >
                Approve
              </Button>
            </Tooltip>
            <Tooltip title='Reject customer'>
              <Button
                size='small'
                variant='outlined'
                color='error'
                disabled={isProcessing}
                onClick={() => handleOpenAction(row, 'reject')}
                startIcon={<CancelOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  minWidth: 0,
                  px: 1,
                }}
              >
                Reject
              </Button>
            </Tooltip>
          </Stack>
        );
      },
    },
  ];

  return {
    isLoading,
    allRows,
    activeRows,
    needsActionCount,
    mobilityActiveCount,
    logisticsActiveCount,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabLists,
    tabs,
    columns,
    detailRow,
    setDetailRow,
    actionTarget,
    actionNotes,
    setActionNotes,
    actionInProgress,
    handleOpenAction,
    handleCloseAction,
    handleConfirmAction,
    getFilteredData,
  };
};
