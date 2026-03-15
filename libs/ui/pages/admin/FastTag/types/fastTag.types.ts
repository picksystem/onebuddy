import { IAuthUser } from '@bandi/interfaces';

export type FastTagRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
