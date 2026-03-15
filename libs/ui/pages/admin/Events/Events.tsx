import { Chip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Column, DataTable, Typography } from '../../../components';

interface EventRow {
  id: string;
  eventType: string;
  user: string;
  resource: string;
  description: string;
  timestamp: string;
  actions: null;
}

const eventTypeConfig: Record<
  string,
  { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }
> = {
  LOGIN: { color: 'info' },
  LOGOUT: { color: 'default' },
  SIGNUP: { color: 'success' },
  TRIP_START: { color: 'primary' },
  TRIP_END: { color: 'secondary' },
  PAYMENT: { color: 'warning' },
  ERROR: { color: 'error' },
  ALERT: { color: 'error' },
  UPDATE: { color: 'info' },
  DELETE: { color: 'error' },
};

const columns: Column<EventRow>[] = [
  { id: 'id', label: 'ID', minWidth: 60, sortable: true },
  {
    id: 'eventType',
    label: 'Event Type',
    minWidth: 130,
    align: 'center',
    sortable: true,
    format: (_value, row) => (
      <Chip
        label={row.eventType}
        size='small'
        color={eventTypeConfig[row.eventType]?.color ?? 'default'}
      />
    ),
  },
  { id: 'user', label: 'User', minWidth: 160, sortable: true },
  { id: 'resource', label: 'Resource', minWidth: 140, sortable: true },
  { id: 'description', label: 'Description', minWidth: 260 },
  { id: 'timestamp', label: 'Timestamp', minWidth: 160, sortable: true },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 80,
    align: 'center',
    format: () => (
      <IconButton size='small' color='primary'>
        <VisibilityIcon fontSize='small' />
      </IconButton>
    ),
  },
];

const data: EventRow[] = [
  {
    id: 'EV001',
    eventType: 'LOGIN',
    user: 'aarav.sharma@gmail.com',
    resource: 'Auth Service',
    description: 'User logged in from Mumbai, Maharashtra',
    timestamp: '2024-08-15 10:32:14',
    actions: null,
  },
  {
    id: 'EV002',
    eventType: 'TRIP_START',
    user: 'rohan.mehta@yahoo.com',
    resource: 'Trip Service',
    description: 'Trip #TRP4821 started from Bandra to Andheri',
    timestamp: '2024-08-15 10:28:05',
    actions: null,
  },
  {
    id: 'EV003',
    eventType: 'PAYMENT',
    user: 'sneha.reddy@gmail.com',
    resource: 'Payment Gateway',
    description: 'Payment of ₹349 processed via Razorpay for Trip #TRP4820',
    timestamp: '2024-08-15 10:15:33',
    actions: null,
  },
  {
    id: 'EV004',
    eventType: 'SIGNUP',
    user: 'vijay.krishna@gmail.com',
    resource: 'Auth Service',
    description: 'New user registered with mobile +91 98001 23456',
    timestamp: '2024-08-15 10:02:47',
    actions: null,
  },
  {
    id: 'EV005',
    eventType: 'TRIP_END',
    user: 'karan.patel@gmail.com',
    resource: 'Trip Service',
    description: 'Trip #TRP4819 completed — 12.4 km, ₹215',
    timestamp: '2024-08-15 09:58:20',
    actions: null,
  },
  {
    id: 'EV006',
    eventType: 'ERROR',
    user: 'system',
    resource: 'Maps API',
    description: 'Google Maps geocoding returned null for input "Sector 14, Gurgaon"',
    timestamp: '2024-08-15 09:45:11',
    actions: null,
  },
  {
    id: 'EV007',
    eventType: 'UPDATE',
    user: 'priya.nair@outlook.com',
    resource: 'User Service',
    description: 'Profile photo updated for captain Ramesh Kumar (D001)',
    timestamp: '2024-08-15 09:30:58',
    actions: null,
  },
  {
    id: 'EV008',
    eventType: 'ALERT',
    user: 'system',
    resource: 'Captain Service',
    description: 'Captain Suresh Yadav offline for more than 2 hours during active hours',
    timestamp: '2024-08-15 09:20:00',
    actions: null,
  },
  {
    id: 'EV009',
    eventType: 'LOGOUT',
    user: 'divya.iyer@hotmail.com',
    resource: 'Auth Service',
    description: 'Session expired — automatic logout after 60 minutes of inactivity',
    timestamp: '2024-08-15 09:05:43',
    actions: null,
  },
  {
    id: 'EV010',
    eventType: 'DELETE',
    user: 'admin@onebuddy.in',
    resource: 'Tag Service',
    description: 'Tag "Archived Route" deleted by admin',
    timestamp: '2024-08-15 08:50:22',
    actions: null,
  },
];

const Events = () => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      minHeight: '100%',
      background: 'linear-gradient(145deg, #fff0f6 0%, #ffe4ef 40%, #fff5f7 100%)',
    }}
  >
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
          mb: 0.5,
        }}
      >
        Events
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: { xs: '0.875rem', md: '1rem' } }}>
        Monitor realtime platform events and triggers
      </Typography>
    </Box>

    {/* Stats row */}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' },
        gap: { xs: 1.5, sm: 2, md: 2.5 },
        mb: 4,
      }}
    >
      {[
        { label: 'Total', value: '—', color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
        { label: 'Active', value: '—', color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
        { label: 'Scheduled', value: '—', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
        { label: 'Failed', value: '—', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)' },
      ].map((stat) => (
        <Box
          key={stat.label}
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: '14px',
            background: stat.bg,
            border: `1px solid ${stat.color}22`,
            textAlign: 'center',
            transition: 'all 0.25s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: `0 8px 24px ${stat.color}22`,
              border: `1px solid ${stat.color}44`,
            },
          }}
        >
          <Typography
            sx={{ fontSize: { xs: '1.5rem', sm: '1.875rem' }, fontWeight: 800, color: stat.color }}
          >
            {stat.value}
          </Typography>
          <Typography sx={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, mt: 0.25 }}>
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Box>

    {/* Content card */}
    <Box
      sx={{
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(236,72,153,0.1)',
        boxShadow: '0 4px 24px rgba(236,72,153,0.08)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      <DataTable
        columns={columns}
        data={data}
        rowKey='id'
        title='System Events'
        selectable
        searchable
        initialRowsPerPage={10}
        onDelete={(rows) => console.log('Delete', rows)}
      />
    </Box>
  </Box>
);

export default Events;
