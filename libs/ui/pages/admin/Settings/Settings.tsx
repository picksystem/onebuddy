import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Switch,
  Select,
  MenuItem,
  FormControl,
  Chip,
  CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SecurityIcon from '@mui/icons-material/Security';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import { useThemeContext } from '@bandi/theme';
import { useGetAdminControlsQuery, useUpdateAdminControlsMutation } from '@bandi/services';

// ── Theme Configs ─────────────────────────────────────────────────────────────
interface ThemeConfig {
  name: string;
  swatch: string;
  accent: string;
  light: string;
  sidebar: string;
  header: string;
  button: string;
  buttonText: string;
}

const THEMES: ThemeConfig[] = [
  { name: 'System', swatch: 'linear-gradient(135deg,#2d5ebb,#e2e8f0)', accent: '#2d5ebb', light: '#e2e8f0', sidebar: '#1e3a8a', header: '#2d5ebb', button: '#2d5ebb', buttonText: '#fff' },
  { name: 'Black and White', swatch: 'linear-gradient(135deg,#111827,#f9fafb)', accent: '#111827', light: '#f3f4f6', sidebar: '#0f172a', header: '#111827', button: '#374151', buttonText: '#fff' },
  { name: 'Blimey', swatch: 'linear-gradient(135deg,#92400e,#f59e0b)', accent: '#92400e', light: '#fef3c7', sidebar: '#78350f', header: '#92400e', button: '#f59e0b', buttonText: '#451a03' },
  { name: 'Blues', swatch: 'linear-gradient(135deg,#0369a1,#38bdf8)', accent: '#0369a1', light: '#e0f2fe', sidebar: '#075985', header: '#0369a1', button: '#0369a1', buttonText: '#fff' },
  { name: 'Clean', swatch: 'linear-gradient(135deg,#0284c7,#0ea5e9)', accent: '#0284c7', light: '#bae6fd', sidebar: '#0369a1', header: '#0284c7', button: '#0ea5e9', buttonText: '#fff' },
  { name: 'Cobalt', swatch: 'linear-gradient(135deg,#312e81,#a5b4fc)', accent: '#312e81', light: '#ede9fe', sidebar: '#1e1b4b', header: '#312e81', button: '#4f46e5', buttonText: '#fff' },
  { name: 'Cobalt Contrast UI', swatch: 'linear-gradient(135deg,#0f2463,#60a5fa)', accent: '#0f2463', light: '#dbeafe', sidebar: '#0a1642', header: '#0f2463', button: '#3b82f6', buttonText: '#fff' },
  { name: 'Contrast UI', swatch: 'linear-gradient(135deg,#1c1c1c,#facc15)', accent: '#1c1c1c', light: '#fef9c3', sidebar: '#0a0a0a', header: '#1c1c1c', button: '#facc15', buttonText: '#1c1c1c' },
  { name: 'Midnight', swatch: 'linear-gradient(135deg,#1e1b4b,#7c3aed)', accent: '#1e1b4b', light: '#ede9fe', sidebar: '#13104a', header: '#1e1b4b', button: '#7c3aed', buttonText: '#fff' },
  { name: 'Rose', swatch: 'linear-gradient(135deg,#881337,#f43f5e)', accent: '#881337', light: '#ffe4e6', sidebar: '#6b0f2d', header: '#881337', button: '#f43f5e', buttonText: '#fff' },
  { name: 'Forest', swatch: 'linear-gradient(135deg,#064e3b,#34d399)', accent: '#064e3b', light: '#d1fae5', sidebar: '#033d2e', header: '#064e3b', button: '#34d399', buttonText: '#064e3b' },
];

