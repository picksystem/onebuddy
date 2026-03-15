import { IAuthUser, UserRole, RoleRequestStatus } from '@bandi/interfaces';

/**
 * Auth & User Mock Data
 * Covers all roles, account states, and edge cases
 *
 * Uses shared interfaces from @bandi/interfaces
 * Same types used by Frontend and Backend
 */

export { UserRole, RoleRequestStatus };

// ============================================
// Single User Mocks - By Role
// ============================================

export const mockAdminUser: IAuthUser = {
  id: 1,
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@bandi.com',
  name: 'Admin User',
  phone: '+1-555-0001',
  businessUnit: 'Technology',
  employeeId: 'EMP001',
  dateOfBirth: '1985-03-15',
  profilePicture: null,
  reasonForAccess: null,
  role: UserRole.ADMIN,
  requestedRole: null,
  status: RoleRequestStatus.APPROVED,
  reviewedBy: null,
  reviewedAt: null,
  adminNotes: null,
  isActive: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-02-06T00:00:00Z',
  accessFromDate: null,
  accessToDate: null,
  application: null,
  applicationLead: null,
  captainProfileUpdated: false,
  mustResetPassword: false,
  source: 'admin',
  lastActivityAt: null,
};

export const mockRegularUser: IAuthUser = {
  id: 2,
  firstName: 'Regular',
  lastName: 'User',
  email: 'user@bandi.com',
  name: 'Regular User',
  phone: '+1-555-0002',
  businessUnit: 'Corporate Services',
  employeeId: 'EMP002',
  dateOfBirth: '1990-07-22',
  profilePicture: null,
  reasonForAccess: null,
  role: UserRole.USER,
  requestedRole: null,
  status: RoleRequestStatus.APPROVED,
  reviewedBy: 1,
  reviewedAt: '2026-01-05T10:00:00Z',
  adminNotes: 'Approved - verified with HR',
  isActive: true,
  createdAt: '2026-01-05T09:00:00Z',
  updatedAt: '2026-02-01T00:00:00Z',
  accessFromDate: null,
  accessToDate: null,
  application: null,
  applicationLead: null,
  captainProfileUpdated: false,
  mustResetPassword: false,
  source: 'signup',
  lastActivityAt: null,
};

export const mockCaptainUser: IAuthUser = {
  id: 3,
  firstName: 'Captain',
  lastName: 'User',
  email: 'captain@bandi.com',
  name: 'Captain User',
  phone: '+1-555-0003',
  businessUnit: 'Professional Services',
  employeeId: 'CON001',
  dateOfBirth: null,
  profilePicture: null,
  reasonForAccess: 'Assigned to BANDI implementation project for Q1 2026',
  role: UserRole.CAPTAIN,
  requestedRole: null,
  status: RoleRequestStatus.APPROVED,
  reviewedBy: 1,
  reviewedAt: '2026-01-10T14:00:00Z',
  adminNotes: null,
  isActive: true,
  createdAt: '2026-01-10T12:00:00Z',
  updatedAt: '2026-01-15T00:00:00Z',
  accessFromDate: '2026-01-10T00:00:00Z',
  accessToDate: '2026-12-31T00:00:00Z',
  application: 'BANDI',
  applicationLead: null,
  captainProfileUpdated: false,
  mustResetPassword: false,
  source: 'admin',
  lastActivityAt: null,
};

// ============================================
// Edge Case Mocks
// ============================================

export const mockInactiveUser: IAuthUser = {
  id: 4,
  firstName: 'Inactive',
  lastName: 'Employee',
  email: 'inactive@bandi.com',
  name: 'Inactive Employee',
  phone: null,
  businessUnit: 'Technology',
  employeeId: 'EMP099',
  dateOfBirth: '1988-11-30',
  profilePicture: null,
  reasonForAccess: null,
  role: UserRole.USER,
  requestedRole: null,
  status: RoleRequestStatus.APPROVED,
  reviewedBy: 1,
  reviewedAt: '2026-01-02T10:00:00Z',
  adminNotes: null,
  isActive: false,
  createdAt: '2025-06-01T00:00:00Z',
  updatedAt: '2026-01-20T00:00:00Z',
  accessFromDate: null,
  accessToDate: null,
  application: null,
  applicationLead: null,
  captainProfileUpdated: false,
  mustResetPassword: false,
  source: 'signup',
  lastActivityAt: null,
};

export const mockLockedUser: IAuthUser = {
  id: 5,
  firstName: 'Locked',
  lastName: 'Account',
  email: 'locked@bandi.com',
  name: 'Locked Account',
  phone: '+1-555-0005',
  businessUnit: 'Revenue',
  employeeId: 'EMP045',
  dateOfBirth: '1992-05-10',
  profilePicture: null,
  reasonForAccess: null,
  role: UserRole.USER,
  requestedRole: null,
  status: RoleRequestStatus.APPROVED,
  reviewedBy: 1,
  reviewedAt: '2026-01-03T09:00:00Z',
  adminNotes: null,
  isActive: true,
  createdAt: '2026-01-03T08:00:00Z',
  updatedAt: '2026-02-06T06:00:00Z',
  accessFromDate: null,
  accessToDate: null,
  application: null,
  applicationLead: null,
  captainProfileUpdated: false,
  mustResetPassword: false,
  source: 'signup',
  lastActivityAt: null,
};

