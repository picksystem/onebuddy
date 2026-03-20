import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import { useStyles } from './styles';

const Zones = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <MapIcon sx={{ color: '#16a34a', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Service Zones
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Configure geographic service zones, operational boundaries and coverage areas
        </Typography>
      </Box>
    </Box>
  );
};

export default Zones;
