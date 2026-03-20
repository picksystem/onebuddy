import { Box, Typography, Button, Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PersonIcon from '@mui/icons-material/Person';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { constants } from '@bandi/utils';
import { useStyles } from './styles';

// ─── Portal Definitions ───────────────────────────────────────────────────────
const PORTALS = [
  {
    id: 'admin',
    label: 'Admin Portal',
    badge: 'Web',
    badgeBg: '#dbeafe',
    badgeColor: '#1d4ed8',
    headerBg: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconColor: '#ffffff',
    Icon: AdminPanelSettingsIcon,
    title: 'Admin Control Centre',
    subtitle: 'Full platform oversight — manage users, captains, trips, finance and compliance from a single dashboard.',
    platform: 'Desktop / Tablet browser',
    port: 'Port 1600',
    cta: 'Sign In to Admin',
    ctaVariant: 'contained' as const,
    ctaPath: '/signin',
    secondaryCta: 'Create Account',
    secondaryPath: '/signup',
    features: [
      'User & Captain management',
      'Customer onboarding & KYC',
      'Driver hire, rental & parcel ops',
      'Finance, commissions & analytics',
      'Role-based access control',
      'Real-time audit trails',
    ],
    dotColor: '#2563eb',
  },
  {
    id: 'captain',
    label: 'Captain App',
    badge: 'Mobile',
    badgeBg: '#dcfce7',
    badgeColor: '#15803d',
    headerBg: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconColor: '#ffffff',
    Icon: TwoWheelerIcon,
    title: 'Captain Driver App',
    subtitle: 'Accept rides, deliveries, hire requests and more — all from your smartphone. Earn more with smart bundles.',
    platform: 'Android APK · iOS (Coming Soon)',
    port: 'Port 1700 (web preview)',
    cta: 'Download Android APK',
    ctaVariant: 'contained' as const,
    ctaPath: null,
    secondaryCta: null,
    secondaryPath: null,
    features: [
      'Accept ride & delivery requests',
      'Vehicle rental & driver hire bundles',
      'Parcel combo + cargo co-ride earnings',
      'Real-time navigation & trip tracking',
      'Earnings dashboard & history',
      'Push notifications (trip alerts)',
    ],
    dotColor: '#059669',
    comingSoon: true,
  },
  {
    id: 'customer',
    label: 'Customer App',
    badge: 'Mobile',
    badgeBg: '#fef3c7',
    badgeColor: '#b45309',
    headerBg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)',
    iconBg: 'rgba(255,255,255,0.18)',
    iconColor: '#ffffff',
    Icon: PersonIcon,
    title: 'Customer Booking App',
    subtitle: 'Book rides, schedule driver hire, rent a vehicle or send a parcel — all in one app, anywhere in India.',
    platform: 'Android APK · iOS (Coming Soon)',
    port: 'Port 1800 (web preview)',
    cta: 'Download Android APK',
    ctaVariant: 'contained' as const,
    ctaPath: null,
    secondaryCta: null,
    secondaryPath: null,
    features: [
      'Book bike, auto, cab & shuttle',
      'Hire a driver for your own vehicle',
      'Rent a vehicle by day/week/month',
      'Send parcels & track in real time',
      'Cargo co-ride for outstation trips',
      'Secure UPI & card payments',
    ],
    dotColor: '#ea580c',
    comingSoon: true,
  },
];

