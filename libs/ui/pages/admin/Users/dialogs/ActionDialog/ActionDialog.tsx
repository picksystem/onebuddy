import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CloseIcon from '@mui/icons-material/Close';
import { UsersRow, ActionType } from '../../types/users.types';
import { useStyles } from './styles';

interface ActionDialogProps {
  actionTarget: { user: UsersRow; type: ActionType } | null;
  actionNotes: string;
  actionInProgress: number | null;
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
          {/* Header banner */}
          <Box className={isApprove ? classes.dialogHeaderApprove : classes.dialogHeaderReject}>
            <Box className={classes.dialogHeaderBadge}>
              {isApprove ? (
                <CheckCircleOutlineIcon className={classes.approveIcon} />
              ) : (
                <WarningAmberIcon className={classes.rejectIcon} />
              )}
              <Typography
                variant='caption'
                fontWeight={700}
                className={isApprove ? classes.approveBadgeText : classes.rejectBadgeText}
              >
                {isApprove ? 'Approve Request' : 'Reject Request'}
              </Typography>
            </Box>
            <Box className={classes.dialogHeaderUserRow}>
              <Avatar className={classes.dialogHeaderAvatar}>
                {`${actionTarget.user.firstName?.[0] ?? ''}${actionTarget.user.lastName?.[0] ?? ''}`.toUpperCase()}
              </Avatar>
              <Box className={classes.dialogHeaderUserInfo}>
                <Typography
                  variant='subtitle1'
                  fontWeight={700}
                  className={classes.dialogHeaderName}
                >
                  {`${actionTarget.user.firstName} ${actionTarget.user.lastName}`.trim()}
                </Typography>
                <Typography variant='caption' className={classes.dialogHeaderEmail}>
                  {actionTarget.user.email}
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
                ? `You are about to approve the onboarding request for ${`${actionTarget.user.firstName} ${actionTarget.user.lastName}`.trim()}. Their onboarding will be marked as approved.`
                : `You are about to reject the onboarding request for ${`${actionTarget.user.firstName} ${actionTarget.user.lastName}`.trim()}. They will not be onboarded.`}
            </Typography>
            <TextField
              label='Admin Notes (optional)'
              multiline
              rows={3}
              fullWidth
              placeholder={
                isApprove
                  ? 'Add any notes about this approval...'
                  : 'Provide a reason for rejection...'
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
              color={isApprove ? 'success' : 'error'}
              startIcon={isApprove ? <CheckCircleOutlineIcon /> : <CancelOutlinedIcon />}
              disabled={actionInProgress === actionTarget.user.id}
              onClick={onConfirm}
              className={classes.confirmButton}
            >
              {actionInProgress === actionTarget.user.id
                ? isApprove
                  ? 'Approving...'
                  : 'Rejecting...'
                : isApprove
                  ? 'Confirm Approve'
                  : 'Confirm Reject'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default ActionDialog;
