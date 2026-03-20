import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Avatar, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import Divider from '@mui/material/Divider';

// Icons – Ride modes
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Icons – KPI & Operations
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StarIcon from '@mui/icons-material/Star';
import RouteIcon from '@mui/icons-material/Route';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';

// Icons – Governance
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

// Icons – People & Organizations
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import CarRentalIcon from '@mui/icons-material/CarRental';
import Inventory2Icon from '@mui/icons-material/Inventory2';

// Icons – Activity feed
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Icons – Trend
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import { useAdminKeyframes, useCurrentDate } from '../../../hooks';
import { useAuth } from '@bandi/hooks';
import { useStyles } from './styles';
import { DATE_FORMATS } from '../../../../utils';
import { useDashboard } from './hooks/useDashboard';

// ─────────────────────────────────────────────────────────────────────────────
// CHART OPTION TEMPLATES  (series are injected from real API data)
// ─────────────────────────────────────────────────────────────────────────────

// Stacked bar – monthly onboardings by vehicle type
const onboardingByVehicleOptions: ApexOptions = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    animations: { enabled: true, speed: 900 },
  },
  colors: ['#f59e0b', '#10b981', '#4f46e5', '#0ea5e9', '#8b5cf6'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '62%' } },
  xaxis: {
    categories: [],
    labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { fontSize: '11px', colors: '#94a3b8' },
      formatter: (v) => String(Math.round(v)),
    },
  },
  grid: { borderColor: 'rgba(79,70,229,0.06)', strokeDashArray: 4 },
  legend: { position: 'top', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: false },
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: (v) => `${v.toLocaleString()} onboardings` },
  },
  fill: { opacity: 1 },
};

// Area – monthly onboarding trend
const onboardingTrendOptions: ApexOptions = {
  chart: { type: 'area', toolbar: { show: false }, animations: { enabled: true, speed: 900 } },
  colors: ['#4f46e5'],
  stroke: { curve: 'smooth', width: 2.5 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90] },
  },
  xaxis: {
    categories: [],
    labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { fontSize: '11px', colors: '#94a3b8' },
      formatter: (v) => String(Math.round(v)),
    },
  },
  grid: { borderColor: 'rgba(79,70,229,0.06)', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  tooltip: { y: { formatter: (v) => `${v.toLocaleString()} onboardings` } },
};

// Donut – onboarding status base config
const tripStatusOptions: ApexOptions = {
  chart: { type: 'donut', toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
  colors: ['#10b981', '#ef4444', '#f59e0b', '#4f46e5'],
  labels: ['Approved', 'Rejected', 'Under Review', 'Pending'],
  legend: { position: 'bottom', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: '70%' } } },
  stroke: { width: 0 },
  tooltip: { y: { formatter: (v) => `${v.toLocaleString()} onboardings` } },
};

// Donut – vehicle type distribution base config
const vehicleTypeDistOptions: ApexOptions = {
  chart: { type: 'donut', toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
  colors: ['#f59e0b', '#10b981', '#4f46e5', '#0ea5e9', '#8b5cf6', '#ef4444'],
  labels: [],
  legend: { position: 'bottom', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: '68%' } } },
  stroke: { width: 0 },
  tooltip: { y: { formatter: (v) => `${v.toLocaleString()} captains` } },
};

// Bar – access request pipeline base config
const accessRequestOptions: ApexOptions = {
  chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true, speed: 900 } },
  colors: ['#10b981', '#ef4444'],
  plotOptions: { bar: { borderRadius: 5, columnWidth: '52%' } },
  xaxis: {
    categories: [],
    labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { fontSize: '11px', colors: '#94a3b8' } } },
  grid: { borderColor: 'rgba(79,70,229,0.06)', strokeDashArray: 4 },
  legend: { position: 'top', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: false },
  tooltip: { shared: true, intersect: false },
};

