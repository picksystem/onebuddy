import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useStyles } from './styles';

const DriverEarnings = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <AccountBalanceWalletIcon sx={{ color: '#1d4ed8', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Collections
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Track and manage driver earnings, collections and payouts
        </Typography>
      </Box>
    </Box>
  );
};

export default DriverEarnings;
