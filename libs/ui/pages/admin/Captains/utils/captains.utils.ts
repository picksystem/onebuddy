import { CaptainsRow } from '../types/captains.types';

export const getFilteredData = (list: CaptainsRow[], search: string): CaptainsRow[] => {
  if (!search) return list;
  return list.filter((row) =>
    Object.values(row).some(
      (val) =>
        val !== null &&
        val !== undefined &&
        String(val).toLowerCase().includes(search.toLowerCase()),
    ),
  );
};

export const getTabLists = (requests: CaptainsRow[]) => ({
  all: requests,
  pending: requests.filter((r) => r.status === 'pending'),
  underReview: requests.filter((r) => r.status === 'under_review'),
  approved: requests.filter((r) => r.status === 'approved'),
  rejected: requests.filter((r) => r.status === 'rejected'),
});
