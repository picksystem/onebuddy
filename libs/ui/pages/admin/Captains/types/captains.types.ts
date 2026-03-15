import { IAuthUser } from '@bandi/interfaces';

export type CaptainsRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
