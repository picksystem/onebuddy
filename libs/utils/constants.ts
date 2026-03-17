const ADMIN_BASE = '/app/admin';
const USER_BASE = '/app/user';
const CAPTAIN_BASE = '/app/captain';

const AdminPath = {
  // Governance
  DASHBOARD: `${ADMIN_BASE}/dashboard`,
  APIS: `${ADMIN_BASE}/apis`,
  ACCESS_REQUEST: `${ADMIN_BASE}/access-request`,
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

  // Supporting
  PROFILE: `${ADMIN_BASE}/profile`,

  // Legacy — kept for backwards compatibility with old page files
  INCIDENT_DETAIL: `${ADMIN_BASE}/incident/:number`,
  TICKET_DETAIL: `${ADMIN_BASE}/ticket/:number`,
  INCIDENT_MANAGEMENT: `${ADMIN_BASE}/incident-management`,
  CREATE_TICKET: `${ADMIN_BASE}/create-ticket`,
  CREATE_TICKET_TYPE: `${ADMIN_BASE}/:type`,
  SUGGESTED_SOLUTION: `${ADMIN_BASE}/suggested-solution`,
  CONFIGURATION: `${ADMIN_BASE}/configuration`,
  ROLE_REQUESTS: `${ADMIN_BASE}/role-requests`,
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

const AuthPath = {
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
};

const DefalutPage = {
  ADMIN_DEFAULT_PAGE: '/app/admin/*',
  USER_DEFAULT_PAGE: '/app/user/*',
  CAPTAIN_DEFAULT_PAGE: '/app/captain/*',
};

/**
 * Combined Path object.
 * - Admin components should use constants.AdminPath
 * - User components should use constants.UserPath
 * - Auth/shared components should use constants.Path for auth routes
 */
const Path = {
  DEFAULT_PAGE: '/',
  ...AuthPath,
  ...AdminPath,
  NOT_FOUND: '*',
};

export const constants = {
  Path,
  AdminPath,
  UserPath,
  CaptainPath,
  AuthPath,
  ADMIN_BASE,
  USER_BASE,
  CAPTAIN_BASE,
  DefalutPage,
};
