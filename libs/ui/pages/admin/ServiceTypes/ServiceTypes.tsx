import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import { useStyles } from './styles';

const ServiceTypes = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <MiscellaneousServicesIcon sx={{ color: '#0284c7', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Service Types
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Manage and configure platform service types and their settings
        </Typography>
      </Box>
    </Box>
  );
};

export default ServiceTypes;
