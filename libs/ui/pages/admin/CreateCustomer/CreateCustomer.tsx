import { useState } from 'react';
import { Typography, alpha } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GroupsIcon from '@mui/icons-material/Groups';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HailIcon from '@mui/icons-material/Hail';
import CarRentalIcon from '@mui/icons-material/CarRental';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BuildIcon from '@mui/icons-material/Build';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { Box, Button } from '@bandi/component';
import { useNavigate } from 'react-router-dom';
import { constants } from '@bandi/utils';

type CustomerType =
  | 'mobility'
  | 'logistics'
  | 'parcel'
  | 'user'
  | 'driver-hire'
  | 'vehicle-rental'
  | 'mechanic-hire';

const CUSTOMER_TYPES = [
  {
    type: 'mobility' as CustomerType,
    displayName: 'Mobility',
    tagline: 'Passenger Transport',
    description:
      'Register a customer for ride-hailing and passenger transport — Bike, Auto Rickshaw, Cab, and Shuttle services across the city or outstation.',
    perks: [
      { icon: TwoWheelerIcon, text: 'Bike, Auto, Cab & Shuttle rides' },
      { icon: AutoAwesomeIcon, text: 'On-demand & scheduled bookings' },
      { icon: DirectionsBusIcon, text: 'City & outstation travel' },
    ],
    icon: DirectionsBusIcon,
    color: '#6366f1',
  },
  {
    type: 'logistics' as CustomerType,
    displayName: 'Logistics',
    tagline: 'Goods Transport',
    description:
      'Onboard a business or individual for freight and cargo services — Tata Ace, DCM, Lorry, and full-truckload for goods movement.',
    perks: [
      { icon: LocalShippingIcon, text: 'Tata Ace, DCM & Lorry' },
      { icon: BusinessIcon, text: 'B2B & commercial freight' },
      { icon: AutoAwesomeIcon, text: 'Parcel & bulk cargo' },
    ],
    icon: LocalShippingIcon,
    color: '#f59e0b',
  },
  {
    type: 'parcel' as CustomerType,
    displayName: 'Parcel Delivery',
    tagline: 'Last-Mile Delivery',
    description:
      'Register a captain for parcel and last-mile delivery services — Bike, Auto, and Tata Ace for fast document, food, and goods delivery across the city.',
    perks: [
      { icon: Inventory2Icon, text: 'Documents, food & general goods' },
      { icon: LocationOnIcon, text: 'Local & outstation delivery' },
      { icon: FlashOnIcon, text: 'Same-trip parcel + ride earning' },
    ],
    icon: Inventory2Icon,
    color: '#ea580c',
  },
  {
    type: 'user' as CustomerType,
    displayName: 'Platform User',
    tagline: 'App User Registration',
    description:
      'Register a new platform user with basic profile details — name, contact, and location for app access without vehicle onboarding.',
    perks: [
      { icon: PersonAddIcon, text: 'Basic profile setup' },
      { icon: LocationOnIcon, text: 'City & area onboarding' },
      { icon: PhoneAndroidIcon, text: 'App account ready instantly' },
    ],
    icon: PersonAddIcon,
    color: '#0891b2',
  },
  {
    type: 'driver-hire' as CustomerType,
    displayName: 'Driver Hire',
    tagline: 'Dedicated Driver Services',
    description:
      'Register a customer who needs a dedicated driver — specify vehicle type, shift hours, number of drivers and daily budget.',
    perks: [
      { icon: HailIcon, text: 'Dedicated driver assignment' },
      { icon: AccessTimeIcon, text: 'Flexible shift configuration' },
      { icon: CurrencyRupeeIcon, text: 'Budget & pricing setup' },
    ],
    icon: HailIcon,
    color: '#16a34a',
  },
  {
    type: 'vehicle-rental' as CustomerType,
    displayName: 'Vehicle Rental',
    tagline: 'Self-Drive & Rentals',
    description:
      'Onboard a customer for vehicle rental — choose the vehicle preference and rental duration for self-drive bookings.',
    perks: [
      { icon: CarRentalIcon, text: 'Self-drive vehicle booking' },
      { icon: CalendarTodayIcon, text: 'Daily, weekly & monthly plans' },
      { icon: DirectionsCarIcon, text: 'Multiple vehicle options' },
    ],
    icon: CarRentalIcon,
    color: '#7c3aed',
  },
  {
    type: 'mechanic-hire' as CustomerType,
    displayName: 'Mechanic Hire',
    tagline: 'On-Demand Roadside Repair',
    description:
      'Register a customer who needs an emergency mechanic — whenever a vehicle breaks down, a nearby mechanic is dispatched to resolve the issue on the spot.',
    perks: [
      { icon: MyLocationIcon, text: 'Nearest mechanic dispatched' },
      { icon: FlashOnIcon, text: 'Emergency breakdown support' },
      { icon: DirectionsCarIcon, text: 'All vehicle types covered' },
    ],
    icon: BuildIcon,
    color: '#ea580c',
  },
] as const;

