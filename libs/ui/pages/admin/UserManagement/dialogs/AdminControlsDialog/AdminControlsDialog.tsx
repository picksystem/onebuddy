import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
} from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import { useStyles } from './styles';

const THEMES: { name: string; swatch: string; accent: string }[] = [
  { name: 'System', swatch: 'linear-gradient(135deg,#2d5ebb,#e2e8f0)', accent: '#2d5ebb' },
  { name: 'Black and White', swatch: 'linear-gradient(135deg,#111827,#f9fafb)', accent: '#111827' },
  { name: 'Blimey', swatch: 'linear-gradient(135deg,#92400e,#f59e0b)', accent: '#92400e' },
  { name: 'Blues', swatch: 'linear-gradient(135deg,#0369a1,#38bdf8)', accent: '#0369a1' },
  { name: 'Clean', swatch: 'linear-gradient(135deg,#0284c7,#0ea5e9)', accent: '#0284c7' },
  { name: 'Cobalt', swatch: 'linear-gradient(135deg,#312e81,#a5b4fc)', accent: '#312e81' },
  {
    name: 'Cobalt Contrast UI',
    swatch: 'linear-gradient(135deg,#0f2463,#60a5fa)',
    accent: '#0f2463',
  },
  { name: 'Contrast UI', swatch: 'linear-gradient(135deg,#1c1c1c,#facc15)', accent: '#1c1c1c' },
  { name: 'Midnight', swatch: 'linear-gradient(135deg,#1e1b4b,#7c3aed)', accent: '#1e1b4b' },
  { name: 'Rose', swatch: 'linear-gradient(135deg,#881337,#f43f5e)', accent: '#881337' },
  { name: 'Forest', swatch: 'linear-gradient(135deg,#064e3b,#34d399)', accent: '#064e3b' },
];

interface AdminControlsDialogProps {
  open: boolean;
  onClose: () => void;
  isSaving?: boolean;
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

const AdminControlsDialog = ({
  open,
  onClose,
  isSaving = false,
  selectedTheme,
  onThemeChange,
}: AdminControlsDialogProps) => {
  const { classes } = useStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      slotProps={{ paper: { className: classes.dialogPaper } }}
    >
      {/* ── Header ── */}
      <Box className={classes.header}>
        <Box className={classes.headerIconWrap}>
          <TuneIcon className={classes.headerIcon} />
        </Box>
        <Box className={classes.headerTextBox}>
          <Typography className={classes.headerTitle}>Admin Controls</Typography>
          <Typography className={classes.headerSubtitle}>Theme</Typography>
        </Box>
        <Box display='flex' alignItems='center' gap={1}>
          {/* Auto-save indicator */}
          {isSaving ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CircularProgress size={13} thickness={5} sx={{ color: 'rgba(255,255,255,0.7)' }} />
              <Typography
                sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}
              >
                Saving…
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: 0.55 }}>
              <CloudDoneIcon sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }} />
              <Typography
                sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}
              >
                Auto-saved
              </Typography>
            </Box>
          )}
          <IconButton size='small' onClick={onClose} className={classes.headerCloseBtn}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      <DialogContent className={classes.dialogContent}>
        {/* ── Theme Selection ── */}
        <Accordion className={classes.accordion} defaultExpanded disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={classes.expandIcon} />}
            className={classes.accordionSummary}
          >
            <Box className={classes.accordionSummaryInner}>
              <Box className={`${classes.sectionIconCircle} ${classes.sectionIconTeal}`}>
                <ColorLensIcon className={classes.sectionIconWhite} />
              </Box>
              <Box flex={1}>
                <Typography className={classes.accordionTitle}>Theme Selection</Typography>
                <Typography className={classes.accordionSubtitle}>
                  Applied instantly · Synced across all sessions
                </Typography>
              </Box>
              <Chip label={selectedTheme} size='small' className={classes.activeThemeChip} />
            </Box>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <Box className={classes.themeGrid}>
              {THEMES.map((t) => {
                const isSelected = selectedTheme === t.name;
                return (
                  <Box
                    key={t.name}
                    className={`${classes.themeCard} ${isSelected ? classes.themeCardSelected : ''}`}
                    onClick={() => onThemeChange(t.name)}
                  >
                    <Box className={classes.themeSwatch} sx={{ background: t.swatch }} />
                    <Typography className={classes.themeCardLabel}>{t.name}</Typography>
                    {isSelected && (
                      <CheckCircleIcon
                        className={classes.themeCheckIcon}
                        sx={{ color: t.accent, fontSize: 18 }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>
          </AccordionDetails>
        </Accordion>
      </DialogContent>

      <DialogActions className={classes.dialogActions}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 'auto', pl: 0.5 }}>
          {isSaving ? (
            <>
              <CircularProgress size={14} thickness={5} color='primary' />
              <Typography variant='caption' color='text.secondary'>
                Saving changes…
              </Typography>
            </>
          ) : (
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <CloudDoneIcon sx={{ fontSize: '0.85rem', color: 'success.main' }} />
              All changes auto-saved
            </Typography>
          )}
        </Box>
        <Button variant='contained' onClick={onClose} sx={{ borderRadius: 2 }} disabled={isSaving}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminControlsDialog;
