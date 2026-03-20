import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import { useStyles } from './styles';

const Commissions = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <PercentIcon sx={{ color: '#ea580c', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Commissions
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Configure commission structures and platform fee rules
        </Typography>
      </Box>
    </Box>
  );
};

export default Commissions;
