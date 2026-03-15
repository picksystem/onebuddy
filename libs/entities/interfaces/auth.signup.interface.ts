/**
 * SignUp Interfaces
 * Shared between Frontend and Backend
 */

import { IAuthUser } from './auth.interface';

export interface ISignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reasonForAccess: string;
  employeeId: string;
  businessUnit: string;
  password: string;
  confirmPassword: string;
  role: 'user' | 'admin' | 'captain';
}

export interface ISignUpResponse {
  message: string;
  data: {
    user: IAuthUser;
    roleRequestPending?: boolean;
  };
}
