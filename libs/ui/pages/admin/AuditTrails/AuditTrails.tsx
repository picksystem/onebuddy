import { Chip, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Column, DataTable, Typography } from '../../../components';
import { useStyles } from './styles';

interface AuditRow {
  id: string;
  action: string;
  actor: string;
  target: string;
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
  PERMISSION_CHANGE: { color: 'warning' },
  EXPORT: { color: 'secondary' },
  CONFIG_CHANGE: { color: 'warning' },
  SUSPEND: { color: 'error' },
  RESTORE: { color: 'success' },
};

const columns: Column<AuditRow>[] = [
  { id: 'id', label: 'ID', minWidth: 80, sortable: true },
  {
    id: 'action',
    label: 'Action',
    minWidth: 160,
    align: 'center',
    sortable: true,
    format: (_value, row) => (
      <Chip
        label={row.action.replace(/_/g, ' ')}
        size='small'
        color={actionConfig[row.action]?.color ?? 'default'}
      />
    ),
  },
  { id: 'actor', label: 'Actor', minWidth: 180, sortable: true },
  { id: 'target', label: 'Target', minWidth: 160, sortable: true },
  { id: 'details', label: 'Details', minWidth: 260 },
  { id: 'ipAddress', label: 'IP Address', minWidth: 130, sortable: true },
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
    actor: 'admin@onebuddy.in',
    target: 'Auth Service',
    details: 'Admin login from Chrome on Windows',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 10:45:00',
    actions: null,
  },
  {
    id: 'AT002',
    action: 'CREATE',
    actor: 'admin@onebuddy.in',
    target: 'User: vijay.krishna@gmail.com',
    details: 'New user account created with role USER',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 10:30:12',
    actions: null,
  },
  {
    id: 'AT003',
    action: 'PERMISSION_CHANGE',
    actor: 'admin@onebuddy.in',
    target: 'User: rohan.mehta@yahoo.com',
    details: 'Role changed from USER to CAPTAIN',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 10:15:44',
    actions: null,
  },
  {
    id: 'AT004',
    action: 'DELETE',
    actor: 'admin@onebuddy.in',
    target: 'Tag: Archived Route',
    details: 'Tag permanently deleted from system',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 09:58:31',
    actions: null,
  },
  {
    id: 'AT005',
    action: 'UPDATE',
    actor: 'priya.nair@outlook.com',
    target: 'Captain: Ramesh Kumar (D001)',
    details: 'Profile photo updated',
    ipAddress: '49.206.10.88',
    timestamp: '2024-08-15 09:30:58',
    actions: null,
  },
  {
    id: 'AT006',
    action: 'CONFIG_CHANGE',
    actor: 'admin@onebuddy.in',
    target: 'Platform Settings',
    details: 'Session timeout changed from 60 min to 30 min',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 09:12:07',
    actions: null,
  },
  {
    id: 'AT007',
    action: 'SUSPEND',
    actor: 'admin@onebuddy.in',
    target: 'Organization: Bharat Petroleum Corp',
    details: 'Account suspended due to payment failure',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 08:55:20',
    actions: null,
  },
  {
    id: 'AT008',
    action: 'EXPORT',
    actor: 'admin@onebuddy.in',
    target: 'Users Report',
    details: 'Exported 1,240 user records to CSV',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 08:40:15',
    actions: null,
  },
  {
    id: 'AT009',
    action: 'RESTORE',
    actor: 'admin@onebuddy.in',
    target: 'User: divya.iyer@hotmail.com',
    details: 'Account restored after manual review',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 08:20:33',
    actions: null,
  },
  {
    id: 'AT010',
    action: 'LOGOUT',
    actor: 'admin@onebuddy.in',
    target: 'Auth Service',
    details: 'Admin session ended manually',
    ipAddress: '103.15.48.22',
    timestamp: '2024-08-15 08:00:00',
    actions: null,
  },
];

const AuditTrails = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      {/* Header */}
      <Box className={classes.header}>
        <Typography variant='h4' className={classes.title}>
          Audit Trails
        </Typography>
        <Typography className={classes.subtitle}>
          Complete history of all system activity and changes
        </Typography>
      </Box>

      {/* Stats row */}
      <Box className={classes.statsGrid}>
        {[
          { label: 'Total', value: '—', color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
          { label: 'Today', value: '—', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
          { label: 'Warnings', value: '—', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
          { label: 'Critical', value: '—', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
        ].map((stat) => (
          <Box
            key={stat.label}
            className={classes.statCard}
            sx={{
              background: stat.bg,
              border: `1px solid ${stat.color}22`,
              '&:hover': {
                boxShadow: `0 8px 24px ${stat.color}22`,
                border: `1px solid ${stat.color}44`,
              },
            }}
          >
            <Typography className={classes.statValue} sx={{ color: stat.color }}>
              {stat.value}
            </Typography>
            <Typography className={classes.statLabel}>{stat.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Content card */}
      <Box className={classes.contentCard}>
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
};

export default AuditTrails;
