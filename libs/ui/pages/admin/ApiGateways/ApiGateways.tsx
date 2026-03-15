import { Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Column, DataTable, Typography } from '../../../components';

interface GatewayRow {
  id: string;
  name: string;
  baseUrl: string;
  method: string;
  status: string;
  rateLimit: string;
  lastChecked: string;
  actions: null;
}

const columns: Column<GatewayRow>[] = [
  { id: 'id', label: 'ID', minWidth: 60, sortable: true },
  { id: 'name', label: 'Gateway Name', minWidth: 180, sortable: true },
  { id: 'baseUrl', label: 'Base URL', minWidth: 220 },
  { id: 'method', label: 'Method', minWidth: 90, align: 'center', sortable: true },
  {
    id: 'status',
    label: 'Status',
    minWidth: 100,
    align: 'center',
    sortable: true,
    format: (_value, row) => (
      <Chip
        label={row.status}
        size='small'
        color={row.status === 'active' ? 'success' : 'default'}
      />
    ),
  },
  { id: 'rateLimit', label: 'Rate Limit', minWidth: 120, align: 'right', sortable: true },
  { id: 'lastChecked', label: 'Last Checked', minWidth: 140, sortable: true },
  {
    id: 'actions',
    label: 'Actions',
    minWidth: 120,
    align: 'center',
    format: () => (
      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
        <IconButton size='small' color='primary'>
          <VisibilityIcon fontSize='small' />
        </IconButton>
        <IconButton size='small' color='warning'>
          <EditIcon fontSize='small' />
        </IconButton>
        <IconButton size='small' color='error'>
          <DeleteIcon fontSize='small' />
        </IconButton>
      </Box>
    ),
  },
];

const data: GatewayRow[] = [
  {
    id: 'GW001',
    name: 'Google Maps Gateway',
    baseUrl: 'https://maps.googleapis.com/maps/api',
    method: 'REST',
    status: 'active',
    rateLimit: '2500 req/day',
    lastChecked: '2024-08-15 10:30',
    actions: null,
  },
  {
    id: 'GW002',
    name: 'Razorpay Payment',
    baseUrl: 'https://api.razorpay.com/v1',
    method: 'REST',
    status: 'active',
    rateLimit: '500 req/min',
    lastChecked: '2024-08-15 10:28',
    actions: null,
  },
  {
    id: 'GW003',
    name: 'Twilio SMS Gateway',
    baseUrl: 'https://api.twilio.com/2010-04-01',
    method: 'REST',
    status: 'active',
    rateLimit: '100 req/min',
    lastChecked: '2024-08-15 09:55',
    actions: null,
  },
  {
    id: 'GW004',
    name: 'Firebase FCM',
    baseUrl: 'https://fcm.googleapis.com/fcm',
    method: 'REST',
    status: 'active',
    rateLimit: '1000 req/min',
    lastChecked: '2024-08-15 10:00',
    actions: null,
  },
  {
    id: 'GW005',
    name: 'AWS S3 Storage',
    baseUrl: 'https://s3.amazonaws.com',
    method: 'REST',
    status: 'active',
    rateLimit: 'Unlimited',
    lastChecked: '2024-08-15 10:15',
    actions: null,
  },
  {
    id: 'GW006',
    name: 'OpenStreetMap Tiles',
    baseUrl: 'https://tile.openstreetmap.org',
    method: 'REST',
    status: 'active',
    rateLimit: '1M req/day',
    lastChecked: '2024-08-15 09:45',
    actions: null,
  },
  {
    id: 'GW007',
    name: 'SendGrid Email',
    baseUrl: 'https://api.sendgrid.com/v3',
    method: 'REST',
    status: 'inactive',
    rateLimit: '200 req/day',
    lastChecked: '2024-08-14 18:30',
    actions: null,
  },
  {
    id: 'GW008',
    name: 'Cashfree Gateway',
    baseUrl: 'https://api.cashfree.com/api/v2',
    method: 'REST',
    status: 'active',
    rateLimit: '300 req/min',
    lastChecked: '2024-08-15 10:20',
    actions: null,
  },
];

const ApiGateways = () => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      minHeight: '100%',
      background: 'linear-gradient(145deg, #f0fdfa 0%, #ccfbf1 40%, #eff6ff 100%)',
    }}
  >
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #14b8a6 0%, #0284c7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
          mb: 0.5,
        }}
      >
        API Gateways
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: { xs: '0.875rem', md: '1rem' } }}>
        Configure and monitor API gateway integrations
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
        { label: 'Gateways', value: '—', color: '#14b8a6', bg: 'rgba(20,184,166,0.08)' },
        { label: 'Active', value: '—', color: '#0284c7', bg: 'rgba(2,132,199,0.08)' },
        { label: 'Requests/s', value: '—', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
        { label: 'Errors', value: '—', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
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
        border: '1px solid rgba(20,184,166,0.1)',
        boxShadow: '0 4px 24px rgba(20,184,166,0.08)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      <DataTable
        columns={columns}
        data={data}
        rowKey='id'
        title='API Gateways List'
        selectable
        searchable
        initialRowsPerPage={10}
        onDelete={(rows) => console.log('Delete', rows)}
      />
    </Box>
  </Box>
);

export default ApiGateways;
