import { Theme } from '@mui/material/styles';
import { createAppStyles } from '@bandi/theme';
import { getBaseStyles } from './DataTable.styles.shared';

export const useStyles = createAppStyles((theme: Theme) => getBaseStyles(theme), {
  admin: {
    toolbar: {},
    toolbarSelected: {},
    title: {},
    searchField: {},
    tableContainer: {},
    tableCell: {},
    clickableRow: {},
    defaultRow: {},
    highlightedRow: {},
    emptyCell: {},
  },
  user: {
    toolbar: {},
    toolbarSelected: {},
    title: {},
    searchField: {},
    tableContainer: {},
    tableCell: {},
    clickableRow: {},
    defaultRow: {},
    highlightedRow: {},
    emptyCell: {},
  },
  captain: {
    toolbar: {},
    toolbarSelected: {},
    title: {},
    searchField: {},
    tableContainer: {},
    tableCell: {},
    clickableRow: {},
    defaultRow: {},
    highlightedRow: {},
    emptyCell: {},
  },
});
