import { Box, Typography } from '../../../components';
import { useStyles } from './styles';

const Organizations = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      {/* Header */}
      <Box className={classes.header}>
        <Typography variant='h4' className={classes.title}>
          Organizations
        </Typography>
        <Typography className={classes.subtitle}>
          Manage organizations and their configurations
        </Typography>
      </Box>
    </Box>
  );
};

export default Organizations;