// ─── Platform Features ────────────────────────────────────────────────────────
const FEATURES = [
  {
    Icon: ShieldIcon,
    color: '#2563eb',
    bg: '#dbeafe',
    title: 'Secure & Compliant',
    desc: 'JWT auth, OTP verification, role-based access, full audit trails and GDPR-ready data handling.',
  },
  {
    Icon: SpeedIcon,
    color: '#059669',
    bg: '#dcfce7',
    title: 'Real-Time Operations',
    desc: 'Socket.io powered live trip tracking, instant driver matching and push notifications via FCM.',
  },
  {
    Icon: NotificationsActiveIcon,
    color: '#7c3aed',
    bg: '#ede9fe',
    title: 'Smart Notifications',
    desc: 'Firebase push alerts for trip updates, OTP delivery, hire matches and payment confirmations.',
  },
  {
    Icon: LocationOnIcon,
    color: '#dc2626',
    bg: '#fee2e2',
    title: 'Zone & City Coverage',
    desc: '20+ Indian cities with area-level zone management, pincode routing and geofencing support.',
  },
  {
    Icon: DirectionsCarIcon,
    color: '#b45309',
    bg: '#fef3c7',
    title: 'All Vehicle Classes',
    desc: 'Bike, auto, cab, shuttle, Tata Ace, DCM, lorry — mobility and logistics under one platform.',
  },
  {
    Icon: PhoneAndroidIcon,
    color: '#0891b2',
    bg: '#cffafe',
    title: 'Single API — All Platforms',
    desc: 'One Express API at /api/v1/ serves web, Android APK and iOS with versioning, CORS and refresh tokens.',
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '20+', label: 'Cities Covered' },
  { value: '7', label: 'Vehicle Types' },
  { value: '5', label: 'Bundle Options' },
  { value: '3', label: 'Portals' },
  { value: '1', label: 'Unified API' },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Welcome = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();

  return (
    <Box className={classes.root}>

      {/* ── Top Nav ── */}
      <Box className={classes.nav}>
        <Box className={classes.navBrand} onClick={() => navigate('/')}>
          <Box className={classes.navBrandIcon}>
            <LocalShippingIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box>
            <Typography className={classes.navBrandName}>OneBuddy</Typography>
            <Typography className={classes.navBrandTagline}>by TravelMate</Typography>
          </Box>
        </Box>

        <Box className={classes.navActions}>
          <Button
            variant='text'
            size='small'
            sx={{ fontWeight: 600, color: '#475569', textTransform: 'none' }}
            onClick={() => navigate(constants.AuthPath?.SIGNIN ?? '/signin')}
          >
            Sign In
          </Button>
          <Button
            variant='contained'
            size='small'
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
              px: 2.5,
            }}
            onClick={() => navigate(constants.AuthPath?.SIGNUP ?? '/signup')}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* ── Hero ── */}
      <Box className={classes.hero}>
        <Box className={classes.heroOrb1} />
        <Box className={classes.heroOrb2} />

        <Box className={classes.heroBadge}>
          <Box className={classes.heroBadgeDot} />
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
            India's Unified Transport Platform
          </Typography>
        </Box>

        <Typography className={classes.heroTitle}>
          One Platform.
          <br />
          <span className={classes.heroTitleAccent}>Every Journey.</span>
        </Typography>

        <Typography className={classes.heroSubtitle}>
          Connect drivers, captains and customers across mobility and logistics —
          bikes, cabs, lorries, parcels and more, all managed from a single intelligent platform.
        </Typography>

        <Box className={classes.heroActions}>
          <Button
            variant='contained'
            size='large'
            onClick={() => navigate(constants.AuthPath?.SIGNIN ?? '/signin')}
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              background: '#ffffff',
              color: '#1e3a8a',
              '&:hover': { background: '#f0f7ff' },
            }}
          >
            Go to Admin Portal
          </Button>
          <Button
            variant='outlined'
            size='large'
            sx={{
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.9)',
              borderColor: 'rgba(255,255,255,0.35)',
              '&:hover': { borderColor: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.06)' },
            }}
            onClick={() => navigate(constants.AuthPath?.SIGNUP ?? '/signup')}
          >
            Sign Up Free
          </Button>
        </Box>
      </Box>

      {/* ── Stats Bar ── */}
      <Box className={classes.statsBar}>
        <Box className={classes.statsGrid}>
          {STATS.map(({ value, label }) => (
            <Box key={label} className={classes.statItem}>
              <Typography className={classes.statValue}>{value}</Typography>
              <Typography className={classes.statLabel}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Portals ── */}
      <Box className={classes.portalsSection}>
        <Typography className={classes.sectionLabel}>Choose your portal</Typography>
        <Typography className={classes.sectionTitle}>Three portals. One ecosystem.</Typography>
        <Typography className={classes.sectionSubtitle}>
          Admin manages the platform. Captains accept work. Customers book services.
          Each portal is purpose-built for its users.
        </Typography>

        <Grid container spacing={3} alignItems='stretch'>
          {PORTALS.map((portal) => (
            <Grid key={portal.id} size={{ xs: 12, md: 4 }}>
              <Box className={classes.portalCard}>

                {/* Card header with gradient */}
                <Box
                  className={classes.portalCardHeader}
                  sx={{ background: portal.headerBg }}
                >
                  <Box
                    className={classes.portalBadge}
                    sx={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', mb: 1.5 }}
                  >
                    {portal.badge}
                    {portal.comingSoon && (
                      <Box component='span' sx={{ ml: 0.5, opacity: 0.8 }}>· Coming Soon</Box>
                    )}
                  </Box>

                  <Box
                    className={classes.portalIconWrap}
                    sx={{ background: portal.iconBg }}
                  >
                    <portal.Icon sx={{ fontSize: 28, color: portal.iconColor }} />
                  </Box>

                  <Typography
                    variant='h6'
                    fontWeight={800}
                    sx={{ color: '#ffffff', lineHeight: 1.2, mb: 0.5 }}
                  >
                    {portal.title}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.5 }}
                  >
                    {portal.subtitle}
                  </Typography>
                </Box>

                {/* Card body */}
                <Box className={classes.portalCardBody}>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 1, flexWrap: 'wrap' }}>
                    <Chip
                      size='small'
                      icon={<PhoneAndroidIcon sx={{ fontSize: '0.85rem !important' }} />}
                      label={portal.platform}
                      sx={{ fontSize: '0.68rem', height: 22, bgcolor: '#f1f5f9', color: '#475569' }}
                    />
                    <Chip
                      size='small'
                      label={portal.port}
                      sx={{ fontSize: '0.68rem', height: 22, bgcolor: '#f8faff', color: '#2563eb', fontFamily: 'monospace' }}
                    />
                  </Box>

                  <Box component='ul' className={classes.portalFeatureList}>
                    {portal.features.map((feat) => (
                      <Box component='li' key={feat} className={classes.portalFeatureItem}>
                        <Box
                          className={classes.portalFeatureDot}
                          sx={{ background: portal.dotColor }}
                        />
                        {feat}
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 'auto' }}>
                    {portal.comingSoon ? (
                      <Button
                        variant='outlined'
                        fullWidth
                        disabled
                        startIcon={<AndroidIcon />}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 700,
                          borderRadius: 2.5,
                          py: 1.2,
                        }}
                      >
                        Download APK — Coming Soon
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant='contained'
                          fullWidth
                          onClick={() => navigate(portal.ctaPath!)}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            borderRadius: 2.5,
                            py: 1.2,
                            background: portal.headerBg,
                          }}
                        >
                          {portal.cta}
                        </Button>
                        {portal.secondaryCta && (
                          <Button
                            variant='text'
                            fullWidth
                            onClick={() => navigate(portal.secondaryPath!)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: 2.5,
                              color: '#475569',
                            }}
                          >
                            {portal.secondaryCta}
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ── Platform Features ── */}
      <Box className={classes.platformSection}>
        <Box className={classes.platformGrid}>
          <Typography className={classes.sectionLabel}>Platform Capabilities</Typography>
          <Typography className={classes.sectionTitle}>Built for scale. Ready for production.</Typography>
          <Typography className={classes.sectionSubtitle} sx={{ mb: 5 }}>
            Every component you need to run a transport business at scale — from auth to payments.
          </Typography>

          <Grid container spacing={2.5}>
            {FEATURES.map(({ Icon, color, bg, title, desc }) => (
              <Grid key={title} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box className={classes.featureCard}>
                  <Box className={classes.featureIconCircle} sx={{ background: bg }}>
                    <Icon sx={{ fontSize: 22, color }} />
                  </Box>
                  <Typography fontWeight={700} sx={{ mb: 0.75, color: '#0f172a', fontSize: '0.95rem' }}>
                    {title}
                  </Typography>
                  <Typography sx={{ fontSize: '0.835rem', color: '#64748b', lineHeight: 1.6 }}>
                    {desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* ── Mobile Download ── */}
      <Box className={classes.downloadSection}>
        <Box className={classes.downloadOrb} />

        <Typography
          sx={{
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.55)',
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          Mobile Apps
        </Typography>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
            color: '#ffffff',
            letterSpacing: '-0.03em',
            mb: 1,
          }}
        >
          Download. Drive. Earn.
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '1rem',
            maxWidth: 520,
            margin: '0 auto',
            mb: 5,
            lineHeight: 1.7,
          }}
        >
          Our captain and customer mobile apps are under active development.
          Built with React Native, available for Android APK first, then iOS.
        </Typography>

        <Grid container spacing={3} justifyContent='center' sx={{ maxWidth: 720, mx: 'auto' }}>
          {[
            {
              Icon: TwoWheelerIcon,
              iconBg: 'linear-gradient(135deg, #064e3b, #059669)',
              name: 'Captain App',
              tagline: 'For drivers & captains',
              platforms: [
                { Icon: AndroidIcon, label: 'Android APK', note: 'In Development' },
                { Icon: AppleIcon, label: 'iOS App Store', note: 'Coming Soon' },
              ],
            },
            {
              Icon: PersonIcon,
              iconBg: 'linear-gradient(135deg, #7c2d12, #ea580c)',
              name: 'Customer App',
              tagline: 'For booking & tracking',
              platforms: [
                { Icon: AndroidIcon, label: 'Android APK', note: 'In Development' },
                { Icon: AppleIcon, label: 'iOS App Store', note: 'Coming Soon' },
              ],
            },
          ].map((app) => (
            <Grid key={app.name} size={{ xs: 12, sm: 6 }}>
              <Box className={classes.downloadAppCard}>
                <Box
                  className={classes.downloadAppIcon}
                  sx={{ background: app.iconBg }}
                >
                  <app.Icon sx={{ fontSize: 32, color: '#ffffff' }} />
                </Box>
                <Box>
                  <Typography
                    fontWeight={800}
                    sx={{ color: '#ffffff', fontSize: '1.1rem', textAlign: 'center' }}
                  >
                    {app.name}
                  </Typography>
                  <Typography
                    sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', textAlign: 'center' }}
                  >
                    {app.tagline}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {app.platforms.map((p) => (
                    <Box
                      key={p.label}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.78rem',
                        }}
                      >
                        <p.Icon sx={{ fontSize: 15 }} />
                        {p.label}
                      </Box>
                      <Box className={classes.comingSoonBadge}>{p.note}</Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Port reference */}
        <Box
          sx={{
            mt: 6,
            p: 3,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 3,
            maxWidth: 700,
            mx: 'auto',
            textAlign: 'left',
          }}
        >
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              mb: 1.5,
            }}
          >
            Port Reference (Development)
          </Typography>
          <Box
            component='pre'
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 2,
              m: 0,
              whiteSpace: 'pre-wrap' as const,
            }}
          >
            {`3001  →  Backend API (Express / Node.js)
1600  →  Admin Web Portal (React — this app)
1700  →  Captain Web Preview (React Native Web)
1800  →  Customer Web Preview (React Native Web)
5432  →  PostgreSQL Database
6379  →  Redis Cache
6006  →  Storybook (Component library)`}
          </Box>
        </Box>
      </Box>

      {/* ── Footer ── */}
      <Box className={classes.footer}>
        <Box className={classes.footerBrand}>
          <LocalShippingIcon sx={{ fontSize: 18, color: '#2563eb' }} />
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
            OneBuddy
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', ml: 1 }}>
            © {new Date().getFullYear()} TravelMate. All rights reserved.
          </Typography>
        </Box>
        <Box className={classes.footerLinks}>
          {['Admin Portal', 'Sign In', 'Sign Up', 'API Docs'].map((link) => (
            <Typography key={link} className={classes.footerLink}>
              {link}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Welcome;
