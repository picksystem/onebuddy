import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { useStyles } from './styles';

const Rides = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <LocalTaxiIcon sx={{ color: '#0284c7', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Rides
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Monitor and manage all ride bookings, trips and real-time operations
        </Typography>
      </Box>
    </Box>
  );
};

export default Rides;
