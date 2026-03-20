import { Box } from '@bandi/component';
import { Typography } from '@mui/material';
import ExtensionIcon from '@mui/icons-material/Extension';
import { useStyles } from './styles';

const Integrations = () => {
  const { classes } = useStyles();
  return (
    <Box className={classes.container}>
      <Box className={classes.header}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
          <ExtensionIcon sx={{ color: '#e11d48', fontSize: '2rem' }} />
          <Typography variant='h4' className={classes.title}>
            Integrations
          </Typography>
        </Box>
        <Typography className={classes.subtitle}>
          Manage third-party integrations, APIs and external service connections
        </Typography>
      </Box>
    </Box>
  );
};

export default Integrations;
