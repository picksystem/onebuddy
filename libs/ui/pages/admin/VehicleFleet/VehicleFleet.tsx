import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  TextField,
  InputAdornment,
  Stack,
  Switch,
  Tooltip,
  Divider,
} from '@mui/material';
import { Box, Loader, DataTable, Column } from '@bandi/component';
import SearchIcon from '@mui/icons-material/Search';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification, useAdminKeyframes } from '@bandi/hooks';
import { CustomerOnboardingRow } from '../UserManagement/types/userManagement.types';
import { useStyles } from '../UserManagement/styles';
import { constants } from '@bandi/utils';
import { fmtDateUser } from '../UserManagement/utils/userManagement.utils';

interface FleetMeta {
  label: string;
  vehicleTypes: string[];
  color: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
}

const FLEET_CONFIG: Record<string, FleetMeta> = {
  bikes: {
    label: 'Bikes & Scooters',
    vehicleTypes: ['bike'],
    color: '#7c3aed',
    gradientFrom: '#4f46e5',
    gradientTo: '#7c3aed',
    description: 'Manage two-wheeler operators — bikes and scooters registered on the platform',
  },
  autos: {
    label: 'Auto Rickshaws',
    vehicleTypes: ['auto'],
    color: '#f59e0b',
    gradientFrom: '#92400e',
    gradientTo: '#f59e0b',
    description: 'Manage auto rickshaw operators for affordable short-distance city mobility',
  },
  cabs: {
    label: 'Cabs',
    vehicleTypes: ['cab'],
    color: '#1d4ed8',
    gradientFrom: '#1e3a8a',
    gradientTo: '#1d4ed8',
    description: 'Manage cab operators — hatchbacks, sedans, SUVs and luxury vehicles',
  },
  shuttles: {
    label: 'Shuttles & Buses',
    vehicleTypes: ['shuttle'],
    color: '#059669',
    gradientFrom: '#064e3b',
    gradientTo: '#059669',
    description: 'Manage shuttle and bus operators for group transport and outstation trips',
  },
  'mini-cargo': {
    label: 'Mini Cargo',
    vehicleTypes: ['tata_ace'],
    color: '#0ea5e9',
    gradientFrom: '#0369a1',
    gradientTo: '#0ea5e9',
    description: 'Manage Tata Ace and mini truck operators for light goods transport',
  },
  'medium-goods': {
    label: 'Medium Goods',
    vehicleTypes: ['dcm'],
    color: '#64748b',
    gradientFrom: '#1e293b',
    gradientTo: '#64748b',
    description: 'Manage DCM and medium goods vehicle operators for mid-range cargo hauls',
  },
  'heavy-trucks': {
    label: 'Lorry / Heavy Trucks',
    vehicleTypes: ['lorry'],
    color: '#dc2626',
    gradientFrom: '#7f1d1d',
    gradientTo: '#dc2626',
    description: 'Manage lorry and heavy truck operators for large-scale freight and logistics',
  },
};

const DEFAULT_META: FleetMeta = {
  label: 'Fleet Management',
  vehicleTypes: [],
  color: '#4f46e5',
  gradientFrom: '#1e3a8a',
  gradientTo: '#4f46e5',
  description: 'Manage vehicle fleet operators',
};

const genId = (row: CustomerOnboardingRow) => {
  const prefix = row.serviceCategory === 'mobility' ? 'MOBIL' : 'LOGST';
  return `${prefix}${String(Number(row.id) || 0).padStart(5, '0')}`;
};

