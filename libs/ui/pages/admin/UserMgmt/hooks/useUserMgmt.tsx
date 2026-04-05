import React, { useCallback, useEffect, useState } from 'react';
import { Column } from '@bandi/component';
import { Chip, Stack, Switch, Typography, Tooltip } from '@mui/material';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification } from '@bandi/hooks';
import { CustomerApprovalRow } from '../../CustomerApprovals/hooks/useCustomerApprovals';

export type { CustomerApprovalRow };

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

export const useUserMgmt = () => {
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();

  const [allRows, setAllRows] = useState<CustomerApprovalRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');

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

  // Only platform users (serviceCategory === 'user')
  const userRows = allRows.filter((r) => (r.serviceCategory as string) === 'user');

  // All Users: approved or rejected
  const managedRows = userRows.filter((r) => r.status === 'approved' || r.status === 'rejected');

  // Drafts: pending
  const draftRows = userRows.filter((r) => r.status === 'pending');

  const tabLists: CustomerApprovalRow[][] = [managedRows, draftRows];

  const getFilteredData = (rows: CustomerApprovalRow[]) => {
    if (!tableSearch.trim()) return rows;
    const q = tableSearch.toLowerCase();
    return rows.filter(
      (r) =>
        `${r.firstName} ${r.lastName}`.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q) ||
        r.phone?.includes(q) ||
        r.city?.toLowerCase().includes(q),
    );
  };

  const handleStatusToggle = useCallback(
    async (row: CustomerApprovalRow) => {
      const newStatus = row.status === 'approved' ? 'rejected' : 'approved';
      setAllRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: newStatus } : r)));
      try {
        await authAction({
          action: 'update-customer-onboarding',
          onboardingId: row.id,
          data: { status: newStatus },
        }).unwrap();
        notify.success(newStatus === 'approved' ? 'User activated' : 'User deactivated');
      } catch {
        setAllRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: row.status } : r)));
        notify.error('Failed to update user status');
      }
    },
    [authAction, notify],
  );

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
      minWidth: 150,
      format: (_v: unknown, row: CustomerApprovalRow) => (
        <Stack spacing={0.15}>
          <Typography sx={{ fontWeight: 700, fontSize: '0.84rem', color: '#1e293b' }}>
            {`${row.firstName} ${row.lastName}`.trim() || '—'}
          </Typography>
          {row.email && (
            <Typography sx={{ fontSize: '0.71rem', color: '#64748b' }}>{row.email}</Typography>
          )}
          {row.phone && (
            <Typography sx={{ fontSize: '0.71rem', color: '#64748b' }}>{row.phone}</Typography>
          )}
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
      label: 'Active',
      minWidth: 80,
      align: 'center',
      format: (_v: unknown, row: CustomerApprovalRow) => {
        if (row.status === 'pending') {
          return (
            <Chip
              label='Pending'
              size='small'
              sx={{
                fontSize: '0.72rem',
                fontWeight: 700,
                bgcolor: '#fef3c7',
                color: '#d97706',
                border: 'none',
              }}
            />
          );
        }
        const isActive = row.status === 'approved';
        const label = isActive ? 'Active' : 'Rejected';
        return (
          <Tooltip title={label} placement='top'>
            <Stack alignItems='center' spacing={0.2}>
              <Switch
                size='small'
                checked={isActive}
                onChange={() => handleStatusToggle(row)}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#16a34a' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#16a34a',
                  },
                }}
              />
              <Typography
                sx={{
                  fontSize: '0.62rem',
                  color: isActive ? '#16a34a' : '#94a3b8',
                  fontWeight: 600,
                }}
              >
                {label}
              </Typography>
            </Stack>
          </Tooltip>
        );
      },
    },
  ];

  return {
    isLoading,
    managedRows,
    draftRows,
    tabLists,
    tabValue,
    setTabValue,
    tableSearch,
    setTableSearch,
    columns,
    getFilteredData,
  };
};
