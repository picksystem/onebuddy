import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import { useStyles } from './styles';

const Transactions = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <PaymentsIcon sx={{ color: '#059669', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Transactions
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Manage platform transactions and payment records
        </Typography>
      </Box>
    </Box>
  );
};

export default Transactions;
