import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@bandi/theme';
import { getBaseStyles } from './ReviewModal.styles.shared';

export const useReviewModalStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {});
