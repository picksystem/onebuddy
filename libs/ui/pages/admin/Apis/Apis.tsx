import { Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Column, DataTable, Typography } from '../../../components';

interface ApiRow {
  id: string;
  endpoint: string;
  method: string;
  status: string;
  callsToday: number;
  avgResponseMs: number;
  lastCalled: string;
  actions: null;
}

const methodConfig: Record<
  string,
  { color: 'default' | 'info' | 'success' | 'warning' | 'error' }
> = {
  GET: { color: 'info' },
  POST: { color: 'success' },
  PUT: { color: 'warning' },
  PATCH: { color: 'warning' },
  DELETE: { color: 'error' },
};

const columns: Column<ApiRow>[] = [
  { id: 'id', label: 'ID', minWidth: 60, sortable: true },
  { id: 'endpoint', label: 'Endpoint', minWidth: 240, sortable: true },
  {
    id: 'method',
    label: 'Method',
    minWidth: 90,
    align: 'center',
    sortable: true,
    format: (_value, row) => (
      <Chip label={row.method} size='small' color={methodConfig[row.method]?.color ?? 'default'} />
    ),
  },
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
        color={
          row.status === 'active' ? 'success' : row.status === 'deprecated' ? 'warning' : 'default'
        }
      />
    ),
  },
  { id: 'callsToday', label: 'Calls Today', minWidth: 110, align: 'right', sortable: true },
  {
    id: 'avgResponseMs',
    label: 'Avg Response',
    minWidth: 130,
    align: 'right',
    sortable: true,
    format: (_value, row) => (
      <Typography
        sx={{
          fontSize: '0.875rem',
          color:
            row.avgResponseMs > 500 ? '#ef4444' : row.avgResponseMs > 200 ? '#f59e0b' : '#10b981',
          fontWeight: 600,
        }}
      >
        {row.avgResponseMs} ms
      </Typography>
    ),
  },
  { id: 'lastCalled', label: 'Last Called', minWidth: 150, sortable: true },
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

const data: ApiRow[] = [
  {
    id: 'API001',
    endpoint: '/api/v1/users',
    method: 'GET',
    status: 'active',
    callsToday: 4821,
    avgResponseMs: 87,
    lastCalled: '2024-08-15 10:32:14',
    actions: null,
  },
  {
    id: 'API002',
    endpoint: '/api/v1/users',
    method: 'POST',
    status: 'active',
    callsToday: 312,
    avgResponseMs: 145,
    lastCalled: '2024-08-15 10:02:47',
    actions: null,
  },
  {
    id: 'API003',
    endpoint: '/api/v1/trips',
    method: 'GET',
    status: 'active',
    callsToday: 9143,
    avgResponseMs: 112,
    lastCalled: '2024-08-15 10:32:00',
    actions: null,
  },
  {
    id: 'API004',
    endpoint: '/api/v1/trips',
    method: 'POST',
    status: 'active',
    callsToday: 2347,
    avgResponseMs: 198,
    lastCalled: '2024-08-15 10:28:05',
    actions: null,
  },
  {
    id: 'API005',
    endpoint: '/api/v1/payments/initiate',
    method: 'POST',
    status: 'active',
    callsToday: 1893,
    avgResponseMs: 321,
    lastCalled: '2024-08-15 10:15:33',
    actions: null,
  },
  {
    id: 'API006',
    endpoint: '/api/v1/captains/:id',
    method: 'PUT',
    status: 'active',
    callsToday: 447,
    avgResponseMs: 162,
    lastCalled: '2024-08-15 10:15:40',
    actions: null,
  },
  {
    id: 'API007',
    endpoint: '/api/v1/captains/:id',
    method: 'DELETE',
    status: 'active',
    callsToday: 12,
    avgResponseMs: 234,
    lastCalled: '2024-08-15 09:42:30',
    actions: null,
  },
  {
    id: 'API008',
    endpoint: '/api/v1/reports/export',
    method: 'GET',
    status: 'deprecated',
    callsToday: 5,
    avgResponseMs: 874,
    lastCalled: '2024-08-15 09:20:55',
    actions: null,
  },
];

const Apis = () => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      minHeight: '100%',
      background: 'linear-gradient(145deg, #f8faff 0%, #f0f4ff 100%)',
    }}
  >
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
          mb: 0.5,
        }}
      >
        APIs
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: { xs: '0.875rem', md: '1rem' } }}>
        Monitor and manage all platform API endpoints
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
        { label: 'Total APIs', value: '—', color: '#4f46e5', bg: 'rgba(79,70,229,0.08)' },
        { label: 'Active', value: '—', color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
        { label: 'Deprecated', value: '—', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
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
        border: '1px solid rgba(79,70,229,0.1)',
        boxShadow: '0 4px 24px rgba(79,70,229,0.08)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      <DataTable
        columns={columns}
        data={data}
        rowKey='id'
        title='API Endpoints'
        selectable
        searchable
        initialRowsPerPage={10}
        onDelete={(rows) => console.log('Delete', rows)}
      />
    </Box>
  </Box>
);

export default Apis;
