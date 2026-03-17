import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@bandi/theme';
import { getBaseStyles } from './Settings.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {
  admin: {
    container: {},
    pageHeader: {},
    tabBar: {},
    panel: {},
  },
  user: {},
  captain: {},
});
