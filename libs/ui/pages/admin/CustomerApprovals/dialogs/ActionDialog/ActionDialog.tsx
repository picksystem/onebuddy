import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { CustomerApprovalRow, ApprovalAction } from '../../hooks/useCustomerApprovals';
import { useStyles } from './styles';

interface ActionDialogProps {
  actionTarget: { row: CustomerApprovalRow; type: ApprovalAction } | null;
  actionNotes: string;
  actionInProgress: number | string | null;
  onClose: () => void;
  onNotesChange: (v: string) => void;
  onConfirm: () => void;
}

const ActionDialog = ({
  actionTarget,
  actionNotes,
  actionInProgress,
  onClose,
  onNotesChange,
  onConfirm,
}: ActionDialogProps) => {
  const { classes } = useStyles();

  const isApprove = actionTarget?.type === 'approve';
  const isReject = actionTarget?.type === 'reject';
  const isReview = actionTarget?.type === 'review';

  const headerClass = isApprove
    ? classes.dialogHeaderApprove
    : isReject
      ? classes.dialogHeaderReject
      : classes.dialogHeaderReview;

  const iconClass = isApprove
    ? classes.approveIcon
    : isReject
      ? classes.rejectIcon
      : classes.reviewIcon;

  const badgeTextClass = isApprove
    ? classes.approveBadgeText
    : isReject
      ? classes.rejectBadgeText
      : classes.reviewBadgeText;

  const badgeLabel = isApprove
    ? 'Approve Request'
    : isReject
      ? 'Reject Request'
      : 'Mark Under Review';

  const BadgeIcon = isApprove
    ? CheckCircleOutlineIcon
    : isReject
      ? CancelOutlinedIcon
      : RateReviewOutlinedIcon;

  return (
    <Dialog
      open={!!actionTarget}
      onClose={onClose}
      maxWidth='xs'
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3, overflow: 'hidden' } } }}
    >
      {actionTarget && (
        <>
          <Box className={headerClass}>
            <Box className={classes.dialogHeaderBadge}>
              <BadgeIcon className={iconClass} />
              <Typography variant='caption' fontWeight={700} className={badgeTextClass}>
                {badgeLabel}
              </Typography>
            </Box>
            <Box className={classes.dialogHeaderUserRow}>
              <Box className={classes.dialogHeaderUserInfo}>
                <Typography
                  variant='subtitle1'
                  fontWeight={700}
                  className={classes.dialogHeaderName}
                >
                  {`${actionTarget.row.firstName} ${actionTarget.row.lastName}`.trim()}
                </Typography>
                <Typography variant='caption' className={classes.dialogHeaderMeta}>
                  {actionTarget.row.userId} ·{' '}
                  {actionTarget.row.serviceCategory === 'mobility' ? 'Mobility' : 'Logistics'} ·{' '}
                  {actionTarget.row.vehicleType}
                </Typography>
              </Box>
              <IconButton onClick={onClose} className={classes.closeButton}>
                <CloseIcon fontSize='small' />
              </IconButton>
            </Box>
          </Box>

          <DialogContent sx={{ p: 3 }}>
            <Typography variant='body2' color='text.secondary' className={classes.descriptionText}>
              {isApprove
                ? `You are about to approve the onboarding request for ${actionTarget.row.firstName}.`
                : isReject
                  ? `You are about to reject the onboarding request from ${actionTarget.row.firstName}.`
                  : `You are about to mark ${actionTarget.row.firstName}'s request as under review.`}
            </Typography>
            <TextField
              label='Notes (optional)'
              multiline
              rows={3}
              fullWidth
              placeholder={
                isApprove
                  ? 'Add any approval notes...'
                  : isReject
                    ? 'Provide a reason for rejection...'
                    : 'Add review notes or next steps...'
              }
              value={actionNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              className={classes.notesTextField}
            />
          </DialogContent>

          <DialogActions className={classes.dialogActions}>
            <Button onClick={onClose} variant='outlined' className={classes.cancelButton}>
              Cancel
            </Button>
            <Button
              variant='contained'
              color={isApprove ? 'success' : isReject ? 'error' : 'primary'}
              startIcon={
                isApprove ? (
                  <CheckCircleOutlineIcon />
                ) : isReject ? (
                  <CancelOutlinedIcon />
                ) : (
                  <RateReviewOutlinedIcon />
                )
              }
              disabled={!!actionInProgress}
              onClick={onConfirm}
              className={classes.confirmButton}
            >
              {actionInProgress
                ? isApprove
                  ? 'Approving...'
                  : isReject
                    ? 'Rejecting...'
                    : 'Saving...'
                : isApprove
                  ? 'Confirm Approve'
                  : isReject
                    ? 'Confirm Reject'
                    : 'Mark Under Review'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ActionDialog;
