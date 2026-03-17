import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Avatar, Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import GlobalStyles from '@mui/material/GlobalStyles';
import Divider from '@mui/material/Divider';

// Icons – Ride modes
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// Icons – KPI & metrics
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import BusinessIcon from '@mui/icons-material/Business';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import NearMeIcon from '@mui/icons-material/NearMe';

// Icons – Activity feed
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import RouteIcon from '@mui/icons-material/Route';

// Icons – Trend
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

import { useCurrentDate } from '../../../hooks';
import { useAuth } from '@bandi/hooks';
import { useStyles } from './styles';
import { DATE_FORMATS } from '../../../../utils';

// ─────────────────────────────────────────────────────────────────────────────
// CHART CONFIGS
// ─────────────────────────────────────────────────────────────────────────────

// Stacked bar – rides by mode (monthly)
const ridesByModeOptions: ApexOptions = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
    animations: { enabled: true, speed: 900 },
  },
  colors: ['#f59e0b', '#10b981', '#4f46e5', '#0ea5e9', '#8b5cf6'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '62%' } },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { fontSize: '11px', colors: '#94a3b8' },
      formatter: (v) => `${(v / 1000).toFixed(0)}K`,
    },
  },
  grid: { borderColor: 'rgba(79,70,229,0.06)', strokeDashArray: 4 },
  legend: { position: 'top', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: false },
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: (v) => `${v.toLocaleString()} rides` },
  },
  fill: { opacity: 1 },
};

const ridesByModeSeries = [
  {
    name: 'Bike',
    data: [4200, 5100, 4800, 6200, 7100, 8400, 6900, 9100, 10200, 11400, 9800, 13200],
  },
  { name: 'Auto', data: [2100, 2600, 2400, 3100, 3500, 4100, 3400, 4600, 5100, 5700, 4900, 6600] },
  { name: 'Car', data: [1400, 1800, 1600, 2100, 2400, 2700, 2200, 3000, 3400, 3900, 3300, 4500] },
  { name: 'Shuttle', data: [800, 1100, 900, 1300, 1500, 1700, 1400, 1900, 2100, 2400, 2000, 2800] },
  { name: 'Goods', data: [400, 600, 500, 700, 800, 900, 750, 1000, 1100, 1300, 1100, 1500] },
];

// Area – Revenue trend
const revenueOptions: ApexOptions = {
  chart: { type: 'area', toolbar: { show: false }, animations: { enabled: true, speed: 900 } },
  colors: ['#4f46e5'],
  stroke: { curve: 'smooth', width: 2.5 },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 90] },
  },
  xaxis: {
    categories: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    labels: {
      style: { fontSize: '11px', colors: '#94a3b8' },
      formatter: (v) => `₹${(v / 1000).toFixed(0)}K`,
    },
  },
  grid: { borderColor: 'rgba(79,70,229,0.06)', strokeDashArray: 4 },
  dataLabels: { enabled: false },
  tooltip: { y: { formatter: (v) => `₹${(v / 1000).toFixed(1)}K` } },
};

const revenueSeries = [
  {
    name: 'Revenue',
    data: [
      380000, 490000, 445000, 615000, 720000, 840000, 660000, 920000, 1050000, 1240000, 1080000,
      1420000,
    ],
  },
];

// Donut – trip status today
const tripStatusOptions: ApexOptions = {
  chart: { type: 'donut', toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
  colors: ['#10b981', '#ef4444', '#f59e0b', '#4f46e5'],
  labels: ['Completed', 'Cancelled', 'Ongoing', 'Scheduled'],
  legend: { position: 'bottom', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: "Today's Trips",
            fontSize: '11px',
            color: '#64748b',
            fontWeight: 700,
            formatter: () => '5,284',
          },
        },
      },
    },
  },
  stroke: { width: 0 },
  tooltip: { y: { formatter: (v) => `${v.toLocaleString()} trips` } },
};
const tripStatusSeries = [4471, 312, 289, 212];

