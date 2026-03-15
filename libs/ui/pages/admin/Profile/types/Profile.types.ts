export interface ProfileForm {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  employeeId: string;
  businessUnit: string;
}

export type LogRow = { sno: number; loginTime: string; ipAddress: string; userAgent: string };
