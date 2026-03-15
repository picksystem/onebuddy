import { Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Column, DataTable, Typography } from '../../../components';

interface SeoRow {
  id: string;
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  status: string;
  lastUpdated: string;
  actions: null;
}

const columns: Column<SeoRow>[] = [
  { id: 'id', label: 'ID', minWidth: 60, sortable: true },
  { id: 'page', label: 'Page', minWidth: 150, sortable: true },
  { id: 'metaTitle', label: 'Meta Title', minWidth: 200, sortable: true },
  {
    id: 'metaDescription',
    label: 'Meta Description',
    minWidth: 250,
    format: (_value, row) => (
      <Typography
        sx={{
          fontSize: '0.8rem',
          color: '#64748b',
          maxWidth: 240,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {row.metaDescription}
      </Typography>
    ),
  },
  { id: 'keywords', label: 'Keywords', minWidth: 180 },
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
          row.status === 'indexed' ? 'success' : row.status === 'pending' ? 'warning' : 'default'
        }
      />
    ),
  },
  { id: 'lastUpdated', label: 'Last Updated', minWidth: 130, sortable: true },
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

const data: SeoRow[] = [
  {
    id: 'SEO001',
    page: 'Home',
    metaTitle: 'OneBuddy - Your Travel Companion App',
    metaDescription:
      "Plan and book your next trip with OneBuddy, India's most trusted travel and ride-hailing app for seamless journeys.",
    keywords: 'travel, ride-hailing, India, trip planning',
    status: 'indexed',
    lastUpdated: '2024-08-10',
    actions: null,
  },
  {
    id: 'SEO002',
    page: 'Captains',
    metaTitle: 'Become a Captain - Earn with OneBuddy',
    metaDescription:
      "Join OneBuddy's captain network and earn a flexible income. Sign up today and start accepting rides.",
    keywords: 'captain signup, earn money, flexible work',
    status: 'indexed',
    lastUpdated: '2024-07-22',
    actions: null,
  },
  {
    id: 'SEO003',
    page: 'About Us',
    metaTitle: 'About OneBuddy - Our Story & Mission',
    metaDescription:
      "Learn about OneBuddy's mission to make travel accessible and safe for everyone across India.",
    keywords: 'about us, travel mission, company story',
    status: 'indexed',
    lastUpdated: '2024-06-15',
    actions: null,
  },
  {
    id: 'SEO004',
    page: 'Contact',
    metaTitle: 'Contact OneBuddy Support Team',
    metaDescription:
      "Get in touch with OneBuddy's 24/7 support team for help with bookings, rides, and account issues.",
    keywords: 'contact support, help, customer service',
    status: 'indexed',
    lastUpdated: '2024-07-01',
    actions: null,
  },
  {
    id: 'SEO005',
    page: 'Pricing',
    metaTitle: 'OneBuddy Pricing & Subscription Plans',
    metaDescription:
      "Explore OneBuddy's flexible pricing plans — Basic, Pro, and Enterprise — tailored to your needs.",
    keywords: 'pricing, plans, subscription, cost',
    status: 'pending',
    lastUpdated: '2024-08-05',
    actions: null,
  },
  {
    id: 'SEO006',
    page: 'Blog',
    metaTitle: 'Travel Tips & News | OneBuddy Blog',
    metaDescription:
      'Discover travel guides, safety tips, and industry news from the OneBuddy team.',
    keywords: 'travel blog, tips, guides, news',
    status: 'indexed',
    lastUpdated: '2024-08-12',
    actions: null,
  },
  {
    id: 'SEO007',
    page: 'Privacy Policy',
    metaTitle: 'Privacy Policy | OneBuddy',
    metaDescription:
      "Read OneBuddy's privacy policy to understand how we collect, use and protect your data.",
    keywords: 'privacy, data protection, GDPR',
    status: 'indexed',
    lastUpdated: '2024-05-20',
    actions: null,
  },
  {
    id: 'SEO008',
    page: 'Careers',
    metaTitle: 'Careers at OneBuddy - Join Our Team',
    metaDescription:
      'Explore exciting career opportunities at OneBuddy and help reshape the future of travel in India.',
    keywords: 'careers, jobs, hiring, work at OneBuddy',
    status: 'draft',
    lastUpdated: '2024-08-14',
    actions: null,
  },
];

const Seo = () => (
  <Box
    sx={{
      p: { xs: 2, sm: 3 },
      minHeight: '100%',
      background: 'linear-gradient(145deg, #f0fdf4 0%, #dcfce7 40%, #f0fdf4 100%)',
    }}
  >
    {/* Header */}
    <Box sx={{ mb: 4 }}>
      <Typography
        variant='h4'
        sx={{
          fontWeight: 800,
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: { xs: '1.5rem', sm: '1.875rem', md: '2rem' },
          mb: 0.5,
        }}
      >
        SEO
      </Typography>
      <Typography sx={{ color: '#64748b', fontSize: { xs: '0.875rem', md: '1rem' } }}>
        Manage SEO metadata, sitemaps and search optimization
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
        { label: 'Pages', value: '—', color: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
        { label: 'Indexed', value: '—', color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
        { label: 'Issues', value: '—', color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
        { label: 'Score', value: '—', color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
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
        border: '1px solid rgba(34,197,94,0.1)',
        boxShadow: '0 4px 24px rgba(22,163,74,0.08)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}
    >
      <DataTable
        columns={columns}
        data={data}
        rowKey='id'
        title='SEO Pages'
        selectable
        searchable
        initialRowsPerPage={10}
        onDelete={(rows) => console.log('Delete', rows)}
      />
    </Box>
  </Box>
);

export default Seo;
