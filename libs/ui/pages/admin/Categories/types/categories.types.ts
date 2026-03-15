import { IAuthUser } from '@bandi/interfaces';

export type CategoriesRow = IAuthUser & { sno: number };
export type ActionType = 'approve' | 'reject';
