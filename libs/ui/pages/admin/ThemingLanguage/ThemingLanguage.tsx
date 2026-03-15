import { Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Column, DataTable, Typography } from '../../../components';

interface ThemingRow {
  id: string;
  language: string;
  languageCode: string;
  theme: string;
  isDefault: string;
  status: string;
  actions: null;
}

const columns: Column<ThemingRow>[] = [
  { id: 'id', label: 'ID', minWidth: 60, sortable: true },
  { id: 'language', label: 'Language', minWidth: 150, sortable: true },
  { id: 'languageCode', label: 'Code', minWidth: 90, align: 'center', sortable: true },
  { id: 'theme', label: 'Theme', minWidth: 130, sortable: true },
  {
    id: 'isDefault',
    label: 'Default',
    minWidth: 90,
    align: 'center',
    sortable: true,
    format: (_value, row) => (
      <Chip
        label={row.isDefault}
        size='small'
        color={row.isDefault === 'Yes' ? 'primary' : 'default'}
        variant={row.isDefault === 'Yes' ? 'filled' : 'outlined'}
      />
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
        color={row.status === 'active' ? 'success' : 'default'}
      />
    ),
  },
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

const data: ThemingRow[] = [
  {
    id: 'TL001',
    language: 'English',
    languageCode: 'en',
    theme: 'Light Blue',
    isDefault: 'Yes',
    status: 'active',
    actions: null,
  },
  {
    id: 'TL002',
    language: 'Hindi',
    languageCode: 'hi',
    theme: 'Light Blue',
    isDefault: 'No',
    status: 'active',
    actions: null,
  },
  {
    id: 'TL003',
    language: 'Tamil',
    languageCode: 'ta',
    theme: 'Dark Green',
    isDefault: 'No',
    status: 'active',
    actions: null,
  },
  {
    id: 'TL004',
    language: 'Telugu',
    languageCode: 'te',
    theme: 'Dark Green',
    isDefault: 'No',
    status: 'active',
    actions: null,
  },
  {
    id: 'TL005',
    language: 'Kannada',
    languageCode: 'kn',
    theme: 'Purple Dusk',
    isDefault: 'No',
    status: 'inactive',
    actions: null,
  },
  {
    id: 'TL006',
    language: 'Marathi',
    languageCode: 'mr',
    theme: 'Light Blue',
    isDefault: 'No',
    status: 'active',
    actions: null,
  },
];

const ThemingLanguage = () => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      minHeight: '100%',
      background: 'linear-gradient(145deg, #fdf4ff 0%, #fce7f3 40%, #fdf4ff 100%)',
    }}
  >
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
          mb: 0.5,
        }}
      >
        Theming & Language
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: { xs: '0.875rem', md: '1rem' } }}>
        Customize platform appearance and localization settings
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
        { label: 'Themes', value: '—', color: '#a855f7', bg: 'rgba(168,85,247,0.08)' },
        { label: 'Languages', value: '—', color: '#ec4899', bg: 'rgba(236,72,153,0.08)' },
        { label: 'Active Theme', value: '—', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
        { label: 'Regions', value: '—', color: '#f43f5e', bg: 'rgba(244,63,94,0.08)' },
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
        border: '1px solid rgba(168,85,247,0.1)',
        boxShadow: '0 4px 24px rgba(168,85,247,0.08)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      <DataTable
        columns={columns}
        data={data}
        rowKey='id'
        title='Theming & Language Settings'
        selectable
        searchable
        initialRowsPerPage={10}
        onDelete={(rows) => console.log('Delete', rows)}
      />
    </Box>
  </Box>
);

export default ThemingLanguage;
