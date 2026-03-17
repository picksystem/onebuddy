import { useState } from 'react';
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
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import SecurityIcon from '@mui/icons-material/Security';
import TuneIcon from '@mui/icons-material/Tune';
import SettingsIcon from '@mui/icons-material/Settings';
import { useThemeContext } from '@bandi/theme';
import { useStyles } from './styles';

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
  {
    name: 'System',
    swatch: 'linear-gradient(135deg,#2d5ebb,#e2e8f0)',
    accent: '#2d5ebb',
    light: '#e2e8f0',
    sidebar: '#1e3a8a',
    header: '#2d5ebb',
    button: '#2d5ebb',
    buttonText: '#fff',
  },
  {
    name: 'Black and White',
    swatch: 'linear-gradient(135deg,#111827,#f9fafb)',
    accent: '#111827',
    light: '#f3f4f6',
    sidebar: '#0f172a',
    header: '#111827',
    button: '#374151',
    buttonText: '#fff',
  },
  {
    name: 'Blimey',
    swatch: 'linear-gradient(135deg,#92400e,#f59e0b)',
    accent: '#92400e',
    light: '#fef3c7',
    sidebar: '#78350f',
    header: '#92400e',
    button: '#f59e0b',
    buttonText: '#451a03',
  },
  {
    name: 'Blues',
    swatch: 'linear-gradient(135deg,#0369a1,#38bdf8)',
    accent: '#0369a1',
    light: '#e0f2fe',
    sidebar: '#075985',
    header: '#0369a1',
    button: '#0369a1',
    buttonText: '#fff',
  },
  {
    name: 'Clean',
    swatch: 'linear-gradient(135deg,#0284c7,#0ea5e9)',
    accent: '#0284c7',
    light: '#bae6fd',
    sidebar: '#0369a1',
    header: '#0284c7',
    button: '#0ea5e9',
    buttonText: '#fff',
  },
  {
    name: 'Cobalt',
    swatch: 'linear-gradient(135deg,#312e81,#a5b4fc)',
    accent: '#312e81',
    light: '#ede9fe',
    sidebar: '#1e1b4b',
    header: '#312e81',
    button: '#4f46e5',
    buttonText: '#fff',
  },
  {
    name: 'Cobalt Contrast UI',
    swatch: 'linear-gradient(135deg,#0f2463,#60a5fa)',
    accent: '#0f2463',
    light: '#dbeafe',
    sidebar: '#0a1642',
    header: '#0f2463',
    button: '#3b82f6',
    buttonText: '#fff',
  },
  {
    name: 'Contrast UI',
    swatch: 'linear-gradient(135deg,#1c1c1c,#facc15)',
    accent: '#1c1c1c',
    light: '#fef9c3',
    sidebar: '#0a0a0a',
    header: '#1c1c1c',
    button: '#facc15',
    buttonText: '#1c1c1c',
  },
  {
    name: 'Midnight',
    swatch: 'linear-gradient(135deg,#1e1b4b,#7c3aed)',
    accent: '#1e1b4b',
    light: '#ede9fe',
    sidebar: '#13104a',
    header: '#1e1b4b',
    button: '#7c3aed',
    buttonText: '#fff',
  },
  {
    name: 'Rose',
    swatch: 'linear-gradient(135deg,#881337,#f43f5e)',
    accent: '#881337',
    light: '#ffe4e6',
    sidebar: '#6b0f2d',
    header: '#881337',
    button: '#f43f5e',
    buttonText: '#fff',
  },
  {
    name: 'Forest',
    swatch: 'linear-gradient(135deg,#064e3b,#34d399)',
    accent: '#064e3b',
    light: '#d1fae5',
    sidebar: '#033d2e',
    header: '#064e3b',
    button: '#34d399',
    buttonText: '#064e3b',
  },
];

