import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import { useStyles } from './styles';

const Pricing = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <PriceChangeIcon sx={{ color: '#d97706', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Pricing Rules
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Configure fare structures, surge pricing and platform pricing rules
        </Typography>
      </Box>
    </Box>
  );
};

export default Pricing;