function getVisuals(color: string) {
  return {
    accent: color,
    gradient: `linear-gradient(135deg, ${color}cc 0%, ${color} 100%)`,
    glow: alpha(color, 0.35),
    bgTint: alpha(color, 0.06),
  };
}

const SERVICE_TYPES: CustomerType[] = ['driver-hire', 'vehicle-rental', 'mechanic-hire'];
const SIMPLE_TYPES: CustomerType[] = ['user', ...SERVICE_TYPES];

const CreateCustomer = () => {
  const navigate = useNavigate();
  const { AdminPath } = constants;
  const [selectedType, setSelectedType] = useState<CustomerType | ''>('');

  const selected = CUSTOMER_TYPES.find((t) => t.type === selectedType);

  const handleContinue = () => {
    if (!selectedType) return;
    navigate(AdminPath.CREATE_CUSTOMER_TYPE.replace(':type', selectedType));
  };

  const handleCancel = () => navigate(AdminPath.DASHBOARD);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 2.5,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #0369a1 100%)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.3)',
          borderRadius: '16px',
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
            flexShrink: 0,
          }}
        >
          <GroupsIcon sx={{ fontSize: 24, color: '#fff' }} />
        </Box>
        <Box>
          <Typography
            sx={{
              color: '#f1f5f9',
              fontWeight: 800,
              fontSize: '1.25rem',
              letterSpacing: '-0.01em',
            }}
          >
            Create New Customer
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>
            Select the service type to get started
          </Typography>
        </Box>
      </Box>

      {/* ── Section label ─────────────────────────────────────────────────── */}
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          mb: 1.5,
        }}
      >
        Full Onboarding
      </Typography>

      {/* ── Onboarding cards (Mobility, Logistics, Parcel) ───────────────── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2.5,
          mb: 3,
        }}
      >
        {CUSTOMER_TYPES.filter((t) => !SIMPLE_TYPES.includes(t.type)).map((t) => {
          const isSelected = selectedType === t.type;
          const { accent, gradient, glow, bgTint } = getVisuals(t.color);
          const Icon = t.icon;

          return (
            <CardItem
              key={t.type}
              t={t}
              isSelected={isSelected}
              accent={accent}
              gradient={gradient}
              glow={glow}
              bgTint={bgTint}
              Icon={Icon}
              onSelect={() => setSelectedType(t.type)}
            />
          );
        })}
      </Box>

      {/* ── Section label ─────────────────────────────────────────────────── */}
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          mb: 1.5,
        }}
      >
        On-Demand Services
      </Typography>

      {/* ── Service cards (Driver Hire, Vehicle Rental, Mechanic Hire) ───── */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
          gap: 2.5,
          mb: 3,
        }}
      >
        {CUSTOMER_TYPES.filter((t) => SERVICE_TYPES.includes(t.type)).map((t) => {
          const isSelected = selectedType === t.type;
          const { accent, gradient, glow, bgTint } = getVisuals(t.color);
          const Icon = t.icon;

          return (
            <CardItem
              key={t.type}
              t={t}
              isSelected={isSelected}
              accent={accent}
              gradient={gradient}
              glow={glow}
              bgTint={bgTint}
              Icon={Icon}
              onSelect={() => setSelectedType(t.type)}
            />
          );
        })}
      </Box>

      {/* ── Section label ─────────────────────────────────────────────────── */}
      <Typography
        sx={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'text.secondary',
          textTransform: 'uppercase',
          letterSpacing: '0.6px',
          mb: 1.5,
        }}
      >
        Platform User
      </Typography>

      {/* ── Platform User card ────────────────────────────────────────────── */}
      <Box>
        {CUSTOMER_TYPES.filter((t) => t.type === 'user').map((t) => {
          const isSelected = selectedType === t.type;
          const { accent, gradient, glow, bgTint } = getVisuals(t.color);
          const Icon = t.icon;

          return (
            <CardItem
              key={t.type}
              t={t}
              isSelected={isSelected}
              accent={accent}
              gradient={gradient}
              glow={glow}
              bgTint={bgTint}
              Icon={Icon}
              onSelect={() => setSelectedType(t.type)}
            />
          );
        })}
      </Box>

      {/* ── Sticky CTA bar ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 20,
          mt: 3,
          px: 2.5,
          py: 1.75,
          backgroundColor: 'background.paper',
          borderRadius: '14px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1.5, sm: 0 },
          justifyContent: 'space-between',
          zIndex: 10,
        }}
      >
        <Box>
          {selected && (
            <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary' }}>
              <b>Selected:</b>{' '}
              <span style={{ color: getVisuals(selected.color).accent, fontWeight: 700 }}>
                {selected.displayName}
              </span>
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
          <Button
            variant='outlined'
            color='error'
            size='small'
            onClick={handleCancel}
            sx={{
              height: '40px',
              padding: '0 12px',
              fontSize: '0.8125rem',
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            size='small'
            onClick={handleContinue}
            disabled={!selectedType}
            sx={{
              height: '40px',
              padding: '0 16px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 120 },
              ...(selected && {
                background: getVisuals(selected.color).gradient,
                boxShadow: `0 4px 16px ${getVisuals(selected.color).glow}`,
                '&:hover': {
                  background: getVisuals(selected.color).gradient,
                  filter: 'brightness(1.1)',
                },
              }),
            }}
          >
            Continue
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// ── Reusable card ──────────────────────────────────────────────────────────────

interface CardItemProps {
  t: (typeof CUSTOMER_TYPES)[number];
  isSelected: boolean;
  accent: string;
  gradient: string;
  glow: string;
  bgTint: string;
  Icon: React.ElementType;
  onSelect: () => void;
}

const CardItem = ({
  t,
  isSelected,
  accent,
  gradient,
  glow,
  bgTint,
  Icon,
  onSelect,
}: CardItemProps) => (
  <Box
    onClick={onSelect}
    sx={{
      position: 'relative',
      background: isSelected
        ? `linear-gradient(160deg, ${bgTint} 0%, transparent 60%)`
        : 'background.paper',
      border: isSelected ? `1.5px solid ${accent}` : '1.5px solid transparent',
      boxShadow: isSelected
        ? `0 0 0 3px ${glow}, 0 8px 32px rgba(0,0,0,0.12)`
        : '0 2px 8px rgba(0,0,0,0.06)',
      borderRadius: '16px',
      p: 3,
      cursor: 'pointer',
      overflow: 'hidden',
      transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      '&:hover': {
        boxShadow: isSelected
          ? `0 0 0 3px ${glow}, 0 12px 40px rgba(0,0,0,0.16)`
          : `0 8px 32px ${alpha(accent, 0.22)}`,
        transform: 'translateY(-4px)',
      },
    }}
  >
    {/* Accent top bar */}
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: gradient,
        borderRadius: '16px 16px 0 0',
      }}
    />

    {/* Selected check */}
    {isSelected && (
      <CheckCircleIcon
        sx={{ position: 'absolute', top: 12, right: 12, color: accent, fontSize: 20 }}
      />
    )}

    {/* Icon + title */}
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mt: 0.5 }}>
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: '14px',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 6px 18px ${glow}`,
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 26, color: '#fff' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', lineHeight: 1.2 }}>
          {t.displayName}
        </Typography>
        <Typography
          sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 500, mt: 0.25 }}
        >
          {t.tagline}
        </Typography>
      </Box>
    </Box>

    {/* Description */}
    <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', lineHeight: 1.65, mt: 2 }}>
      {t.description}
    </Typography>

    {/* Perks */}
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, mt: 2 }}>
      {t.perks.map(({ icon: PerkIcon, text }) => (
        <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <PerkIcon sx={{ fontSize: '0.85rem', color: accent, flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.76rem', color: 'text.secondary' }}>{text}</Typography>
        </Box>
      ))}
    </Box>

    {/* CTA hint */}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 2.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          opacity: isSelected ? 1 : 0.4,
          transition: 'opacity 0.2s',
        }}
      >
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: accent }}>
          Select & Continue
        </Typography>
        <ArrowForwardIcon sx={{ fontSize: '0.9rem', color: accent }} />
      </Box>
    </Box>
  </Box>
);

export default CreateCustomer;
