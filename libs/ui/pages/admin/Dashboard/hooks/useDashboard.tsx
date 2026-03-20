import { useEffect, useState, useCallback } from 'react';
import { useAuthActionMutation } from '@bandi/services';
import { CustomerOnboardingRow } from '../../UserManagement/types/userManagement.types';

interface GenericRequest {
  status?: string;
  [key: string]: unknown;
}

const VEHICLE_KEYS: Record<string, string> = {
  two_wheeler: 'bike',
  bike: 'bike',
  motorcycle: 'bike',
  scooter: 'bike',
  auto: 'auto',
  three_wheeler: 'auto',
  electric_rickshaw: 'auto',
  rickshaw: 'auto',
  car: 'car',
  sedan: 'car',
  suv: 'car',
  hatchback: 'car',
  mpv: 'car',
  bus: 'shuttle',
  minibus: 'shuttle',
  shuttle: 'shuttle',
  van: 'shuttle',
  tempo_traveller: 'shuttle',
  truck: 'goods',
  mini_truck: 'goods',
  pickup: 'goods',
  goods_carrier: 'goods',
  freight: 'goods',
};

const normalizeVehicle = (vt: string): string => {
  const lower = (vt || '').toLowerCase().replace(/[\s-]+/g, '_');
  if (VEHICLE_KEYS[lower]) return VEHICLE_KEYS[lower];
  for (const [key, val] of Object.entries(VEHICLE_KEYS)) {
    if (lower.includes(key)) return val;
  }
  return 'other';
};

