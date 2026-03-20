import { Box, Typography } from '../../../components';
import { useStyles } from './styles';

const AuditTrails = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      {/* Header */}
      <Box className={classes.header}>
        <Typography variant='h4' className={classes.title}>
          Audit Trails
        </Typography>
        <Typography className={classes.subtitle}>
          Complete history of all system activity and changes
        </Typography>
      </Box>
    </Box>
  );
};

export default AuditTrails;
