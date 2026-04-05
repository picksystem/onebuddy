import React, { useEffect, useState, useCallback } from 'react';
import { Column } from '@bandi/component';
import { Chip, Typography, Button, Stack, Tooltip, Tab } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import {
  CustomerApprovalRow,
  ApprovalStatus,
  ApprovalAction,
} from '../../CustomerApprovals/hooks/useCustomerApprovals';

export type { CustomerApprovalRow, ApprovalStatus, ApprovalAction };

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

export type FleetTypeEntry = {
  key: string;
  label: string;
  vehicleTypes: readonly string[];
  serviceCategory?: string;
  color: string;
  Icon: React.ElementType;
  cardCls: string;
};

export const FLEET_TYPES: FleetTypeEntry[] = [
  {
    key: 'bikes',
    label: 'Bikes & Scooters',
    vehicleTypes: ['bike', 'scooter'],
    color: '#7c3aed',
    Icon: TwoWheelerIcon,
    cardCls: 'statCard4',
  },
  {
    key: 'autos',
    label: 'Auto',
    vehicleTypes: ['auto', 'auto_rickshaw'],
    color: '#f59e0b',
    Icon: ElectricRickshawIcon,
    cardCls: 'statCard1',
  },
  {
    key: 'cabs',
    label: 'Cabs',
    vehicleTypes: ['cab', 'hatchback', 'sedan', 'suv'],
    color: '#1d4ed8',
    Icon: DirectionsCarIcon,
    cardCls: 'statCard3',
  },
  {
    key: 'shuttles',
    label: 'Shuttles & Buses',
    vehicleTypes: ['shuttle', 'bus', 'minibus'],
    color: '#059669',
    Icon: DirectionsBusIcon,
    cardCls: 'statCard2',
  },
  {
    key: 'mini-cargo',
    label: 'Mini Cargo',
    vehicleTypes: ['tata_ace', 'mini_truck', 'mini_cargo'],
    color: '#0ea5e9',
    Icon: AirportShuttleIcon,
    cardCls: 'statCard5',
  },
  {
    key: 'medium-goods',
    label: 'Medium Goods',
    vehicleTypes: ['dcm', 'medium_goods', 'pickup'],
    color: '#0f766e',
    Icon: LocalShippingIcon,
    cardCls: 'statCard6',
  },
  {
    key: 'heavy-trucks',
    label: 'Heavy Trucks',
    vehicleTypes: ['lorry', 'heavy_truck', 'trailer'],
    color: '#dc2626',
    Icon: FireTruckIcon,
    cardCls: 'statCard7',
  },
  {
    key: 'parcel',
    label: 'Parcel Delivery',
    vehicleTypes: [],
    serviceCategory: 'parcel',
    color: '#ea580c',
    Icon: Inventory2Icon,
    cardCls: 'statCard7',
  },
];

const MOBILITY_FLEET_KEYS = new Set(['bikes', 'autos', 'cabs', 'shuttles', 'parcel']);
const LOGISTICS_FLEET_KEYS = new Set(['mini-cargo', 'medium-goods', 'heavy-trucks']);

export const ALL_FLEET_VEHICLE_TYPES: string[] = FLEET_TYPES.flatMap((ft) => [...ft.vehicleTypes]);

