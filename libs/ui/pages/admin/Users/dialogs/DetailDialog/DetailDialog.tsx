import {
  Box,
  Typography,
  Chip,
  Grid,
  Divider,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CloseIcon from '@mui/icons-material/Close';
import { UsersRow, ActionType } from '../../types/users.types';
import DetailField from '../../components/DetailField';
import { useStyles } from './styles';

interface DetailDialogProps {
  detailUser: UsersRow | null;
  onClose: () => void;
  onOpenAction: (user: UsersRow, type: ActionType) => void;
}

const statusColor: Record<string, 'warning' | 'default' | 'success' | 'error'> = {
  pending: 'warning',
  under_review: 'default',
  approved: 'success',
  rejected: 'error',
};

const DetailDialog = ({ detailUser, onClose, onOpenAction }: DetailDialogProps) => {
  const { classes } = useStyles();
  return (
    <Dialog
      open={!!detailUser}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
    >
      {detailUser && (
        <>
          {/* Header banner */}
          <Box className={classes.dialogHeader}>
            <Box className={classes.dialogHeaderBadge}>
              <LocalShippingIcon className={classes.dialogHeaderBadgeIcon} />
              <Typography
                variant='caption'
                fontWeight={700}
                className={classes.dialogHeaderBadgeText}
              >
                End User Onboarding Review
              </Typography>
            </Box>
            <Box className={classes.dialogHeaderUserRow}>
              <Avatar className={classes.dialogHeaderAvatar}>
                {`${detailUser.firstName?.[0] ?? ''}${detailUser.lastName?.[0] ?? ''}`.toUpperCase()}
              </Avatar>
              <Box className={classes.dialogHeaderUserInfo}>
                <Typography variant='h6' fontWeight={700} className={classes.dialogHeaderTitle}>
                  {`${detailUser.firstName} ${detailUser.lastName}`.trim()}
                </Typography>
                <Typography variant='body2' className={classes.dialogHeaderSubtitle}>
                  {detailUser.email || detailUser.phone}
                </Typography>
                <Box className={classes.dialogHeaderChipsRow}>
                  <Chip
                    label={detailUser.status
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    color={statusColor[detailUser.status] ?? 'default'}
                    size='small'
                  />
                  <Chip
                    label={detailUser.serviceCategory
                      .replace(/_/g, ' ')
                      .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                    size='small'
                    variant='outlined'
                    color='primary'
                  />
                </Box>
              </Box>
              <IconButton onClick={onClose} className={classes.closeButton}>
                <CloseIcon fontSize='small' />
              </IconButton>
            </Box>
          </Box>

          <DialogContent dividers sx={{ p: 3 }}>
            <Typography variant='subtitle2' color='primary' className={classes.sectionTitle}>
              Personal Info
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <DetailField label='First Name' value={detailUser.firstName} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='Last Name' value={detailUser.lastName} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='Phone' value={detailUser.phone} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='Email' value={detailUser.email} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='City' value={detailUser.city} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='Area' value={detailUser.area} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant='subtitle2' color='primary' className={classes.sectionTitle}>
              Vehicle Details
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <DetailField
                  label='Vehicle Type'
                  value={detailUser.vehicleType
                    ?.replace(/_/g, ' ')
                    .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='Vehicle Number' value={detailUser.vehicleNumber} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField
                  label='Fuel Type'
                  value={detailUser.fuelType
                    ?.replace(/_/g, ' ')
                    .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='Trip Preference' value={detailUser.tripPreference} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant='subtitle2' color='primary' className={classes.sectionTitle}>
              Documents
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid size={{ xs: 6 }}>
                <DetailField label='RC Number' value={detailUser.rcNumber} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='RC Expiry' value={detailUser.rcExpiry} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='DL Number' value={detailUser.dlNumber} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='DL Expiry' value={detailUser.dlExpiry} />
              </Grid>
              {detailUser.insuranceNumber && (
                <>
                  <Grid size={{ xs: 6 }}>
                    <DetailField label='Insurance No.' value={detailUser.insuranceNumber} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <DetailField label='Insurance Expiry' value={detailUser.insuranceExpiry} />
                  </Grid>
                </>
              )}
              {detailUser.pucNumber && (
                <>
                  <Grid size={{ xs: 6 }}>
                    <DetailField label='PUC Number' value={detailUser.pucNumber} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <DetailField label='PUC Expiry' value={detailUser.pucExpiry} />
                  </Grid>
                </>
              )}
              <Grid size={{ xs: 6 }}>
                <DetailField label='ID Proof Type' value={detailUser.idProofType} />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField label='ID Proof Number' value={detailUser.idProofNumber} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant='subtitle2' color='primary' className={classes.sectionTitle}>
              Onboarding Status
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <DetailField
                  label='Status'
                  value={
                    <Chip
                      label={detailUser.status
                        .replace(/_/g, ' ')
                        .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                      color={statusColor[detailUser.status] ?? 'default'}
                      size='small'
                    />
                  }
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <DetailField
                  label='Submitted'
                  value={
                    detailUser.submittedAt
                      ? new Date(detailUser.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'
                  }
                />
              </Grid>
              {detailUser.adminNotes && (
                <Grid size={{ xs: 12 }}>
                  <Box className={classes.reasonBox}>
                    <Typography variant='caption' color='text.secondary'>
                      Admin Notes
                    </Typography>
                    <Typography variant='body2'>{detailUser.adminNotes}</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </DialogContent>

          <DialogActions className={classes.dialogActions}>
            <Button onClick={onClose} variant='outlined' className={classes.closeActionButton}>
              Close
            </Button>
            {(detailUser.status === 'pending' || detailUser.status === 'under_review') && (
              <>
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<CancelOutlinedIcon />}
                  className={classes.rejectButton}
                  onClick={() => {
                    onOpenAction(detailUser, 'reject');
                    onClose();
                  }}
                >
                  Reject
                </Button>
                <Button
                  variant='contained'
                  color='success'
                  startIcon={<CheckCircleOutlineIcon />}
                  className={classes.approveButton}
                  onClick={() => {
                    onOpenAction(detailUser, 'approve');
                    onClose();
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default DetailDialog;