// Donut – Revenue by channel
const revenueChannelOptions: ApexOptions = {
  chart: { type: 'donut', toolbar: { show: false }, animations: { enabled: true, speed: 700 } },
  colors: ['#f59e0b', '#10b981', '#4f46e5', '#0ea5e9', '#8b5cf6'],
  labels: ['Bike Rides', 'Auto Rides', 'Car Rides', 'Shuttle', 'Goods'],
  legend: { position: 'bottom', fontSize: '11px', fontWeight: 600 },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '68%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total Revenue',
            fontSize: '11px',
            color: '#64748b',
            fontWeight: 700,
            formatter: () => '₹2.84L',
          },
        },
      },
    },
  },
  stroke: { width: 0 },
  tooltip: { y: { formatter: (v) => `₹${v.toLocaleString()}` } },
};
const revenueChannelSeries = [98000, 62000, 74000, 36000, 14000];

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────

const KPI_CARDS = [
  {
    label: 'Total Trips Today',
    value: '5,284',
    sub: '84.6% completion',
    Icon: NearMeIcon,
    color: '#4f46e5',
    cls: 'kpiCard0',
    trend: '+14.2%',
    trendUp: true,
    trendLabel: 'vs yesterday',
  },
  {
    label: 'Captains Online',
    value: '1,847',
    sub: '2,341 registered',
    Icon: DirectionsCarIcon,
    color: '#10b981',
    cls: 'kpiCard1',
    trend: '+62 now',
    trendUp: true,
    trendLabel: 'live count',
  },
  {
    label: 'Revenue Today',
    value: '₹2.84L',
    sub: '₹14.2L this month',
    Icon: CurrencyRupeeIcon,
    color: '#f59e0b',
    cls: 'kpiCard2',
    trend: '+22.4%',
    trendUp: true,
    trendLabel: 'vs last month',
  },
  {
    label: 'Avg Trip Rating',
    value: '4.73★',
    sub: 'Based on 4.8K reviews',
    Icon: StarIcon,
    color: '#0ea5e9',
    cls: 'kpiCard3',
    trend: '+0.04',
    trendUp: true,
    trendLabel: 'vs last week',
  },
];

const SERVICE_MODES = [
  {
    label: 'Bike Rides',
    value: '2,142',
    sub: '+18% today',
    Icon: TwoWheelerIcon,
    color: '#f59e0b',
    bg: '#fffbeb',
    pct: 82,
    delay: '0s',
  },
  {
    label: 'Auto Rides',
    value: '1,284',
    sub: '+11% today',
    Icon: ElectricRickshawIcon,
    color: '#10b981',
    bg: '#f0fdf4',
    pct: 64,
    delay: '0.08s',
  },
  {
    label: 'Car Rides',
    value: '924',
    sub: '+9% today',
    Icon: DirectionsCarIcon,
    color: '#4f46e5',
    bg: '#eef2ff',
    pct: 52,
    delay: '0.16s',
  },
  {
    label: 'Shuttle',
    value: '647',
    sub: '+28% today',
    Icon: AirportShuttleIcon,
    color: '#0ea5e9',
    bg: '#f0f9ff',
    pct: 38,
    delay: '0.24s',
  },
  {
    label: 'Goods / Freight',
    value: '287',
    sub: '+7% today',
    Icon: LocalShippingIcon,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    pct: 22,
    delay: '0.32s',
  },
];

const SEC_METRICS = [
  { label: 'Total Users', value: '11,687', Icon: GroupIcon, color: '#4f46e5', bg: '#eef2ff' },
  { label: 'Corporate Accounts', value: '64', Icon: BusinessIcon, color: '#10b981', bg: '#f0fdf4' },
  {
    label: 'Active Subscriptions',
    value: '8,291',
    Icon: SubscriptionsIcon,
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    label: 'FastTag Active',
    value: '2,341',
    Icon: LocalOfferIcon,
    color: '#f59e0b',
    bg: '#fffbeb',
  },
];