const fmtLabel = (s: string) => s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export const useDashboard = () => {
  const [authAction] = useAuthActionMutation();
  const [onboardings, setOnboardings] = useState<CustomerOnboardingRow[]>([]);
  const [driverHireRequests, setDriverHireRequests] = useState<GenericRequest[]>([]);
  const [vehicleRentalRequests, setVehicleRentalRequests] = useState<GenericRequest[]>([]);
  const [parcelRequests, setParcelRequests] = useState<GenericRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setIsLoading(true);
      const [onboardingsRes, driverHireRes, vehicleRentalRes, parcelRes] = await Promise.all([
        authAction({ action: 'get-customer-onboardings' })
          .unwrap()
          .catch(() => ({ data: [] })),
        authAction({ action: 'get-driver-hire-requests' })
          .unwrap()
          .catch(() => ({ data: [] })),
        authAction({ action: 'get-vehicle-rental-requests' })
          .unwrap()
          .catch(() => ({ data: [] })),
        authAction({ action: 'get-parcel-requests' })
          .unwrap()
          .catch(() => ({ data: [] })),
      ]);
      setOnboardings((onboardingsRes.data || []) as CustomerOnboardingRow[]);
      setDriverHireRequests((driverHireRes.data || []) as GenericRequest[]);
      setVehicleRentalRequests((vehicleRentalRes.data || []) as GenericRequest[]);
      setParcelRequests((parcelRes.data || []) as ParcelRequest[]);
    } finally {
      setIsLoading(false);
    }
  }, [authAction]);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Category splits ────────────────────────────────────────────────────────
  const mobilityOnboardings = onboardings.filter((r) => r.serviceCategory === 'mobility');
  const logisticsOnboardings = onboardings.filter((r) => r.serviceCategory === 'logistics');
  const approvedCaptains = mobilityOnboardings.filter((r) => r.status === 'approved');

  // ── Status breakdown ───────────────────────────────────────────────────────
  const statusCounts = { approved: 0, pending: 0, under_review: 0, rejected: 0 };
  onboardings.forEach((r) => {
    const s = r.status as keyof typeof statusCounts;
    if (s in statusCounts) statusCounts[s]++;
  });

  // ── Vehicle-type mode counts (Service Modes section) ──────────────────────
  const modeCounts: Record<string, number> = { bike: 0, auto: 0, car: 0, shuttle: 0, goods: 0 };
  mobilityOnboardings.forEach((r) => {
    const mode = normalizeVehicle(r.vehicleType || '');
    if (mode in modeCounts) modeCounts[mode]++;
  });
  const maxModeCount = Math.max(...Object.values(modeCounts), 1);

  // ── Vehicle-type distribution donut (replacing Revenue by Mode) ────────────
  const vtDistMap: Record<string, number> = {};
  mobilityOnboardings.forEach((r) => {
    const label = fmtLabel(r.vehicleType || 'unknown');
    vtDistMap[label] = (vtDistMap[label] || 0) + 1;
  });
  const vehicleTypeDistLabels = Object.keys(vtDistMap);
  const vehicleTypeDistSeries = Object.values(vtDistMap);
  const vehicleTypeDistTotal = vehicleTypeDistSeries.reduce((a, b) => a + b, 0);

  // ── City distribution ──────────────────────────────────────────────────────
  const cityCountMap: Record<string, number> = {};
  onboardings.forEach((r) => {
    if (r.city) cityCountMap[r.city] = (cityCountMap[r.city] || 0) + 1;
  });
  const sortedCities = Object.entries(cityCountMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);
  const maxCityCount = sortedCities[0]?.[1] || 1;

  // ── Monthly helpers (last 12 months) ──────────────────────────────────────
  const now = new Date();
  const months12Labels: string[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months12Labels.push(d.toLocaleString('default', { month: 'short' }));
  }

  const getMonthBounds = (monthsAgo: number) => {
    const start = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
    return { start: start.getTime(), end: end.getTime() };
  };

  // Monthly total onboarding count (area chart – replacing Revenue Trend)
  const monthlyOnboardingCounts = months12Labels.map((_, i) => {
    const { start, end } = getMonthBounds(11 - i);
    return onboardings.filter((r) => {
      const t = new Date(r.createdAt).getTime();
      return t >= start && t < end;
    }).length;
  });

  // Monthly by vehicle type (stacked bar – replacing Rides by Mode)
  const VEHICLE_MODE_KEYS = ['bike', 'auto', 'car', 'shuttle', 'goods'] as const;
  const VEHICLE_MODE_NAMES = ['Bike', 'Auto', 'Car', 'Shuttle', 'Goods'];
  const monthlyByVehicleType = VEHICLE_MODE_KEYS.map((vk, ki) => ({
    name: VEHICLE_MODE_NAMES[ki],
    data: months12Labels.map((_, i) => {
      const { start, end } = getMonthBounds(11 - i);
      return mobilityOnboardings.filter((r) => {
        if (normalizeVehicle(r.vehicleType || '') !== vk) return false;
        const t = new Date(r.createdAt).getTime();
        return t >= start && t < end;
      }).length;
    }),
  }));

  // ── Pipeline: last 6 months ────────────────────────────────────────────────
  const pipelineMonths: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    pipelineMonths.push(d.toLocaleString('default', { month: 'short' }));
  }
  const approvedPerMonth = pipelineMonths.map((_, i) => {
    const { start, end } = getMonthBounds(5 - i);
    return onboardings.filter((r) => {
      if (r.status !== 'approved') return false;
      const t = new Date(r.createdAt).getTime();
      return t >= start && t < end;
    }).length;
  });
  const rejectedPerMonth = pipelineMonths.map((_, i) => {
    const { start, end } = getMonthBounds(5 - i);
    return onboardings.filter((r) => {
      if (r.status !== 'rejected') return false;
      const t = new Date(r.createdAt).getTime();
      return t >= start && t < end;
    }).length;
  });

  // ── City bar (replacing Subscriptions by Plan) ─────────────────────────────
  const topCityLabels = sortedCities.map(([name]) => name);
  const topCityCounts = sortedCities.map(([, count]) => count);

  // ── Service-category distribution ─────────────────────────────────────────
  const serviceCategoryCounts: Record<string, number> = {};
  onboardings.forEach((r) => {
    const cat = r.serviceCategory || 'unknown';
    serviceCategoryCounts[cat] = (serviceCategoryCounts[cat] || 0) + 1;
  });

  // ── Health metrics (replacing static Platform Health bars) ─────────────────
  const total = onboardings.length || 1;
  const healthMetrics = [
    {
      label: 'Approval Rate',
      value: `${Math.round((statusCounts.approved / total) * 100)}%`,
      pct: Math.round((statusCounts.approved / total) * 100),
      color: '#10b981',
    },
    {
      label: 'Pending Rate',
      value: `${Math.round((statusCounts.pending / total) * 100)}%`,
      pct: Math.round((statusCounts.pending / total) * 100),
      color: '#f59e0b',
    },
    {
      label: 'Under Review',
      value: `${Math.round((statusCounts.under_review / total) * 100)}%`,
      pct: Math.round((statusCounts.under_review / total) * 100),
      color: '#0ea5e9',
    },
    {
      label: 'Rejection Rate',
      value: `${Math.round((statusCounts.rejected / total) * 100)}%`,
      pct: Math.round((statusCounts.rejected / total) * 100),
      color: '#ef4444',
    },
    {
      label: 'Mobility Share',
      value: `${Math.round((mobilityOnboardings.length / total) * 100)}%`,
      pct: Math.round((mobilityOnboardings.length / total) * 100),
      color: '#4f46e5',
    },
    {
      label: 'Logistics Share',
      value: `${Math.round((logisticsOnboardings.length / total) * 100)}%`,
      pct: Math.round((logisticsOnboardings.length / total) * 100),
      color: '#8b5cf6',
    },
  ];

  // ── Recent onboardings (replacing Live Activity) ───────────────────────────
  const recentOnboardings = [...onboardings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 12)
    .map((r) => ({
      name: `${r.firstName} ${r.lastName}`.trim(),
      city: r.city || '—',
      vehicleType: fmtLabel(r.vehicleType || 'Unknown'),
      serviceCategory: fmtLabel(r.serviceCategory || 'Unknown'),
      status: r.status,
      createdAt: r.createdAt,
    }));

  // ── Top captains ───────────────────────────────────────────────────────────
  const topCaptainsList = approvedCaptains
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return {
    isLoading,
    // Counts
    captainsOnline: approvedCaptains.length,
    totalOnboardings: onboardings.length,
    mobilityCount: mobilityOnboardings.length,
    logisticsCount: logisticsOnboardings.length,
    pendingOnboardingsCount: statusCounts.pending,
    underReviewCount: statusCounts.under_review,
    approvedCount: statusCounts.approved,
    rejectedCount: statusCounts.rejected,
    driverHireCount: driverHireRequests.length,
    vehicleRentalCount: vehicleRentalRequests.length,
    parcelCount: parcelRequests.length,
    // Service modes
    modeCounts,
    maxModeCount,
    // City
    sortedCities,
    maxCityCount,
    topCityLabels,
    topCityCounts,
    // Status
    statusCounts,
    // Pipeline chart
    pipelineMonths,
    approvedPerMonth,
    rejectedPerMonth,
    // Monthly trend (area)
    months12Labels,
    monthlyOnboardingCounts,
    // Monthly by vehicle type (stacked bar)
    monthlyByVehicleType,
    // Vehicle type donut
    vehicleTypeDistLabels,
    vehicleTypeDistSeries,
    vehicleTypeDistTotal,
    // Service category donut
    serviceCategoryCounts,
    // Health metrics
    healthMetrics,
    // Recent activity
    recentOnboardings,
    // Top captains
    topCaptainsList,
  };
};

// keep TS happy for the parcel cast
type ParcelRequest = GenericRequest;
