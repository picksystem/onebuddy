import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { useStyles } from './styles';

const Analytics = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <QueryStatsIcon sx={{ color: '#4f46e5', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Analytics
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Platform performance analytics, trends and business insights
        </Typography>
      </Box>
    </Box>
  );
};

export default Analytics;
