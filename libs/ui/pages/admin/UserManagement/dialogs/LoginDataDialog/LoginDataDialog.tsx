import { UserAvatar } from '@bandi/component';
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CloseIcon from '@mui/icons-material/Close';
import { useStyles } from './styles';
import { UserRow, CustomerOnboardingRow } from '../../types/userManagement.types';
import ReadField from '../../components/ReadField';
import { fmtDateTime, fmtDate } from '../../utils/userManagement.utils';

const STATUS_COLORS: Record<string, 'warning' | 'default' | 'success' | 'error'> = {
  pending: 'warning',
  under_review: 'default',
  approved: 'success',
  rejected: 'error',
};

interface LoginDataDialogProps {
  open: boolean;
  onClose: () => void;
  selectedRow: UserRow | null;
  selectedOnboarding?: CustomerOnboardingRow | null;
}

const LoginDataDialog = ({ open, onClose, selectedRow, selectedOnboarding }: LoginDataDialogProps) => {
  const { classes } = useStyles();
  const isOnboarding = !!selectedOnboarding;

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xs' fullWidth>
      <Box className={classes.header}>
        <Box className={classes.badgeRow}>
          {isOnboarding ? (
            <DirectionsCarIcon className={classes.badgeIcon} />
          ) : (
            <LoginIcon className={classes.badgeIcon} />
          )}
          <Typography variant='caption' fontWeight={700} className={classes.badgeLabel}>
            {isOnboarding ? 'Onboarding Details' : 'Login Activity'}
          </Typography>
        </Box>
        <Box className={classes.userCard}>
          <UserAvatar user={selectedRow ?? {}} size={52} className={classes.headerAvatar} />
          <Box className={classes.userInfo}>
            <Typography variant='h6' fontWeight={700} className={classes.headerTitle}>
              {selectedRow?.name}
            </Typography>
            <Typography variant='body2' className={classes.headerEmail}>
              {isOnboarding
                ? (selectedOnboarding?.phone || selectedRow?.email)
                : selectedRow?.email}
            </Typography>
            {isOnboarding && selectedOnboarding && (
              <Box sx={{ mt: 0.5 }}>
                <Chip
                  label={
                    selectedOnboarding.status
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c) => c.toUpperCase())
                  }
                  size='small'
                  color={STATUS_COLORS[selectedOnboarding.status] ?? 'default'}
                  sx={{ fontSize: '0.68rem', height: 20 }}
                />
              </Box>
            )}
          </Box>
          <IconButton onClick={onClose} className={classes.closeBtn}>
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      </Box>

      <DialogContent dividers>
        {isOnboarding && selectedOnboarding ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <ReadField label='Service Category' value={
                selectedOnboarding.serviceCategory
                  ? selectedOnboarding.serviceCategory.charAt(0).toUpperCase() +
                    selectedOnboarding.serviceCategory.slice(1)
                  : '-'
              } />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <ReadField label='Vehicle Type' value={
                (selectedOnboarding.vehicleType || '-')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              } />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <ReadField label='Vehicle Number' value={selectedOnboarding.vehicleNumber || '-'} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <ReadField label='Fuel Type' value={
                (selectedOnboarding.fuelType || '-')
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              } />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ReadField label='Phone' value={selectedOnboarding.phone || '-'} muted />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ReadField label='Email' value={selectedOnboarding.email || '-'} muted />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ReadField
                label='City / Area'
                value={[selectedOnboarding.city, selectedOnboarding.area]
                  .filter(Boolean)
                  .join(', ') || '-'}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <ReadField label='Access From' value={fmtDate(selectedOnboarding.accessFromDate)} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <ReadField label='Access Until' value={fmtDate(selectedOnboarding.accessToDate)} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <ReadField label='Submitted' value={fmtDateTime(selectedOnboarding.submittedAt)} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <ReadField label='Created' value={fmtDate(selectedOnboarding.createdAt)} />
            </Grid>
            {selectedOnboarding.adminNotes && (
              <Grid size={{ xs: 12 }}>
                <ReadField label='Admin Notes' value={selectedOnboarding.adminNotes} muted />
              </Grid>
            )}
          </Grid>
        ) : (
          selectedRow && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <ReadField label='Work Email' value={selectedRow.email} muted />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <ReadField label='Last Login' value={fmtDateTime(selectedRow.lastLoginAt)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <ReadField label='Last Activity' value={fmtDateTime(selectedRow.lastActivityAt)} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <ReadField
                  label='Failed Login Attempts'
                  value={String(selectedRow.failedLoginAttempts ?? 0)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <ReadField
                  label='Locked Until'
                  value={
                    selectedRow.lockedUntil ? fmtDateTime(selectedRow.lockedUntil) : 'Not locked'
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <ReadField
                  label='Password Changed'
                  value={fmtDateTime(selectedRow.passwordChangedAt)}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <ReadField
                  label='Must Reset Password'
                  value={selectedRow.mustResetPassword ? 'Yes' : 'No'}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <ReadField label='Source' value={selectedRow.source || 'self_signup'} muted />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <ReadField label='Joined' value={fmtDate(selectedRow.createdAt)} />
              </Grid>
            </Grid>
          )
        )}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDataDialog;
