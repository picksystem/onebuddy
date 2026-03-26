import { Theme } from '@mui/material/styles';
import { createAppStyles } from '../../../../../theme';
import { getBaseStyles } from '../../UserDetail/styles/userDetail.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {});