const HEALTH = [
  { label: 'Trip Completion Rate', value: '84.6%', pct: 84.6, color: '#10b981' },
  { label: 'Payment Success', value: '98.2%', pct: 98.2, color: '#4f46e5' },
  { label: 'Captain Acceptance', value: '87.4%', pct: 87.4, color: '#0ea5e9' },
  { label: 'API Uptime', value: '99.9%', pct: 99.9, color: '#8b5cf6' },
  { label: 'Shuttle Fill Rate', value: '76.3%', pct: 76.3, color: '#f59e0b' },
  { label: 'Goods Delivery Rate', value: '93.1%', pct: 93.1, color: '#ef4444' },
];

const TOP_CITIES = [
  {
    rank: 1,
    name: 'Mumbai',
    state: 'Maharashtra',
    trips: '1,284',
    pct: 100,
    color: '#4f46e5',
    bg: '#eef2ff',
  },
  {
    rank: 2,
    name: 'Delhi NCR',
    state: 'Delhi',
    trips: '1,047',
    pct: 82,
    color: '#10b981',
    bg: '#f0fdf4',
  },
  {
    rank: 3,
    name: 'Bangalore',
    state: 'Karnataka',
    trips: '924',
    pct: 72,
    color: '#f59e0b',
    bg: '#fffbeb',
  },
  {
    rank: 4,
    name: 'Pune',
    state: 'Maharashtra',
    trips: '741',
    pct: 58,
    color: '#0ea5e9',
    bg: '#f0f9ff',
  },
  {
    rank: 5,
    name: 'Hyderabad',
    state: 'Telangana',
    trips: '612',
    pct: 48,
    color: '#8b5cf6',
    bg: '#f5f3ff',
  },
  {
    rank: 6,
    name: 'Chennai',
    state: 'Tamil Nadu',
    trips: '487',
    pct: 38,
    color: '#ef4444',
    bg: '#fef2f2',
  },
];

const TOP_CAPTAINS = [
  {
    initials: 'AK',
    name: 'Arjun Kumar',
    city: 'Mumbai',
    trips: 284,
    earning: '₹18,420',
    rating: '4.96',
    bg: '#eef2ff',
    color: '#4f46e5',
    top: true,
  },
  {
    initials: 'PS',
    name: 'Priya Sharma',
    city: 'Delhi',
    trips: 261,
    earning: '₹16,890',
    rating: '4.94',
    bg: '#f0fdf4',
    color: '#10b981',
    top: false,
  },
  {
    initials: 'RV',
    name: 'Ravi Verma',
    city: 'Bangalore',
    trips: 248,
    earning: '₹15,740',
    rating: '4.92',
    bg: '#fffbeb',
    color: '#f59e0b',
    top: false,
  },
  {
    initials: 'SM',
    name: 'Sanjay Mehta',
    city: 'Pune',
    trips: 233,
    earning: '₹14,210',
    rating: '4.91',
    bg: '#f0f9ff',
    color: '#0ea5e9',
    top: false,
  },
  {
    initials: 'DN',
    name: 'Divya Nair',
    city: 'Chennai',
    trips: 219,
    earning: '₹13,650',
    rating: '4.89',
    bg: '#f5f3ff',
    color: '#8b5cf6',
    top: false,
  },
];