// ── Mini App Preview Mockup ───────────────────────────────────────────────────
const AppPreview = ({ theme }: { theme: ThemeConfig }) => (
  <Box
    sx={{
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      transition: 'box-shadow 0.3s ease',
      userSelect: 'none',
    }}
  >
    {/* Browser chrome */}
    <Box
      sx={{
        height: 32,
        background: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: 0.75,
        px: 1.5,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
        <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
      ))}
      <Box sx={{ flex: 1, height: 16, borderRadius: 2, background: '#e2e8f0', mx: 1.5 }} />
    </Box>

    {/* App layout */}
    <Box sx={{ height: 230, display: 'flex' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 82,
          background: `linear-gradient(180deg, ${theme.sidebar} 0%, ${theme.accent}cc 100%)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          p: 1.25,
          pt: 1.75,
        }}
      >
        <Box sx={{ width: '100%', height: 18, borderRadius: 1.5, background: 'rgba(255,255,255,0.22)', mb: 1.5 }} />
        {[true, false, false, false, false].map((active, i) => (
          <Box
            key={i}
            sx={{
              width: '100%',
              height: 22,
              borderRadius: 1.5,
              background: active ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 0.75,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: 0.75,
                flexShrink: 0,
                background: active ? theme.accent : 'rgba(255,255,255,0.4)',
              }}
            />
            <Box
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 0.5,
                background: active ? `${theme.accent}90` : 'rgba(255,255,255,0.25)',
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box
          sx={{
            height: 38,
            background: theme.header,
            display: 'flex',
            alignItems: 'center',
            px: 1.5,
            gap: 1,
          }}
        >
          <Box sx={{ flex: 1, height: 10, borderRadius: 1, background: 'rgba(255,255,255,0.28)' }} />
          {[0, 1].map((i) => (
            <Box key={i} sx={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,0.22)' }} />
          ))}
        </Box>

        {/* Content area */}
        <Box sx={{ flex: 1, p: 1.25, background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 0.85 }}>
          {/* Stat cards */}
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {[
              { bg: theme.accent, bar1: 'rgba(255,255,255,0.75)', bar2: 'rgba(255,255,255,0.4)' },
              { bg: `${theme.accent}1a`, bar1: `${theme.accent}80`, bar2: `${theme.accent}40` },
              { bg: theme.light, bar1: `${theme.accent}60`, bar2: `${theme.accent}30` },
            ].map((card, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  height: 42,
                  borderRadius: 1.75,
                  background: card.bg,
                  border: `1px solid ${theme.accent}18`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  px: 0.85,
                  gap: 0.4,
                }}
              >
                <Box sx={{ width: '65%', height: 5, borderRadius: 0.5, background: card.bar1 }} />
                <Box sx={{ width: '40%', height: 3.5, borderRadius: 0.5, background: card.bar2 }} />
              </Box>
            ))}
          </Box>

          {/* Table rows */}
          {[0.85, 0.65, 0.45].map((op, i) => (
            <Box key={i} sx={{ width: '100%', height: 13, borderRadius: 1, background: `rgba(226,232,240,${op})` }} />
          ))}

          {/* Buttons row */}
          <Box sx={{ display: 'flex', gap: 0.75, mt: 'auto', pt: 0.25 }}>
            {/* Primary button */}
            <Box
              sx={{
                height: 22,
                px: 1.25,
                borderRadius: 1.25,
                background: theme.button,
                display: 'flex',
                alignItems: 'center',
                boxShadow: `0 2px 8px ${theme.accent}35`,
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 5,
                  borderRadius: 0.5,
                  background: theme.buttonText === '#fff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.65)',
                }}
              />
            </Box>
            {/* Outlined button */}
            <Box
              sx={{
                height: 22,
                px: 1.25,
                borderRadius: 1.25,
                border: `1.5px solid ${theme.accent}`,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Box sx={{ width: 22, height: 5, borderRadius: 0.5, background: `${theme.accent}70` }} />
            </Box>
            {/* Chip */}
            <Box
              sx={{
                height: 18,
                px: 0.85,
                borderRadius: 10,
                background: `${theme.accent}15`,
                border: `1px solid ${theme.accent}30`,
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Box sx={{ width: 18, height: 4.5, borderRadius: 0.5, background: theme.accent }} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

// ── General Tab ───────────────────────────────────────────────────────────────
const GeneralTab = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
    {[
      { title: 'Platform Name', desc: 'The name displayed across the admin panel and emails.', value: 'OneBuddy Admin' },
      { title: 'Support Email', desc: 'Contact email shown to users for support queries.', value: 'support@onebuddy.in' },
      { title: 'Default Timezone', desc: 'Timezone applied to all timestamps in the system.', value: 'Asia/Kolkata (IST)' },
      { title: 'Default Language', desc: 'Primary language for the admin interface.', value: 'English (en-IN)' },
    ].map((item, i) => (
      <Box
        key={i}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          p: 2.5,
          borderRadius: 3,
          background: '#fff',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
          transition: 'all 0.2s ease',
          '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transform: 'translateY(-1px)' },
        }}
      >
        <Box flex={1}>
          <Typography fontWeight={600} fontSize='0.9rem'>{item.title}</Typography>
          <Typography fontSize='0.8rem' color='text.secondary' mt={0.3}>{item.desc}</Typography>
        </Box>
        <Typography
          fontSize='0.82rem'
          fontWeight={500}
          sx={{
            px: 2, py: 0.85,
            borderRadius: 2,
            background: 'rgba(79,70,229,0.06)',
            border: '1px solid rgba(79,70,229,0.12)',
            color: '#4f46e5',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {item.value}
        </Typography>
      </Box>
    ))}
  </Box>
);

// ── Security Tab ──────────────────────────────────────────────────────────────
const SecurityTab = () => {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [loginAttempts, setLoginAttempts] = useState('5');
  const [pwExpiry, setPwExpiry] = useState('90');

  const rows = [
    {
      title: 'Two-Factor Authentication',
      desc: 'Require all admin accounts to use 2FA for additional security.',
      control: (
        <Switch
          checked={twoFactor}
          onChange={(e) => setTwoFactor(e.target.checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: '#4f46e5' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#4f46e5' },
          }}
        />
      ),
    },
    {
      title: 'Session Timeout',
      desc: 'Automatically sign out inactive sessions after the chosen period.',
      control: (
        <FormControl size='small' sx={{ minWidth: 150 }}>
          <Select value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value as string)} sx={{ borderRadius: 2 }}>
            <MenuItem value='15'>15 minutes</MenuItem>
            <MenuItem value='30'>30 minutes</MenuItem>
            <MenuItem value='60'>1 hour</MenuItem>
            <MenuItem value='120'>2 hours</MenuItem>
            <MenuItem value='480'>8 hours</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      title: 'Max Login Attempts',
      desc: 'Lock the account after this many consecutive failed sign-in attempts.',
      control: (
        <FormControl size='small' sx={{ minWidth: 140 }}>
          <Select value={loginAttempts} onChange={(e) => setLoginAttempts(e.target.value as string)} sx={{ borderRadius: 2 }}>
            <MenuItem value='3'>3 attempts</MenuItem>
            <MenuItem value='5'>5 attempts</MenuItem>
            <MenuItem value='10'>10 attempts</MenuItem>
          </Select>
        </FormControl>
      ),
    },
    {
      title: 'Password Expiry',
      desc: 'Force users to reset their password after this period.',
      control: (
        <FormControl size='small' sx={{ minWidth: 150 }}>
          <Select value={pwExpiry} onChange={(e) => setPwExpiry(e.target.value as string)} sx={{ borderRadius: 2 }}>
            <MenuItem value='30'>30 days</MenuItem>
            <MenuItem value='60'>60 days</MenuItem>
            <MenuItem value='90'>90 days</MenuItem>
            <MenuItem value='180'>180 days</MenuItem>
            <MenuItem value='never'>Never</MenuItem>
          </Select>
        </FormControl>
      ),
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {rows.map((row, i) => (
        <Box
          key={i}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            p: 2.5,
            borderRadius: 3,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
            transition: 'all 0.2s ease',
            '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)', transform: 'translateY(-1px)' },
          }}
        >
          <Box flex={1}>
            <Typography fontWeight={600} fontSize='0.9rem'>{row.title}</Typography>
            <Typography fontSize='0.8rem' color='text.secondary' mt={0.3}>{row.desc}</Typography>
          </Box>
          {row.control}
        </Box>
      ))}
    </Box>
  );
};

// ── Main Settings Page ────────────────────────────────────────────────────────
const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const { themeName: selectedTheme, setThemeName } = useThemeContext();
  const { data: adminControlsData } = useGetAdminControlsQuery();
  const [updateAdminControls, { isLoading: isSaving }] = useUpdateAdminControlsMutation();

  useEffect(() => {
    if (adminControlsData) {
      const stored = localStorage.getItem('bandi_selected_theme');
      if (!stored || stored === 'System') setThemeName(adminControlsData.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminControlsData]);

  const handleThemeSelect = (name: string) => {
    setThemeName(name);
    updateAdminControls({ theme: name }).catch(() => {});
  };

  const selectedThemeConfig = THEMES.find((t) => t.name === selectedTheme) ?? THEMES[0];

  const TABS = [
    { label: 'General', icon: <SettingsIcon fontSize='small' /> },
    { label: 'Security', icon: <SecurityIcon fontSize='small' /> },
    { label: 'Admin Controls', icon: <TuneIcon fontSize='small' /> },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        minHeight: '100%',
        background: 'linear-gradient(160deg, #f0f4ff 0%, #fafbff 50%, #f0f4ff 100%)',
      }}
    >
      {/* ── Hero Header ── */}
      <Box
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 35%, #4f46e5 70%, #0ea5e9 100%)',
          backgroundSize: '300% 300%',
          borderRadius: 4,
          p: { xs: 3, sm: 4 },
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 56px rgba(79,70,229,0.25)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -80, right: -80,
            width: 280, height: 280,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -60, left: '25%',
            width: 220, height: 220,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Typography
          variant='h5'
          sx={{
            fontWeight: 800,
            color: '#fff',
            fontSize: { xs: '1.4rem', sm: '1.9rem' },
            letterSpacing: '-0.025em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Settings
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255,255,255,0.68)',
            fontSize: '0.875rem',
            mt: 0.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          Configure platform preferences, security policies and application appearance.
        </Typography>
      </Box>

      {/* ── Tab Bar ── */}
      <Box
        sx={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(14px)',
          borderRadius: 3.5,
          p: 0.75,
          mb: 3,
          border: '1px solid rgba(79,70,229,0.08)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        }}
      >
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              minHeight: 44,
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.82rem',
              textTransform: 'none',
              color: 'text.secondary',
              transition: 'all 0.22s ease',
              position: 'relative',
              '&.Mui-selected': {
                color: '#4f46e5',
                background: 'rgba(79,70,229,0.09)',
                boxShadow: '0 2px 10px rgba(79,70,229,0.14)',
              },
              '&:not(:last-of-type)::after': {
                content: '""',
                position: 'absolute',
                right: 0, top: '22%',
                height: '56%', width: 1,
                background: 'rgba(0,0,0,0.1)',
                borderRadius: 1,
                pointerEvents: 'none',
              },
            },
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.label} icon={tab.icon} iconPosition='start' label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* ── Tab Content ── */}
      {tabValue === 0 && <GeneralTab />}
      {tabValue === 1 && <SecurityTab />}
      {tabValue === 2 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '360px 1fr' },
            gap: 3,
            alignItems: 'start',
          }}
        >
          {/* ── Left: Theme List ── */}
          <Box
            sx={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Panel header */}
            <Box sx={{ p: 2.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography fontWeight={700} fontSize='0.95rem'>Theme Selection</Typography>
                  <Typography fontSize='0.78rem' color='text.secondary' mt={0.25}>
                    Click any theme to preview & apply
                  </Typography>
                </Box>
                {isSaving ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                    <CircularProgress size={12} thickness={5} sx={{ color: '#4f46e5' }} />
                    <Typography fontSize='0.7rem' color='text.secondary'>Saving…</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.65 }}>
                    <CloudDoneIcon sx={{ fontSize: '0.9rem', color: 'success.main' }} />
                    <Typography fontSize='0.68rem' color='text.secondary'>Auto-saved</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Theme list */}
            <Box sx={{ p: 1.25, display: 'flex', flexDirection: 'column', gap: 0.5, maxHeight: 540, overflowY: 'auto' }}>
              {THEMES.map((theme) => {
                const isSelected = selectedTheme === theme.name;
                return (
                  <Box
                    key={theme.name}
                    onClick={() => handleThemeSelect(theme.name)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 1.5,
                      borderRadius: 2.5,
                      cursor: 'pointer',
                      background: isSelected ? `${theme.accent}0f` : 'transparent',
                      border: isSelected ? `1.5px solid ${theme.accent}` : '1.5px solid transparent',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: isSelected ? `${theme.accent}0f` : 'rgba(0,0,0,0.025)',
                        border: isSelected
                          ? `1.5px solid ${theme.accent}`
                          : '1.5px solid rgba(0,0,0,0.07)',
                      },
                    }}
                  >
                    {/* Color swatch */}
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        background: theme.swatch,
                        flexShrink: 0,
                        boxShadow: isSelected
                          ? `0 0 0 2px #fff, 0 0 0 4px ${theme.accent}`
                          : '0 2px 8px rgba(0,0,0,0.15)',
                        transition: 'box-shadow 0.25s ease',
                      }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Typography
                        fontWeight={isSelected ? 700 : 500}
                        fontSize='0.875rem'
                        color={isSelected ? theme.accent : 'text.primary'}
                      >
                        {theme.name}
                      </Typography>
                      <Typography fontSize='0.68rem' color='text.disabled' fontFamily='monospace'>
                        {theme.accent}
                      </Typography>
                    </Box>
                    {isSelected && (
                      <CheckCircleIcon sx={{ color: theme.accent, fontSize: 20, flexShrink: 0 }} />
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* ── Right: Preview ── */}
          <Box
            sx={{
              background: 'rgba(255,255,255,0.92)',
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Panel header */}
            <Box
              sx={{
                p: 2.5,
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography fontWeight={700} fontSize='0.95rem'>Live Preview</Typography>
                <Typography fontSize='0.78rem' color='text.secondary' mt={0.25}>
                  How <strong>{selectedTheme}</strong> looks across the application
                </Typography>
              </Box>
              <Chip
                label={selectedTheme}
                size='small'
                sx={{
                  background: `${selectedThemeConfig.accent}15`,
                  color: selectedThemeConfig.accent,
                  border: `1px solid ${selectedThemeConfig.accent}30`,
                  fontWeight: 700,
                  fontSize: '0.72rem',
                }}
              />
            </Box>

            <Box sx={{ p: 2.5 }}>
              {/* Mini browser + app mockup */}
              <AppPreview theme={selectedThemeConfig} />

              {/* Color palette */}
              <Typography
                fontSize='0.7rem'
                fontWeight={700}
                color='text.secondary'
                sx={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.09em',
                  mt: 3,
                  mb: 1.5,
                  display: 'block',
                }}
              >
                Color Palette
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {[
                  { label: 'Primary', color: selectedThemeConfig.accent },
                  { label: 'Button', color: selectedThemeConfig.button },
                  { label: 'Sidebar', color: selectedThemeConfig.sidebar },
                  { label: 'Header', color: selectedThemeConfig.header },
                ].map(({ label, color }) => (
                  <Box
                    key={label}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      background: '#f8fafc',
                      borderRadius: 2.5,
                      px: 1.5,
                      py: 0.85,
                      border: '1px solid rgba(0,0,0,0.06)',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: `0 4px 14px ${color}25`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: 1.5,
                        background: color,
                        flexShrink: 0,
                        border: '1.5px solid rgba(0,0,0,0.1)',
                        boxShadow: `0 2px 8px ${color}45`,
                      }}
                    />
                    <Box>
                      <Typography fontSize='0.7rem' fontWeight={700} color='text.secondary' lineHeight={1.2}>
                        {label}
                      </Typography>
                      <Typography fontSize='0.65rem' color='text.disabled' fontFamily='monospace' lineHeight={1.3}>
                        {color}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Settings;
