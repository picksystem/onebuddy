import { AccessRequestRow } from '../types/accessRequests.types';

export const getTableData = (rows: AccessRequestRow[]): AccessRequestRow[] =>
  rows.map((r, i) => ({ ...r, sno: i + 1 }));

export const getFilteredData = (list: AccessRequestRow[], search: string): AccessRequestRow[] => {
  if (!search) return list;
  const q = search.toLowerCase();
  return list.filter((r) =>
    [r.name, r.email, r.businessUnit, r.requestedRole, r.status].some((v) =>
      String(v || '')
        .toLowerCase()
        .includes(q),
    ),
  );
};

export const getTabLists = (rows: AccessRequestRow[]) => ({
  all: rows,
  admins: rows.filter((r) => r.requestedRole === 'admin'),
  consultants: rows.filter((r) => r.requestedRole === 'consultant'),
  pending: rows.filter((r) => r.status === 'pending_approval'),
});