// Bar – city onboardings (horizontal)
const cityBarOptions: ApexOptions = {
  chart: { type: 'bar', toolbar: { show: false }, animations: { enabled: true, speed: 900 } },
  colors: ['#4f46e5'],
  plotOptions: { bar: { borderRadius: 5, horizontal: true, barHeight: '60%' } },
  xaxis: {
    categories: [],
    labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: { fontSize: '11px', colors: '#374151' }, align: 'left' } },
  grid: { borderColor: 'rgba(79,70,229,0.06)', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  tooltip: { y: { formatter: (v) => `${v.toLocaleString()} onboardings` } },
};

// Donut – service category distribution base config
const userDistributionOptions: ApexOptions = {
  chart: { type: 'donut', toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
  colors: ['#4f46e5', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6', '#ef4444'],
  labels: [],
  legend: { position: 'bottom', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: false },
  plotOptions: { pie: { donut: { size: '68%' } } },
  stroke: { width: 0 },
  tooltip: { y: { formatter: (v) => `${v.toLocaleString()} onboardings` } },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const SectionLabel = ({ label, classes }: { label: string; classes: Record<string, string> }) => (
  <Box className={classes.sectionLabel}>
    <Box className={classes.sectionLabelBar} />
    <Typography className={classes.sectionLabelText}>{label}</Typography>
    <Box className={classes.sectionLabelBar} />
  </Box>
);

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { classes, cx } = useStyles();
  const keyframes = useAdminKeyframes();
  const { user } = useAuth();
  const userName =
    user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Admin';
  const userInitials = userName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const currentDate = useCurrentDate(1000, DATE_FORMATS.DATE_SHORT);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const barChartHeight = isMobile ? 180 : isTablet ? 220 : 252;
  const areaChartHeight = isMobile ? 160 : isTablet ? 200 : 224;
  const donutChartHeight = isMobile ? 180 : isTablet ? 200 : 236;
  const accessBarHeight = isMobile ? 160 : 210;
  const subscriptionBarHeight = isMobile ? 140 : 188;

  // ── Live API data ─────────────────────────────────────────────────────────────
  const {
    isLoading: dashLoading,
    captainsOnline,
    totalOnboardings,
    mobilityCount,
    logisticsCount,
    pendingOnboardingsCount,
    underReviewCount,
    approvedCount,
    rejectedCount,
    driverHireCount,
    vehicleRentalCount,
    parcelCount,
    modeCounts,
    sortedCities,
    maxCityCount,
    topCityLabels,
    topCityCounts,
    statusCounts,
    pipelineMonths,
    approvedPerMonth,
    rejectedPerMonth,
    months12Labels,
    monthlyOnboardingCounts,
    monthlyByVehicleType,
    vehicleTypeDistLabels,
    vehicleTypeDistSeries,
    vehicleTypeDistTotal,
    serviceCategoryCounts,
    healthMetrics,
    recentOnboardings,
    topCaptainsList,
  } = useDashboard();

  const V = (n: number) => (dashLoading ? '—' : n.toLocaleString());

  // ── KPI cards (all real data) ─────────────────────────────────────────────
  const kpiCards = [
    {
      label: 'Total Onboardings',
      value: V(totalOnboardings),
      sub: `${V(approvedCount)} approved`,
      Icon: PeopleIcon,
      color: '#4f46e5',
      cls: 'kpiCard0',
      trend: V(pendingOnboardingsCount),
      trendUp: pendingOnboardingsCount === 0,
      trendLabel: 'pending review',
    },
    {
      label: 'Approved Captains',
      value: V(captainsOnline),
      sub: `${V(mobilityCount)} mobility onboardings`,
      Icon: LocalTaxiIcon,
      color: '#10b981',
      cls: 'kpiCard1',
      trend: V(underReviewCount),
      trendUp: true,
      trendLabel: 'under review',
    },
    {
      label: 'Pending Reviews',
      value: V(pendingOnboardingsCount),
      sub: `${V(underReviewCount)} under review`,
      Icon: RouteIcon,
      color: '#f59e0b',
      cls: 'kpiCard2',
      trend: V(rejectedCount),
      trendUp: rejectedCount === 0,
      trendLabel: 'total rejected',
    },
    {
      label: 'Service Requests',
      value: V(driverHireCount + vehicleRentalCount + parcelCount),
      sub: `${V(driverHireCount)} hire · ${V(vehicleRentalCount)} rental · ${V(parcelCount)} parcel`,
      Icon: CurrencyRupeeIcon,
      color: '#0ea5e9',
      cls: 'kpiCard3',
      trend: V(logisticsCount),
      trendUp: true,
      trendLabel: 'logistics onboardings',
    },
  ];

  // ── Governance stats (all real data) ─────────────────────────────────────
  const governanceStats = [
    {
      label: 'Pending Onboardings',
      value: V(pendingOnboardingsCount),
      sub: 'Awaiting admin review',
      Icon: VpnKeyIcon,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      label: 'Under Review',
      value: V(underReviewCount),
      sub: 'Being processed',
      Icon: QueryStatsIcon,
      color: '#0ea5e9',
      bg: '#f0f9ff',
    },
    {
      label: 'Approved',
      value: V(approvedCount),
      sub: 'Total approved onboardings',
      Icon: CalendarMonthIcon,
      color: '#10b981',
      bg: '#f0fdf4',
    },
    {
      label: 'Rejected',
      value: V(rejectedCount),
      sub: 'Total rejected',
      Icon: ManageSearchIcon,
      color: '#ef4444',
      bg: '#fef2f2',
    },
  ];

  // ── Service Modes (all real data) ─────────────────────────────────────────
  const MODE_DEFS = [
    {
      label: 'Bike Rides',
      key: 'bike',
      Icon: TwoWheelerIcon,
      color: '#f59e0b',
      bg: '#fffbeb',
      delay: '0s',
    },
    {
      label: 'Auto Rides',
      key: 'auto',
      Icon: ElectricRickshawIcon,
      color: '#10b981',
      bg: '#f0fdf4',
      delay: '0.08s',
    },
    {
      label: 'Car Rides',
      key: 'car',
      Icon: DirectionsCarIcon,
      color: '#4f46e5',
      bg: '#eef2ff',
      delay: '0.16s',
    },
    {
      label: 'Shuttle',
      key: 'shuttle',
      Icon: AirportShuttleIcon,
      color: '#0ea5e9',
      bg: '#f0f9ff',
      delay: '0.24s',
    },
    {
      label: 'Goods / Freight',
      key: 'goods',
      Icon: LocalShippingIcon,
      color: '#8b5cf6',
      bg: '#f5f3ff',
      delay: '0.32s',
    },
    {
      label: 'Parcel Delivery',
      key: 'parcel',
      Icon: Inventory2Icon,
      color: '#ea580c',
      bg: '#fff7ed',
      delay: '0.40s',
    },
  ];
  const parcelCount_ = parcelCount;
  const allModeCounts: Record<string, number> = { ...modeCounts, parcel: parcelCount_ };
  const maxAllModes = Math.max(...Object.values(allModeCounts), 1);
  const serviceModes = MODE_DEFS.map(({ label, key, Icon, color, bg, delay }) => {
    const count = allModeCounts[key] ?? 0;
    return {
      label,
      Icon,
      color,
      bg,
      delay,
      value: V(count),
      pct: Math.round((count / maxAllModes) * 100),
      sub: `${count} onboardings`,
    };
  });

  // ── Fleet Stats (all real data) ───────────────────────────────────────────
  const fleetStats = [
    {
      label: 'Total Onboardings',
      value: V(totalOnboardings),
      sub: 'All onboardings',
      Icon: PeopleIcon,
      color: '#4f46e5',
      bg: '#eef2ff',
    },
    {
      label: 'Mobility',
      value: V(mobilityCount),
      sub: 'Mobility onboardings',
      Icon: AdminPanelSettingsIcon,
      color: '#7c3aed',
      bg: '#f5f3ff',
    },
    {
      label: 'Approved Captains',
      value: V(captainsOnline),
      sub: 'Approved & active',
      Icon: LocalTaxiIcon,
      color: '#10b981',
      bg: '#f0fdf4',
    },
    {
      label: 'Logistics',
      value: V(logisticsCount),
      sub: 'Logistics onboardings',
      Icon: CorporateFareIcon,
      color: '#0ea5e9',
      bg: '#f0f9ff',
    },
    {
      label: 'Driver Hire',
      value: V(driverHireCount),
      sub: 'Driver hire requests',
      Icon: PersonSearchIcon,
      color: '#f59e0b',
      bg: '#fffbeb',
    },
    {
      label: 'Vehicle Rental',
      value: V(vehicleRentalCount),
      sub: 'Vehicle rental requests',
      Icon: CarRentalIcon,
      color: '#ef4444',
      bg: '#fef2f2',
    },
    {
      label: 'Parcel',
      value: V(parcelCount),
      sub: 'Parcel requests',
      Icon: Inventory2Icon,
      color: '#ea580c',
      bg: '#fff7ed',
    },
  ];

  // ── Monthly onboarding by vehicle type (stacked bar) ─────────────────────
  const onboardingByVehicleDynOptions: ApexOptions = {
    ...onboardingByVehicleOptions,
    xaxis: { ...onboardingByVehicleOptions.xaxis, categories: months12Labels },
  };

  // ── Monthly onboarding trend (area chart) ─────────────────────────────────
  const onboardingTrendDynOptions: ApexOptions = {
    ...onboardingTrendOptions,
    xaxis: { ...onboardingTrendOptions.xaxis, categories: months12Labels },
  };
  const onboardingTrendSeries = [{ name: 'Onboardings', data: monthlyOnboardingCounts }];

  // ── Onboarding status donut ────────────────────────────────────────────────
  const onboardingStatusSeries = [
    statusCounts.approved,
    statusCounts.rejected,
    statusCounts.under_review,
    statusCounts.pending,
  ];
  const onboardingTotal = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const tripStatusDynOptions: ApexOptions = {
    ...tripStatusOptions,
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Onboardings',
              fontSize: '11px',
              color: '#64748b',
              fontWeight: 700,
              formatter: () => (dashLoading ? '…' : onboardingTotal.toLocaleString()),
            },
          },
        },
      },
    },
  };

  // ── Vehicle type distribution donut ───────────────────────────────────────
  const vehicleTypeDistDynOptions: ApexOptions = {
    ...vehicleTypeDistOptions,
    labels: vehicleTypeDistLabels.length > 0 ? vehicleTypeDistLabels : ['No Data'],
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Captains',
              fontSize: '11px',
              color: '#64748b',
              fontWeight: 700,
              formatter: () => (dashLoading ? '…' : vehicleTypeDistTotal.toLocaleString()),
            },
          },
        },
      },
    },
  };

  // ── Access-request pipeline ────────────────────────────────────────────────
  const dynamicAccessRequestOptions: ApexOptions = {
    ...accessRequestOptions,
    xaxis: { ...accessRequestOptions.xaxis, categories: pipelineMonths },
  };
  const dynamicAccessRequestSeries = [
    { name: 'Approved', data: approvedPerMonth },
    { name: 'Rejected', data: rejectedPerMonth },
  ];

  // ── City bar chart (replacing Subscriptions) ──────────────────────────────
  const cityBarDynOptions: ApexOptions = {
    ...cityBarOptions,
    xaxis: { ...cityBarOptions.xaxis, categories: topCityLabels },
  };
  const cityBarSeries = [{ name: 'Onboardings', data: topCityCounts }];

  // ── Service-category donut ─────────────────────────────────────────────────
  const userDistLabels = Object.keys(serviceCategoryCounts).map(
    (k) => k.charAt(0).toUpperCase() + k.slice(1),
  );
  const userDistSeries = Object.values(serviceCategoryCounts);
  const userDistTotal = userDistSeries.reduce((a, b) => a + b, 0);
  const userDistributionDynOptions: ApexOptions = {
    ...userDistributionOptions,
    labels: userDistLabels.length > 0 ? userDistLabels : ['No Data'],
    plotOptions: {
      pie: {
        donut: {
          size: '68%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Onboardings',
              fontSize: '11px',
              color: '#64748b',
              fontWeight: 700,
              formatter: () => (dashLoading ? '…' : userDistTotal.toLocaleString()),
            },
          },
        },
      },
    },
  };

  // ── Top Cities ────────────────────────────────────────────────────────────
  const CITY_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6', '#ef4444'];
  const CITY_BGS = ['#eef2ff', '#f0fdf4', '#fffbeb', '#f0f9ff', '#f5f3ff', '#fef2f2'];
  const topCitiesDisplay = sortedCities.map(([name, count], idx) => ({
    rank: idx + 1,
    name,
    trips: count.toLocaleString(),
    pct: Math.round((count / maxCityCount) * 100),
    color: CITY_COLORS[idx % CITY_COLORS.length],
    bg: CITY_BGS[idx % CITY_BGS.length],
  }));

  // ── Top Captains ──────────────────────────────────────────────────────────
  const CAPTAIN_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6'];
  const CAPTAIN_BGS = ['#eef2ff', '#f0fdf4', '#fffbeb', '#f0f9ff', '#f5f3ff'];
  const topCaptainsDisplay = topCaptainsList.map((captain, idx) => {
    const name = `${captain.firstName} ${captain.lastName}`.trim();
    const initials = name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
    const vt = (captain.vehicleType || '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c: string) => c.toUpperCase());
    return {
      initials,
      name,
      city: captain.city || '—',
      sub: vt || 'Captain',
      earning: 'Approved',
      rating: captain.vehicleNumber || '—',
      bg: CAPTAIN_BGS[idx % CAPTAIN_BGS.length],
      color: CAPTAIN_COLORS[idx % CAPTAIN_COLORS.length],
      top: idx === 0,
    };
  });

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
        <Box className={classes.heroHeader}>
          <Box className={classes.heroGridOverlay} />
          <Box className={classes.heroShimmer} />
          <Box className={classes.heroOrb} />
          <Box className={classes.heroOrb2} />
          <Box className={classes.heroOrb3} />
          <Box className={classes.heroContent}>
            <Box className={classes.heroLeft}>
              <Box className={classes.heroWelcomeRow}>
                <Avatar className={classes.heroAvatar} src={user?.profilePicture || undefined}>
                  {!user?.profilePicture && userInitials}
                </Avatar>
                <Typography variant='h4' className={classes.heroTitle}>
                  Welcome, <strong>{userName}</strong>
                </Typography>
              </Box>
              <Typography className={classes.heroGreeting}>TravelMate Operations Center</Typography>
              <Typography className={classes.heroSub}>
                Live data across Ride-Hailing · Shuttle · Goods Logistics · Corporate Fleet
              </Typography>
              <Box className={classes.heroModePills}>
                {[
                  { label: '🛵  Bike Rides' },
                  { label: '🛺  Auto Rides' },
                  { label: '🚗  Car Rides' },
                  { label: '🚌  Shuttle' },
                  { label: '🚛  Goods' },
                ].map(({ label }) => (
                  <Box key={label} className={classes.heroModePill}>
                    {label}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box className={classes.heroRight}>
              <Box className={classes.heroBadge}>
                <Box className={classes.heroBadgeDot} />
                <Typography className={classes.heroBadgeText}>All Services Live</Typography>
              </Box>
              <Typography className={classes.heroDate}>{currentDate}</Typography>
            </Box>
          </Box>
        </Box>

        {/* ══ OPERATIONS — PRIMARY KPIs ══════════════════════════════════════ */}
        <SectionLabel label='Operations Overview' classes={classes} />
        <Box className={classes.kpiGrid}>
          {kpiCards.map(({ label, value, Icon, color, cls, trend, trendUp, trendLabel }) => (
            <Box key={label} className={cx(classes.kpiCard, classes[cls as keyof typeof classes])}>
              <Box className={classes.kpiTop}>
                <Box>
                  <Typography className={classes.kpiValue} sx={{ color }}>
                    {value}
                  </Typography>
                  <Typography className={classes.kpiLabel}>{label}</Typography>
                </Box>
                <Box
                  className={classes.kpiIconWrap}
                  sx={{ background: `${color}14`, border: `1.5px solid ${color}28` }}
                >
                  <Icon className={classes.kpiIcon} sx={{ color }} />
                </Box>
              </Box>
              <Divider className={classes.kpiDivider} />
              <Box className={classes.kpiTrend}>
                <Box
                  className={classes.kpiTrendBadge}
                  sx={{
                    background: trendUp ? '#f0fdf4' : '#fef2f2',
                    color: trendUp ? '#10b981' : '#ef4444',
                  }}
                >
                  {trendUp ? (
                    <TrendingUpIcon sx={{ fontSize: '0.85rem !important' }} />
                  ) : (
                    <TrendingDownIcon sx={{ fontSize: '0.85rem !important' }} />
                  )}
                  {trend}
                </Box>
                <Typography className={classes.kpiTrendLabel}>{trendLabel}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ══ GOVERNANCE OVERVIEW ════════════════════════════════════════════ */}
        <SectionLabel label='Governance' classes={classes} />
        <Box className={classes.secRow}>
          {governanceStats.map(({ label, value, sub, Icon, color, bg }) => (
            <Box key={label} className={classes.secCard}>
              <Box className={classes.secIcon} sx={{ background: bg }}>
                <Icon sx={{ color }} />
              </Box>
              <Box>
                <Typography className={classes.secValue} sx={{ color }}>
                  {value}
                </Typography>
                <Typography className={classes.secLabel}>{label}</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.38)', mt: 0.25 }}>
                  {sub}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ══ SERVICE MODE BREAKDOWN ═════════════════════════════════════════ */}
        <SectionLabel label='Service Modes — Today' classes={classes} />
        <Box className={classes.modeGrid}>
          {serviceModes.map(({ label, value, sub, Icon, color, bg, pct, delay }) => (
            <Box
              key={label}
              className={classes.modeCard}
              sx={{ animation: `db-slide-up 0.55s ${delay} ease both` }}
            >
              <Box className={classes.modeCardTop}>
                <Box className={classes.modeIconBox} sx={{ background: bg }}>
                  <Icon sx={{ color }} />
                </Box>
                <Box className={classes.modeStatusDot} />
              </Box>
              <Box>
                <Typography className={classes.modeValue} sx={{ color }}>
                  {value}
                </Typography>
                <Typography className={classes.modeLabel}>{label}</Typography>
              </Box>
              <Box className={classes.modeBar}>
                <Box
                  className={classes.modeBarFill}
                  sx={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}aa)`,
                  }}
                />
              </Box>
              <Typography className={classes.modeSub}>{sub}</Typography>
            </Box>
          ))}
        </Box>

        {/* ══ PEOPLE & ORGANIZATIONS ═════════════════════════════════════════ */}
        <SectionLabel label='People & Organizations' classes={classes} />
        <Box className={classes.fleetGrid}>
          {fleetStats.map(({ label, value, sub, Icon, color, bg }) => (
            <Box key={label} className={classes.secCard}>
              <Box className={classes.secIcon} sx={{ background: bg }}>
                <Icon sx={{ color }} />
              </Box>
              <Box>
                <Typography className={classes.secValue} sx={{ color }}>
                  {value}
                </Typography>
                <Typography className={classes.secLabel}>{label}</Typography>
                <Typography sx={{ fontSize: '0.65rem', color: 'rgba(0,0,0,0.38)', mt: 0.25 }}>
                  {sub}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ══ OPERATIONS ANALYTICS ════════════════════════════════════════════ */}
        <SectionLabel label='Operations Analytics' classes={classes} />
        <Box className={classes.chartRow}>
          <Box className={classes.chartPanel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>
                Onboardings by Vehicle Type — Monthly
              </Typography>
              <Box className={classes.panelBadge} sx={{ background: '#eef2ff', color: '#4f46e5' }}>
                Last 12 Months
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={onboardingByVehicleDynOptions}
                series={monthlyByVehicleType}
                type='bar'
                height={barChartHeight}
              />
            </Box>
          </Box>

          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Onboarding Health</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#f0fdf4', color: '#10b981' }}>
                Live
              </Box>
            </Box>
            <Box className={classes.panelBody}>
              {healthMetrics.map(({ label, value, pct, color }) => (
                <Box key={label} className={classes.healthRow}>
                  <Typography className={classes.healthLabel}>
                    <Box
                      component='span'
                      className={classes.healthDot}
                      sx={{ background: color }}
                    />
                    {label}
                  </Typography>
                  <Box className={classes.healthBar}>
                    <Box
                      className={classes.healthFill}
                      sx={{ width: `${pct}%`, background: color }}
                    />
                  </Box>
                  <Typography className={classes.healthValue} sx={{ color }}>
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ══ ONBOARDING TREND + STATUS + VEHICLE TYPE ═══════════════════════ */}
        <Box className={classes.twoColRow}>
          <Box className={classes.chartPanel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Monthly Onboarding Trend</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#eef2ff', color: '#4f46e5' }}>
                {dashLoading ? '…' : `${totalOnboardings.toLocaleString()} total`}
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={onboardingTrendDynOptions}
                series={onboardingTrendSeries}
                type='area'
                height={areaChartHeight}
              />
            </Box>
          </Box>

          <Box className={classes.twoColRow} sx={{ mb: 0 }}>
            <Box className={classes.panel}>
              <Box className={classes.panelHead}>
                <Typography className={classes.panelTitle}>Onboarding Status</Typography>
                <Box
                  className={classes.panelBadge}
                  sx={{ background: '#eef2ff', color: '#4f46e5' }}
                >
                  {dashLoading ? '…' : onboardingTotal.toLocaleString()}
                </Box>
              </Box>
              <Box sx={{ p: 1 }}>
                <Chart
                  options={tripStatusDynOptions}
                  series={onboardingStatusSeries}
                  type='donut'
                  height={donutChartHeight}
                />
              </Box>
            </Box>

            <Box className={classes.panel}>
              <Box className={classes.panelHead}>
                <Typography className={classes.panelTitle}>Vehicle Type Distribution</Typography>
                <Box
                  className={classes.panelBadge}
                  sx={{ background: '#fffbeb', color: '#f59e0b' }}
                >
                  {dashLoading ? '…' : `${vehicleTypeDistTotal.toLocaleString()} captains`}
                </Box>
              </Box>
              <Box sx={{ p: 1 }}>
                <Chart
                  options={vehicleTypeDistDynOptions}
                  series={vehicleTypeDistSeries.length > 0 ? vehicleTypeDistSeries : [1]}
                  type='donut'
                  height={donutChartHeight}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ══ GOVERNANCE ANALYTICS ══════════════════════════════════════════ */}
        <SectionLabel label='Governance Analytics' classes={classes} />
        <Box className={classes.twoColRow}>
          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Onboarding Pipeline</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#f0fdf4', color: '#10b981' }}>
                Last 6 Months
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={dynamicAccessRequestOptions}
                series={dynamicAccessRequestSeries}
                type='bar'
                height={accessBarHeight}
              />
            </Box>
          </Box>

          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Onboardings by City</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#f5f3ff', color: '#4f46e5' }}>
                {dashLoading ? '…' : `${sortedCities.length} cities`}
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={cityBarDynOptions}
                series={cityBarSeries}
                type='bar'
                height={subscriptionBarHeight}
              />
            </Box>
          </Box>
        </Box>

        {/* ══ PEOPLE DISTRIBUTION ════════════════════════════════════════════ */}
        <SectionLabel label='User & Role Distribution' classes={classes} />
        <Box className={classes.twoColRow}>
          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Onboarding Distribution</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#eef2ff', color: '#4f46e5' }}>
                {dashLoading ? '…' : `${userDistTotal.toLocaleString()} Total`}
              </Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <Chart
                options={userDistributionDynOptions}
                series={userDistSeries.length > 0 ? userDistSeries : [1]}
                type='donut'
                height={donutChartHeight + 30}
              />
            </Box>
          </Box>

          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Top Cities by Onboardings</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#eef2ff', color: '#4f46e5' }}>
                {dashLoading ? '…' : `${totalOnboardings.toLocaleString()} total`}
              </Box>
            </Box>
            <Box className={classes.panelBody}>
              {topCitiesDisplay.map(({ rank, name, trips, pct, color, bg }) => (
                <Box key={name} className={classes.cityItem}>
                  <Box className={classes.cityRank} sx={{ background: bg, color }}>
                    #{rank}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography className={classes.cityName}>{name}</Typography>
                    <Typography className={classes.citySub}>{trips} onboardings</Typography>
                  </Box>
                  <Box className={classes.cityBar}>
                    <Box
                      className={classes.cityBarFill}
                      sx={{ width: `${pct}%`, background: color }}
                    />
                  </Box>
                  <Typography className={classes.cityValue} sx={{ color }}>
                    {trips}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ══ TOP CAPTAINS + LIVE ACTIVITY ═══════════════════════════════════ */}
        <SectionLabel label='Captains & Live Feed' classes={classes} />
        <Box className={classes.twoColRow}>
          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Top Captains</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#f0fdf4', color: '#10b981' }}>
                {dashLoading ? '…' : `${captainsOnline} Approved`}
              </Box>
            </Box>
            <Box className={classes.panelBody}>
              {topCaptainsDisplay.map(
                ({ initials, name, city, sub, earning, rating, bg, color, top }) => (
                  <Box key={name} className={classes.captainItem}>
                    <Box sx={{ position: 'relative' }}>
                      <Box className={classes.captainAvatar} sx={{ background: bg, color }}>
                        {initials}
                      </Box>
                      {top && (
                        <StarIcon
                          sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            fontSize: '0.85rem !important',
                            color: '#f59e0b',
                          }}
                        />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography className={classes.captainName}>{name}</Typography>
                      <Typography className={classes.captainSub}>
                        {city} · {sub}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography className={classes.captainEarn} sx={{ color }}>
                        {earning}
                      </Typography>
                      <Typography className={classes.captainRate}>★ {rating}</Typography>
                    </Box>
                  </Box>
                ),
              )}
            </Box>
          </Box>

          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Recent Onboardings</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#f0fdf4', color: '#10b981' }}>
                <Box
                  component='span'
                  sx={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#10b981',
                    mr: 0.5,
                    animation: 'db-pulse 1.5s ease-in-out infinite',
                  }}
                />
                Live
              </Box>
            </Box>
            <Box className={classes.panelBody}>
              {recentOnboardings.length === 0 ? (
                <Typography
                  sx={{ fontSize: '0.78rem', color: '#94a3b8', p: 2, textAlign: 'center' }}
                >
                  No onboardings yet
                </Typography>
              ) : (
                recentOnboardings.map((item, i) => {
                  const statusColors: Record<string, string> = {
                    approved: '#10b981',
                    pending: '#f59e0b',
                    under_review: '#0ea5e9',
                    rejected: '#ef4444',
                  };
                  const statusBgs: Record<string, string> = {
                    approved: '#f0fdf4',
                    pending: '#fffbeb',
                    under_review: '#f0f9ff',
                    rejected: '#fef2f2',
                  };
                  const sc = statusColors[item.status] || '#94a3b8';
                  const sb = statusBgs[item.status] || '#f8fafc';
                  const date = new Date(item.createdAt);
                  const timeAgo = (() => {
                    const diff = Date.now() - date.getTime();
                    const mins = Math.floor(diff / 60000);
                    if (mins < 60) return `${mins}m ago`;
                    const hrs = Math.floor(mins / 60);
                    if (hrs < 24) return `${hrs}h ago`;
                    return `${Math.floor(hrs / 24)}d ago`;
                  })();
                  return (
                    <Box key={i} className={classes.activityItem}>
                      <Box className={classes.activityDot} sx={{ background: sb }}>
                        <PersonAddIcon sx={{ color: sc, fontSize: '1rem !important' }} />
                      </Box>
                      <Typography className={classes.activityText}>
                        <strong>{item.name}</strong> — {item.city} · {item.vehicleType} ·{' '}
                        {item.serviceCategory}{' '}
                        <Box component='span' sx={{ color: sc, fontWeight: 700 }}>
                          [{item.status.replace(/_/g, ' ')}]
                        </Box>
                      </Typography>
                      <Typography className={classes.activityTime}>{timeAgo}</Typography>
                    </Box>
                  );
                })
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