export const mockPendingRoleRequestUser: IAuthUser = {
  id: 6,
  firstName: 'Pending',
  lastName: 'Approval',
  email: 'pending@bandi.com',
  name: 'Pending Approval',
  phone: '+1-555-0006',
  businessUnit: 'Technology',
  employeeId: 'EMP078',
  dateOfBirth: '1995-01-20',
  profilePicture: null,
  reasonForAccess: 'Need admin access for incident management responsibilities',
  role: UserRole.USER,
  requestedRole: UserRole.ADMIN,
  status: RoleRequestStatus.PENDING,
  reviewedBy: null,
  reviewedAt: null,
  adminNotes: null,
  isActive: true,
  createdAt: '2026-02-01T11:00:00Z',
  updatedAt: '2026-02-01T11:00:00Z',
  accessFromDate: null,
  accessToDate: null,
  application: null,
  applicationLead: null,
  captainProfileUpdated: false,
  mustResetPassword: false,
  source: 'signup',
  lastActivityAt: null,
};

export const mockRejectedRoleRequestUser: IAuthUser = {
  id: 7,
  firstName: 'Rejected',
  lastName: 'Request',
  email: 'rejected@bandi.com',
  name: 'Rejected Request',
  phone: '+1-555-0007',
  businessUnit: 'Marketing',
  employeeId: 'EMP056',
  dateOfBirth: '1991-09-05',
  profilePicture: null,
  reasonForAccess: 'Want captain access for reporting',
  role: UserRole.USER,
  requestedRole: UserRole.CAPTAIN,
  status: RoleRequestStatus.REJECTED,
  reviewedBy: 1,
  reviewedAt: '2026-01-28T16:00:00Z',
  adminNotes: null,
  isActive: true,
  createdAt: '2026-01-25T09:00:00Z',
  updatedAt: '2026-01-28T16:00:00Z',
  accessFromDate: null,
  accessToDate: null,
  application: null,
  applicationLead: null,
  captainProfileUpdated: false,
  mustResetPassword: false,
  source: 'signup',
  lastActivityAt: null,
};

export const mockPendingSignupUser: IAuthUser = {
  id: 8,
  firstName: 'New',
  lastName: 'Signup',
  email: 'newsignup@bandi.com',
  name: 'New Signup',
  phone: '+1-555-0008',
  businessUnit: 'Technology',
  employeeId: 'EMP100',
  dateOfBirth: '1998-12-01',
  profilePicture: null,
  reasonForAccess: 'New hire needing access to BANDI platform',
  role: UserRole.USER,
  requestedRole: UserRole.USER,
  status: RoleRequestStatus.PENDING,
  reviewedBy: null,
  reviewedAt: null,
  adminNotes: null,
  isActive: false,
  createdAt: '2026-02-05T09:00:00Z',
  updatedAt: '2026-02-05T09:00:00Z',
  accessFromDate: null,
  accessToDate: null,
  application: null,
  applicationLead: null,
  captainProfileUpdated: false,
  mustResetPassword: false,
  source: 'signup',
  lastActivityAt: null,
};

// ============================================
// List Mocks
// ============================================

export const mockUsersEmpty: IAuthUser[] = [];

export const mockUsersAll: IAuthUser[] = [
  mockAdminUser,
  mockRegularUser,
  mockCaptainUser,
  mockInactiveUser,
  mockLockedUser,
  mockPendingRoleRequestUser,
  mockRejectedRoleRequestUser,
  mockPendingSignupUser,
];

export const mockUsersActive: IAuthUser[] = [
  mockAdminUser,
  mockRegularUser,
  mockCaptainUser,
  mockLockedUser,
  mockPendingRoleRequestUser,
  mockRejectedRoleRequestUser,
];

export const mockUsersAdmins: IAuthUser[] = [mockAdminUser];

export const mockUsersCaptains: IAuthUser[] = [mockCaptainUser];

export const mockUsersPendingApproval: IAuthUser[] = [
  mockPendingRoleRequestUser,
  mockPendingSignupUser,
];

// ============================================
// Auth Response Mocks
// ============================================

export const mockSignInResponseAdmin = {
  message: 'Sign in successful',
  data: {
    user: mockAdminUser,
    token: 'mock-jwt-token-admin-xyz123',
    adminApproved: true,
    adminRequestPending: false,
  },
};

export const mockSignInResponseUser = {
  message: 'Sign in successful',
  data: {
    user: mockRegularUser,
    token: 'mock-jwt-token-user-abc456',
    adminApproved: true,
    adminRequestPending: false,
  },
};

export const mockSignInResponseCaptain = {
  message: 'Sign in successful',
  data: {
    user: mockCaptainUser,
    token: 'mock-jwt-token-captain-def789',
    adminApproved: true,
    adminRequestPending: false,
  },
};

export const mockSignInResponsePendingApproval = {
  message: 'Sign in successful but role request pending',
  data: {
    user: mockPendingRoleRequestUser,
    token: 'mock-jwt-token-pending-ghi012',
    adminApproved: false,
    adminRequestPending: true,
  },
};

// ============================================
// Loading/Error States
// ============================================

export const mockUsersLoading = {
  isLoading: true,
  data: null,
  error: null,
};

export const mockUsersError = {
  isLoading: false,
  data: null,
  error: 'Failed to fetch users',
};

export const mockUsersSuccess = {
  isLoading: false,
  data: mockUsersAll,
  error: null,
};
