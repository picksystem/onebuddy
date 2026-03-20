import React, { useCallback, useEffect, useState } from 'react';
import { Chip, Typography, Button, Stack, Tab, Link } from '@mui/material';
import { Column } from '@bandi/component';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { LogisticsRow, ActionType } from '../types/logistics.types';
import { getFilteredData, getTabLists } from '../utils/logistics.utils';

export const useLogistics = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [shipments, setShipments] = useState<LogisticsRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [detailRow, setDetailRow] = useState<LogisticsRow | null>(null);
  const [selectedRow, setSelectedRow] = useState<LogisticsRow | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    row: LogisticsRow;
    type: ActionType;
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const fetchShipments = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await authAction({ action: 'get-logistics-shipments' }).unwrap();
      setShipments(result.data || []);
    } catch {
      notify.error('Failed to load logistics shipments');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchShipments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { all, pending, inTransit, delivered } = getTabLists(shipments);
  const tabLists = [all, pending, inTransit, delivered];

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { row, type } = actionTarget;
    try {
      setActionInProgress(row.id);
      await authAction({
        action: type === 'dispatch' ? 'dispatch-logistics-shipment' : 'reject-logistics-shipment',
        userId: row.id,
        adminNotes: actionNotes || undefined,
      }).unwrap();
      notify.success(
        type === 'dispatch'
          ? `Shipment dispatched for ${row.name}`
          : `Shipment from ${row.name} rejected`,
      );
      setActionTarget(null);
      setActionNotes('');
      fetchShipments();
    } catch {
      notify.error(`Failed to ${type} shipment. Please try again.`);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleOpenAction = (row: LogisticsRow, type: ActionType) => {
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

  const columns: Column<LogisticsRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    {
      id: 'name',
      label: 'Customer',
      minWidth: 160,
      format: (_v: unknown, row: LogisticsRow): React.ReactNode => (
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
    { id: 'origin', label: 'Origin', minWidth: 140, format: (v: unknown) => String(v || '-') },
    {
      id: 'destination',
      label: 'Destination',
      minWidth: 140,
      format: (v: unknown) => String(v || '-'),
    },
    {
      id: 'cargoType',
      label: 'Cargo Type',
      minWidth: 130,
      format: (v: unknown) => String(v || '-'),
    },
    { id: 'weight', label: 'Weight', minWidth: 100, format: (v: unknown) => String(v || '-') },
    {
      id: 'scheduledDate',
      label: 'Scheduled',
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
          <Chip label={statusLabel[s] ?? s} color={statusColor[s] ?? 'default'} size='small' />
        );
      },
    },
    {
      id: 'id',
      label: 'Actions',
      minWidth: 200,
      align: 'center',
      sortable: false,
      format: (_v: unknown, row: LogisticsRow): React.ReactNode => {
        if (row.status !== 'pending') return <Typography variant='body2'>—</Typography>;
        const processing = actionInProgress === row.id;
        return (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              variant='contained'
              color='primary'
              size='small'
              startIcon={<SendIcon />}
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
      <Tab icon={<LocalShippingIcon />} iconPosition='start' label={`All (${all.length})`} />
      <Tab
        icon={<PendingActionsIcon />}
        iconPosition='start'
        label={`Pending (${pending.length})`}
      />
      <Tab
        icon={<AirportShuttleIcon />}
        iconPosition='start'
        label={`In Transit (${inTransit.length})`}
      />
      <Tab
        icon={<CheckCircleIcon />}
        iconPosition='start'
        label={`Delivered (${delivered.length})`}
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
    getFilteredData: (list: LogisticsRow[]) => getFilteredData(list, tableSearch),
  };
};
