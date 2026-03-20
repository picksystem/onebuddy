import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@bandi/theme';
import { getBaseStyles } from './DriverEarnings.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {
  admin: { container: {}, title: {}, contentCard: {} },
  user: {},
  captain: {},
});
