import { IAuthUser } from '@bandi/interfaces';

export type CollectionsRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
