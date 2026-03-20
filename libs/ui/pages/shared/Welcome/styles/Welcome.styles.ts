import { Theme } from '@mui/material/styles';
import { getBaseStyles } from './Welcome.styles.shared';
import { createAppStyles } from '@bandi/theme';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {});
