import { IAuthUser } from '@bandi/interfaces';

export type UsersRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
