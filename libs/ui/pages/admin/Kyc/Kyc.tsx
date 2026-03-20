import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useStyles } from './styles';

const Kyc = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <VerifiedUserIcon sx={{ color: '#0d9488', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            KYC / Verification
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Review and manage KYC documents and identity verification requests
        </Typography>
      </Box>
    </Box>
  );
};

export default Kyc;
