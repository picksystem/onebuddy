import { Typography, alpha, darken } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import { Box, Button } from '@bandi/component';
import { useStyles } from './styles';
import useCreateManagement from './hooks/useCreateManagement';

const MANAGEMENT_TYPES = [
  {
    type: 'admin',
    displayName: 'Admin',
    tagline: 'Full Platform Access',
    description:
      'Create an admin account with complete control over platform settings, users, configuration, and management capabilities.',
    perks: [
      { icon: AdminPanelSettingsOutlinedIcon, text: 'Manage users & roles' },
      { icon: VerifiedUserOutlinedIcon, text: 'Full configuration access' },
      { icon: AnalyticsOutlinedIcon, text: 'All reports & dashboards' },
    ],
    icon: ManageAccountsIcon,
    color: '#6366f1',
  },
  {
    type: 'consultant',
    displayName: 'Consultant',
    tagline: 'Scoped Read Access',
    description:
      'Onboard a consultant with read-only access to review analytics, collaborate on platform operations, and provide advisory support.',
    perks: [
      { icon: AnalyticsOutlinedIcon, text: 'Reports & analytics view' },
      { icon: VerifiedUserOutlinedIcon, text: 'Advisory collaboration' },
      { icon: AdminPanelSettingsOutlinedIcon, text: 'No config changes' },
    ],
    icon: BusinessCenterIcon,
    color: '#0ea5e9',
  },
];

function getVisuals(color: string) {
  return {
    accent: color,
    gradient: `linear-gradient(135deg, ${darken(color, 0.2)} 0%, ${color} 100%)`,
    glow: alpha(color, 0.35),
    bgTint: alpha(color, 0.06),
  };
}

const CreateManagement = () => {
  const { classes } = useStyles();
  const { selectedType, setSelectedType, handleEnterDetails, handleCancelCreation } =
    useCreateManagement();

  const selected = MANAGEMENT_TYPES.find((t) => t.type === selectedType);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Box
        className={classes.managementHero}
        sx={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #0369a1 100%)',
          boxShadow: '0 8px 32px rgba(37,99,235,0.3)',
        }}
      >
        <Box className={classes.managementHeroIcon}>
          <GroupsIcon sx={{ fontSize: 28, color: '#fff' }} />
        </Box>
        <Box className={classes.managementHeroText}>
          <Typography className={classes.managementHeroTitle}>
            Create New Management Account
          </Typography>
          <Typography className={classes.managementHeroSub}>
            Select the type of management account you want to set up
          </Typography>
        </Box>
      </Box>

      {/* ── Type cards ────────────────────────────────────────────────────── */}
      <Box className={classes.ticketTypeGrid}>
        {MANAGEMENT_TYPES.map((t) => {
          const isSelected = selectedType === t.type;
          const { accent, gradient, glow, bgTint } = getVisuals(t.color);
          const Icon = t.icon;

          return (
            <Box
              key={t.type}
              className={classes.ticketCard}
              onClick={() => setSelectedType(t.type)}
              sx={{
                border: isSelected ? `1.5px solid ${accent}` : '1.5px solid transparent',
                boxShadow: isSelected
                  ? `0 0 0 3px ${glow}, 0 8px 32px rgba(0,0,0,0.12)`
                  : '0 2px 8px rgba(0,0,0,0.06)',
                background: isSelected
                  ? `linear-gradient(160deg, ${bgTint} 0%, transparent 60%)`
                  : undefined,
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: isSelected
                    ? `0 0 0 3px ${glow}, 0 12px 40px rgba(0,0,0,0.16)`
                    : `0 8px 32px ${alpha(accent, 0.22)}`,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              {/* Accent bar */}
              <Box className={classes.ticketAccentBar} sx={{ background: gradient }} />

              {/* Selected check */}
              {isSelected && (
                <CheckCircleIcon
                  sx={{ position: 'absolute', top: 12, right: 12, color: accent, fontSize: 20 }}
                />
              )}

              {/* Icon + title */}
              <Box className={classes.ticketCardHeader}>
                <Box
                  className={classes.ticketIconBadge}
                  sx={{ background: gradient, boxShadow: `0 6px 18px ${glow}` }}
                >
                  <Icon sx={{ fontSize: 24, color: '#fff' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography className={classes.ticketCardTitle}>{t.displayName}</Typography>
                  <Typography
                    sx={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: accent,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      mt: 0.25,
                    }}
                  >
                    {t.tagline}
                  </Typography>
                </Box>
              </Box>

              {/* Description */}
              <Typography className={classes.ticketCardDesc}>{t.description}</Typography>

              {/* Perks list */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6, mt: 1 }}>
                {t.perks.map(({ icon: PerkIcon, text }) => (
                  <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <PerkIcon sx={{ fontSize: '0.85rem', color: accent, flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.76rem', color: 'text.secondary' }}>
                      {text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* ── Sticky CTA bar ───────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 20,
          mt: 2,
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
            <Typography className={classes.ctaSelected}>
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
            onClick={handleCancelCreation}
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
            onClick={handleEnterDetails}
            disabled={!selectedType}
            sx={{
              height: '40px',
              padding: '0 16px',
              fontSize: '0.8125rem',
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              minWidth: { sm: 90 },
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

export default CreateManagement;
