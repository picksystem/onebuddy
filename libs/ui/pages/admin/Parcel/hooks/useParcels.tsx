import React, { useCallback, useEffect, useState } from 'react';
import { Chip, Typography, Button, Stack, Tab, Link } from '@mui/material';
import { Column } from '@bandi/component';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { ParcelRow, ActionType } from '../types/parcel.types';
import { getFilteredData, getTabLists } from '../utils/parcel.utils';

export const useParcels = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [requests, setRequests] = useState<ParcelRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [detailRow, setDetailRow] = useState<ParcelRow | null>(null);
  const [selectedRow, setSelectedRow] = useState<ParcelRow | null>(null);
  const [actionTarget, setActionTarget] = useState<{ row: ParcelRow; type: ActionType } | null>(
    null,
  );
  const [actionNotes, setActionNotes] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await authAction({ action: 'get-parcel-requests' }).unwrap();
      setRequests(result.data || []);
    } catch {
      notify.error('Failed to load parcel requests');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { all, pending, inTransit, delivered, rejected } = getTabLists(requests);
  const tabLists = [all, pending, inTransit, delivered, rejected];

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { row, type } = actionTarget;
    try {
      setActionInProgress(row.id);
      await authAction({
        action: type === 'dispatch' ? 'dispatch-parcel' : 'reject-parcel',
        userId: row.id,
        adminNotes: actionNotes || undefined,
      }).unwrap();
      notify.success(
        type === 'dispatch'
          ? `Parcel dispatched for ${row.name}`
          : `Parcel request from ${row.name} rejected`,
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

  const handleOpenAction = (row: ParcelRow, type: ActionType) => {
    setActionTarget({ row, type });
    setActionNotes('');
  };

  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };

  const statusColor: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
    pending: 'warning',
    in_transit: 'info',
    delivered: 'success',
    rejected: 'error',
  };

  const statusLabel: Record<string, string> = {
    pending: 'Pending',
    in_transit: 'In Transit',
    delivered: 'Delivered',
    rejected: 'Rejected',
  };

  const columns: Column<ParcelRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    {
      id: 'name',
      label: 'Sender',
      minWidth: 160,
      format: (_v: unknown, row: ParcelRow): React.ReactNode => (
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
    { id: 'email', label: 'Email', minWidth: 200, format: (v: unknown) => String(v || '-') },
    {
      id: 'pickupLocation',
      label: 'Pickup',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'dropLocation',
      label: 'Drop',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'parcelType',
      label: 'Type',
      minWidth: 120,
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
            label={statusLabel[s] ?? s.charAt(0).toUpperCase() + s.slice(1)}
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
      format: (_v: unknown, row: ParcelRow): React.ReactNode => {
        if (row.status !== 'pending') return <Typography variant='body2'>—</Typography>;
        const processing = actionInProgress === row.id;
        return (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              size='small'
              startIcon={<RocketLaunchIcon />}
              disabled={processing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'dispatch');
              }}
            >
              Dispatch
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
      <Tab icon={<Inventory2Icon />} iconPosition='start' label={`All (${all.length})`} />
      <Tab
        icon={<PendingActionsIcon />}
        iconPosition='start'
        label={`Pending (${pending.length})`}
      />
      <Tab
        icon={<LocalShippingIcon />}
        iconPosition='start'
        label={`In Transit (${inTransit.length})`}
      />
      <Tab
        icon={<CheckCircleIcon />}
        iconPosition='start'
        label={`Delivered (${delivered.length})`}
      />
      <Tab icon={<CancelIcon />} iconPosition='start' label={`Rejected (${rejected.length})`} />
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
    getFilteredData: (list: ParcelRow[]) => getFilteredData(list, tableSearch),
  };
};
