import { IAuthUser } from '@bandi/interfaces';

export type ConsultantRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
