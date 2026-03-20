import React, { useEffect, useState, useCallback } from 'react';
import { Column } from '@bandi/component';
import { Chip, Typography, Button, Stack, Tab, Link, Tooltip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { IAuthUser } from '@bandi/interfaces';
import { ConsultantRow, ActionType } from '../types/consultant.types';
import { getFilteredData, getTabLists } from '../utils/consultant.utils';

export const useConsultants = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [requests, setRequests] = useState<IAuthUser[]>([]);
  const [drafts, setDrafts] = useState<ConsultantRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [actionInProgress, setActionInProgress] = useState<number | null>(null);
  const [detailUser, setDetailUser] = useState<IAuthUser | null>(null);
  const [selectedRow, setSelectedRow] = useState<ConsultantRow | null>(null);
  const [actionTarget, setActionTarget] = useState<{
    user: ConsultantRow;
    type: ActionType;
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const [requestsResult, draftsResult] = await Promise.allSettled([
        authAction({ action: 'get-role-requests' }).unwrap(),
        authAction({ action: 'get-management-drafts', type: 'consultant' }).unwrap(),
      ]);
      const requestsRes =
        requestsResult.status === 'fulfilled' ? requestsResult.value : { data: [] };
      const draftsRes = draftsResult.status === 'fulfilled' ? draftsResult.value : { data: [] };
      const consultants = (requestsRes.data || []).filter(
        (u: IAuthUser) => u.requestedRole === 'consultant',
      );
      setRequests(consultants);
      const draftRows: ConsultantRow[] = (draftsRes.data || []).map((d: any) => {
        const f = d.formData?.form ?? {};
        return {
          id: `draft_${d.id}` as any,
          name: `${f.firstName ?? ''} ${f.lastName ?? ''}`.trim() || '-',
          email: f.email || '-',
          businessUnit: f.department || '-',
          requestedRole: 'consultant',
          status: 'draft',
          expiresAt: d.expiresAt,
          isDraft: true,
        } as any;
      });
      setDrafts(draftRows);
    } catch {
      notify.error('Failed to load consultant requests');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    all: allRequests,
    pending: pendingRequests,
    approved: approvedRequests,
    rejected: rejectedRequests,
  } = getTabLists(requests);
  const tabLists = [allRequests, pendingRequests, approvedRequests, rejectedRequests];

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { user, type } = actionTarget;
    try {
      setActionInProgress(user.id);
      await authAction({
        action: type === 'approve' ? 'approve-role-request' : 'reject-role-request',
        userId: user.id,
        adminNotes: actionNotes || undefined,
      }).unwrap();
      notify.success(
        type === 'approve'
          ? `Access approved for ${user.name}`
          : `Access request from ${user.name} has been rejected`,
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

  const handleOpenAction = (user: ConsultantRow, type: ActionType) => {
    setActionTarget({ user, type });
    setActionNotes('');
  };

  const handleCloseAction = () => {
    setActionTarget(null);
    setActionNotes('');
  };

  const columns: Column<ConsultantRow>[] = [
    { id: 'sno', label: 'S.No', minWidth: 60, align: 'center', sortable: false },
    {
      id: 'name',
      label: 'Name',
      minWidth: 170,
      format: (_v: unknown, row: ConsultantRow): React.ReactNode => (
        <Link
          component='button'
          variant='body2'
          underline='hover'
          onClick={(e) => {
            e.stopPropagation();
            setDetailUser(row);
          }}
          sx={{ fontWeight: 500, cursor: 'pointer' }}
        >
          {String(row.name || '-')}
        </Link>
      ),
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 220,
      format: (v: unknown): React.ReactNode => String(v || '-'),
    },
    {
      id: 'businessUnit',
      label: 'Department',
      minWidth: 150,
      format: (v: unknown): React.ReactNode => String(v || '-'),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      align: 'center',
      format: (v: unknown): React.ReactNode => {
        const status = String(v || '').toLowerCase();
        const colorMap: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
          pending_approval: 'warning',
          invited: 'info',
          active: 'success',
          rejected: 'error',
          draft: 'default',
        };
        const labelMap: Record<string, string> = {
          pending_approval: 'Pending',
          invited: 'Invited',
          active: 'Approved',
          rejected: 'Rejected',
          draft: 'Draft',
        };
        return (
          <Chip
            label={
              labelMap[status] ||
              String(v || '-')
                .charAt(0)
                .toUpperCase() + String(v || '-').slice(1)
            }
            color={colorMap[status] ?? 'default'}
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
      format: (_v: unknown, row: ConsultantRow): React.ReactNode => {
        if ((row as any).isDraft)
          return (
            <Tooltip title={`Expires: ${new Date((row as any).expiresAt).toLocaleDateString()}`}>
              <Typography variant='body2' color='text.secondary'>
                Draft only
              </Typography>
            </Tooltip>
          );
        if (row.status !== 'pending_approval') return <Typography variant='body2'>-</Typography>;
        const isProcessing = actionInProgress === row.id;
        return (
          <Stack direction='row' spacing={1} justifyContent='center'>
            <Button
              variant='contained'
              color='success'
              size='small'
              startIcon={<CheckCircleOutlineIcon />}
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenAction(row, 'approve');
              }}
            >
              Approve
            </Button>
            <Button
              variant='outlined'
              color='error'
              size='small'
              startIcon={<CancelOutlinedIcon />}
              disabled={isProcessing}
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

  const tabs = [
    <Tab key={0} icon={<QueryStatsIcon />} iconPosition='start' label='All' />,
    <Tab key={1} icon={<PendingActionsIcon />} iconPosition='start' label='Pending' />,
    <Tab key={2} icon={<CheckCircleIcon />} iconPosition='start' label='Approved' />,
    <Tab key={3} icon={<DoNotDisturbIcon />} iconPosition='start' label='Rejected' />,
  ];

  return {
    isLoading,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    tabLists,
    columns,
    tabs,
    detailUser,
    setDetailUser,
    selectedRow,
    setSelectedRow,
    actionTarget,
    actionNotes,
    actionInProgress,
    handleConfirmAction,
    handleOpenAction,
    handleCloseAction,
    setActionNotes,
    getFilteredData: (list: IAuthUser[]) => getFilteredData(list, tableSearch),
    allRequests,
    pendingRequests,
    approvedRequests,
    rejectedRequests,
  };
};
