import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Stack,
  Switch,
  Tooltip,
  Divider,
} from '@mui/material';
import { Box, Loader, DataTable, Column } from '@bandi/component';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FireTruckIcon from '@mui/icons-material/FireTruck';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import SearchIcon from '@mui/icons-material/Search';
import { useAuthActionMutation } from '@bandi/services';
import { useNotification, useAdminKeyframes } from '@bandi/hooks';
import { useStyles } from '../UserManagement/styles';
import { CustomerOnboardingRow } from '../UserManagement/types/userManagement.types';
import { constants } from '@bandi/utils';
import { fmtDateUser } from '../UserManagement/utils/userManagement.utils';

interface FleetType {
  key: string;
  label: string;
  IconComponent: React.ElementType;
  vehicleTypes: string[];
  serviceCategory?: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  cardClass: string;
  description: string;
}

const FLEET_TYPES: FleetType[] = [
  {
    key: 'bikes',
    label: 'Bikes & Scooters',
    IconComponent: TwoWheelerIcon,
    vehicleTypes: ['bike', 'scooter'],
    color: '#7c3aed',
    gradientFrom: '#4f46e5',
    gradientTo: '#7c3aed',
    cardClass: 'statCard4',
    description: 'Two-wheeler operators — bikes and scooters',
  },
  {
    key: 'autos',
    label: 'Auto',
    IconComponent: ElectricRickshawIcon,
    vehicleTypes: ['auto', 'auto_rickshaw'],
    color: '#f59e0b',
    gradientFrom: '#92400e',
    gradientTo: '#f59e0b',
    cardClass: 'statCard1',
    description: 'Auto rickshaw operators for short-distance city mobility',
  },
  {
    key: 'cabs',
    label: 'Cabs',
    IconComponent: DirectionsCarIcon,
    vehicleTypes: ['cab', 'hatchback', 'sedan', 'suv'],
    color: '#1d4ed8',
    gradientFrom: '#1e3a8a',
    gradientTo: '#1d4ed8',
    cardClass: 'statCard0',
    description: 'Cab operators — hatchbacks, sedans, SUVs and luxury vehicles',
  },
  {
    key: 'shuttles',
    label: 'Shuttles & Buses',
    IconComponent: DirectionsBusIcon,
    vehicleTypes: ['shuttle', 'bus', 'minibus'],
    color: '#059669',
    gradientFrom: '#064e3b',
    gradientTo: '#059669',
    cardClass: 'statCard2',
    description: 'Shuttle and bus operators for group transport and outstation trips',
  },
  {
    key: 'mini-cargo',
    label: 'Mini Cargo',
    IconComponent: AirportShuttleIcon,
    vehicleTypes: ['tata_ace', 'mini_truck', 'mini_cargo'],
    color: '#0ea5e9',
    gradientFrom: '#0369a1',
    gradientTo: '#0ea5e9',
    cardClass: 'statCard3',
    description: 'Tata Ace and mini truck operators for light goods transport',
  },
  {
    key: 'medium-goods',
    label: 'Medium Goods',
    IconComponent: LocalShippingIcon,
    vehicleTypes: ['dcm', 'medium_goods', 'pickup'],
    color: '#0f766e',
    gradientFrom: '#134e4a',
    gradientTo: '#0f766e',
    cardClass: 'statCard5',
    description: 'DCM and medium goods vehicle operators for mid-range cargo hauls',
  },
  {
    key: 'heavy-trucks',
    label: 'Heavy Trucks',
    IconComponent: FireTruckIcon,
    vehicleTypes: ['lorry', 'heavy_truck', 'trailer'],
    color: '#dc2626',
    gradientFrom: '#7f1d1d',
    gradientTo: '#dc2626',
    cardClass: 'statCard7',
    description: 'Lorry and heavy truck operators for large-scale freight and logistics',
  },
  {
    key: 'parcel',
    label: 'Parcel Delivery',
    IconComponent: Inventory2Icon,
    vehicleTypes: [],
    serviceCategory: 'parcel',
    color: '#ea580c',
    gradientFrom: '#c2410c',
    gradientTo: '#ea580c',
    cardClass: 'statCard7',
    description: 'Parcel delivery operators for last-mile document, food, and goods delivery',
  },
];

