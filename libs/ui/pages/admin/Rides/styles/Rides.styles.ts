import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@bandi/theme';
import { getBaseStyles } from './Rides.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {
  admin: { container: {}, title: {}, contentCard: {} },
  user: {},
  captain: {},
});
