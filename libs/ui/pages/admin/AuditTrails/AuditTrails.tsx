import { Chip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Column, DataTable, Typography } from '../../../components';

interface AuditRow {
  id: string;
  action: string;
  user: string;
  resource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  actions: null;
}

const actionConfig: Record<
  string,
  { color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }
> = {
  CREATE: { color: 'success' },
  UPDATE: { color: 'info' },
  DELETE: { color: 'error' },
  LOGIN: { color: 'primary' },
  LOGOUT: { color: 'default' },
  EXPORT: { color: 'warning' },
  APPROVE: { color: 'success' },
  REJECT: { color: 'error' },
};

const columns: Column<AuditRow>[] = [
  { id: 'id', label: 'ID', minWidth: 60, sortable: true },
  {
    id: 'action',
    label: 'Action',
    minWidth: 110,
    align: 'center',
    sortable: true,
    format: (_value, row) => (
      <Chip label={row.action} size='small' color={actionConfig[row.action]?.color ?? 'default'} />
    ),
  },
  { id: 'user', label: 'User', minWidth: 180, sortable: true },
  { id: 'resource', label: 'Resource', minWidth: 150, sortable: true },
  { id: 'details', label: 'Details', minWidth: 280 },
  { id: 'ipAddress', label: 'IP Address', minWidth: 130 },
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

const data: AuditRow[] = [
  {
    id: 'AT001',
    action: 'LOGIN',
    user: 'aarav.sharma@gmail.com',
    resource: 'Auth Service',
    details: 'Admin login from Chrome 126 on Windows 11',
    ipAddress: '103.21.58.14',
    timestamp: '2024-08-15 10:32:14',
    actions: null,
  },
  {
    id: 'AT002',
    action: 'UPDATE',
    user: 'priya.nair@outlook.com',
    resource: 'Captain Profile',
    details: 'Updated vehicle type for captain D003 from "Sedan" to "Van"',
    ipAddress: '49.36.112.88',
    timestamp: '2024-08-15 10:15:40',
    actions: null,
  },
  {
    id: 'AT003',
    action: 'CREATE',
    user: 'aarav.sharma@gmail.com',
    resource: 'User',
    details: 'New admin user created: divya.ops@onebuddy.in',
    ipAddress: '103.21.58.14',
    timestamp: '2024-08-15 09:58:02',
    actions: null,
  },
  {
    id: 'AT004',
    action: 'DELETE',
    user: 'aarav.sharma@gmail.com',
    resource: 'Tag',
    details: 'Deleted tag "Archived Route" (ID: T009)',
    ipAddress: '103.21.58.14',
    timestamp: '2024-08-15 09:42:30',
    actions: null,
  },
  {
    id: 'AT005',
    action: 'APPROVE',
    user: 'priya.nair@outlook.com',
    resource: 'Approval',
    details: 'Approved captain onboarding request for Ajay Pandey (APR003)',
    ipAddress: '49.36.112.88',
    timestamp: '2024-08-15 09:30:11',
    actions: null,
  },
  {
    id: 'AT006',
    action: 'EXPORT',
    user: 'aarav.sharma@gmail.com',
    resource: 'Report',
    details: 'Exported monthly trip report as CSV (August 2024)',
    ipAddress: '103.21.58.14',
    timestamp: '2024-08-15 09:20:55',
    actions: null,
  },
  {
    id: 'AT007',
    action: 'REJECT',
    user: 'aarav.sharma@gmail.com',
    resource: 'Approval',
    details: 'Rejected account upgrade request from Sneha Reddy (APR004)',
    ipAddress: '103.21.58.14',
    timestamp: '2024-08-15 09:05:39',
    actions: null,
  },
  {
    id: 'AT008',
    action: 'UPDATE',
    user: 'priya.nair@outlook.com',
    resource: 'Subscription',
    details: 'Extended subscription for Karan Patel (S005) by 3 months',
    ipAddress: '49.36.112.88',
    timestamp: '2024-08-14 17:48:22',
    actions: null,
  },
  {
    id: 'AT009',
    action: 'CREATE',
    user: 'priya.nair@outlook.com',
    resource: 'Organization',
    details: 'New organization registered: QuickRide Pvt Ltd (O006)',
    ipAddress: '49.36.112.88',
    timestamp: '2024-08-14 16:35:14',
    actions: null,
  },
  {
    id: 'AT010',
    action: 'LOGOUT',
    user: 'aarav.sharma@gmail.com',
    resource: 'Auth Service',
    details: 'Admin session ended after manual logout',
    ipAddress: '103.21.58.14',
    timestamp: '2024-08-14 15:00:00',
    actions: null,
  },
];

const AuditTrails = () => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      minHeight: '100%',
      background: 'linear-gradient(145deg, #f5f3ff 0%, #ede9fe 40%, #f8f5ff 100%)',
    }}
  >
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
          mb: 0.5,
        }}
      >
        Audit Trails
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: { xs: '0.875rem', md: '1rem' } }}>
        Complete history of all system activity and changes
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
        { label: 'Total Events', value: '—', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
        { label: 'Today', value: '—', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
        { label: 'Users', value: '—', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
        { label: 'Changes', value: '—', color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
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
        border: '1px solid rgba(99,102,241,0.1)',
        boxShadow: '0 4px 24px rgba(99,102,241,0.08)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      <DataTable
        columns={columns}
        data={data}
        rowKey='id'
        title='Audit Trail Log'
        selectable
        searchable
        initialRowsPerPage={10}
        onDelete={(rows) => console.log('Delete', rows)}
      />
    </Box>
  </Box>
);

export default AuditTrails;