// ── Mini App Preview Mockup ───────────────────────────────────────────────────
const AppPreview = ({ theme, classes }: { theme: ThemeConfig; classes: Record<string, string> }) => (
  <Box className={classes.appPreviewWrapper}>
    {/* Browser chrome */}
    <Box className={classes.browserChrome}>
      {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
        <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
      ))}
      <Box className={classes.browserUrlBar} />
    </Box>

    {/* App layout */}
    <Box className={classes.appLayout}>
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
        <Box
          sx={{
            width: '100%',
            height: 18,
            borderRadius: 1.5,
            background: 'rgba(255,255,255,0.22)',
            mb: 1.5,
          }}
        />
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
          <Box
            sx={{ flex: 1, height: 10, borderRadius: 1, background: 'rgba(255,255,255,0.28)' }}
          />
          {[0, 1].map((i) => (
            <Box
              key={i}
              sx={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.22)',
              }}
            />
          ))}
        </Box>

        {/* Content area */}
        <Box
          sx={{
            flex: 1,
            p: 1.25,
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.85,
          }}
        >
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
            <Box
              key={i}
              sx={{
                width: '100%',
                height: 13,
                borderRadius: 1,
                background: `rgba(226,232,240,${op})`,
              }}
            />
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
                  background:
                    theme.buttonText === '#fff' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.65)',
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
              <Box
                sx={{ width: 22, height: 5, borderRadius: 0.5, background: `${theme.accent}70` }}
              />
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
const GeneralTab = ({ classes }: { classes: Record<string, string> }) => (
  <Box className={classes.settingRowList}>
    {[
      {
        title: 'Platform Name',
        desc: 'The name displayed across the admin panel and emails.',
        value: 'OneBuddy Admin',
      },
      {
        title: 'Support Email',
        desc: 'Contact email shown to users for support queries.',
        value: 'support@onebuddy.in',
      },
      {
        title: 'Default Timezone',
        desc: 'Timezone applied to all timestamps in the system.',
        value: 'Asia/Kolkata (IST)',
      },
      {
        title: 'Default Language',
        desc: 'Primary language for the admin interface.',
        value: 'English (en-IN)',
      },
    ].map((item, i) => (
      <Box key={i} className={classes.settingRow}>
        <Box flex={1}>
          <Typography fontWeight={600} fontSize='0.9rem'>
            {item.title}
          </Typography>
          <Typography fontSize='0.8rem' color='text.secondary' mt={0.3}>
            {item.desc}
          </Typography>
        </Box>
        <Typography className={classes.settingValue}>
          {item.value}
        </Typography>
      </Box>
    ))}
  </Box>
);

// ── Security Tab ──────────────────────────────────────────────────────────────
const SecurityTab = ({ classes }: { classes: Record<string, string> }) => {
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
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#4f46e5',
            },
          }}
        />
      ),
    },
    {
      title: 'Session Timeout',
      desc: 'Automatically sign out inactive sessions after the chosen period.',
      control: (
        <FormControl size='small' sx={{ minWidth: 150 }}>
          <Select
            value={sessionTimeout}
            onChange={(e) => setSessionTimeout(e.target.value as string)}
            sx={{ borderRadius: 2 }}
          >
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
          <Select
            value={loginAttempts}
            onChange={(e) => setLoginAttempts(e.target.value as string)}
            sx={{ borderRadius: 2 }}
          >
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
          <Select
            value={pwExpiry}
            onChange={(e) => setPwExpiry(e.target.value as string)}
            sx={{ borderRadius: 2 }}
          >
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
    <Box className={classes.settingRowList}>
      {rows.map((row, i) => (
        <Box key={i} className={classes.settingRow}>
          <Box flex={1}>
            <Typography fontWeight={600} fontSize='0.9rem'>
              {row.title}
            </Typography>
            <Typography fontSize='0.8rem' color='text.secondary' mt={0.3}>
              {row.desc}
            </Typography>
          </Box>
          {row.control}
        </Box>
      ))}
    </Box>
  );
};

