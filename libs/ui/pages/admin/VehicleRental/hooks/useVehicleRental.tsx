import React, { useCallback, useEffect, useState } from 'react';
import { Chip, Typography, Button, Stack, Tab, Link, Avatar, Box as MuiBox } from '@mui/material';
import { Column } from '@bandi/component';
import CarRentalIcon from '@mui/icons-material/CarRental';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { VehicleRentalRow, ActionType } from '../types/vehicleRental.types';
import { getFilteredData, getTabLists } from '../utils/vehicleRental.utils';

export const useVehicleRental = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [requests, setRequests] = useState<VehicleRentalRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [detailRow, setDetailRow] = useState<VehicleRentalRow | null>(null);
  const [selectedRow, setSelectedRow] = useState<VehicleRentalRow | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    row: VehicleRentalRow;
    type: ActionType;
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await authAction({ action: 'get-vehicle-rental-requests' }).unwrap();
      setRequests(result.data || []);
    } catch {
      notify.error('Failed to load vehicle rental requests');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { all, pending, active, completed } = getTabLists(requests);
  const tabLists = [all, pending, active, completed];

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { row, type } = actionTarget;
    try {
      setActionInProgress(row.id);
      await authAction({
        action: type === 'assign' ? 'assign-vehicle-rental' : 'reject-vehicle-rental',
        userId: row.id,
        adminNotes: actionNotes || undefined,
      }).unwrap();
      notify.success(
        type === 'assign'
          ? `Vehicle assigned for ${row.name}`
          : `Rental request from ${row.name} rejected`,
      );
      setActionTarget(null);
      setActionNotes('');
      fetchRequests();
    } catch {
      notify.error(`Failed to ${type} request. Please try again.`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleOpenAction = (row: VehicleRentalRow, type: ActionType) => {
    setActionTarget({ row, type });
    setActionNotes('');
  };

  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };

  const statusColor: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
    pending: 'warning',
    active: 'info',
    completed: 'success',
    rejected: 'error',
  };

  const columns: Column<VehicleRentalRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    {
      id: 'name',
      label: 'Name',
      minWidth: 160,
      format: (_v: unknown, row: VehicleRentalRow): React.ReactNode => (
        <Link
          component='button'
          variant='body2'
          underline='hover'
          onClick={(e) => {
            e.stopPropagation();
            setDetailRow(row);
          }}
          sx={{ fontWeight: 500, cursor: 'pointer' }}
        >
          {row.name || '-'}
        </Link>
      ),
    },
    { id: 'email', label: 'Email', minWidth: 210, format: (v: unknown) => String(v || '-') },
    {
      id: 'vehicleImage',
      label: 'Photo',
      minWidth: 80,
      align: 'center' as const,
      sortable: false,
      format: (_v: unknown, row: VehicleRentalRow): React.ReactNode => (
        <MuiBox sx={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            src={row.vehicleImage || ''}
            variant='rounded'
            sx={{ width: 52, height: 40, borderRadius: '8px', bgcolor: 'rgba(15,118,110,0.1)' }}
          >
            {!row.vehicleImage && (
              <DirectionsCarIcon sx={{ color: '#0f766e', fontSize: '1.4rem' }} />
            )}
          </Avatar>
        </MuiBox>
      ),
    },
    {
      id: 'vehicleType',
      label: 'Vehicle Type',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'costPerDay',
      label: 'Cost / Day',
      minWidth: 120,
      align: 'center' as const,
      format: (v: unknown): React.ReactNode => {
        const num = Number(v);
        if (!v || isNaN(num)) return <Typography variant='body2'>—</Typography>;
        return (
          <Typography variant='body2' sx={{ fontWeight: 600, color: '#0f766e' }}>
            ₹{num.toLocaleString('en-IN')}
          </Typography>
        );
      },
    },
    { id: 'duration', label: 'Duration', minWidth: 120, format: (v: unknown) => String(v || '-') },
    { id: 'location', label: 'Location', minWidth: 140, format: (v: unknown) => String(v || '-') },
    {
      id: 'startDate',
      label: 'Start Date',
      minWidth: 130,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      format: (v: unknown): React.ReactNode => {
        const s = String(v || '');
        return (
          <Chip
            label={s.charAt(0).toUpperCase() + s.slice(1)}
            color={statusColor[s] ?? 'default'}
            size='small'
          />
        );
      },
    },
    {
      id: 'id',
      label: 'Actions',
      minWidth: 200,
      align: 'center',
      sortable: false,
      format: (_v: unknown, row: VehicleRentalRow): React.ReactNode => {
        if (row.status !== 'pending') return <Typography variant='body2'>—</Typography>;
        const processing = actionInProgress === row.id;
        return (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              size='small'
              startIcon={<AssignmentTurnedInIcon />}
              disabled={processing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'assign');
              }}
            >
              Assign
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={<CancelOutlinedIcon />}
              disabled={processing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'reject');
              }}
            >
              Reject
            </Button>
          </Stack>
        );
      },
    },
  ];

  const tabs = (
    <>
      <Tab icon={<CarRentalIcon />} iconPosition='start' label={`All (${all.length})`} />
      <Tab
        icon={<PendingActionsIcon />}
        iconPosition='start'
        label={`Pending (${pending.length})`}
      />
      <Tab icon={<DirectionsCarIcon />} iconPosition='start' label={`Active (${active.length})`} />
      <Tab
        icon={<CheckCircleIcon />}
        iconPosition='start'
        label={`Completed (${completed.length})`}
      />
    </>
  );

  return {
    isLoading,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabLists,
    columns,
    tabs,
    detailRow,
    setDetailRow,
    selectedRow,
    setSelectedRow,
    actionTarget,
    actionNotes,
    actionInProgress,
    handleConfirmAction,
    handleOpenAction,
    handleCloseAction,
    setActionNotes,
    getFilteredData: (list: VehicleRentalRow[]) => getFilteredData(list, tableSearch),
  };
};
