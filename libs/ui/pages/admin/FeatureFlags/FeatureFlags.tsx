import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import { useStyles } from './styles';

const FeatureFlags = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <ToggleOnIcon sx={{ color: '#7c3aed', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Feature Flags
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Enable or disable platform features and progressive rollouts
        </Typography>
      </Box>
    </Box>
  );
};

export default FeatureFlags;
