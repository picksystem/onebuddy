import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@bandi/theme';
import { getBaseStyles } from './CreateCustomerForm.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {});
