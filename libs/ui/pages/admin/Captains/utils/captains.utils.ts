import { IAuthUser } from '@bandi/interfaces';
import { CaptainsRow } from '../types/captains.types';

export const getTableData = (list: IAuthUser[]): CaptainsRow[] =>
  list.map((r, i) => ({ ...r, sno: i + 1 }));

export const getFilteredData = (list: IAuthUser[], search: string): CaptainsRow[] => {
  const rows = getTableData(list);
  if (!search) return rows;
  return rows.filter((row) =>
    Object.values(row).some(
      (val) =>
        val !== null &&
        val !== undefined &&
        String(val).toLowerCase().includes(search.toLowerCase()),
    ),
  );
};

export const getTabLists = (requests: IAuthUser[]) => ({
  all: requests,
  pending: requests.filter((r) => r.status === 'pending_approval'),
  approved: requests.filter((r) => r.status === 'active' || r.status === 'invited'),
  rejected: requests.filter((r) => r.status === 'rejected'),
});