// ── Main Settings Page ────────────────────────────────────────────────────────
const Settings = () => {
  const { classes } = useStyles();
  const [tabValue, setTabValue] = useState(0);
  const { themeName: selectedTheme, setThemeName } = useThemeContext();

  const handleThemeSelect = (name: string) => {
    setThemeName(name);
  };

  const selectedThemeConfig = THEMES.find((t) => t.name === selectedTheme) ?? THEMES[0];

  const TABS = [
    { label: 'General', icon: <SettingsIcon fontSize='small' /> },
    { label: 'Security', icon: <SecurityIcon fontSize='small' /> },
    { label: 'Admin Controls', icon: <TuneIcon fontSize='small' /> },
  ];

  return (
    <Box className={classes.container}>
      {/* ── Hero Header ── */}
      <Box className={classes.pageHeader}>
        <Typography variant='h5' className={classes.pageHeaderTitle}>
          Settings
        </Typography>
        <Typography className={classes.pageHeaderSubtitle}>
          Configure platform preferences, security policies and application appearance.
        </Typography>
      </Box>

      {/* ── Tab Bar ── */}
      <Box className={classes.tabBar}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          className={classes.tabs}
        >
          {TABS.map((tab) => (
            <Tab key={tab.label} icon={tab.icon} iconPosition='start' label={tab.label} />
          ))}
        </Tabs>
      </Box>

      {/* ── Tab Content ── */}
      {tabValue === 0 && <GeneralTab classes={classes} />}
      {tabValue === 1 && <SecurityTab classes={classes} />}
      {tabValue === 2 && (
        <Box className={classes.adminControlsGrid}>
          {/* ── Left: Theme List ── */}
          <Box className={classes.panel}>
            {/* Panel header */}
            <Box className={classes.panelHeader}>
              <Box className={classes.panelHeaderRow}>
                <Box>
                  <Typography className={classes.panelTitle}>
                    Theme Selection
                  </Typography>
                  <Typography className={classes.panelSubtitle}>
                    Click any theme to preview &amp; apply
                  </Typography>
                </Box>
                <Box className={classes.panelAutoSave}>
                  <CloudDoneIcon sx={{ fontSize: '0.9rem', color: 'success.main' }} />
                  <Typography fontSize='0.68rem' color='text.secondary'>
                    Auto-saved
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Theme list */}
            <Box className={classes.themeList}>
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
                      border: isSelected
                        ? `1.5px solid ${theme.accent}`
                        : '1.5px solid transparent',
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
          <Box className={classes.panel}>
            {/* Panel header */}
            <Box className={classes.previewPanelHeaderRow}>
              <Box>
                <Typography className={classes.panelTitle}>
                  Live Preview
                </Typography>
                <Typography className={classes.panelSubtitle}>
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

            <Box className={classes.previewContent}>
              {/* Mini browser + app mockup */}
              <AppPreview theme={selectedThemeConfig} classes={classes} />

              {/* Color palette */}
              <Typography className={classes.colorPaletteLabel}>
                Color Palette
              </Typography>
              <Box className={classes.colorPaletteRow}>
                {[
                  { label: 'Primary', color: selectedThemeConfig.accent },
                  { label: 'Button', color: selectedThemeConfig.button },
                  { label: 'Sidebar', color: selectedThemeConfig.sidebar },
                  { label: 'Header', color: selectedThemeConfig.header },
                ].map(({ label, color }) => (
                  <Box
                    key={label}
                    className={classes.colorSwatch}
                    sx={{
                      '&:hover': {
                        boxShadow: `0 4px 14px ${color}25`,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box
                      className={classes.colorSwatchDot}
                      sx={{
                        background: color,
                        boxShadow: `0 2px 8px ${color}45`,
                      }}
                    />
                    <Box>
                      <Typography className={classes.colorSwatchLabel}>
                        {label}
                      </Typography>
                      <Typography className={classes.colorSwatchHex}>
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
