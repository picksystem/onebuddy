import { IAuthUser } from '@bandi/interfaces';

export type AccessRequestRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
