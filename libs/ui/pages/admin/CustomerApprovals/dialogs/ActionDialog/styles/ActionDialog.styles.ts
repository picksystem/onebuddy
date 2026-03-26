import { makeStyles } from 'tss-react/mui';

export const useStyles = makeStyles()(() => ({
  dialogHeaderApprove: {
    background: 'linear-gradient(135deg, #065f46 0%, #059669 100%)',
    padding: '24px 24px 20px',
    color: '#fff',
  },
  dialogHeaderReject: {
    background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
    padding: '24px 24px 20px',
    color: '#fff',
  },
  dialogHeaderReview: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
    padding: '24px 24px 20px',
    color: '#fff',
  },
  dialogHeaderBadge: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 },
  approveIcon: { fontSize: '18px !important', color: '#6ee7b7 !important' },
  rejectIcon: { fontSize: '18px !important', color: '#fca5a5 !important' },
  reviewIcon: { fontSize: '18px !important', color: '#93c5fd !important' },
  approveBadgeText: {
    color: '#6ee7b7 !important',
    letterSpacing: '1px !important',
    textTransform: 'uppercase' as const,
    fontWeight: '700 !important',
  },
  rejectBadgeText: {
    color: '#fca5a5 !important',
    letterSpacing: '1px !important',
    textTransform: 'uppercase' as const,
    fontWeight: '700 !important',
  },
  reviewBadgeText: {
    color: '#93c5fd !important',
    letterSpacing: '1px !important',
    textTransform: 'uppercase' as const,
    fontWeight: '700 !important',
  },
  dialogHeaderUserRow: { display: 'flex', alignItems: 'center', gap: 16 },
  dialogHeaderUserInfo: { flex: 1, minWidth: 0 },
  dialogHeaderName: {
    color: '#fff !important',
    lineHeight: '1.2 !important',
    fontWeight: '700 !important',
  },
  dialogHeaderMeta: { color: 'rgba(255,255,255,0.75) !important' },
  closeButton: {
    color: 'rgba(255,255,255,0.7) !important',
    '&:hover': { color: '#fff !important', backgroundColor: 'rgba(255,255,255,0.1) !important' },
  },
  descriptionText: { marginBottom: '16px !important' },
  notesTextField: { '& .MuiOutlinedInput-root': { borderRadius: 8 } },
  dialogActions: {
    padding: '16px 24px',
    gap: 12,
    '@media (max-width: 599px)': { flexDirection: 'column' as const, padding: '12px 16px', gap: 8 },
  },
  cancelButton: {
    borderRadius: '8px !important',
    '@media (max-width: 599px)': { width: '100% !important' },
  },
  confirmButton: {
    borderRadius: '8px !important',
    paddingLeft: '24px !important',
    paddingRight: '24px !important',
    '@media (max-width: 599px)': {
      width: '100% !important',
      paddingLeft: '16px !important',
      paddingRight: '24px !important',
    },
  },
}));
