import { AdminRow } from '../types/admins.types';

export const getTabLists = (rows: AdminRow[]) => ({
  all: rows,
  pending: rows.filter((r) => r.status === 'pending_approval'),
  approved: rows.filter((r) => r.status === 'active' || r.status === 'invited'),
  rejected: rows.filter((r) => r.status === 'rejected'),
});

export const getFilteredData = (rows: AdminRow[], search: string): AdminRow[] => {
  if (!search.trim()) return rows;
  const q = search.toLowerCase();
  return rows.filter(
    (r) =>
      r.name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.businessUnit?.toLowerCase().includes(q),
  );
};

export const getTableData = (rows: AdminRow[]): AdminRow[] =>
  rows.map((r, i) => ({ ...r, sno: i + 1 }));
