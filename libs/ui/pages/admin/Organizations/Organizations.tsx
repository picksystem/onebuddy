import { Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Column, DataTable, Typography } from '../../../components';

interface OrgRow {
  id: string;
  name: string;
  type: string;
  status: string;
  membersCount: number;
  city: string;
  createdDate: string;
  actions: null;
}

const columns: Column<OrgRow>[] = [
  { id: 'id', label: 'ID', minWidth: 60, sortable: true },
  { id: 'name', label: 'Organization', minWidth: 200, sortable: true },
  {
    id: 'type',
    label: 'Type',
    minWidth: 110,
    align: 'center',
    sortable: true,
    format: (_value, row) => {
      const map: Record<
        string,
        'default' | 'primary' | 'secondary' | 'info' | 'warning' | 'success'
      > = {
        Corporate: 'primary',
        SME: 'warning',
        Startup: 'success',
      };
      return <Chip label={row.type} color={map[row.type] ?? 'default'} size='small' />;
    },
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
        color={row.status === 'active' ? 'success' : row.status === 'trial' ? 'warning' : 'error'}
      />
    ),
  },
  { id: 'membersCount', label: 'Members', minWidth: 90, align: 'right', sortable: true },
  { id: 'city', label: 'City', minWidth: 120, sortable: true },
  { id: 'createdDate', label: 'Created Date', minWidth: 120, sortable: true },
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

const data: OrgRow[] = [
  {
    id: 'O001',
    name: 'Tata Consultancy Services',
    type: 'Corporate',
    status: 'active',
    membersCount: 450,
    city: 'Mumbai',
    createdDate: '2023-04-10',
    actions: null,
  },
  {
    id: 'O002',
    name: 'Infosys BPM Ltd',
    type: 'Corporate',
    status: 'active',
    membersCount: 320,
    city: 'Bangalore',
    createdDate: '2023-06-15',
    actions: null,
  },
  {
    id: 'O003',
    name: 'Redbus Travels',
    type: 'SME',
    status: 'active',
    membersCount: 85,
    city: 'Hyderabad',
    createdDate: '2023-08-22',
    actions: null,
  },
  {
    id: 'O004',
    name: 'Zomato Logistics',
    type: 'Startup',
    status: 'trial',
    membersCount: 34,
    city: 'Gurugram',
    createdDate: '2024-01-05',
    actions: null,
  },
  {
    id: 'O005',
    name: 'Mahindra Logistics',
    type: 'Corporate',
    status: 'active',
    membersCount: 210,
    city: 'Pune',
    createdDate: '2023-10-18',
    actions: null,
  },
  {
    id: 'O006',
    name: 'QuickRide Pvt Ltd',
    type: 'Startup',
    status: 'active',
    membersCount: 47,
    city: 'Chennai',
    createdDate: '2024-02-14',
    actions: null,
  },
  {
    id: 'O007',
    name: 'Bharat Petroleum Corp',
    type: 'Corporate',
    status: 'suspended',
    membersCount: 190,
    city: 'Delhi',
    createdDate: '2023-05-30',
    actions: null,
  },
  {
    id: 'O008',
    name: 'SunBus Solutions',
    type: 'SME',
    status: 'trial',
    membersCount: 62,
    city: 'Ahmedabad',
    createdDate: '2024-03-01',
    actions: null,
  },
];

const Organizations = () => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      minHeight: '100%',
      background: 'linear-gradient(145deg, #faf5ff 0%, #f3e8ff 40%, #faf5ff 100%)',
    }}
  >
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
          mb: 0.5,
        }}
      >
        Organizations
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: { xs: '0.875rem', md: '1rem' } }}>
        Manage organizations and their configurations
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
        { label: 'Total', value: '—', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
        { label: 'Active', value: '—', color: '#6d28d9', bg: 'rgba(109,40,217,0.08)' },
        { label: 'Trial', value: '—', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
        { label: 'Suspended', value: '—', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
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
        border: '1px solid rgba(139,92,246,0.1)',
        boxShadow: '0 4px 24px rgba(139,92,246,0.08)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      <DataTable
        columns={columns}
        data={data}
        rowKey='id'
        title='Organizations List'
        selectable
        searchable
        initialRowsPerPage={10}
        onDelete={(rows) => console.log('Delete', rows)}
      />
    </Box>
  </Box>
);

export default Organizations;