const VehicleFleet = () => {
  const { type = '' } = useParams<{ type: string }>();
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();
  const visibleIdsRef = useRef<(string | number)[]>([]);

  const [allOnboardings, setAllOnboardings] = useState<CustomerOnboardingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState<CustomerOnboardingRow | null>(null);

  const meta = FLEET_CONFIG[type] ?? DEFAULT_META;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await authAction({ action: 'get-customer-onboardings' }).unwrap();
      setAllOnboardings(
        ((result.data || []) as CustomerOnboardingRow[]).map((r, i) => ({ ...r, sno: i + 1 })),
      );
    } catch {
      notify.error('Failed to load fleet data');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authAction]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset UI state when fleet type changes (same component reused across fleet routes)
  useEffect(() => {
    setTableSearch('');
    setSelectedRow(null);
    // Re-fetch if data is already loaded (navigating between fleet pages)
    if (!isLoading) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const fleetData = useMemo(() => {
    const vTypes = meta.vehicleTypes;
    if (!vTypes.length) return allOnboardings;
    return allOnboardings.filter((r) => vTypes.includes(r.vehicleType?.toLowerCase() || ''));
  }, [allOnboardings, meta.vehicleTypes]);

  // Keep visible ids in sync for customer detail navigation
  useEffect(() => {
    const q = tableSearch.toLowerCase();
    const visible = q
      ? fleetData.filter((r) =>
          Object.values(r).some(
            (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(q),
          ),
        )
      : fleetData;
    visibleIdsRef.current = visible.map((r) => genId(r));
  }, [fleetData, tableSearch]);

  const handleStatusToggle = useCallback(
    async (row: CustomerOnboardingRow) => {
      const newStatus = row.status === 'approved' ? 'rejected' : 'approved';
      setAllOnboardings((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, status: newStatus } : r)),
      );
      try {
        await authAction({
          action: 'update-customer-onboarding',
          id: Number(row.id),
          data: { status: newStatus },
        }).unwrap();
        notify.success(newStatus === 'approved' ? 'Customer activated' : 'Customer deactivated');
      } catch {
        setAllOnboardings((prev) =>
          prev.map((r) => (r.id === row.id ? { ...r, status: row.status } : r)),
        );
        notify.error('Failed to update customer status');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [authAction],
  );

  const expiryNode = useCallback((expiryStr: string | null, createdAt: string): React.ReactNode => {
    if (!expiryStr) return <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>;
    const now = Date.now();
    const expiry = new Date(expiryStr).getTime();
    const start = new Date(createdAt).getTime();
    const total = expiry - start;
    const remaining = expiry - now;
    let color = '#16a34a';
    if (remaining <= 0) color = '#dc2626';
    else if (remaining <= 6 * 3_600_000) color = '#dc2626';
    else if (total > 0 && (now - start) / total >= 0.5) color = '#d97706';
    const label = remaining <= 0 ? 'Expired' : fmtDateUser(expiryStr, undefined, undefined);
    return (
      <span
        style={{ color, fontWeight: remaining <= 6 * 3_600_000 ? 700 : 500, fontSize: '0.82rem' }}
      >
        {label}
      </span>
    );
  }, []);

  const columns: Column<CustomerOnboardingRow>[] = useMemo(
    () => [
      {
        id: 'sno',
        label: '#',
        minWidth: 42,
        align: 'center',
        sortable: false,
        format: (_v, _r, i?: number): React.ReactNode => (
          <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8' }}>
            {(i ?? 0) + 1}
          </Typography>
        ),
      },
      {
        id: 'firstName',
        label: 'Customer',
        minWidth: 162,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode => (
          <Stack spacing={0.15}>
            <Typography
              component='span'
              onClick={(e) => {
                e.stopPropagation();
                localStorage.setItem(
                  'customer_detail_nav_ids',
                  JSON.stringify(visibleIdsRef.current),
                );
                localStorage.setItem('customer_detail_nav_ids_ts', String(Date.now()));
                window.open(
                  constants.AdminPath.CUSTOMER_DETAIL.replace(':id', genId(row)),
                  '_blank',
                );
              }}
              sx={{
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                color: '#1d4ed8',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(29,78,216,0.35)',
                textUnderlineOffset: '3px',
                lineHeight: 1.3,
                '&:hover': { color: '#1e40af' },
              }}
            >
              {`${row.firstName} ${row.lastName}`.trim() || '—'}
            </Typography>
            <Typography sx={{ fontSize: '0.71rem', color: '#64748b' }}>
              {row.email || '—'}
            </Typography>
            {row.phone && (
              <Typography sx={{ fontSize: '0.71rem', color: '#64748b' }}>{row.phone}</Typography>
            )}
            <Typography
              sx={{
                fontSize: '0.69rem',
                fontWeight: 700,
                fontFamily: 'monospace',
                color: '#6366f1',
                letterSpacing: '0.3px',
              }}
            >
              {genId(row)}
            </Typography>
          </Stack>
        ),
      },
      {
        id: 'vehicleType',
        label: 'Vehicle',
        minWidth: 138,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode => (
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
              {row.vehicleSubType ? ` · ${row.vehicleSubType}` : ''}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.74rem',
                fontFamily: 'monospace',
                fontWeight: 700,
                color: '#1d4ed8',
                letterSpacing: '0.5px',
              }}
            >
              {row.vehicleNumber || '—'}
            </Typography>
            {row.fuelType && (
              <Typography
                sx={{ fontSize: '0.67rem', color: '#94a3b8', textTransform: 'capitalize' }}
              >
                {row.fuelType}
              </Typography>
            )}
            {row.tripPreference && (
              <Typography
                sx={{
                  fontSize: '0.67rem',
                  color: '#94a3b8',
                  textTransform: 'capitalize',
                  ml: '5px',
                }}
              >
                {row.tripPreference.replace(/_/g, ' ')}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        id: 'rcNumber',
        label: 'Vehicle Docs',
        minWidth: 158,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode => {
          const docs = [
            { label: 'RC', number: row.rcNumber, expiry: row.rcExpiry },
            { label: 'Ins', number: row.insuranceNumber, expiry: row.insuranceExpiry },
            { label: 'PUC', number: row.pucNumber, expiry: row.pucExpiry },
            { label: 'Fitness', number: row.fitnessNumber, expiry: row.fitnessExpiry },
            { label: 'Permit', number: row.permitNumber, expiry: row.permitExpiry },
          ].filter((d) => d.number);
          if (!docs.length)
            return <Typography sx={{ fontSize: '0.72rem', color: '#cbd5e1' }}>—</Typography>;
          return (
            <Stack spacing={0.25}>
              {docs.map((d) => (
                <Typography key={d.label} sx={{ fontSize: '0.71rem', lineHeight: 1.4 }}>
                  <span
                    style={{
                      color: '#475569',
                      fontWeight: 700,
                      display: 'inline-block',
                      minWidth: 40,
                    }}
                  >
                    {d.label}
                  </span>
                  <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{d.number}</span>
                  {d.expiry && (
                    <span style={{ display: 'inline-block', marginLeft: 4 }}>
                      {expiryNode(d.expiry, row.createdAt)}
                    </span>
                  )}
                </Typography>
              ))}
            </Stack>
          );
        },
      },
      {
        id: 'dlNumber',
        label: 'Driver Docs',
        minWidth: 142,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode => {
          const docs = [
            { label: 'DL', number: row.dlNumber, expiry: row.dlExpiry },
            {
              label: (row.idProofType || 'ID').toUpperCase(),
              number: row.idProofNumber,
              expiry: null as string | null,
            },
          ].filter((d) => d.number);
          if (!docs.length)
            return <Typography sx={{ fontSize: '0.72rem', color: '#cbd5e1' }}>—</Typography>;
          return (
            <Stack spacing={0.25}>
              {docs.map((d) => (
                <Typography key={d.label} sx={{ fontSize: '0.71rem', lineHeight: 1.4 }}>
                  <span
                    style={{
                      color: '#475569',
                      fontWeight: 700,
                      display: 'inline-block',
                      minWidth: 40,
                    }}
                  >
                    {d.label}
                  </span>
                  <span style={{ fontFamily: 'monospace', color: '#1e293b' }}>{d.number}</span>
                  {d.expiry && (
                    <span style={{ display: 'inline-block', marginLeft: 4 }}>
                      {expiryNode(d.expiry, row.createdAt)}
                    </span>
                  )}
                </Typography>
              ))}
            </Stack>
          );
        },
      },
      {
        id: 'city',
        label: 'Location',
        minWidth: 95,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode => (
          <Stack spacing={0.15}>
            <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#1e293b' }}>
              {row.city || '—'}
            </Typography>
            {row.area && (
              <Typography sx={{ fontSize: '0.71rem', color: '#64748b' }}>{row.area}</Typography>
            )}
            {row.pincode && (
              <Typography
                sx={{
                  fontSize: '0.69rem',
                  fontFamily: 'monospace',
                  color: '#94a3b8',
                  letterSpacing: '0.5px',
                }}
              >
                {row.pincode}
              </Typography>
            )}
          </Stack>
        ),
      },
      {
        id: 'bundleTypes',
        label: 'Bundle',
        minWidth: 110,
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode => {
          if (!row.bundleTypes)
            return <Typography sx={{ fontSize: '0.72rem', color: '#cbd5e1' }}>—</Typography>;
          let types: string[] = [];
          try {
            const parsed = JSON.parse(row.bundleTypes);
            types = Array.isArray(parsed) ? parsed : [String(parsed)];
          } catch {
            types = [row.bundleTypes];
          }
          return (
            <Stack spacing={0.3}>
              {types.map((t) => (
                <Typography
                  key={t}
                  sx={{
                    fontSize: '0.71rem',
                    fontWeight: 600,
                    color: '#3730a3',
                    background: '#eef2ff',
                    borderRadius: '4px',
                    px: '5px',
                    py: '1px',
                    display: 'inline-block',
                    width: 'fit-content',
                    textTransform: 'capitalize',
                  }}
                >
                  {t.replace(/_/g, ' ')}
                </Typography>
              ))}
              {row.bundleDiscount !== null && row.bundleDiscount > 0 && (
                <Typography sx={{ fontSize: '0.68rem', color: '#16a34a', fontWeight: 700 }}>
                  {row.bundleDiscount}% off
                </Typography>
              )}
            </Stack>
          );
        },
      },
      {
        id: 'status',
        label: 'Active',
        minWidth: 80,
        align: 'center',
        format: (_v: unknown, row: CustomerOnboardingRow): React.ReactNode => {
          const isActive = row.status === 'approved';
          const label = isActive
            ? 'Active'
            : row.status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
          return (
            <Tooltip title={label} placement='top'>
              <Stack alignItems='center' spacing={0.2}>
                <Switch
                  size='small'
                  checked={isActive}
                  onChange={() => handleStatusToggle(row)}
                  onClick={(e) => e.stopPropagation()}
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
    ],
    [handleStatusToggle, expiryNode],
  );

  const filteredData = useMemo(() => {
    if (!tableSearch) return fleetData;
    const q = tableSearch.toLowerCase();
    return fleetData.filter((row) =>
      Object.values(row).some(
        (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(q),
      ),
    );
  }, [fleetData, tableSearch]);

  const approved = fleetData.filter((r) => r.status === 'approved').length;
  const pending = fleetData.filter((r) => r.status === 'pending').length;
  const inactive = fleetData.filter(
    (r) => r.status !== 'approved' && r.status !== 'pending',
  ).length;

  if (isLoading) {
    return (
      <>
        {keyframes}
        <Box className={classes.container}>
          <Loader />
        </Box>
      </>
    );
  }

  const statCards = [
    {
      label: 'Total',
      value: fleetData.length,
      Icon: GroupIcon,
      cls: classes.statCard0,
      sub: `All ${meta.label.toLowerCase()} operators`,
      color: meta.color,
    },
    {
      label: 'Active',
      value: approved,
      Icon: CheckCircleIcon,
      cls: classes.statCard2,
      sub: 'Approved & on platform',
      color: '#16a34a',
    },
    {
      label: 'Pending',
      value: pending,
      Icon: PendingActionsIcon,
      cls: classes.statCard3,
      sub: 'Awaiting approval',
      color: '#f59e0b',
    },
    {
      label: 'Inactive',
      value: inactive,
      Icon: CancelIcon,
      cls: classes.statCard1,
      sub: 'Rejected or deactivated',
      color: '#94a3b8',
    },
  ];

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* Page header */}
        <Box
          className={classes.pageHeader}
          sx={{
            background: `linear-gradient(135deg, #0f172a 0%, ${meta.gradientFrom} 35%, ${meta.gradientTo} 100%) !important`,
          }}
        >
          <Box className={classes.headerOrb3} />
          <Box className={classes.pageHeaderRow}>
            <Typography variant='h5' className={classes.title}>
              {meta.label}
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            {meta.description}
          </Typography>
        </Box>

        {/* Stat cards */}
        <Box className={classes.statsGrid}>
          {statCards.map(({ label, value, Icon, cls, sub, color }) => (
            <Box key={label} className={`${classes.statCard} ${cls}`}>
              <Box className={classes.statCardTop}>
                <Box>
                  <Typography className={classes.statValue} sx={{ color }}>
                    {value}
                  </Typography>
                  <Typography className={classes.statLabel}>{label}</Typography>
                </Box>
                <Box
                  className={classes.statIconWrap}
                  sx={{ background: `${color}14`, border: `1.5px solid ${color}28` }}
                >
                  <Icon className={classes.statIcon} sx={{ color }} />
                </Box>
              </Box>
              <Divider className={classes.statDivider} />
              <Box className={classes.statSubRow}>
                <Box
                  className={classes.statSubDot}
                  sx={{ background: color, boxShadow: `0 0 6px ${color}` }}
                />
                <Typography className={classes.statSub}>{sub}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Search bar */}
        <Box className={classes.tabsBox} sx={{ justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.92rem', color: '#1e293b', pl: 1 }}>
            {filteredData.length} operator{filteredData.length !== 1 ? 's' : ''}
          </Typography>
          <TextField
            placeholder='Search...'
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className={classes.tabsSearchField}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position='end'>
                    <SearchIcon />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Table */}
        <Box className={classes.tableContainer}>
          <DataTable
            columns={columns}
            data={filteredData}
            rowKey='id'
            searchable={false}
            initialRowsPerPage={10}
            onRowClick={(row) => setSelectedRow(row)}
            activeRowKey={selectedRow?.id}
          />
        </Box>
      </Box>
    </>
  );
};

export default VehicleFleet;
