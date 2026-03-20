import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import RuleIcon from '@mui/icons-material/Rule';
import { useStyles } from './styles';

const BusinessRules = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <RuleIcon sx={{ color: '#475569', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Business Rules
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Define and manage platform business logic, rules and policy configurations
        </Typography>
      </Box>
    </Box>
  );
};

export default BusinessRules;