export const useFleetAccess = (category?: 'mobility' | 'logistics') => {
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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await authAction({ action: 'get-customer-onboardings' })
        .unwrap()
        .catch(() => ({ data: [] }));
      setAllRows(res.data ?? []);
    } catch {
      setAllRows([]);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Visible fleet types based on category
  const visibleFleetTypes: FleetTypeEntry[] =
    category === 'mobility'
      ? FLEET_TYPES.filter((ft) => MOBILITY_FLEET_KEYS.has(ft.key))
      : category === 'logistics'
        ? FLEET_TYPES.filter((ft) => LOGISTICS_FLEET_KEYS.has(ft.key))
        : FLEET_TYPES;

  // All fleet rows (pending or under_review, matching any fleet vehicle or parcel serviceCategory)
  const allFleetRows = allRows.filter(
    (r) =>
      (ALL_FLEET_VEHICLE_TYPES.includes(r.vehicleType?.toLowerCase() ?? '') ||
        (r as unknown as Record<string, unknown>).serviceCategory === 'parcel') &&
      (r.status === 'pending' || r.status === 'under_review'),
  );

  // Filter to category
  const fleetRows =
    category === 'mobility'
      ? allFleetRows.filter((r) => {
          const mobTypes = FLEET_TYPES.filter(
            (ft) => MOBILITY_FLEET_KEYS.has(ft.key) && ft.key !== 'parcel',
          ).flatMap((ft) => [...ft.vehicleTypes]);
          return (
            mobTypes.includes(r.vehicleType?.toLowerCase() ?? '') ||
            (r as unknown as Record<string, unknown>).serviceCategory === 'parcel'
          );
        })
      : category === 'logistics'
        ? allFleetRows.filter((r) => {
            const logTypes = FLEET_TYPES.filter((ft) => LOGISTICS_FLEET_KEYS.has(ft.key)).flatMap(
              (ft) => [...ft.vehicleTypes],
            );
            return logTypes.includes(r.vehicleType?.toLowerCase() ?? '');
          })
        : allFleetRows;

  const pendingFleetRows = fleetRows.filter((r) => r.status === 'pending');

  const rowsForFleetType = useCallback(
    (ft: FleetTypeEntry): CustomerApprovalRow[] => {
      if (ft.serviceCategory) {
        return fleetRows.filter(
          (r) => (r as unknown as Record<string, unknown>).serviceCategory === ft.serviceCategory,
        );
      }
      return fleetRows.filter((r) => ft.vehicleTypes.includes(r.vehicleType?.toLowerCase() ?? ''));
    },
    [fleetRows],
  );

  // tabLists: [all, ...per fleet type, pending]
  const tabLists: CustomerApprovalRow[][] = [
    fleetRows,
    ...visibleFleetTypes.map((ft) => rowsForFleetType(ft)),
    pendingFleetRows,
  ];

  const getFilteredData = (rows: CustomerApprovalRow[]) => {
    if (!tableSearch.trim()) return rows;
    const q = tableSearch.toLowerCase();
    return rows.filter(
      (r) =>
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.vehicleType?.toLowerCase().includes(q) ||
        r.vehicleNumber?.toLowerCase().includes(q) ||
        r.city?.toLowerCase().includes(q),
    );
  };

  // Action handlers
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
      notify.success(`Fleet operator ${label} successfully.`);
      handleCloseAction();
      fetchData();
    } catch {
      notify.error('Action failed. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  // Tabs — All + visible fleet types + Pending
  const tabs = [
    <Tab key='all' icon={<HowToRegIcon />} iconPosition='start' label='All' />,
    ...visibleFleetTypes.map((ft) => (
      <Tab
        key={ft.key}
        icon={<ft.Icon sx={{ fontSize: '1rem' }} />}
        iconPosition='start'
        label={ft.label}
      />
    )),
    <Tab key='pending' icon={<PendingActionsIcon />} iconPosition='start' label='Pending' />,
  ];

  // Columns
  const columns: Column<CustomerApprovalRow>[] = [
    {
      id: 'sno',
      label: '#',
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
      id: 'vehicleType',
      label: 'Vehicle',
      minWidth: 120,
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
                  {row.adminNotes}
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
            <Chip
              icon={<CheckCircleOutlineIcon style={{ fontSize: 13 }} />}
              label='Approved'
              size='small'
              sx={{
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: '#dcfce7',
                color: '#15803d',
                border: 'none',
              }}
            />
          );
        }
        if (row.status === 'rejected') {
          return (
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
          );
        }
        return (
          <Stack direction='row' spacing={0.75} justifyContent='center'>
            <Tooltip title='Approve operator'>
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
            <Tooltip title='Reject operator'>
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
    fleetRows,
    pendingFleetRows,
    visibleFleetTypes,
    rowsForFleetType,
    tabLists,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
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