const ACTIVITY = [
  {
    Icon: NearMeIcon,
    color: '#4f46e5',
    bg: '#eef2ff',
    text: 'Shuttle trip Mumbai→Pune completed — ₹840 collected (BlaBlaCar route)',
    time: '1m ago',
  },
  {
    Icon: LocalShippingIcon,
    color: '#8b5cf6',
    bg: '#f5f3ff',
    text: 'Goods delivery #GD-1024 confirmed for TechCorp (Blackbuck partner route)',
    time: '4m ago',
  },
  {
    Icon: PersonAddIcon,
    color: '#10b981',
    bg: '#f0fdf4',
    text: 'New corporate account registered — FinServ Pvt. Ltd. (50 seats)',
    time: '9m ago',
  },
  {
    Icon: CancelIcon,
    color: '#ef4444',
    bg: '#fef2f2',
    text: 'Bike ride #T-28389 cancelled — driver no-show reported by user',
    time: '17m ago',
  },
  {
    Icon: VerifiedIcon,
    color: '#f59e0b',
    bg: '#fffbeb',
    text: 'FastTag approved for Shuttle route — Ravi Patel (Bangalore↔Mysore)',
    time: '29m ago',
  },
  {
    Icon: PaymentIcon,
    color: '#4f46e5',
    bg: '#eef2ff',
    text: 'Subscription renewed — TechCorp Premium Plan ₹4,999/mo × 50 seats',
    time: '42m ago',
  },
  {
    Icon: RouteIcon,
    color: '#0ea5e9',
    bg: '#f0f9ff',
    text: 'New shuttle route added: Hyderabad↔Vijayawada (3 shared seats)',
    time: '1h ago',
  },
  {
    Icon: WarningAmberIcon,
    color: '#f59e0b',
    bg: '#fffbeb',
    text: '3 Access requests pending for over 24h — requires admin review',
    time: '1h ago',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const { classes, cx } = useStyles();
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

  const keyframes = (
    <GlobalStyles
      styles={`
      @keyframes db-gradient-shift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes db-orb {
        0%,100% { transform: translate(0,0) scale(1); }
        25%  { transform: translate(20px,-18px) scale(1.06); }
        75%  { transform: translate(-14px,12px) scale(0.94); }
      }
      @keyframes db-float {
        0%,100% { transform: translateY(0) rotate(0deg); }
        40%  { transform: translateY(-16px) rotate(5deg); }
        70%  { transform: translateY(-8px) rotate(-3deg); }
      }
      @keyframes db-slide-up {
        from { opacity:0; transform:translateY(20px); }
        to   { opacity:1; transform:translateY(0); }
      }
      @keyframes db-counter {
        from { opacity:0; transform:scale(0.7) translateY(10px); }
        to   { opacity:1; transform:scale(1) translateY(0); }
      }
      @keyframes db-pulse {
        0%,100% { opacity:1; transform:scale(1); }
        50%     { opacity:0.55; transform:scale(1.35); }
      }
      @keyframes db-shimmer {
        0%   { transform: translateX(-100%) skewX(-12deg); }
        60%,100% { transform: translateX(280%) skewX(-12deg); }
      }
      @keyframes db-ring-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
    `}
    />
  );

  return (
    <>
      {keyframes}
      <Box className={classes.container}>
        {/* ══ HERO ═══════════════════════════════════════════════════════════ */}
        <Box className={classes.heroHeader}>
          {/* Decorative layers */}
          <Box className={classes.heroGridOverlay} />
          <Box className={classes.heroShimmer} />
          <Box className={classes.heroOrb} />
          <Box className={classes.heroOrb2} />
          <Box className={classes.heroOrb3} />

          {/* Main content */}
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

        {/* ══ PRIMARY KPIs ═══════════════════════════════════════════════════ */}
        <Box className={classes.kpiGrid}>
          {KPI_CARDS.map(({ label, value, sub, Icon, color, cls, trend, trendUp, trendLabel }) => (
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

        {/* ══ SERVICE MODE BREAKDOWN ═════════════════════════════════════════ */}
        <Box className={classes.modeGrid}>
          {SERVICE_MODES.map(({ label, value, sub, Icon, color, bg, pct, delay }) => (
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

        {/* ══ SECONDARY BUSINESS METRICS ════════════════════════════════════ */}
        <Box className={classes.secRow}>
          {SEC_METRICS.map(({ label, value, Icon, color, bg }) => (
            <Box key={label} className={classes.secCard}>
              <Box className={classes.secIcon} sx={{ background: bg }}>
                <Icon sx={{ color }} />
              </Box>
              <Box>
                <Typography className={classes.secValue} sx={{ color }}>
                  {value}
                </Typography>
                <Typography className={classes.secLabel}>{label}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* ══ RIDES BY MODE CHART + REVENUE AREA ════════════════════════════ */}
        <Box className={classes.chartRow}>
          <Box className={classes.chartPanel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>
                Rides by Service Mode — Monthly
              </Typography>
              <Box className={classes.panelBadge} sx={{ background: '#eef2ff', color: '#4f46e5' }}>
                FY 2024–25
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={ridesByModeOptions}
                series={ridesByModeSeries}
                type='bar'
                height={barChartHeight}
              />
            </Box>
          </Box>

          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Platform Health</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#f0fdf4', color: '#10b981' }}>
                Live
              </Box>
            </Box>
            <Box className={classes.panelBody}>
              {HEALTH.map(({ label, value, pct, color }) => (
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

        {/* ══ REVENUE TREND + TRIP STATUS + REVENUE BY CHANNEL ══════════════ */}
        <Box className={classes.twoColRow}>
          <Box className={classes.chartPanel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Monthly Revenue Trend</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#eef2ff', color: '#4f46e5' }}>
                ₹14.2L this month
              </Box>
            </Box>
            <Box sx={{ p: 2 }}>
              <Chart
                options={revenueOptions}
                series={revenueSeries}
                type='area'
                height={areaChartHeight}
              />
            </Box>
          </Box>

          <Box className={classes.twoColRow} sx={{ mb: 0 }}>
            <Box className={classes.panel}>
              <Box className={classes.panelHead}>
                <Typography className={classes.panelTitle}>Trip Status Today</Typography>
                <Box
                  className={classes.panelBadge}
                  sx={{ background: '#eef2ff', color: '#4f46e5' }}
                >
                  5,284
                </Box>
              </Box>
              <Box sx={{ p: 1 }}>
                <Chart
                  options={tripStatusOptions}
                  series={tripStatusSeries}
                  type='donut'
                  height={donutChartHeight}
                />
              </Box>
            </Box>

            <Box className={classes.panel}>
              <Box className={classes.panelHead}>
                <Typography className={classes.panelTitle}>Revenue by Mode</Typography>
                <Box
                  className={classes.panelBadge}
                  sx={{ background: '#fffbeb', color: '#f59e0b' }}
                >
                  ₹2.84L
                </Box>
              </Box>
              <Box sx={{ p: 1 }}>
                <Chart
                  options={revenueChannelOptions}
                  series={revenueChannelSeries}
                  type='donut'
                  height={donutChartHeight}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ══ TOP CITIES + TOP CAPTAINS + LIVE ACTIVITY ═════════════════════ */}
        <Box className={classes.threeColRow}>
          {/* Top Cities */}
          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Top Cities by Trips</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#eef2ff', color: '#4f46e5' }}>
                Today
              </Box>
            </Box>
            <Box className={classes.panelBody}>
              {TOP_CITIES.map(({ rank, name, state, trips, pct, color, bg }) => (
                <Box key={name} className={classes.cityItem}>
                  <Box className={classes.cityRank} sx={{ background: bg, color }}>
                    #{rank}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography className={classes.cityName}>{name}</Typography>
                    <Typography className={classes.citySub}>{state}</Typography>
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

          {/* Top Captains */}
          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Top Captains</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#f0fdf4', color: '#10b981' }}>
                This Month
              </Box>
            </Box>
            <Box className={classes.panelBody}>
              {TOP_CAPTAINS.map(
                ({ initials, name, city, trips, earning, rating, bg, color, top }) => (
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
                        {city} · {trips} trips
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

          {/* Live Activity Feed */}
          <Box className={classes.panel}>
            <Box className={classes.panelHead}>
              <Typography className={classes.panelTitle}>Live Activity</Typography>
              <Box className={classes.panelBadge} sx={{ background: '#fef2f2', color: '#ef4444' }}>
                <Box
                  component='span'
                  sx={{
                    display: 'inline-block',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#ef4444',
                    mr: 0.5,
                    animation: 'db-pulse 1.5s ease-in-out infinite',
                  }}
                />
                Live
              </Box>
            </Box>
            <Box className={classes.panelBody}>
              {ACTIVITY.map(({ Icon, color, bg, text, time }, i) => (
                <Box key={i} className={classes.activityItem}>
                  <Box className={classes.activityDot} sx={{ background: bg }}>
                    <Icon sx={{ color }} />
                  </Box>
                  <Typography className={classes.activityText}>{text}</Typography>
                  <Typography className={classes.activityTime}>{time}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
