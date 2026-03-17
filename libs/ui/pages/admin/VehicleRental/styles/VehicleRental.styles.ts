import { Theme } from '@mui/material/styles';
import { getBaseStyles } from './VehicleRental.styles.shared';
import { createAppStyles } from '../../../../../theme';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {});
