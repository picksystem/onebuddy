import React from 'react';
import { IAuthUser } from '@bandi/interfaces';

export type UserRow = IAuthUser & { sno: number };

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface EditFormShape {
  firstName: string;
  lastName: string;
  phone: string;
  businessUnit: string;
  employeeId: string;
  role: string;
  isActive: boolean;
  accessFromDate: string;
  accessToDate: string;
  application: string;
  applicationLead: string;
  reasonForAccess: string;
  adminNotes: string;
}

export type InitialCreateValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  businessUnit: string;
  reasonForAccess: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export interface NewUserDraftData {
  values: InitialCreateValues;
  savedAt: string;
  expiresAt: string;
}

export type ChangeProfileErrors = {
  role?: string;
  reasonCode?: string;
  note?: string;
};

export type ResetPwErrors = {
  password?: string;
  confirm?: string;
};

export interface ChangeLogEntry {
  id?: string | number | null;
  createdAt?: string | null;
  changeType?: string | null;
  fieldName?: string | null;
  previousValue?: string | null;
  newValue?: string | null;
  changedByName?: string | null;
  reasonCode?: string | null;
  reasonNotes?: string | null;
}
