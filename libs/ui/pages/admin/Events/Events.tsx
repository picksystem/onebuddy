import { Box, Typography } from '../../../components';
import { useStyles } from './styles';

const Events = () => {
  const { classes } = useStyles();

  return (
    <Box className={classes.container}>
      {/* Header */}
      <Box className={classes.header}>
        <Typography variant='h4' className={classes.title}>
          Events
        </Typography>
        <Typography className={classes.subtitle}>
          Monitor realtime platform events and triggers
        </Typography>
      </Box>
    </Box>
  );
};

export default Events;
