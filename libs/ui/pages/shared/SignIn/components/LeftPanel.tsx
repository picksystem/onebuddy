import { Box, Typography } from '@mui/material';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import NfcIcon from '@mui/icons-material/Nfc';
import SpeedIcon from '@mui/icons-material/Speed';

const VEHICLES = [
  { icon: TwoWheelerIcon, label: 'Bikes & two-wheelers' },
  { icon: DirectionsCarIcon, label: 'Cars & passenger vehicles' },
  { icon: ElectricRickshawIcon, label: 'Autos & three-wheelers' },
  { icon: LocalShippingIcon, label: 'Lorries, DCMs & heavy freight' },
  { icon: AirportShuttleIcon, label: 'Tata Ace & light commercial' },
  { icon: NfcIcon, label: 'FASTag toll-lane automation' },
  { icon: SpeedIcon, label: 'Real-time fleet tracking' },
];

interface LeftPanelProps {
  classes: Record<string, string>;
  onNavigateSignUp: () => void;
}

const LeftPanel = ({ classes, onNavigateSignUp }: LeftPanelProps) => (
  <Box className={classes.leftPanel}>
    <Box className={classes.circle1} />
    <Box className={classes.circle2} />
    <Box className={classes.circle3} />

    <Box className={classes.brand}>
      <Box className={classes.brandIcon}>
        <LocalShippingIcon className={classes.brandIcon28} />
      </Box>
      <Typography variant='h4' fontWeight={800} className={classes.brandTitle}>
        OneBuddy
      </Typography>
    </Box>

    <Typography variant='h4' fontWeight={700} className={classes.heroHeading}>
      Your Fleet,
      <br />
      One Platform
    </Typography>
    <Typography className={classes.heroSubtitle}>
      Manage bikes, cars, lorries, DCMs, Tata Aces and more — with FASTag integration and
      real-time tracking.
    </Typography>

    {VEHICLES.map(({ icon: Icon, label }) => (
      <Box key={label} className={classes.featureRow}>
        <Box className={classes.featureIconWrap}>
          <Icon className={classes.featureIconInner} />
        </Box>
        <Typography className={classes.featureLabel}>{label}</Typography>
      </Box>
    ))}

    <Box className={classes.signupLink} onClick={onNavigateSignUp}>
      New to OneBuddy? <strong>Create an account</strong>
    </Box>
  </Box>
);

export default LeftPanel;
