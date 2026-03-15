import { IAuthUser } from '@bandi/interfaces';

export type SubscriptionsRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
