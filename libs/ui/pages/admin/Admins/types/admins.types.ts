import { IAuthUser } from '@bandi/interfaces';

export type AdminRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