const MOBILITY_KEYS = new Set(['bikes', 'autos', 'cabs', 'shuttles', 'parcel']);
const LOGISTICS_KEYS = new Set(['mini-cargo', 'medium-goods', 'heavy-trucks']);

const genId = (row: CustomerOnboardingRow) => row.customerId ?? String(row.id);

const TabPanel = ({
  children,
  value,
  index,
}: {
  children: React.ReactNode;
  value: number;
  index: number;
}) => (value === index ? <Box>{children}</Box> : null);

const FleetManagement = () => {
  const { classes } = useStyles();
  const keyframes = useAdminKeyframes();
  const [authAction] = useAuthActionMutation();
  const notify = useNotification();
  const visibleIdsRef = useRef<(string | number)[]>([]);
  const { pathname } = useLocation();

  const category: 'mobility' | 'logistics' | null = pathname.includes('mobility')
    ? 'mobility'
    : pathname.includes('logistics')
      ? 'logistics'
      : null;

  const visibleFleetTypes = useMemo(
    () =>
      category === 'mobility'
        ? FLEET_TYPES.filter((ft) => MOBILITY_KEYS.has(ft.key))
        : category === 'logistics'
          ? FLEET_TYPES.filter((ft) => LOGISTICS_KEYS.has(ft.key))
          : FLEET_TYPES,
    [category],
  );

  const pageTitle =
    category === 'mobility'
      ? 'Mobility Management'
      : category === 'logistics'
        ? 'Logistics Management'
        : 'Fleet Management';

  const pageDescription =
    category === 'mobility'
      ? 'Manage all mobility fleet operators — bikes, autos, cabs, shuttles, and parcel delivery from a single view.'
      : category === 'logistics'
        ? 'Manage all logistics fleet operators — mini cargo, medium goods, and heavy trucks.'
        : 'Manage all mobility and logistics fleet operators from a single view.';

  const [allOnboardings, setAllOnboardings] = useState<CustomerOnboardingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [tableSearch, setTableSearch] = useState('');
  const [selectedRow, setSelectedRow] = useState<CustomerOnboardingRow | null>(null);

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

  const activeFleet = visibleFleetTypes[tabValue] ?? visibleFleetTypes[0];

  const fleetDataForType = useCallback(
    (ft: FleetType) => {
      if (ft.serviceCategory) {
        return allOnboardings.filter(
          (r) => (r as Record<string, unknown>).serviceCategory === ft.serviceCategory,
        );
      }
      if (!ft.vehicleTypes.length) return allOnboardings;
      return allOnboardings.filter((r) =>
        ft.vehicleTypes.includes(r.vehicleType?.toLowerCase() || ''),
      );
    },
    [allOnboardings],
  );

  const currentFleetData = useMemo(
    () => fleetDataForType(activeFleet),
    [fleetDataForType, activeFleet],
  );

  useEffect(() => {
    const q = tableSearch.toLowerCase();
    const visible = q
      ? currentFleetData.filter((r) =>
          Object.values(r).some(
            (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(q),
          ),
        )
      : currentFleetData;
    visibleIdsRef.current = visible.map(genId);
  }, [currentFleetData, tableSearch]);

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
              <Typography sx={{ fontSize: '0.69rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                {row.pincode}
              </Typography>
            )}
          </Stack>
        ),
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
    if (!tableSearch) return currentFleetData;
    const q = tableSearch.toLowerCase();
    return currentFleetData.filter((row) =>
      Object.values(row).some(
        (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(q),
      ),
    );
  }, [currentFleetData, tableSearch]);

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

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* Page header */}
        <Box className={classes.pageHeader}>
          <Box className={classes.headerOrb3} />
          <Box className={classes.pageHeaderRow}>
            <Typography variant='h5' className={classes.title}>
              {pageTitle}
            </Typography>
          </Box>
          <Typography variant='body2' className={classes.description}>
            {pageDescription}
          </Typography>
        </Box>

        {/* Fleet type stat cards — clickable to switch tab */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${visibleFleetTypes.length}, 1fr)`,
            gap: 1.5,
            mb: 2.5,
            '@media (max-width:900px)': { gridTemplateColumns: 'repeat(4, 1fr)' },
            '@media (max-width:600px)': { gridTemplateColumns: 'repeat(2, 1fr)', gap: 1 },
          }}
        >
          {visibleFleetTypes.map((ft, idx) => {
            const ftData = fleetDataForType(ft);
            const count = ftData.length;
            const isActive = tabValue === idx;
            const approved = ftData.filter((r) => r.status === 'approved').length;
            const inactive = ftData.filter((r) => r.status !== 'approved').length;
            const cardCls = (classes as Record<string, string>)[ft.cardClass] ?? '';
            return (
              <Box
                key={ft.key}
                onClick={() => {
                  setTabValue(idx);
                  setTableSearch('');
                  setSelectedRow(null);
                }}
                className={`${classes.statCard} ${cardCls}`}
                sx={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  outline: isActive ? `2px solid ${ft.color}` : 'none',
                  outlineOffset: 2,
                  transform: isActive ? 'translateY(-6px)' : undefined,
                  boxShadow: isActive
                    ? `0 16px 40px ${ft.color}30, 0 4px 16px ${ft.color}18`
                    : undefined,
                }}
              >
                <Box className={classes.statCardTop} sx={{ flex: 1, alignItems: 'flex-start' }}>
                  <Box>
                    <Typography className={classes.statValue} sx={{ color: ft.color }}>
                      {count}
                    </Typography>
                    <Typography
                      className={classes.statLabel}
                      sx={{ minHeight: '2.2em', display: 'block' }}
                    >
                      {ft.label}
                    </Typography>
                  </Box>
                  <Box
                    className={classes.statIconWrap}
                    sx={{ background: `${ft.color}14`, border: `1.5px solid ${ft.color}28` }}
                  >
                    <ft.IconComponent className={classes.statIcon} sx={{ color: ft.color }} />
                  </Box>
                </Box>
                <Divider className={classes.statDivider} />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flex: '1 1 0',
                      minWidth: 0,
                    }}
                  >
                    <Box
                      className={classes.statSubDot}
                      sx={{ background: '#10b981', boxShadow: '0 0 6px #10b981', flexShrink: 0 }}
                    />
                    <Typography
                      className={classes.statSub}
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      <span style={{ color: '#10b981', fontWeight: 700 }}>{approved}</span>
                      {' active'}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flex: '1 1 0',
                      minWidth: 0,
                      justifyContent: 'flex-end',
                    }}
                  >
                    <Box
                      className={classes.statSubDot}
                      sx={{ background: '#94a3b8', boxShadow: '0 0 6px #94a3b8', flexShrink: 0 }}
                    />
                    <Typography
                      className={classes.statSub}
                      sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      <span style={{ color: '#94a3b8', fontWeight: 700 }}>{inactive}</span>
                      {' inactive'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Tabs + Search */}
        <Box className={classes.tabsBox}>
          <Tabs
            value={tabValue}
            onChange={(_, v) => {
              setTabValue(v);
              setTableSearch('');
              setSelectedRow(null);
            }}
            variant='scrollable'
            scrollButtons='auto'
            allowScrollButtonsMobile
            sx={{ flex: 1 }}
          >
            {visibleFleetTypes.map((ft) => (
              <Tab
                key={ft.key}
                icon={<ft.IconComponent sx={{ fontSize: '1.1rem' }} />}
                iconPosition='start'
                label={ft.label}
              />
            ))}
          </Tabs>
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

        {/* Tab panels */}
        {visibleFleetTypes.map((ft, idx) => (
          <TabPanel key={ft.key} value={tabValue} index={idx}>
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
          </TabPanel>
        ))}
      </Box>
    </>
  );
};

export default FleetManagement;
