import { Box, Typography } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import NfcIcon from '@mui/icons-material/Nfc';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw';

const FEATURES = [
  { icon: TwoWheelerIcon, label: 'Bikes, cars & all vehicle categories' },
  { icon: ElectricRickshawIcon, label: 'Autos & three-wheelers' },
  { icon: DirectionsBusIcon, label: 'DCMs, lorries & Tata Ace freight' },
  { icon: NfcIcon, label: 'FASTag & toll expense management' },
  { icon: GpsFixedIcon, label: 'Live GPS fleet tracking' },
  { icon: AccountBalanceWalletIcon, label: 'Trip cost & captain settlements' },
  { icon: LocalShippingIcon, label: 'End-to-end logistics visibility' },
];

interface LeftPanelProps {
  classes: Record<string, string>;
  onNavigateSignIn: () => void;
}

const LeftPanel = ({ classes, onNavigateSignIn }: LeftPanelProps) => (
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

    <Typography variant='h5' fontWeight={700} className={classes.heroHeading}>
      One platform for
      <br />
      all your vehicles
    </Typography>
    <Typography className={classes.heroSubtitle}>
      Join fleet managers tracking bikes, cars, lorries, DCMs, and Tata Aces — with FASTag and
      toll integration built in.
    </Typography>

    {FEATURES.map(({ icon: Icon, label }) => (
      <Box key={label} className={classes.featureRow}>
        <Box className={classes.featureIconWrap}>
          <Icon className={classes.featureIconInner} />
        </Box>
        <Typography className={classes.featureLabel}>{label}</Typography>
      </Box>
    ))}

    <Box className={classes.signinLink} onClick={onNavigateSignIn}>
      Already have an account? <strong>Sign in</strong>
    </Box>
  </Box>
);

export default LeftPanel;
