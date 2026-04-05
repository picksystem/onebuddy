const ADMIN_BASE = '/app/admin';
const USER_BASE = '/app/user';
const CAPTAIN_BASE = '/app/captain';

const AdminPath = {
  // Governance
  DASHBOARD: `${ADMIN_BASE}/dashboard`,
  CONSULTANT: `${ADMIN_BASE}/consultant`,
  APIS: `${ADMIN_BASE}/apis`,
  ACCESS_MANAGEMENT: `${ADMIN_BASE}/access-management`,
  AUDIT_TRAILS: `${ADMIN_BASE}/audit-trails`,
  EVENTS: `${ADMIN_BASE}/events`,

  // Administration
  USERS: `${ADMIN_BASE}/users`,
  CAPTAINS: `${ADMIN_BASE}/captains`,
  ORGANIZATIONS: `${ADMIN_BASE}/organizations`,
  SUBSCRIPTIONS: `${ADMIN_BASE}/subscriptions`,
  COLLECTIONS: `${ADMIN_BASE}/collections`,
  CATEGORIES: `${ADMIN_BASE}/categories`,
  TAGS: `${ADMIN_BASE}/tags`,
  THEMING_LANGUAGE: `${ADMIN_BASE}/theming-language`,
  API_GATEWAYS: `${ADMIN_BASE}/api-gateways`,
  SEO: `${ADMIN_BASE}/seo`,
  USER_MANAGEMENT: `${ADMIN_BASE}/user-management`,
  SETTINGS: `${ADMIN_BASE}/settings`,

  // Mobility Services
  DRIVER_HIRE: `${ADMIN_BASE}/driver-hire`,
  VEHICLE_RENTAL: `${ADMIN_BASE}/vehicle-rental`,
  MECHANIC_HIRE: `${ADMIN_BASE}/mechanic-hire`,
  PARCEL: `${ADMIN_BASE}/parcel`,
  LOGISTICS: `${ADMIN_BASE}/logistics`,

  // Operations
  RIDES: `${ADMIN_BASE}/rides`,

  // Finance
  TRANSACTIONS: `${ADMIN_BASE}/transactions`,
  DRIVER_EARNINGS: `${ADMIN_BASE}/driver-earnings`,
  COMMISSIONS: `${ADMIN_BASE}/commissions`,

  // Requests
  KYC: `${ADMIN_BASE}/kyc`,

  // Reports
  ANALYTICS: `${ADMIN_BASE}/analytics`,

  // Configuration
  PRICING: `${ADMIN_BASE}/pricing`,
  SERVICES: `${ADMIN_BASE}/service-types`,
  RULES: `${ADMIN_BASE}/business-rules`,
  FEATURE_FLAGS: `${ADMIN_BASE}/feature-flags`,
  ZONES: `${ADMIN_BASE}/zones`,
  INTEGRATIONS: `${ADMIN_BASE}/integrations`,

  // Fleet — split by category
  FLEET_MANAGEMENT: `${ADMIN_BASE}/fleet-management`,
  FLEET_ACCESS: `${ADMIN_BASE}/fleet-access`,
  MOBILITY_MANAGEMENT: `${ADMIN_BASE}/mobility-management`,
  MOBILITY_ACCESS: `${ADMIN_BASE}/mobility-access`,
  LOGISTICS_MANAGEMENT: `${ADMIN_BASE}/logistics-management`,
  LOGISTICS_ACCESS: `${ADMIN_BASE}/logistics-access`,

  // User Management
  USER_ACCESS: `${ADMIN_BASE}/user-access`,
  USER_MGMT: `${ADMIN_BASE}/user-mgmt`,

  // Team
  ADMINS: `${ADMIN_BASE}/admins`,

  // Supporting
  PROFILE: `${ADMIN_BASE}/profile`,
  CREATE_CUSTOMER: `${ADMIN_BASE}/create-customer`,
  CREATE_CUSTOMER_TYPE: `${ADMIN_BASE}/create-customer/:type`,
  CUSTOMER_APPROVALS: `${ADMIN_BASE}/customer-approvals`,

  // User Detail
  USER_DETAIL: `${ADMIN_BASE}/user/:id`,
  CUSTOMER_DETAIL: `${ADMIN_BASE}/customer/:id`,

  // Ticket / Incident Management
  INCIDENT_DETAIL: `${ADMIN_BASE}/incident/:number`,
  TICKET_DETAIL: `${ADMIN_BASE}/ticket/:number`,
  INCIDENT_MANAGEMENT: `${ADMIN_BASE}/incident-management`,
  CREATE_MANAGEMENT: `${ADMIN_BASE}/create-management`,
  CREATE_MANAGEMENT_TYPE: `${ADMIN_BASE}/create-management/:type`,
  CREATE_TICKET_TYPE: `${ADMIN_BASE}/:type`,
  SUGGESTED_SOLUTION: `${ADMIN_BASE}/suggested-solution`,
  CONFIGURATION: `${ADMIN_BASE}/configuration`,
  ROLE_REQUESTS: `${ADMIN_BASE}/role-requests`,
};

const AuthPath = {
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
};

/**
 * Combined Path object for auth/shared components.
 * Admin components should use constants.AdminPath.
 * User components should use constants.UserPath.
 */
const Path = {
  DEFAULT_PAGE: '/',
  NOT_FOUND: '*',
  ...AuthPath,
  ...AdminPath,
};

const UserPath = {
  DASHBOARD: `${USER_BASE}/dashboard`,
  FAVOURITES: `${USER_BASE}/favourites`,
  RECENT_ITEMS: `${USER_BASE}/recent-items`,
  INCIDENT_MANAGEMENT: `${USER_BASE}/incident-management`,
  CHANGE_MANAGEMENT: `${USER_BASE}/change-management`,
  PROBLEM_MANAGEMENT: `${USER_BASE}/problem-management`,
};

const CaptainPath = {
  DASHBOARD: `${CAPTAIN_BASE}/dashboard`,
  CHANGE_MANAGEMENT: `${CAPTAIN_BASE}/change-management`,
  PROBLEM_MANAGEMENT: `${CAPTAIN_BASE}/problem-management`,
  CREATE_TICKET: `${CAPTAIN_BASE}/create-ticket`,
};

export const constants = {
  Path,
  AdminPath,
  AuthPath,
  UserPath,
  CaptainPath,
};
